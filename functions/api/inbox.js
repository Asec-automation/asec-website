/**
 * ASEC website inbox — stores every contact message, job application (with CV) and job-alert
 * sign-up in Cloudflare KV, so nothing depends on email delivery. HR reads them in the careers admin.
 *
 *   POST   /api/inbox              → public: multipart (application + CV) or JSON (contact / alert)
 *   Access: the HR (careers) login sees applications and job alerts; the business login sees
 *   business inquiries (contact form) only.
 *   GET    /api/inbox              → list (login token)
 *   GET    /api/inbox?id=ID        → one item with full text (login token)
 *   GET    /api/inbox?cv=ID        → a signed 10-minute link to the CV (login token)
 *   GET    /api/inbox?file=…&sig=… → the CV file itself (signed link)
 *   PATCH  /api/inbox?id=ID        → { read?, stage?, interview?, deleted? } (login token)
 *                                    deleted: true moves it to the Deleted bin, false restores it
 *                                    stage: new | interview | accepted | rejected
 *                                    interview: { date: 'YYYY-MM-DD', time: 'HH:MM', interviewer }
 *   DELETE /api/inbox?id=ID        → delete item and CV permanently (login token)
 *
 * Optional email copy: once asecautomation.com uses Cloudflare Email Routing, add a "send_email"
 * binding named INBOX_EMAIL plus the variables INBOX_FROM (e.g. website@asecautomation.com),
 * INBOX_TO_CONTACT and INBOX_TO_CAREERS. Without them, items are only stored (nothing is lost).
 */
import { session, can, hmac, secretOf } from './careers.js'

const P_ITEM = 'asec:inbox:item:'
const P_CV = 'asec:inbox:cv:'
const MAX_CV = 5 * 1024 * 1024
const OK_EXT = /\.(pdf|docx?)$/i
const json = (code, obj) => new Response(JSON.stringify(obj), { status: code, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
const clean = (s, n = 300) => String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ' ').trim().slice(0, n)
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
const newId = () => `${Date.now().toString(36)}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`
/** KV metadata is limited to 1 KB — keep the list summary short. */
const summary = (it) => ({
  kind: it.kind, at: it.at, read: !!it.read,
  name: clean(it.name, 80), email: clean(it.email, 100),
  title: clean(it.position || it.subject || it.area || '', 120),
  cv: it.cv ? { name: clean(it.cv.name, 100), size: it.cv.size } : undefined,
  stage: it.stage || undefined,
  deleted: it.deleted ? it.deletedAt || 1 : undefined,
  interview: it.interview ? { date: it.interview.date, time: it.interview.time, interviewer: clean(it.interview.interviewer, 60) } : undefined,
})
const STAGES = ['new', 'interview', 'accepted', 'rejected']

async function rateLimited(kv, request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'local'
  const k = `asec:inbox:rate:${ip}`
  const n = Number((await kv.get(k)) || 0) + 1
  if (n > 8) return true
  await kv.put(k, String(n), { expirationTtl: 3600 })
  return false
}

async function receive(request, kv) {
  const type = request.headers.get('Content-Type') || ''
  const it = { id: newId(), at: Date.now(), read: false }
  let cvFile = null
  if (type.includes('multipart/form-data')) {
    const fd = await request.formData()
    if (clean(fd.get('website') || fd.get('_honey'))) return { spam: true }
    Object.assign(it, {
      kind: 'application', name: clean(fd.get('name'), 120), email: clean(fd.get('email'), 160), phone: clean(fd.get('phone'), 40),
      position: clean(fd.get('position'), 160), message: clean(fd.get('coverLetter') || fd.get('cover_letter'), 6000),
    })
    const f = fd.get('cv') || fd.get('attachment')
    if (!f || typeof f === 'string') return { error: 'Please attach your CV.' }
    if (f.size > MAX_CV) return { error: 'The CV is larger than 5 MB.' }
    if (!OK_EXT.test(f.name || '')) return { error: 'Please upload a PDF, DOC or DOCX file.' }
    cvFile = f
    it.cv = { name: clean(f.name, 140), size: f.size, type: f.type || 'application/octet-stream' }
  } else {
    const b = await request.json().catch(() => ({}))
    if (clean(b.website || b._honey)) return { spam: true }
    const kind = b.kind === 'alert' ? 'alert' : 'contact'
    Object.assign(it, { kind, name: clean(b.name, 120), email: clean(b.email, 160) })
    if (kind === 'alert') it.area = clean(b.area, 120)
    else Object.assign(it, {
      phone: clean(b.phone, 40), company: clean(b.company, 160), country: clean(b.country, 80),
      category: clean(b.category, 120), department: clean(b.department, 80), subject: clean(b.subject, 200), message: clean(b.message, 6000), form: clean(b.formType, 40),
    })
  }
  if (!emailOk(it.email)) return { error: 'Please enter a valid email address.' }
  if (it.kind === 'application' && it.name.length < 2) return { error: 'Please enter your full name.' }
  if (it.kind === 'contact' && (it.message || '').length < 5) return { error: 'Please write a message.' }
  if (cvFile) await kv.put(P_CV + it.id, await cvFile.arrayBuffer(), { metadata: { name: it.cv.name, type: it.cv.type } })
  await kv.put(P_ITEM + it.id, JSON.stringify(it), { metadata: summary(it) })
  return { item: it, cvFile }
}

/* ---- optional email copy through Cloudflare Email Routing ---- */
const b64 = (buf) => { let s = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(s).replace(/.{76}/g, '$&\r\n') }
const hdr = (s) => `=?UTF-8?B?${btoa(unescape(encodeURIComponent(s)))}?=`
async function emailCopy(env, it, cvFile) {
  if (!env.INBOX_EMAIL || !env.INBOX_FROM) return
  const to = it.kind === 'contact' ? env.INBOX_TO_CONTACT : env.INBOX_TO_CAREERS
  if (!to) return
  const label = { application: 'Job application', contact: 'Website inquiry', alert: 'Job alert sign-up' }[it.kind]
  const lines = Object.entries({ Name: it.name, Email: it.email, Phone: it.phone, Company: it.company, Country: it.country, Category: it.category, Department: it.department, Position: it.position, 'Area of interest': it.area, Subject: it.subject })
    .filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)
  const text = `${label} from the ASEC Automation website\r\n\r\n${lines.join('\r\n')}${it.message ? `\r\n\r\n${it.message}` : ''}\r\n\r\nAlso saved in the careers admin inbox.`
  const B = `asec-${it.id}`
  let mime = [`From: ASEC Website <${env.INBOX_FROM}>`, `To: ${to}`, `Reply-To: ${it.email}`, `Subject: ${hdr(`${label} — ${it.position || it.subject || it.area || it.name}`)}`,
    `Message-ID: <${it.id}@asec-website>`, 'MIME-Version: 1.0', `Content-Type: multipart/mixed; boundary="${B}"`, '',
    `--${B}`, 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', b64(new TextEncoder().encode(text))]
  if (cvFile) mime.push(`--${B}`, `Content-Type: ${it.cv.type}; name="${it.cv.name.replace(/"/g, '')}"`, 'Content-Transfer-Encoding: base64',
    `Content-Disposition: attachment; filename="${it.cv.name.replace(/"/g, '')}"`, '', b64(await cvFile.arrayBuffer()))
  mime.push(`--${B}--`, '')
  const { EmailMessage } = await import('cloudflare:email')
  await env.INBOX_EMAIL.send(new EmailMessage(env.INBOX_FROM, to, mime.join('\r\n')))
}

export async function onRequest({ request, env, ctx }) {
  try {
    const kv = env.CAREERS_KV
    if (!kv) return json(500, { error: 'Storage has not been connected yet.' })
    const url = new URL(request.url)

    if (request.method === 'POST') {
      if (await rateLimited(kv, request)) return json(429, { error: 'Too many submissions. Please try again later.' })
      const r = await receive(request, kv)
      if (r.spam) return json(200, { ok: true })
      if (r.error) return json(400, { error: r.error })
      const p = emailCopy(env, r.item, r.cvFile).catch(() => {})
      if (ctx && ctx.waitUntil) ctx.waitUntil(p); else await p
      return json(200, { ok: true })
    }

    // Signed, 10-minute CV links: the browser downloads (or opens) them directly — no sign-in header needed.
    if (request.method === 'GET' && url.searchParams.get('file')) {
      const fid = clean(url.searchParams.get('file'), 60), exp = Number(url.searchParams.get('exp')), mode = url.searchParams.get('mode') === 'view' ? 'view' : 'download'
      const ok = secretOf(env) && exp > Date.now() && url.searchParams.get('sig') === (await hmac(secretOf(env), `cv.${fid}.${exp}.${mode}`))
      if (!ok) return new Response('This download link has expired. Go back to the careers admin and press Download CV again.', { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
      const { value, metadata } = await kv.getWithMetadata(P_CV + fid, { type: 'arrayBuffer' })
      if (!value) return new Response('File not found.', { status: 404 })
      const name = (metadata && metadata.name) || 'cv.pdf'
      const ascii = name.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '')
      return new Response(value, { headers: {
        'Content-Type': (metadata && metadata.type) || 'application/octet-stream',
        'Content-Disposition': `${mode === 'view' ? 'inline' : 'attachment'}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`,
        'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff',
      } })
    }

    const auth = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
    const me = await session(env, auth)
    if (!me || !(can(me, 'careers') || can(me, 'business'))) return json(401, { error: 'Please sign in again.' })
    const allowed = (kind) => (kind === 'contact' ? can(me, 'business') : can(me, 'careers'))
    /** Activity history: who did what (the last 60 entries). */
    const log = (it, a) => { it.history = [...(it.history || []), { at: Date.now(), by: me.name, a }].slice(-60) }
    const id = clean(url.searchParams.get('id') || url.searchParams.get('cv'), 60)
    let current = null
    if (id) {
      const v = await kv.get(P_ITEM + id)
      if (!v) return json(404, { error: 'Not found.' })
      current = JSON.parse(v)
      if (!allowed(current.kind)) return json(404, { error: 'Not found.' })
    }

    if (request.method === 'GET' && url.searchParams.get('cv')) {
      const mode = url.searchParams.get('mode') === 'view' ? 'view' : 'download'
      if (current) { log(current, mode === 'view' ? 'opened the CV' : 'downloaded the CV'); await kv.put(P_ITEM + id, JSON.stringify(current), { metadata: summary(current) }) }
      const exp = Date.now() + 10 * 60e3
      const sig = await hmac(secretOf(env), `cv.${id}.${exp}.${mode}`)
      return json(200, { url: `${url.pathname}?file=${encodeURIComponent(id)}&exp=${exp}&mode=${mode}&sig=${sig}` })
    }
    if (request.method === 'GET' && id) return json(200, { item: current })
    if (request.method === 'GET') {
      const items = []; let cursor
      do {
        const page = await kv.list({ prefix: P_ITEM, cursor, limit: 1000 })
        for (const k of page.keys) if (allowed(k.metadata?.kind)) items.push({ id: k.name.slice(P_ITEM.length), ...(k.metadata || {}) })
        cursor = page.list_complete ? undefined : page.cursor
      } while (cursor && items.length < 3000)
      items.sort((a, b) => (b.at || 0) - (a.at || 0))
      return json(200, { items })
    }
    if (request.method === 'PATCH' && id) {
      const it = current; const b = await request.json().catch(() => ({}))
      const LABEL = { new: 'Inbox', interview: 'Interviews', accepted: 'Accepted', rejected: 'Not accepted' }
      if ('read' in b) { if (!b.read && it.read) log(it, 'marked as unread'); it.read = !!b.read }
      if ('deleted' in b) { if (b.deleted) { it.deleted = true; it.deletedAt = Date.now(); log(it, 'moved to Deleted') } else { delete it.deleted; delete it.deletedAt; log(it, 'restored from Deleted') } }
      if ('stage' in b) { if (!STAGES.includes(b.stage)) return json(400, { error: 'Unknown stage.' }); if (b.stage !== (it.stage || 'new')) log(it, `moved to ${LABEL[b.stage]}`); it.stage = b.stage; it.stageAt = Date.now() }
      if ('interview' in b) {
        const iv = b.interview
        if (iv === null) delete it.interview
        else {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(iv?.date || '') || !/^\d{2}:\d{2}$/.test(iv?.time || '')) return json(400, { error: 'Enter a valid date and time.' })
          it.interview = { date: iv.date, time: iv.time, interviewer: clean(iv.interviewer, 60) }
          log(it, `scheduled an interview for ${iv.date} at ${iv.time}${it.interview.interviewer ? ` with ${it.interview.interviewer}` : ''}`)
        }
      }
      await kv.put(P_ITEM + id, JSON.stringify(it), { metadata: summary(it) })
      return json(200, { ok: true })
    }
    if (request.method === 'DELETE' && id) {
      await kv.delete(P_ITEM + id); await kv.delete(P_CV + id)
      return json(200, { ok: true })
    }
    return json(405, { error: 'Method not allowed.' })
  } catch {
    return json(500, { error: 'Something went wrong. Please try again.' })
  }
}

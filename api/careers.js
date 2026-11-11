/**
 * ASEC Careers API (Vercel serverless function).
 *
 *   GET  /api/careers              → published job openings (public)
 *   GET  /api/careers?all=1        → all openings incl. hidden (needs login token)
 *   POST /api/careers?action=login → { password } → { token }   (token valid 8 hours)
 *   PUT  /api/careers              → save the full list (needs login token)
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   CAREERS_ADMIN_PASSWORD   the password HR uses to sign in
 *   CAREERS_TOKEN_SECRET     any long random text (signs login sessions)
 *   KV_REST_API_URL / KV_REST_API_TOKEN   added automatically when you connect a
 *                            Vercel KV / Upstash Redis store to the project
 */
import crypto from 'node:crypto'

const KEY = 'asec:careers:jobs'
const TOKEN_HOURS = 8
const MAX_JOBS = 100

const kv = async (cmd) => {
  const url = process.env.KV_REST_API_URL, tok = process.env.KV_REST_API_TOKEN
  if (!url || !tok) throw new Error('storage-not-configured')
  const r = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) })
  if (!r.ok) throw new Error('storage-error')
  return (await r.json()).result
}

const secret = () => process.env.CAREERS_TOKEN_SECRET || process.env.CAREERS_ADMIN_PASSWORD || ''
const sign = (data) => crypto.createHmac('sha256', secret()).update(data).digest('base64url')
const makeToken = () => { const exp = Date.now() + TOKEN_HOURS * 3600e3; const body = `careers.${exp}`; return `${body}.${sign(body)}` }
const validToken = (t) => {
  if (!t || !secret()) return false
  const i = t.lastIndexOf('.'); if (i < 0) return false
  const body = t.slice(0, i), sig = t.slice(i + 1), good = sign(body)
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return false
  const exp = Number(body.split('.')[1]); return Number.isFinite(exp) && exp > Date.now()
}
const samePassword = (a, b) => {
  const x = crypto.createHash('sha256').update(String(a)).digest(), y = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(x, y)
}

const clean = (s, n = 400) => String(s ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n)
const cleanList = (a) => (Array.isArray(a) ? a : String(a ?? '').split(/;|\n/)).map((x) => clean(x, 300)).filter(Boolean).slice(0, 20)
const cleanJob = (j, i) => ({
  slug: clean(j.slug, 80) || `job-${Date.now()}-${i}`,
  title: clean(j.title, 120), department: clean(j.department, 80), location: clean(j.location, 80), type: clean(j.type, 40) || 'Full-time',
  summary: clean(j.summary, 1200), responsibilities: cleanList(j.responsibilities), requirements: cleanList(j.requirements),
  show: j.show !== false, updated: new Date().toISOString(),
})

const readBody = async (req) => {
  if (req.body && typeof req.body === 'object') return req.body
  let raw = ''; for await (const c of req) { raw += c; if (raw.length > 300_000) throw new Error('too-large') }
  return raw ? JSON.parse(raw) : {}
}
const send = (res, code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(obj)) }

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://x')
    const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')

    if (req.method === 'GET') {
      const all = url.searchParams.get('all') === '1'
      if (all && !validToken(auth)) return send(res, 401, { error: 'Please sign in again.' })
      const list = JSON.parse((await kv(['GET', KEY])) || '[]')
      return send(res, 200, { jobs: all ? list : list.filter((j) => j.show !== false) })
    }

    if (req.method === 'POST' && url.searchParams.get('action') === 'login') {
      const ip = String(req.headers['x-forwarded-for'] || 'local').split(',')[0].trim()
      const tries = await kv(['INCR', `asec:careers:login:${ip}`])
      if (tries === 1) await kv(['EXPIRE', `asec:careers:login:${ip}`, 900])
      if (tries > 10) return send(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' })
      const { password } = await readBody(req)
      const real = process.env.CAREERS_ADMIN_PASSWORD
      if (!real) return send(res, 500, { error: 'The careers password has not been set up yet.' })
      if (!password || !samePassword(password, real)) return send(res, 401, { error: 'Incorrect password.' })
      await kv(['DEL', `asec:careers:login:${ip}`])
      return send(res, 200, { token: makeToken(), hours: TOKEN_HOURS })
    }

    if (req.method === 'PUT') {
      if (!validToken(auth)) return send(res, 401, { error: 'Please sign in again.' })
      const body = await readBody(req)
      if (!Array.isArray(body.jobs)) return send(res, 400, { error: 'Invalid data.' })
      const jobs = body.jobs.slice(0, MAX_JOBS).map(cleanJob).filter((j) => j.title)
      await kv(['SET', KEY, JSON.stringify(jobs)])
      return send(res, 200, { ok: true, jobs })
    }

    return send(res, 405, { error: 'Method not allowed.' })
  } catch (e) {
    const msg = e.message === 'storage-not-configured' ? 'Job storage has not been connected yet.' : 'Something went wrong. Please try again.'
    return send(res, 500, { error: msg })
  }
}

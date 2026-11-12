/**
 * ASEC Careers API — Cloudflare Pages Function (free plan).
 *
 *   GET  /api/careers              → published job openings (public)
 *   GET  /api/careers?all=1        → all openings incl. hidden (needs login token)
 *   POST /api/careers?action=login → { password } → { token }   (token valid 8 hours)
 *   PUT  /api/careers              → save the full list (needs login token)
 *
 * Cloudflare setup (Workers & Pages → your project → Settings):
 *   Bindings → add KV namespace, variable name: CAREERS_KV
 *   Variables and Secrets → add (type "Secret"):
 *     CAREERS_ADMIN_PASSWORD   the password HR uses to sign in
 *     CAREERS_TOKEN_SECRET     any long random text (signs login sessions)
 */
const KEY = 'asec:careers:jobs'
const TOKEN_HOURS = 8
const MAX_JOBS = 100
const enc = new TextEncoder()

const json = (code, obj) => new Response(JSON.stringify(obj), { status: code, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)))
}
async function sha(s) { return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(String(s)))) }
function equalBytes(a, b) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0 }

const secretOf = (env) => env.CAREERS_TOKEN_SECRET || env.CAREERS_ADMIN_PASSWORD || ''
async function makeToken(env) { const body = `careers.${Date.now() + TOKEN_HOURS * 3600e3}`; return `${body}.${await hmac(secretOf(env), body)}` }
export async function validToken(env, t) {
  if (!t || !secretOf(env)) return false
  const i = t.lastIndexOf('.'); if (i < 0) return false
  const body = t.slice(0, i), sig = t.slice(i + 1)
  if (!equalBytes(enc.encode(sig), enc.encode(await hmac(secretOf(env), body)))) return false
  const exp = Number(body.split('.')[1]); return Number.isFinite(exp) && exp > Date.now()
}

const clean = (s, n = 400) => String(s ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n)
const cleanList = (a) => (Array.isArray(a) ? a : String(a ?? '').split(/;|\n/)).map((x) => clean(x, 300)).filter(Boolean).slice(0, 20)
const cleanJob = (j, i) => ({
  slug: clean(j.slug, 80) || `job-${Date.now()}-${i}`,
  title: clean(j.title, 120), department: clean(j.department, 80), location: clean(j.location, 80), type: clean(j.type, 40) || 'Full-time',
  summary: clean(j.summary, 1200), responsibilities: cleanList(j.responsibilities), requirements: cleanList(j.requirements),
  show: j.show !== false, updated: new Date().toISOString(),
})

/** Stored as { savedAt, jobs }; older saves were a bare array. */
function parseStore(raw) {
  try { const v = JSON.parse(raw || '[]'); return Array.isArray(v) ? { jobs: v, savedAt: 0 } : { jobs: Array.isArray(v.jobs) ? v.jobs : [], savedAt: Number(v.savedAt) || 0 } }
  catch { return { jobs: [], savedAt: 0 } }
}

export async function onRequest({ request, env }) {
  try {
    const kv = env.CAREERS_KV
    if (!kv) return json(500, { error: 'Job storage has not been connected yet.' })
    const url = new URL(request.url)
    const auth = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')

    if (request.method === 'GET') {
      const all = url.searchParams.get('all') === '1'
      if (all && !(await validToken(env, auth))) return json(401, { error: 'Please sign in again.' })
      const { jobs: list, savedAt } = parseStore(await kv.get(KEY))
      return json(200, { jobs: all ? list : list.filter((j) => j.show !== false), savedAt })
    }

    if (request.method === 'POST' && url.searchParams.get('action') === 'login') {
      const ip = request.headers.get('CF-Connecting-IP') || 'local'
      const lk = `asec:careers:login:${ip}`
      const tries = Number((await kv.get(lk)) || 0) + 1
      if (tries > 10) return json(429, { error: 'Too many attempts. Try again in 15 minutes.' })
      await kv.put(lk, String(tries), { expirationTtl: 900 })
      const { password } = await request.json().catch(() => ({}))
      if (!env.CAREERS_ADMIN_PASSWORD) return json(500, { error: 'The careers password has not been set up yet.' })
      if (!password || !equalBytes(await sha(password), await sha(env.CAREERS_ADMIN_PASSWORD))) return json(401, { error: 'Incorrect password.' })
      await kv.delete(lk)
      return json(200, { token: await makeToken(env), hours: TOKEN_HOURS })
    }

    if (request.method === 'PUT') {
      if (!(await validToken(env, auth))) return json(401, { error: 'Please sign in again.' })
      const text = await request.text()
      if (text.length > 300_000) return json(413, { error: 'Too much data.' })
      const body = JSON.parse(text || '{}')
      if (!Array.isArray(body.jobs)) return json(400, { error: 'Invalid data.' })
      const jobs = body.jobs.slice(0, MAX_JOBS).map(cleanJob).filter((j) => j.title)
      const savedAt = Date.now()
      await kv.put(KEY, JSON.stringify({ savedAt, jobs }))
      return json(200, { ok: true, jobs, savedAt })
    }

    return json(405, { error: 'Method not allowed.' })
  } catch {
    return json(500, { error: 'Something went wrong. Please try again.' })
  }
}

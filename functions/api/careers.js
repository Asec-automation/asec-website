/**
 * ASEC Careers API — Cloudflare Pages Function (free plan).
 *
 *   GET  /api/careers              → published job openings (public)
 *   GET  /api/careers?all=1        → all openings incl. hidden (needs login token)
 *   POST /api/careers?action=login → { username, password } → { token, roles, name }   (token valid 8 hours)
 *                                    username "hr" → careers (jobs + applicants)
 *                                    username "business" → business inquiries only
 *   PUT  /api/careers              → save the full list (needs login token)
 *
 * Cloudflare setup (Workers & Pages → your project → Settings):
 *   Bindings → add KV namespace, variable name: CAREERS_KV
 *   Variables and Secrets → add (type "Secret"):
 *     CAREERS_ADMIN_PASSWORD   the password HR uses to sign in (jobs + applicants)
 *     BUSINESS_ADMIN_PASSWORD  the password for /business/admin (business inquiries only)
 *     CAREERS_TOKEN_SECRET     any long random text (signs login sessions)
 */
const KEY = 'asec:careers:jobs'
const TOKEN_HOURS = 8
const MAX_JOBS = 100
const enc = new TextEncoder()

const json = (code, obj) => new Response(JSON.stringify(obj), { status: code, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)))
}
async function sha(s) { return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(String(s)))) }
function equalBytes(a, b) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0 }

export const secretOf = (env) => env.CAREERS_TOKEN_SECRET || env.CAREERS_ADMIN_PASSWORD || ''
/* ------------------------------------------------------------------------------------------
 * Staff sign-in
 *   Personal accounts live in KV (STAFF_KEY): { username, name, roles, pw, active, createdAt, createdBy }.
 *   roles: "careers" (recruitment: jobs + applicants), "business" (business inquiries),
 *          "admin" (everything, plus staff accounts)
 *   Built-in accounts (secrets in Cloudflare): hr → CAREERS_ADMIN_PASSWORD, business → BUSINESS_ADMIN_PASSWORD,
 *   admin → ADMIN_PASSWORD (the first administrator, who creates everyone else).
 *   Tokens: "<body>.<expiry>.<signature>", body = "careers" | "business" (shared accounts) | "u~<username>".
 * ------------------------------------------------------------------------------------------ */
export const STAFF_KEY = 'asec:staff:users'
export const ROLES = ['careers', 'business', 'admin']
export async function loadStaff(kv) { try { const v = JSON.parse((await kv.get(STAFF_KEY)) || '[]'); return Array.isArray(v) ? v : [] } catch { return [] } }
export async function saveStaff(kv, list) { await kv.put(STAFF_KEY, JSON.stringify(list)) }

const b64 = (u8) => btoa(String.fromCharCode(...u8))
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
const PBKDF2_ITER = 100000
async function pbkdf2(password, salt, iter) {
  const key = await crypto.subtle.importKey('raw', enc.encode(String(password)), 'PBKDF2', false, ['deriveBits'])
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, key, 256))
}
/** Stored as "pbkdf2$<iterations>$<salt>$<hash>"; the password itself is never stored. */
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return `pbkdf2$${PBKDF2_ITER}$${b64(salt)}$${b64(await pbkdf2(password, salt, PBKDF2_ITER))}`
}
export async function checkPassword(password, stored) {
  const [kind, it, salt, hash] = String(stored || '').split('$')
  if (kind !== 'pbkdf2' || !salt || !hash) return false
  return equalBytes(await pbkdf2(password, unb64(salt), Number(it) || PBKDF2_ITER), unb64(hash))
}

async function makeToken(env, who) { const body = `${who}.${Date.now() + TOKEN_HOURS * 3600e3}`; return `${body}.${await hmac(secretOf(env), body)}` }

/** The signed-in person: { user, name, roles }, or null if the token is missing, forged, expired or the account is disabled. */
export async function session(env, t) {
  if (!t || !secretOf(env)) return null
  const i = t.lastIndexOf('.'); if (i < 0) return null
  const body = t.slice(0, i), sig = t.slice(i + 1)
  if (!equalBytes(enc.encode(sig), enc.encode(await hmac(secretOf(env), body)))) return null
  const j = body.lastIndexOf('.'); const who = body.slice(0, j), exp = Number(body.slice(j + 1))
  if (!Number.isFinite(exp) || exp <= Date.now()) return null
  if (who === 'careers') return { user: 'hr', name: 'HR (shared account)', roles: ['careers'] }
  if (who === 'business') return { user: 'business', name: 'Business (shared account)', roles: ['business'] }
  if (!who.startsWith('u~')) return null
  const user = who.slice(2)
  if (user === 'admin') return env.ADMIN_PASSWORD ? { user, name: 'Administrator', roles: ['admin'] } : null
  const u = (await loadStaff(env.CAREERS_KV)).find((x) => x.username === user)
  return u && u.active !== false ? { user, name: u.name || user, roles: u.roles || [] } : null
}
/** Can this session use an area ("careers" | "business" | "admin")? Admins can use everything. */
export const can = (s, area) => !!s && (s.roles.includes('admin') || s.roles.includes(area))
/** Recruitment (careers) access. */
export async function validToken(env, t) { return can(await session(env, t), 'careers') }

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
      const { username, password, area } = await request.json().catch(() => ({}))
      const bad = () => json(401, { error: 'Incorrect username or password.' })
      if (!password) return bad()
      const key = String(username ?? '').trim().toLowerCase() || (area === 'business' ? 'business' : 'hr')
      const shared = { hr: ['careers', env.CAREERS_ADMIN_PASSWORD, 'HR (shared account)'], business: ['business', env.BUSINESS_ADMIN_PASSWORD, 'Business (shared account)'] }
      let who = '', name = '', roles = []
      if (shared[key]) {
        const [role, expected, label] = shared[key]
        if (!expected || !equalBytes(await sha(password), await sha(expected))) return bad()
        who = role; name = label; roles = [role]
      } else if (key === 'admin') {
        if (!env.ADMIN_PASSWORD || !equalBytes(await sha(password), await sha(env.ADMIN_PASSWORD))) return bad()
        who = 'u~admin'; name = 'Administrator'; roles = ['admin']
      } else {
        const acc = (await loadStaff(kv)).find((x) => x.username === key)
        if (!acc || acc.active === false || !(await checkPassword(password, acc.pw))) return bad()
        who = `u~${acc.username}`; name = acc.name || acc.username; roles = acc.roles || []
      }
      await kv.delete(lk)
      const role = roles.includes('admin') || roles.includes('careers') ? 'careers' : 'business'
      return json(200, { token: await makeToken(env, who), role, roles, name, username: key, hours: TOKEN_HOURS })
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

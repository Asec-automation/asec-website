/**
 * ASEC staff accounts — personal sign-ins for the careers and business admins.
 *
 *   GET    /api/staff?me=1          → the signed-in person { user, name, roles } (any sign-in)
 *   GET    /api/staff               → all accounts, without passwords (admin)
 *   POST   /api/staff               → { username, name, password, roles } create an account (admin)
 *   PATCH  /api/staff?u=USERNAME    → { name?, roles?, active?, password? } change an account (admin)
 *   DELETE /api/staff?u=USERNAME    → remove an account (admin)
 *   POST   /api/staff?action=password → { current, password } change your own password (personal accounts)
 *
 * roles: "careers" (recruitment), "business" (business inquiries), "admin" (everything + staff accounts).
 * Passwords are stored only as salted PBKDF2 hashes.
 */
import { session, can, loadStaff, saveStaff, hashPassword, checkPassword, ROLES } from './careers.js'

const json = (code, obj) => new Response(JSON.stringify(obj), { status: code, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
const clean = (s, n = 80) => String(s ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n)
const RESERVED = new Set(['hr', 'business', 'admin', 'careers', 'root', 'staff'])
const okUser = (u) => /^[a-z][a-z0-9_-]{1,29}$/.test(u) && !RESERVED.has(u)
const okPw = (p) => typeof p === 'string' && p.length >= 10 && p.length <= 200
const okRoles = (r) => Array.isArray(r) && r.length > 0 && r.every((x) => ROLES.includes(x))
const pub = (u) => ({ username: u.username, name: u.name, roles: u.roles, active: u.active !== false, createdAt: u.createdAt, createdBy: u.createdBy, updatedAt: u.updatedAt, updatedBy: u.updatedBy })

export async function onRequest({ request, env }) {
  try {
    const kv = env.CAREERS_KV
    if (!kv) return json(500, { error: 'Storage has not been connected yet.' })
    const url = new URL(request.url)
    const me = await session(env, (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, ''))
    if (!me) return json(401, { error: 'Please sign in again.' })

    if (request.method === 'GET' && url.searchParams.get('me')) return json(200, { me })

    // Change your own password (personal accounts only)
    if (request.method === 'POST' && url.searchParams.get('action') === 'password') {
      const b = await request.json().catch(() => ({}))
      const list = await loadStaff(kv); const acc = list.find((x) => x.username === me.user)
      if (!acc) return json(400, { error: 'Shared and built-in accounts change their password in Cloudflare.' })
      if (!(await checkPassword(String(b.current || ''), acc.pw))) return json(400, { error: 'Your current password is not correct.' })
      if (!okPw(b.password)) return json(400, { error: 'Use at least 10 characters.' })
      acc.pw = await hashPassword(b.password); acc.updatedAt = Date.now(); acc.updatedBy = me.name
      await saveStaff(kv, list)
      return json(200, { ok: true })
    }

    if (!can(me, 'admin')) return json(403, { error: 'Only an administrator can manage staff accounts.' })
    const list = await loadStaff(kv)

    if (request.method === 'GET') return json(200, { users: list.map(pub) })

    if (request.method === 'POST') {
      const b = await request.json().catch(() => ({}))
      const username = clean(b.username, 30).toLowerCase()
      if (!okUser(username)) return json(400, { error: 'Username: 2–30 lower-case letters, numbers, - or _, starting with a letter (not hr, business or admin).' })
      if (list.some((x) => x.username === username)) return json(400, { error: 'That username is already taken.' })
      if (!clean(b.name)) return json(400, { error: 'Enter the person’s name.' })
      if (!okPw(b.password)) return json(400, { error: 'The password needs at least 10 characters.' })
      if (!okRoles(b.roles)) return json(400, { error: 'Choose at least one area.' })
      if (list.length >= 100) return json(400, { error: 'Too many accounts.' })
      const acc = { username, name: clean(b.name), roles: [...new Set(b.roles)], pw: await hashPassword(b.password), active: true, createdAt: Date.now(), createdBy: me.name }
      list.push(acc); await saveStaff(kv, list)
      return json(200, { user: pub(acc) })
    }

    const username = clean(url.searchParams.get('u'), 30).toLowerCase()
    const acc = list.find((x) => x.username === username)
    if (!acc) return json(404, { error: 'Account not found.' })

    if (request.method === 'PATCH') {
      const b = await request.json().catch(() => ({}))
      if ('name' in b) { if (!clean(b.name)) return json(400, { error: 'Enter the person’s name.' }); acc.name = clean(b.name) }
      if ('roles' in b) { if (!okRoles(b.roles)) return json(400, { error: 'Choose at least one area.' }); acc.roles = [...new Set(b.roles)] }
      if ('active' in b) acc.active = !!b.active
      if ('password' in b) { if (!okPw(b.password)) return json(400, { error: 'The password needs at least 10 characters.' }); acc.pw = await hashPassword(b.password) }
      acc.updatedAt = Date.now(); acc.updatedBy = me.name
      await saveStaff(kv, list)
      return json(200, { user: pub(acc) })
    }
    if (request.method === 'DELETE') {
      await saveStaff(kv, list.filter((x) => x.username !== username))
      return json(200, { ok: true })
    }
    return json(405, { error: 'Method not allowed.' })
  } catch {
    return json(500, { error: 'Something went wrong. Please try again.' })
  }
}

import React, { useEffect, useState } from 'react'
import { LuUserPlus, LuKeyRound, LuUserX, LuUserCheck, LuTrash2, LuRefreshCw, LuCopy, LuCheck, LuPencil, LuX } from 'react-icons/lu'
import { STAFF_API } from '../content/live-jobs'

interface Account { username: string; name: string; roles: string[]; active: boolean; createdAt?: number; createdBy?: string; updatedAt?: number; updatedBy?: string }
const AREAS: [string, string, string][] = [
  ['careers', 'Recruitment', 'Job openings, applicants and CVs, interviews, email templates'],
  ['business', 'Business inquiries', 'Messages from the Contact Us form'],
  ['admin', 'Administrator', 'Everything, plus adding staff and resetting passwords'],
]
const LABEL = Object.fromEntries(AREAS.map(([k, l]) => [k, l]))
const when = (t?: number) => (t ? new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '')
/** A random 14-character password (no look-alike characters). */
const makePassword = () => {
  const c = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const r = crypto.getRandomValues(new Uint32Array(14))
  return Array.from(r, (n) => c[n % c.length]).join('')
}
const DEMO: Account[] = [
  { username: 'fatima', name: 'Fatima', roles: ['careers'], active: true, createdAt: Date.now() - 864e5, createdBy: 'Administrator' },
  { username: 'mohammed', name: 'Mohammed', roles: ['careers'], active: true, createdAt: Date.now() - 864e5, createdBy: 'Administrator' },
  { username: 'mahmoud', name: 'Eng. Mahmoud', roles: ['business'], active: true, createdAt: Date.now() - 864e5, createdBy: 'Administrator' },
]

/** Admin screen: create personal staff accounts and choose what each person can open. */
export function StaffAccounts({ token, demo, active, onSignOut }: { token: string; demo: boolean; active: boolean; onSignOut: () => void }) {
  const [list, setList] = useState<Account[]>([])
  const [loading, setLoading] = useState(!demo)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState({ name: '', username: '', password: makePassword(), roles: ['careers'] as string[] })
  const [busy, setBusy] = useState(false)
  const [shown, setShown] = useState<{ user: string; password: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [edit, setEdit] = useState<string | null>(null)
  const [editRoles, setEditRoles] = useState<string[]>([])
  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const call = async (method: string, query = '', body?: unknown) => {
    const r = await fetch(`${STAFF_API}${query}`, { method, headers: auth, cache: 'no-store', body: body ? JSON.stringify(body) : undefined })
    const d = await r.json().catch(() => ({}))
    if (r.status === 401) { onSignOut(); throw new Error('Please sign in again.') }
    if (!r.ok) throw new Error(d.error || 'Something went wrong.')
    return d
  }
  const load = async () => {
    if (demo) { setList(DEMO); return }
    setLoading(true)
    try { setList((await call('GET')).users || []) } catch (x) { setMsg({ ok: false, text: (x as Error).message }) } finally { setLoading(false) }
  }
  useEffect(() => { if (active) load() }, [active, token, demo])

  const toggle = (roles: string[], r: string) => (roles.includes(r) ? roles.filter((x) => x !== r) : [...roles, r])
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null)
    const username = form.username.trim().toLowerCase()
    if (!form.name.trim() || !username || form.roles.length === 0) { setMsg({ ok: false, text: 'Fill in the name and username, and choose at least one area.' }); return }
    setBusy(true)
    try {
      if (demo) setList((l) => [...l, { username, name: form.name.trim(), roles: form.roles, active: true, createdAt: Date.now(), createdBy: 'Demo' }])
      else { await call('POST', '', { ...form, username }); await load() }
      setShown({ user: username, password: form.password }); setCopied(false)
      setForm({ name: '', username: '', password: makePassword(), roles: ['careers'] })
      setMsg({ ok: true, text: `Account “${username}” created.` })
    } catch (x) { setMsg({ ok: false, text: (x as Error).message }) } finally { setBusy(false) }
  }
  const patch = async (a: Account, body: Partial<Account> & { password?: string }, ok: string) => {
    setMsg(null)
    try {
      if (demo) setList((l) => l.map((x) => (x.username === a.username ? { ...x, ...body } : x)))
      else { await call('PATCH', `?u=${encodeURIComponent(a.username)}`, body); await load() }
      setMsg({ ok: true, text: ok })
    } catch (x) { setMsg({ ok: false, text: (x as Error).message }) }
  }
  const reset = async (a: Account) => {
    const password = makePassword()
    await patch(a, { password }, `New password for “${a.username}” is ready. Give it to them privately.`)
    setShown({ user: a.username, password }); setCopied(false)
  }
  const remove = async (a: Account) => {
    if (!window.confirm(`Delete the account “${a.username}” (${a.name})? They will no longer be able to sign in.`)) return
    setMsg(null)
    try {
      if (demo) setList((l) => l.filter((x) => x.username !== a.username))
      else { await call('DELETE', `?u=${encodeURIComponent(a.username)}`); await load() }
      setMsg({ ok: true, text: `Account “${a.username}” deleted.` })
    } catch (x) { setMsg({ ok: false, text: (x as Error).message }) }
  }
  const copy = async () => { if (!shown) return; try { await navigator.clipboard.writeText(`Username: ${shown.user}\nPassword: ${shown.password}\nSign in: https://www.asecautomation.com/login`); setCopied(true) } catch {} }

  return (
    <div className="sa">
      {msg && <p className={`ca-msg ${msg.ok ? 'ca-msg--ok' : 'ca-msg--err'}`} role="status">{msg.text}</p>}
      {shown && (
        <div className="sa-pw" role="status">
          <div><b>Sign-in details for {shown.user}</b><span>Username: <code>{shown.user}</code> · Password: <code>{shown.password}</code></span>
            <small>Shown only once. Give it to the person privately (not in a group chat). They can change it after signing in.</small></div>
          <div className="sa-pw__btns"><button type="button" className="ca-btn" onClick={copy}>{copied ? <><LuCheck aria-hidden /> Copied</> : <><LuCopy aria-hidden /> Copy</>}</button>
            <button type="button" className="ca-btn" onClick={() => setShown(null)} aria-label="Hide"><LuX aria-hidden /></button></div>
        </div>
      )}

      <form className="sa-card" onSubmit={create}>
        <h2><LuUserPlus aria-hidden /> Add a staff member</h2>
        <div className="sa-grid">
          <label>Full name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, username: form.username || '' })} placeholder="e.g. Fatima Ahmed" /></label>
          <label>Username<input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })} placeholder="e.g. fatima" autoCapitalize="none" spellCheck={false} /></label>
          <label className="sa-wide">Temporary password
            <div className="sa-gen"><input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} spellCheck={false} />
              <button type="button" className="ca-btn" onClick={() => setForm({ ...form, password: makePassword() })}><LuRefreshCw aria-hidden /> New</button></div>
          </label>
        </div>
        <fieldset className="sa-areas"><legend>What can they open?</legend>
          {AREAS.map(([k, l, d]) => (
            <label key={k} className={form.roles.includes(k) ? 'is-on' : ''}><input type="checkbox" checked={form.roles.includes(k)} onChange={() => setForm({ ...form, roles: toggle(form.roles, k) })} /><span><b>{l}</b><small>{d}</small></span></label>
          ))}
        </fieldset>
        <button className="btn btn--blue" type="submit" disabled={busy}><LuUserPlus aria-hidden /> {busy ? 'Creating…' : 'Create account'}</button>
      </form>

      <div className="sa-card">
        <div className="sa-head"><h2>Staff accounts</h2><button type="button" className="ca-btn" onClick={load}><LuRefreshCw aria-hidden /> Refresh</button></div>
        {loading ? <p className="muted">Loading…</p> : list.length === 0 ? <p className="muted">No personal accounts yet. Add the first one above.</p> : (
          <table className="sa-table">
            <thead><tr><th>Name</th><th>Username</th><th>Can open</th><th>Status</th><th aria-label="Actions" /></tr></thead>
            <tbody>{list.map((a) => (
              <tr key={a.username} className={a.active ? '' : 'is-off'}>
                <td><b>{a.name}</b><small>Added {when(a.createdAt)}{a.createdBy ? ` by ${a.createdBy}` : ''}</small></td>
                <td><code>{a.username}</code></td>
                <td>{edit === a.username ? (
                  <div className="sa-edit">{AREAS.map(([k, l]) => <label key={k}><input type="checkbox" checked={editRoles.includes(k)} onChange={() => setEditRoles(toggle(editRoles, k))} /> {l}</label>)}
                    <span><button type="button" className="ca-btn" disabled={!editRoles.length} onClick={async () => { await patch(a, { roles: editRoles }, `Access updated for “${a.username}”.`); setEdit(null) }}>Save</button>
                      <button type="button" className="ca-btn" onClick={() => setEdit(null)}>Cancel</button></span></div>
                ) : <div className="sa-chips">{a.roles.map((r) => <span key={r} className={`sa-chip sa-chip--${r}`}>{LABEL[r] || r}</span>)}</div>}</td>
                <td><span className={`sa-status ${a.active ? 'is-on' : ''}`}>{a.active ? 'Active' : 'Disabled'}</span></td>
                <td><div className="sa-actions">
                  <button type="button" className="ca-btn" onClick={() => { setEdit(a.username); setEditRoles(a.roles) }} title="Change what they can open"><LuPencil aria-hidden /> Access</button>
                  <button type="button" className="ca-btn" onClick={() => reset(a)} title="Make a new password"><LuKeyRound aria-hidden /> Reset password</button>
                  {a.active
                    ? <button type="button" className="ca-btn" onClick={() => patch(a, { active: false }, `“${a.username}” can no longer sign in.`)}><LuUserX aria-hidden /> Disable</button>
                    : <button type="button" className="ca-btn" onClick={() => patch(a, { active: true }, `“${a.username}” can sign in again.`)}><LuUserCheck aria-hidden /> Enable</button>}
                  <button type="button" className="ca-btn is-danger" onClick={() => remove(a)} aria-label={`Delete ${a.username}`}><LuTrash2 aria-hidden /></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        )}
        <p className="sa-note">The shared <code>hr</code> and <code>business</code> sign-ins still work. Once everyone has a personal account, they can be switched off by removing their passwords in Cloudflare.</p>
      </div>
    </div>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { LuDownload, LuTrash2, LuMail, LuMailOpen, LuRefreshCw, LuFileText, LuBriefcase, LuMessageSquare, LuBell } from 'react-icons/lu'
import { INBOX_API } from '../content/live-jobs'

type Kind = 'application' | 'contact' | 'alert'
interface Summary { id: string; kind: Kind; at: number; read: boolean; name: string; email: string; title: string; cv?: { name: string; size: number } }
interface Full extends Summary { phone?: string; company?: string; country?: string; category?: string; department?: string; position?: string; subject?: string; area?: string; message?: string }

const KIND: Record<Kind, { label: string; icon: React.ReactNode }> = {
  application: { label: 'Job application', icon: <LuBriefcase aria-hidden /> },
  contact: { label: 'Contact message', icon: <LuMessageSquare aria-hidden /> },
  alert: { label: 'Job alert', icon: <LuBell aria-hidden /> },
}
const when = (t: number) => new Date(t).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const mb = (n: number) => `${(n / 1024 / 1024).toFixed(2)} MB`

/** The website inbox: every application (with CV), contact message and job-alert sign-up. */
export function AdminInbox({ token, demo, onSignOut, onCount }: { token: string; demo: boolean; onSignOut: () => void; onCount: (n: number) => void }) {
  const [items, setItems] = useState<Summary[]>([])
  const [loading, setLoading] = useState(!demo)
  const [err, setErr] = useState('')
  const [filter, setFilter] = useState<'all' | Kind>('all')
  const [open, setOpen] = useState<string | null>(null)
  const [full, setFull] = useState<Record<string, Full>>({})
  const auth = { Authorization: `Bearer ${token}` }

  const load = () => {
    if (demo) {
      setItems([
        { id: 'd1', kind: 'application', at: Date.now() - 3600e3, read: false, name: 'Ahmed Hassan', email: 'ahmed@example.com', title: 'Senior PLC Engineer', cv: { name: 'Ahmed-Hassan-CV.pdf', size: 412000 } },
        { id: 'd2', kind: 'contact', at: Date.now() - 86400e3, read: true, name: 'Mona Adel', email: 'mona@example.com', title: 'MCC upgrade for a cement plant' },
        { id: 'd3', kind: 'alert', at: Date.now() - 2 * 86400e3, read: true, name: '', email: 'candidate@example.com', title: 'Automation & control' },
      ]); return
    }
    setLoading(true); setErr('')
    fetch(INBOX_API, { headers: auth, cache: 'no-store' })
      .then(async (r) => { const d = await r.json().catch(() => ({})); if (r.status === 401) { onSignOut(); return } if (!r.ok) throw new Error(d.error); setItems(d.items || []) })
      .catch((x) => setErr((x as Error).message || 'Couldn’t load the inbox.'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [token, demo])
  useEffect(() => { onCount(items.filter((i) => !i.read).length) }, [items])

  const shown = useMemo(() => items.filter((i) => filter === 'all' || i.kind === filter), [items, filter])
  const count = (k: Kind) => items.filter((i) => i.kind === k).length

  const setRead = async (id: string, read: boolean) => {
    setItems((l) => l.map((i) => (i.id === id ? { ...i, read } : i)))
    if (!demo) await fetch(`${INBOX_API}?id=${encodeURIComponent(id)}`, { method: 'PATCH', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ read }) }).catch(() => {})
  }
  const toggle = async (it: Summary) => {
    if (open === it.id) { setOpen(null); return }
    setOpen(it.id)
    if (!it.read) setRead(it.id, true)
    if (!full[it.id]) {
      if (demo) { setFull((f) => ({ ...f, [it.id]: { ...it, phone: '+20 100 000 0000', position: it.title, message: 'Demo text — on the live site you see the full message or cover letter here.' } })); return }
      const r = await fetch(`${INBOX_API}?id=${encodeURIComponent(it.id)}`, { headers: auth, cache: 'no-store' })
      const d = await r.json().catch(() => ({}))
      if (r.ok) setFull((f) => ({ ...f, [it.id]: d.item }))
    }
  }
  const remove = async (it: Summary) => {
    if (!window.confirm(`Delete this ${KIND[it.kind].label.toLowerCase()} from ${it.name || it.email}?${it.cv ? ' The CV will be deleted too.' : ''}`)) return
    setItems((l) => l.filter((i) => i.id !== it.id)); setOpen(null)
    if (!demo) await fetch(`${INBOX_API}?id=${encodeURIComponent(it.id)}`, { method: 'DELETE', headers: auth }).catch(() => {})
  }
  const downloadCv = async (it: Summary) => {
    if (demo) { window.alert('Demo only — on the live site this downloads the CV.'); return }
    const r = await fetch(`${INBOX_API}?cv=${encodeURIComponent(it.id)}`, { headers: auth, cache: 'no-store' })
    if (!r.ok) { window.alert('The CV could not be downloaded. Please try again.'); return }
    const a = document.createElement('a'); a.href = URL.createObjectURL(await r.blob()); a.download = it.cv?.name || 'cv'
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  }

  return (
    <div className="ib">
      <div className="ib__bar">
        <div className="ib__filters" role="tablist" aria-label="Filter inbox">
          {(['all', 'application', 'contact', 'alert'] as const).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={filter === k} className={filter === k ? 'is-on' : ''} onClick={() => setFilter(k)}>
              {k === 'all' ? `All (${items.length})` : `${KIND[k].label}s (${count(k)})`}
            </button>
          ))}
        </div>
        <button type="button" className="ca-btn" onClick={load}><LuRefreshCw aria-hidden /> Refresh</button>
      </div>
      {err && <p className="ca-msg ca-msg--err">{err}</p>}
      {loading ? <p className="muted">Loading inbox…</p> : shown.length === 0 ? (
        <div className="ca-empty"><h2>Nothing here yet</h2><p>New job applications, contact messages and job-alert sign-ups from the website appear here.</p></div>
      ) : (
        <ul className="ib__list">
          {shown.map((it) => {
            const f = full[it.id]; const isOpen = open === it.id
            return (
              <li key={it.id} className={`ib__item ${it.read ? '' : 'is-new'}`}>
                <button type="button" className="ib__row" onClick={() => toggle(it)} aria-expanded={isOpen}>
                  <span className={`ib__kind ib__kind--${it.kind}`}>{KIND[it.kind].icon}</span>
                  <span className="ib__main"><strong>{it.name || it.email}</strong><span>{KIND[it.kind].label}{it.title ? ` · ${it.title}` : ''}</span></span>
                  {it.cv && <span className="ib__cv"><LuFileText aria-hidden /> CV</span>}
                  <time className="ib__time">{when(it.at)}</time>
                </button>
                {isOpen && (
                  <div className="ib__body">
                    <dl className="kv" style={{ gridTemplateColumns: '130px 1fr' }}>
                      {f?.name && <><dt>Name</dt><dd>{f.name}</dd></>}
                      <dt>Email</dt><dd><a href={`mailto:${it.email}`}>{it.email}</a></dd>
                      {f?.phone && <><dt>Phone</dt><dd><a href={`tel:${f.phone}`}>{f.phone}</a></dd></>}
                      {f?.position && <><dt>Position</dt><dd>{f.position}</dd></>}
                      {f?.company && <><dt>Company</dt><dd>{f.company}</dd></>}
                      {f?.country && <><dt>Country</dt><dd>{f.country}</dd></>}
                      {f?.category && <><dt>Inquiry</dt><dd>{f.category}</dd></>}
                      {f?.department && f.department !== 'No preference' && <><dt>Department</dt><dd>{f.department}</dd></>}
                      {f?.subject && <><dt>Subject</dt><dd>{f.subject}</dd></>}
                      {f?.area && <><dt>Interested in</dt><dd>{f.area}</dd></>}
                      <dt>Received</dt><dd>{when(it.at)}</dd>
                    </dl>
                    {f?.message && <div className="ib__msg">{f.message}</div>}
                    {!f && <p className="muted">Loading…</p>}
                    <div className="ib__actions">
                      {it.cv && <button type="button" className="btn btn--blue" onClick={() => downloadCv(it)}><LuDownload aria-hidden /> Download CV <small>({it.cv.name} · {mb(it.cv.size)})</small></button>}
                      <a className="btn btn--outline" href={`mailto:${it.email}?subject=${encodeURIComponent(it.kind === 'application' ? `Your application to ASEC Automation${it.title ? ` — ${it.title}` : ''}` : 'Re: your message to ASEC Automation')}`}><LuMail aria-hidden /> Reply by email</a>
                      <button type="button" className="ca-btn" onClick={() => setRead(it.id, !it.read)}>{it.read ? <><LuMail aria-hidden /> Mark as unread</> : <><LuMailOpen aria-hidden /> Mark as read</>}</button>
                      <button type="button" className="ca-btn is-danger" onClick={() => remove(it)}><LuTrash2 aria-hidden /> Delete</button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

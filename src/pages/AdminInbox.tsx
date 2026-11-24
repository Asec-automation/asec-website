import React, { useEffect, useMemo, useState } from 'react'
import { LuDownload, LuTrash2, LuUndo2, LuMail, LuMailOpen, LuRefreshCw, LuFileText, LuBriefcase, LuMessageSquare, LuBell, LuSearch, LuX } from 'react-icons/lu'
import { INBOX_API, API_BASE } from '../content/live-jobs'
import { ReplyTemplates, fmtDate, fmtTime, type Stage, type Interview } from '../components/ReplyTemplates'
import { InterviewCalendar } from '../components/InterviewCalendar'

type Kind = 'application' | 'contact' | 'alert'
interface Summary { id: string; kind: Kind; at: number; read: boolean; name: string; email: string; title: string; cv?: { name: string; size: number }; stage?: Stage; interview?: Interview; deleted?: number }
const STAGE_LABEL: Record<Stage, string> = { new: 'Inbox', interview: 'Interviews', accepted: 'Accepted', rejected: 'Not accepted' }
interface Full extends Summary { phone?: string; company?: string; country?: string; category?: string; department?: string; position?: string; subject?: string; area?: string; message?: string }

const KIND: Record<Kind, { label: string; icon: React.ReactNode }> = {
  application: { label: 'Job application', icon: <LuBriefcase aria-hidden /> },
  contact: { label: 'Business inquiry', icon: <LuMessageSquare aria-hidden /> },
  alert: { label: 'Job alert', icon: <LuBell aria-hidden /> },
}
const when = (t: number) => new Date(t).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const mb = (n: number) => `${(n / 1024 / 1024).toFixed(2)} MB`

/** The website inbox: every application (with CV), contact message and job-alert sign-up. */
export function AdminInbox({ token, demo, onSignOut, onCount, kinds = ['application', 'contact', 'alert'], stages, active = true, calendar = false, bin = false }: { token: string; demo: boolean; onSignOut: () => void; onCount: (n: number) => void; kinds?: Kind[]; stages?: Stage[]; active?: boolean; calendar?: boolean; bin?: boolean }) {
  const fits = (i: Summary) => (bin ? !!i.deleted : !i.deleted) && kinds.includes(i.kind) && (bin || (i.kind !== 'application' || !stages || stages.includes(i.stage || 'new')))
  const keep = (l: Summary[]) => l.filter(fits)
  const [day, setDay] = useState('')
  const business = kinds.length === 1 && kinds[0] === 'contact'
  const [items, setItems] = useState<Summary[]>([])
  const [loading, setLoading] = useState(!demo)
  const [err, setErr] = useState('')
  const [filter, setFilter] = useState<'all' | Kind>('all')
  const [open, setOpen] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [position, setPosition] = useState('')
  const [full, setFull] = useState<Record<string, Full>>({})
  const auth = { Authorization: `Bearer ${token}` }

  const load = () => {
    if (demo) {
      setItems(keep([
        { id: 'd1', kind: 'application', at: Date.now() - 3600e3, read: false, name: 'Ahmed Hassan', email: 'ahmed@example.com', title: 'Senior PLC Engineer', cv: { name: 'Ahmed-Hassan-CV.pdf', size: 412000 } },
        { id: 'd2', kind: 'contact', at: Date.now() - 86400e3, read: true, name: 'Mona Adel', email: 'mona@example.com', title: 'MCC upgrade for a cement plant' },
        { id: 'd3', kind: 'alert', at: Date.now() - 2 * 86400e3, read: true, name: '', email: 'candidate@example.com', title: 'Automation & control' },
        { id: 'd4', kind: 'application', at: Date.now() - 3 * 86400e3, read: true, name: 'Sample Candidate', email: 'sample@example.com', title: 'Mechanical Tendering Engineer', stage: 'interview', interview: { date: new Date(Date.now() + 2 * 86400e3).toISOString().slice(0, 10), time: '11:00', interviewer: 'Eng. Interviewer' } },
      ])); return
    }
    setLoading(true); setErr('')
    fetch(INBOX_API, { headers: auth, cache: 'no-store' })
      .then(async (r) => { const d = await r.json().catch(() => ({})); if (r.status === 401) { onSignOut(); return } if (!r.ok) throw new Error(d.error); setItems(keep(d.items || [])) })
      .catch((x) => setErr((x as Error).message || 'Couldn’t load the inbox.'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { if (active) load() }, [token, demo, active])
  useEffect(() => { onCount(items.filter((i) => !i.read).length) }, [items])

  /** Job titles people applied for, with counts, so HR can see everyone who applied to one role. */
  const positions = useMemo(() => {
    const m = new Map<string, number>()
    items.filter((i) => i.kind === 'application').forEach((i) => { const t = (i.title || 'Open application').trim(); m.set(t, (m.get(t) || 0) + 1) })
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [items])
  const norm = (t: string) => t.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[–—]/g, '-')
  const shown = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean)
    return items.filter((i) => {
      if (filter !== 'all' && i.kind !== filter) return false
      if (position && (i.kind !== 'application' || (i.title || 'Open application').trim() !== position)) return false
      if (!words.length) return true
      const hay = norm(`${i.title} ${i.name} ${i.email} ${KIND[i.kind].label} ${i.interview?.interviewer || ''}`)
      return words.every((w) => hay.includes(w))
    }).filter((i) => !day || i.interview?.date === day)
      .sort((a, b) => calendar ? `${a.interview?.date}${a.interview?.time}`.localeCompare(`${b.interview?.date}${b.interview?.time}`) : 0)
  }, [items, filter, q, position, day, calendar])
  const calItems = useMemo(() => items.filter((i) => i.interview?.date).map((i) => ({ id: i.id, name: i.name || i.email, title: i.title, date: i.interview!.date, time: i.interview!.time, interviewer: i.interview!.interviewer })), [items])

  /** Move an application between Inbox / Interviews / Accepted / Not accepted (saved on the server). */
  const setStage = async (it: Summary, stage: Stage, interview?: Interview) => {
    const next = { ...it, stage, ...(interview ? { interview } : {}) }
    setItems((l) => (fits(next) ? l.map((i) => (i.id === it.id ? next : i)) : l.filter((i) => i.id !== it.id)))
    if (!fits(next)) setOpen(null)
    if (!demo) await fetch(`${INBOX_API}?id=${encodeURIComponent(it.id)}`, { method: 'PATCH', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(interview ? { stage, interview } : { stage }) }).catch(() => {})
  }
  const pickPosition = (t: string) => { setPosition((p) => (p === t ? '' : t)); setFilter('application') }
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
  /** Delete moves the item to the Deleted bin; it can be restored from there or deleted forever. */
  const setDeleted = async (it: Summary, deleted: boolean) => {
    setItems((l) => l.filter((i) => i.id !== it.id)); setOpen(null)
    if (!demo) await fetch(`${INBOX_API}?id=${encodeURIComponent(it.id)}`, { method: 'PATCH', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ deleted }) }).catch(() => {})
  }
  const purge = async (it: Summary) => {
    if (!window.confirm(`Delete this ${KIND[it.kind].label.toLowerCase()} from ${it.name || it.email} forever?${it.cv ? ' The CV will be deleted too.' : ''} This cannot be undone.`)) return
    setItems((l) => l.filter((i) => i.id !== it.id)); setOpen(null)
    if (!demo) await fetch(`${INBOX_API}?id=${encodeURIComponent(it.id)}`, { method: 'DELETE', headers: auth }).catch(() => {})
  }
  /** Ask the server for a short-lived signed link, then let the browser download or open it natively. */
  const openCv = async (it: Summary, mode: 'download' | 'view') => {
    if (demo) { window.alert('Demo only — on the live site this opens the CV.'); return }
    const tab = mode === 'view' ? window.open('', '_blank') : null
    try {
      const r = await fetch(`${INBOX_API}?cv=${encodeURIComponent(it.id)}&mode=${mode}`, { headers: auth, cache: 'no-store' })
      const d = await r.json().catch(() => ({}))
      if (r.status === 401) { tab?.close(); onSignOut(); return }
      if (!r.ok || !d.url) throw new Error()
      const link = API_BASE + d.url
      if (tab) tab.location.href = link
      else { const a = document.createElement('a'); a.href = link; a.download = it.cv?.name || 'cv'; document.body.appendChild(a); a.click(); a.remove() }
    } catch { tab?.close(); window.alert('The CV could not be opened. Please try again.') }
  }

  return (
    <div className="ib">
      <div className="ib__bar">
        <div className="ib__filters" role="tablist" aria-label="Filter inbox">
          {kinds.length > 1 && (['all', ...kinds] as const).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={filter === k} className={filter === k ? 'is-on' : ''} onClick={() => setFilter(k)}>
              {k === 'all' ? `All (${items.length})` : `${KIND[k].label.replace(/y$/, 'ie')}s (${count(k)})`}
            </button>
          ))}
        </div>
        <button type="button" className="ca-btn" onClick={load}><LuRefreshCw aria-hidden /> Refresh</button>
      </div>
      <div className="ib__search" role="search">
        <LuSearch aria-hidden />
        <label className="sr-only" htmlFor="ib-q">Search the inbox</label>
        <input id="ib-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={business ? 'Search by subject, name, company or email…' : 'Search by job title, name or email — e.g. “Procurement Engineer”'} autoComplete="off" />
        {(q || position) && <button type="button" className="ib__clear" onClick={() => { setQ(''); setPosition('') }}><LuX aria-hidden /> Clear</button>}
      </div>
      {positions.length > 0 && (filter === 'all' || filter === 'application') && (
        <div className="ib__positions" aria-label="Applications by job title">
          <span className="ib__positions-label">Applied for:</span>
          {positions.map(([t, n]) => (
            <button key={t} type="button" className={position === t ? 'is-on' : ''} aria-pressed={position === t} onClick={() => pickPosition(t)}>{t} <b>{n}</b></button>
          ))}
        </div>
      )}
      {calendar && <InterviewCalendar items={calItems} day={day} onDay={setDay} />}
      {day && <p className="ib__result">Interviews on {fmtDate(day)} · <button type="button" className="ib__link" onClick={() => setDay('')}>show all</button></p>}
      {(q || position) && !loading && <p className="ib__result">{shown.length} {shown.length === 1 ? 'result' : 'results'}{position ? ` for “${position}”` : ''}{q ? ` matching “${q}”` : ''}</p>}
      {err && <p className="ca-msg ca-msg--err">{err}</p>}
      {loading ? <p className="muted">Loading inbox…</p> : shown.length === 0 ? (
        (q || position) && items.length ? <div className="ca-empty"><h2>No matches</h2><p>Nothing matches your search. Try another job title or clear the search.</p></div>
        : <div className="ca-empty"><h2>Nothing here yet</h2><p>{bin ? 'Deleted applications and messages appear here. Restore them, or delete them forever.' : business ? 'Messages sent through the Contact Us form (quotes, site visits, partnership and service questions) appear here.' : stages && !stages.includes('new') ? `Applications moved to ${stages.map((x) => STAGE_LABEL[x]).join(' / ')} appear here.` : 'New job applications and job-alert sign-ups from the website appear here.'}</p></div>
      ) : (
        <ul className="ib__list">
          {shown.map((it) => {
            const f = full[it.id]; const isOpen = open === it.id
            return (
              <li key={it.id} className={`ib__item ${it.read ? '' : 'is-new'}`}>
                <button type="button" className="ib__row" onClick={() => toggle(it)} aria-expanded={isOpen}>
                  <span className={`ib__kind ib__kind--${it.kind}`}>{KIND[it.kind].icon}</span>
                  <span className="ib__main"><strong>{it.name || it.email}</strong><span>{KIND[it.kind].label}{it.title ? ` · ${it.title}` : ''}</span>{it.interview && it.stage === 'interview' && <span className="ib__iv">Interview · {fmtDate(it.interview.date)}, {fmtTime(it.interview.time)} · {it.interview.interviewer}</span>}</span>
                  {it.cv && <span className="ib__cv"><LuFileText aria-hidden /> CV</span>}
                  <time className="ib__time">{bin && it.deleted && it.deleted > 1 ? `Deleted ${when(it.deleted)}` : when(it.at)}</time>
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
                      {it.kind === 'application' && <><dt>Status</dt><dd>{STAGE_LABEL[it.stage || 'new']}{bin ? ' (restores here)' : ''}</dd></>}
                      {it.interview && <><dt>Interview</dt><dd>{fmtDate(it.interview.date)}, {fmtTime(it.interview.time)} · {it.interview.interviewer}</dd></>}
                    </dl>
                    {f?.message && <div className="ib__msg">{f.message}</div>}
                    {!f && <p className="muted">Loading…</p>}
                    {it.kind === 'application' && !bin && <ReplyTemplates name={f?.name || it.name} email={it.email} position={f?.position || it.title} interview={it.interview} onSchedule={(iv) => setStage(it, 'interview', iv)} onMove={(st) => setStage(it, st)} />}
                    {it.kind === 'application' && !bin && (
                      <div className="ib__move"><span>Move to:</span>{(['new', 'interview', 'accepted', 'rejected'] as Stage[]).map((st) => (
                        <button key={st} type="button" className={(it.stage || 'new') === st ? 'is-on' : ''} disabled={(it.stage || 'new') === st} onClick={() => setStage(it, st)}>{STAGE_LABEL[st]}</button>
                      ))}</div>
                    )}
                    <div className="ib__actions">
                      {it.cv && <button type="button" className="btn btn--blue" onClick={() => openCv(it, 'view')}><LuFileText aria-hidden /> Open CV</button>}
                      {it.cv && <button type="button" className="btn btn--outline" onClick={() => openCv(it, 'download')}><LuDownload aria-hidden /> Download CV <small>({it.cv.name} · {mb(it.cv.size)})</small></button>}
                      <a className="btn btn--outline" href={`mailto:${it.email}?subject=${encodeURIComponent(it.kind === 'application' ? `Your application to ASEC Automation${it.title ? ` — ${it.title}` : ''}` : 'Re: your message to ASEC Automation')}`}><LuMail aria-hidden /> Reply by email</a>
                      <button type="button" className="ca-btn" onClick={() => setRead(it.id, !it.read)}>{it.read ? <><LuMail aria-hidden /> Mark as unread</> : <><LuMailOpen aria-hidden /> Mark as read</>}</button>
                      {bin ? <>
                        <button type="button" className="ca-btn" onClick={() => setDeleted(it, false)}><LuUndo2 aria-hidden /> Restore</button>
                        <button type="button" className="ca-btn is-danger" onClick={() => purge(it)}><LuTrash2 aria-hidden /> Delete forever</button>
                      </> : <button type="button" className="ca-btn is-danger" onClick={() => setDeleted(it, true)}><LuTrash2 aria-hidden /> Delete</button>}
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

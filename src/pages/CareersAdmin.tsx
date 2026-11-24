import React, { useEffect, useRef, useState } from 'react'
import { LuLock, LuLogOut, LuPlus, LuTrash2, LuEye, LuEyeOff, LuArrowUp, LuArrowDown, LuUpload, LuDownload, LuSave, LuCircleCheck, LuTriangleAlert, LuInbox, LuBriefcase, LuHandshake, LuCalendarDays, LuUserCheck, LuUserX } from 'react-icons/lu'
import { AdminInbox } from './AdminInbox'
import { Link } from '../lib/router'
import { API_AVAILABLE, CAREERS_API, csvToJobs, jobsToCsv, slugify, type EditableJob } from '../content/live-jobs'

const TOKEN_KEY = 'asec-careers-token'
const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']
const blank = (): EditableJob => ({ slug: `job-${Date.now().toString(36)}`, title: '', department: '', location: '', type: 'Full-time', summary: '', responsibilities: [], requirements: [], show: true })
const getToken = () => { try { return sessionStorage.getItem(TOKEN_KEY) || '' } catch { return '' } }
const LAST_KEY = 'asec-careers-last-save'
const lastSave = (): { savedAt: number; jobs: EditableJob[] } | null => {
  try { const v = JSON.parse(localStorage.getItem(LAST_KEY) || 'null'); return v && Array.isArray(v.jobs) && Date.now() - v.savedAt < 10 * 60e3 ? v : null } catch { return null }
}
const setToken = (t: string) => { try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY) } catch {} }

export default function CareersAdmin() {
  const [token, setTok] = useState('')
  const [demo, setDemo] = useState(false)
  useEffect(() => { setTok(getToken()) }, [])
  const signOut = () => { setToken(''); setTok(''); setDemo(false) }
  return (
    <section className="ca">
      <div className="container">
        {token || demo ? <Workspace token={token} demo={demo} onSignOut={signOut} /> : <Login onToken={(t) => { setToken(t); setTok(t) }} onDemo={() => setDemo(true)} />}
      </div>
    </section>
  )
}

function Workspace({ token, demo, onSignOut }: { token: string; demo: boolean; onSignOut: () => void }) {
  type Tab = 'jobs' | 'inbox' | 'interviews' | 'accepted' | 'rejected' | 'business' | 'bin'
  const [tab, setTab] = useState<Tab>(() => { try { const h = location.hash.slice(1) as Tab; return (['inbox', 'interviews', 'accepted', 'rejected', 'business', 'bin'] as string[]).includes(h) ? h : 'jobs' } catch { return 'jobs' } })
  const [unread, setUnread] = useState(0)
  const [unreadBiz, setUnreadBiz] = useState(0)
  const noop = () => {}
  const T = (k: Tab, icon: React.ReactNode, label: string, badge = 0) => (
    <button type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{icon} {label}{badge > 0 && <span className="ca-tabs__n">{badge}</span>}</button>
  )
  const Head = ({ title, text }: { title: string; text: string }) => (
    <div className="ca-ed__head" style={{ marginBottom: 18 }}>
      <div><h1>{title}{demo && <span className="ca-tag">Demo</span>}</h1><p>{text}</p></div>
    </div>
  )
  const common = { token, demo, onSignOut }
  return (
    <>
      <div className="ca-ws">
      <nav className="ca-tabs" role="tablist" aria-label="Careers admin sections" aria-orientation="vertical">
        <span className="ca-tabs__group">Jobs</span>
        {T('jobs', <LuBriefcase aria-hidden />, 'Job openings')}
        <span className="ca-tabs__group">Applicants</span>
        {T('inbox', <LuInbox aria-hidden />, 'Inbox', unread)}
        {T('interviews', <LuCalendarDays aria-hidden />, 'Interviews')}
        {T('accepted', <LuUserCheck aria-hidden />, 'Accepted')}
        {T('rejected', <LuUserX aria-hidden />, 'Not accepted')}
        <span className="ca-tabs__group">Company</span>
        {T('business', <LuHandshake aria-hidden />, 'Business inquiries', unreadBiz)}
        <span className="ca-tabs__sep" aria-hidden />
        {T('bin', <LuTrash2 aria-hidden />, 'Deleted')}
        <button type="button" className="ca-tabs__out" onClick={onSignOut}><LuLogOut aria-hidden /> Sign out</button>
      </nav>
      <div className="ca-ws__main">
      <div hidden={tab !== 'jobs'}><Editor token={token} demo={demo} onSignOut={onSignOut} /></div>
      <div hidden={tab !== 'inbox'}>
        <Head title="Inbox" text="New job applications with CVs and job-alert sign-ups. Reply with a template or move an application to the next step." />
        <AdminInbox {...common} onCount={setUnread} kinds={['application', 'alert']} stages={['new']} active={tab === 'inbox'} />
      </div>
      <div hidden={tab !== 'interviews'}>
        <Head title="Interviews" text="Scheduled interviews. Click a day in the calendar to see who is coming." />
        <AdminInbox {...common} onCount={noop} kinds={['application']} stages={['interview']} active={tab === 'interviews'} calendar />
      </div>
      <div hidden={tab !== 'accepted'}>
        <Head title="Accepted" text="Candidates who received an offer. Their CVs stay here." />
        <AdminInbox {...common} onCount={noop} kinds={['application']} stages={['accepted']} active={tab === 'accepted'} />
      </div>
      <div hidden={tab !== 'rejected'}>
        <Head title="Not accepted" text="Candidates who were not selected. Their CVs are kept on file for future openings." />
        <AdminInbox {...common} onCount={noop} kinds={['application']} stages={['rejected']} active={tab === 'rejected'} />
      </div>
      <div hidden={tab !== 'business'}>
        <Head title="Business inquiries" text="Messages from the Contact Us form: quote requests, site visits, partnerships and service questions." />
        <AdminInbox {...common} onCount={setUnreadBiz} kinds={['contact']} active={tab === 'business'} />
      </div>
      <div hidden={tab !== 'bin'}>
        <Head title="Deleted" text="Deleted applications, job alerts and business inquiries. Restore an item to put it back where it was, or delete it forever." />
        <AdminInbox {...common} onCount={noop} active={tab === 'bin'} bin />
      </div>
      </div>
      </div>
    </>
  )
}

function Login({ onToken, onDemo }: { onToken: (t: string) => void; onDemo: () => void }) {
  const [pw, setPw] = useState(''); const [show, setShow] = useState(false)
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('')
    if (!pw) { setErr('Enter the careers password.'); return }
    if (!API_AVAILABLE) { setErr('Sign-in works once the website is online. Use the demo below to see how it looks.'); return }
    setBusy(true)
    try {
      const r = await fetch(`${CAREERS_API}?action=login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Sign-in failed. Please try again.')
      onToken(d.token)
    } catch (x) { setErr((x as Error).message === 'Failed to fetch' ? 'Couldn’t reach the server. Check your connection and try again.' : (x as Error).message) }
    finally { setBusy(false) }
  }
  return (
    <div className="ca-login">
      <span className="ca-login__icon"><LuLock aria-hidden /></span>
      <h1>Careers admin</h1>
      <p>Sign in to manage job openings and read applications, CVs and messages.</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="ca-pw">Password</label>
        <div className="ca-pw">
          <input id="ca-pw" type={show ? 'text' : 'password'} autoComplete="current-password" value={pw} onChange={(e) => { setPw(e.target.value); setErr('') }} aria-invalid={!!err || undefined} aria-describedby={err ? 'ca-err' : undefined} />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <LuEyeOff /> : <LuEye />}</button>
        </div>
        {err && <p className="ca-err" id="ca-err" role="alert">{err}</p>}
        <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      {!API_AVAILABLE && <button type="button" className="ca-demo" onClick={onDemo}>Open the demo (preview only — nothing is saved)</button>}
      <Link to="/careers" className="ca-back">← Back to Careers</Link>
    </div>
  )
}

function Editor({ token, demo, onSignOut }: { token: string; demo: boolean; onSignOut: () => void }) {
  const [jobs, setJobs] = useState<EditableJob[]>([])
  const [loading, setLoading] = useState(!demo)
  const [dirty, setDirty] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (demo) { setJobs([{ ...blank(), slug: 'demo-1', title: 'Senior PLC Engineer', department: 'Automation', location: 'Cairo, Egypt', summary: 'Lead PLC and SCADA projects for cement plants.', responsibilities: ['Design PLC logic', 'Commission control systems'], requirements: ['5+ years PLC experience', 'Siemens TIA Portal'] }]); return }
    fetch(`${CAREERS_API}?all=1`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({})); if (r.status === 401) { onSignOut(); return } if (!r.ok) throw new Error(d.error)
        // Cloudflare can take up to a minute to show a new save everywhere; if this browser saved something newer, show that.
        const mine = lastSave()
        if (mine && mine.savedAt > (Number(d.savedAt) || 0)) setJobs(mine.jobs)
        else setJobs(d.jobs || [])
      })
      .catch((x) => setMsg({ kind: 'err', text: (x as Error).message || 'Couldn’t load the job list.' }))
      .finally(() => setLoading(false))
  }, [token, demo])

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const update = (list: EditableJob[]) => { setJobs(list); setDirty(true); setMsg(null) }
  const patch = (i: number, p: Partial<EditableJob>) => update(jobs.map((j, k) => (k === i ? { ...j, ...p } : j)))
  const move = (i: number, d: number) => { const n = [...jobs]; const t = n[i]; n[i] = n[i + d]; n[i + d] = t; update(n) }
  const add = () => { const j = blank(); update([j, ...jobs]); setOpen(j.slug) }
  /** Deleting saves straight away, so a deleted job can't come back by forgetting to press Save. */
  const remove = (i: number) => {
    if (!window.confirm(`Delete “${jobs[i].title || 'this job'}”? It will be removed from the Careers page straight away.`)) return
    const rest = jobs.filter((_, k) => k !== i)
    if (rest.some((j) => !j.title.trim())) { update(rest); setMsg({ kind: 'err', text: 'Deleted here — give every remaining job a title, then press Save and publish.' }); return }
    setJobs(rest); save(rest, 'Deleted. The Careers page will update within about a minute.')
  }

  const save = async (src: EditableJob[] = jobs, okText = 'Saved. The Careers page will update within about a minute.') => {
    const jobs = src
    const missing = jobs.findIndex((j) => !j.title.trim())
    if (missing >= 0) { setOpen(jobs[missing].slug); setMsg({ kind: 'err', text: 'Every job needs a title before saving.' }); return }
    const list = jobs.map((j) => ({ ...j, slug: j.slug.startsWith('job-') && j.title ? `${slugify(j.title)}-${j.slug.slice(4)}` : j.slug }))
    if (demo) { setJobs(list); setDirty(false); setMsg({ kind: 'ok', text: 'Demo only — on the live site this publishes the changes to the Careers page.' }); return }
    setSaving(true)
    try {
      const r = await fetch(CAREERS_API, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ jobs: list }) })
      const d = await r.json().catch(() => ({}))
      if (r.status === 401) { setMsg({ kind: 'err', text: 'Your session expired. Copy any unsaved text, then sign in again.' }); return }
      if (!r.ok) throw new Error(d.error || 'Saving failed.')
      setJobs(d.jobs); setDirty(false); setMsg({ kind: 'ok', text: okText })
      try { localStorage.setItem(LAST_KEY, JSON.stringify({ savedAt: Number(d.savedAt) || Date.now(), jobs: d.jobs })) } catch {}
    } catch (x) { setMsg({ kind: 'err', text: (x as Error).message }) } finally { setSaving(false) }
  }

  const importCsv = async (f: File) => {
    if (!/\.csv$/i.test(f.name)) { setMsg({ kind: 'err', text: 'Please choose a CSV file. In Excel use File → Save As → CSV UTF-8.' }); return }
    const rows = csvToJobs(await f.text())
    if (!rows.length) { setMsg({ kind: 'err', text: 'No jobs found. The first row must contain the column titles (Title, Department, …).' }); return }
    const replace = jobs.length === 0 || window.confirm(`Found ${rows.length} job(s). Press OK to REPLACE the current list, or Cancel to ADD them to it.`)
    update(replace ? rows : [...rows, ...jobs]); setMsg({ kind: 'ok', text: `${rows.length} job(s) imported. Review them, then press Save to publish.` })
  }
  const exportCsv = () => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([jobsToCsv(jobs)], { type: 'text/csv;charset=utf-8' }))
    a.download = 'ASEC-careers-jobs.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  const visible = jobs.filter((j) => j.show !== false).length
  return (
    <div className="ca-ed">
      <header className="ca-ed__head">
        <div>
          <h1>Careers admin{demo && <span className="ca-tag">Demo</span>}</h1>
          <p>{jobs.length} job{jobs.length === 1 ? '' : 's'} · {visible} shown on the Careers page{dirty && <strong> · unsaved changes</strong>}</p>
        </div>
        <div className="ca-ed__actions">
          <button type="button" className="ca-btn" onClick={() => fileRef.current?.click()}><LuUpload aria-hidden /> Import Excel (CSV)</button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) importCsv(f); e.target.value = '' }} />
          <button type="button" className="ca-btn" onClick={exportCsv} disabled={!jobs.length}><LuDownload aria-hidden /> Download Excel (CSV)</button>
        </div>
      </header>

      <div className="ca-bar">
        <button type="button" className="btn btn--outline" onClick={add}><LuPlus aria-hidden /> Add a job</button>
        <button type="button" className="btn btn--primary" onClick={() => save()} disabled={saving || !dirty}><LuSave aria-hidden /> {saving ? 'Saving…' : 'Save and publish'}</button>
      </div>
      <div aria-live="polite">{msg && <p className={`ca-msg ca-msg--${msg.kind}`}>{msg.kind === 'ok' ? <LuCircleCheck aria-hidden /> : <LuTriangleAlert aria-hidden />}{msg.text}</p>}</div>

      {loading ? <p className="muted">Loading jobs…</p> : jobs.length === 0 ? (
        <div className="ca-empty"><h2>No jobs yet</h2><p>Press “Add a job”, or import your Excel list saved as CSV.</p></div>
      ) : (
        <ol className="ca-list">
          {jobs.map((j, i) => {
            const isOpen = open === j.slug
            return (
              <li key={j.slug} className={`ca-job ${j.show === false ? 'is-hidden' : ''}`}>
                <div className="ca-job__row">
                  <button type="button" className="ca-job__title" onClick={() => setOpen(isOpen ? null : j.slug)} aria-expanded={isOpen}>
                    <strong>{j.title || 'Untitled job'}</strong>
                    <span>{[j.department, j.location, j.type].filter(Boolean).join(' · ') || 'Click to edit'}</span>
                  </button>
                  <label className="ca-switch"><input type="checkbox" checked={j.show !== false} onChange={(e) => patch(i, { show: e.target.checked })} /><span>{j.show !== false ? 'Shown' : 'Hidden'}</span></label>
                  <div className="ca-job__tools">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><LuArrowUp /></button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === jobs.length - 1} aria-label="Move down"><LuArrowDown /></button>
                    <button type="button" onClick={() => remove(i)} aria-label="Delete job" className="is-danger"><LuTrash2 /></button>
                  </div>
                </div>
                {isOpen && (
                  <div className="ca-job__form">
                    <label className="ca-f ca-f--wide">Job title *<input value={j.title} maxLength={120} onChange={(e) => patch(i, { title: e.target.value })} /></label>
                    <label className="ca-f">Department<input value={j.department} maxLength={80} onChange={(e) => patch(i, { department: e.target.value })} /></label>
                    <label className="ca-f">Location<input value={j.location} maxLength={80} placeholder="Cairo, Egypt" onChange={(e) => patch(i, { location: e.target.value })} /></label>
                    <label className="ca-f">Type<select value={j.type} onChange={(e) => patch(i, { type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
                    <label className="ca-f ca-f--wide">Short description<textarea rows={3} value={j.summary} maxLength={1200} onChange={(e) => patch(i, { summary: e.target.value })} /></label>
                    <label className="ca-f">Responsibilities <em>one per line</em><textarea rows={5} value={j.responsibilities.join('\n')} onChange={(e) => patch(i, { responsibilities: e.target.value.split('\n') })} onBlur={(e) => patch(i, { responsibilities: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })} /></label>
                    <label className="ca-f">Requirements <em>one per line</em><textarea rows={5} value={j.requirements.join('\n')} onChange={(e) => patch(i, { requirements: e.target.value.split('\n') })} onBlur={(e) => patch(i, { requirements: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })} /></label>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

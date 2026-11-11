import React, { useState } from 'react'
import { company } from '../content/company'
import { href } from '../lib/router'
import { Arrow } from './ui'

const AREAS = ['Any role', 'Automation & control', 'Electrical engineering', 'Panel workshop', 'Solar / PV', 'Site & commissioning', 'Sales & business development', 'Internships']

/** "Get notified of new jobs" — sends the sign-up to the HR mailbox (careers@) via FormSubmit. */
export function JobAlerts() {
  const [email, setEmail] = useState('')
  const [area, setArea] = useState('Any role')
  const [consent, setConsent] = useState(false)
  const [honey, setHoney] = useState('')
  const [err, setErr] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const endpoint = company.careersEndpoint.replace('formsubmit.co/', 'formsubmit.co/ajax/')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setErr('Please enter a valid email address.'); return }
    if (!consent) { setErr('Please agree so we can email you about new jobs.'); return }
    setErr('')
    if (honey) { setState('sent'); return }
    setState('sending')
    try {
      const r = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email.trim(), 'Area of interest': area, formType: 'job-alert', _subject: `Job alert sign-up — ${area} — ${email.trim()}`, _template: 'table', _captcha: 'false', _replyto: email.trim() }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok || String(d.success) === 'false') throw new Error()
      setState('sent')
    } catch { setState('error') }
  }

  return (
    <div className="alerts panel reveal">
      <div className="alerts__text">
        <span className="eyebrow">Job alerts</span>
        <h2 className="h3">Get notified of new jobs.</h2>
        <p className="muted">Leave your email and the area you’re interested in. Our HR team will let you know when a matching role opens.</p>
      </div>
      {state === 'sent' ? (
        <div className="notice notice--ok" role="status">Thank you — you’re on the list. We’ll email you when a matching role opens.</div>
      ) : (
        <form className="alerts__form" onSubmit={submit} noValidate aria-label="Job alerts sign-up">
          <div className="alerts__row">
            <div className="field"><label htmlFor="ja-email">Email</label><input id="ja-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!err && !email ? true : undefined} /></div>
            <div className="field"><label htmlFor="ja-area">Area of interest</label><select id="ja-area" value={area} onChange={(e) => setArea(e.target.value)}>{AREAS.map((a) => <option key={a} value={a}>{a}</option>)}</select></div>
          </div>
          <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden><label>Website<input tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} /></label></div>
          <label className="check"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>I agree that ASEC Automation may email me about job openings, as described in the <a href={href('/privacy')} style={{ textDecoration: 'underline' }}>Privacy Policy</a>. I can unsubscribe at any time.</span></label>
          {err && <span className="field__err" role="alert">{err}</span>}
          {state === 'error' && <div className="notice notice--err">Sorry — the sign-up could not be sent. Please try again later.</div>}
          <div><button className="btn btn--blue" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Notify me'} <Arrow /></button></div>
        </form>
      )}
    </div>
  )
}

import React, { useMemo, useState } from 'react'
import { LuCalendarClock, LuMailX, LuFileCheck, LuMail, LuCopy, LuCheck, LuMapPin, LuPaperclip } from 'react-icons/lu'
import { company } from '../content/company'

export type Stage = 'new' | 'interview' | 'accepted' | 'rejected'
export interface Interview { date: string; time: string; interviewer: string }
type Kind = 'interview' | 'regret' | 'offer'
const HEAD = company.offices?.find((o) => o.label === 'Head office')
const ADDRESS = HEAD?.address || company.contact.address
const MAP = HEAD?.mapUrl || ''
const LOGO = 'https://www.asecautomation.com/images/brand/logo-dark-full.png'
const SIGN = `Best regards,\nHR Team · ASEC Automation\n${company.contact.hrEmail}`

export const fmtDate = (d: string) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '')
export const fmtTime = (t: string) => { if (!t) return ''; const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}` }
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Ready-made emails for an applicant. Sending one also moves the application to the matching tab. */
export function ReplyTemplates({ name, email, position, interview, onSchedule, onMove }: {
  name: string; email: string; position: string; interview?: Interview
  onSchedule: (iv: Interview) => void; onMove: (s: Stage) => void
}) {
  const [kind, setKind] = useState<Kind | null>(null)
  const [date, setDate] = useState(interview?.date || '')
  const [time, setTime] = useState(interview?.time || '')
  const [interviewer, setInterviewer] = useState(interview?.interviewer || '')
  const [replyBy, setReplyBy] = useState('')
  const [cc, setCc] = useState('')
  const [copied, setCopied] = useState(false)
  const first = (name || '').trim().split(/\s+/)[0] || 'Candidate'
  const role = position && position !== 'Open application' ? position : ''
  const roleText = role ? `the ${role} position` : 'a position'

  const mail = useMemo(() => {
    if (kind === 'interview') return {
      subject: `Interview invitation${role ? ` — ${role}` : ''} | ASEC Automation`,
      body: `Dear ${first},\n\nThank you for applying for ${roleText} at ASEC Automation. We are pleased to invite you to an interview.\n\nDate: ${fmtDate(date) || '[date]'}\nTime: ${fmtTime(time) || '[time]'} (Cairo time)\nInterviewer: ${interviewer || '[interviewer name]'}\nLocation: ASEC Automation head office, ${ADDRESS}${MAP ? `\nMap: ${MAP}` : ''}\nWebsite: www.asecautomation.com\n\nTo learn more about our work before the interview, you are welcome to visit our website.\n\nPlease arrive 10 minutes early, and reply to this email to confirm your attendance. If this time does not suit you, let us know and we will arrange another slot.\n\nWe look forward to meeting you.\n\n${SIGN}`,
      action: 'Open in email & schedule',
    }
    if (kind === 'regret') return {
      subject: `Your application${role ? ` — ${role}` : ''} | ASEC Automation`,
      body: `Dear ${first},\n\nThank you for your interest in ASEC Automation and for the time you took to apply for ${roleText}.\n\nAfter careful review, we have decided not to move forward with your application for this role at this time.\n\nWe were glad to learn about your experience, and we will keep your CV on file. If a suitable opportunity opens in the future, our team will contact you. You are also welcome to follow our open roles at www.asecautomation.com/careers.\n\nWe wish you every success in your career.\n\n${SIGN}`,
      action: 'Open in email & move to Not accepted',
    }
    if (kind === 'offer') return {
      subject: `Your offer letter${role ? ` — ${role}` : ''} | ASEC Automation`,
      body: `Dear ${first},\n\nCongratulations! We are delighted to offer you ${roleText} at ASEC Automation.\n\nPlease find your offer letter attached. It sets out your position, start date, compensation and the terms of employment.\n\nKindly review the letter, sign it and send it back to us${replyBy ? ` by ${fmtDate(replyBy)}` : ''}. If you have any questions, reply to this email and we will be happy to help.\n\nWe look forward to welcoming you to the ASEC team.\n\n${SIGN}`,
      action: 'Open in email & move to Accepted',
    }
    return null
  }, [kind, date, time, interviewer, replyBy, first, role, roleText])

  const ready = kind !== 'interview' || (date && time && interviewer.trim())
  const after = () => {
    if (kind === 'interview') onSchedule({ date, time, interviewer: interviewer.trim() })
    else if (kind === 'regret') onMove('rejected')
    else if (kind === 'offer') onMove('accepted')
  }
  const send = () => { if (!mail || !ready) return; const ccList = cc.split(/[;,\s]+/).filter(Boolean).join(','); window.location.href = `mailto:${email}?${ccList ? `cc=${encodeURIComponent(ccList)}&` : ''}subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`; after() }
  /** Copies a formatted version (ASEC logo on top) for Outlook / Gmail, plus plain text as a fallback. */
  const copy = async () => {
    if (!mail || !ready) return
    const html = `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#1f2a44;line-height:1.55"><img src="${LOGO}" alt="ASEC Automation" width="180" style="display:block;margin:0 0 16px"><div style="white-space:pre-wrap">${esc(mail.body).replace(/\n/g, '<br>')}</div></div>`
    try {
      if (window.ClipboardItem) await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([mail.body], { type: 'text/plain' }) })])
      else await navigator.clipboard.writeText(mail.body)
      setCopied(true); setTimeout(() => setCopied(false), 1800)
    } catch { /* ignore */ }
  }

  const TABS: [Kind, string, React.ReactNode][] = [
    ['interview', 'Interview invitation', <LuCalendarClock aria-hidden />],
    ['regret', 'Not selected (CV kept)', <LuMailX aria-hidden />],
    ['offer', 'Offer letter', <LuFileCheck aria-hidden />],
  ]
  return (
    <div className="rt">
      <div className="rt__head"><strong>Reply with a template</strong><span>Sending moves the application to Interviews, Accepted or Not accepted.</span></div>
      <div className="rt__tabs" role="tablist">
        {TABS.map(([k, label, icon]) => (
          <button key={k} type="button" role="tab" aria-selected={kind === k} className={kind === k ? 'is-on' : ''} onClick={() => setKind(kind === k ? null : k)}>{icon} {label}</button>
        ))}
      </div>
      {kind && mail && (
        <div className="rt__panel">
          {kind === 'interview' && (
            <div className="rt__fields">
              <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
              <label>Time<input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
              <label>Interviewer name<input type="text" value={interviewer} onChange={(e) => setInterviewer(e.target.value)} placeholder="Full name and title" /></label>
              <label>Interviewer email (CC)<input type="email" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="name@asecautomation.com" /></label>
              <p className="rt__loc"><LuMapPin aria-hidden /> Location and website are added automatically: ASEC head office, {ADDRESS} · www.asecautomation.com</p>
            </div>
          )}
          {kind === 'offer' && (
            <div className="rt__fields">
              <label>Reply by (optional)<input type="date" value={replyBy} onChange={(e) => setReplyBy(e.target.value)} /></label>
              <label>CC (optional)<input type="email" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="e.g. hiring manager" /></label>
              <p className="rt__loc rt__warn"><LuPaperclip aria-hidden /> Remember to attach the offer letter (PDF) in your email before sending.</p>
            </div>
          )}
          <div className="rt__preview" aria-label="Email preview">
            <div className="rt__meta"><span>To</span><b>{email}</b></div>
            {cc.trim() && <div className="rt__meta"><span>CC</span><b>{cc}</b></div>}
            <div className="rt__meta"><span>Subject</span><b>{mail.subject}</b></div>
            <div className="rt__mail"><img src="/images/brand/logo-dark-full.png" alt="ASEC Automation" /><pre>{mail.body}</pre></div>
          </div>
          <div className="rt__actions">
            <button type="button" className="btn btn--blue" onClick={send} disabled={!ready}><LuMail aria-hidden /> {mail.action}</button>
            <button type="button" className="btn btn--outline" onClick={copy} disabled={!ready}>{copied ? <><LuCheck aria-hidden /> Copied</> : <><LuCopy aria-hidden /> Copy with logo</>}</button>
            {!ready && <span className="rt__hint">Fill in the date, time and interviewer first.</span>}
          </div>
          <p className="rt__note">“Copy with logo” pastes the email with the ASEC logo into Outlook or Gmail. “Open in email” opens a plain-text draft (email apps don’t allow logos there).</p>
        </div>
      )}
    </div>
  )
}

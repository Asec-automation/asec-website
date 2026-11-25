import React, { useMemo, useState } from 'react'
import { LuCalendarClock, LuMailX, LuFileCheck, LuMail, LuMapPin, LuPaperclip } from 'react-icons/lu'
import { company } from '../content/company'

export type Stage = 'new' | 'interview' | 'accepted' | 'rejected'
export interface Interview { date: string; time: string; interviewer: string }
type Kind = 'interview' | 'regret' | 'offer'
const HEAD = company.offices?.find((o) => o.label === 'Head office')
const ADDRESS = HEAD?.address || company.contact.address
const MAP = HEAD?.mapUrl || ''
/** The careers@ Outlook signature (logo, HR Team, email, website, LinkedIn) is added by Outlook itself. */
const SIGN = 'Best regards,'

export const fmtDate = (d: string) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '')
export const fmtTime = (t: string) => { if (!t) return ''; const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}` }

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
  const first = (name || '').trim().split(/\s+/)[0] || 'Candidate'
  const role = position && position !== 'Open application' ? position : ''
  const roleText = role ? `the ${role} position` : 'a position'

  const mail = useMemo(() => {
    if (kind === 'interview') return {
      subject: `Interview invitation${role ? ` — ${role}` : ''} | ASEC Automation`,
      body: `Dear ${first},\n\nThank you for applying for ${roleText} at ASEC Automation. We are pleased to invite you to an interview.\n\nDate: ${fmtDate(date) || '[date]'}\nTime: ${fmtTime(time) || '[time]'} (Cairo time)\nInterviewer: ${interviewer || '[interviewer name]'}\nLocation: ${MAP || `ASEC Automation head office, ${ADDRESS}`}\n\nPlease arrive 10 minutes early, and reply to this email to confirm your attendance. If this time does not suit you, let us know and we will arrange another slot.\n\nWe look forward to meeting you.\n\n${SIGN}`,
      action: 'Open in Outlook & schedule',
    }
    if (kind === 'regret') return {
      subject: `Your application${role ? ` — ${role}` : ''} | ASEC Automation`,
      body: `Dear ${first},\n\nThank you for your interest in ASEC Automation and for the time you took to apply for ${roleText}.\n\nAfter careful review, we have decided not to move forward with your application for this role at this time.\n\nWe were glad to learn about your experience, and we will keep your CV on file. If a suitable opportunity opens in the future, our team will contact you. You are also welcome to follow our open roles at www.asecautomation.com/careers.\n\nWe wish you every success in your career.\n\n${SIGN}`,
      action: 'Open in Outlook & move to Not accepted',
    }
    if (kind === 'offer') return {
      subject: `Your offer letter${role ? ` — ${role}` : ''} | ASEC Automation`,
      body: `Dear ${first},\n\nCongratulations! We are delighted to offer you ${roleText} at ASEC Automation.\n\nPlease find your offer letter attached. It sets out your position, start date, compensation and the terms of employment.\n\nKindly review the letter, sign it and send it back to us${replyBy ? ` by ${fmtDate(replyBy)}` : ''}. If you have any questions, reply to this email and we will be happy to help.\n\nWe look forward to welcoming you to the ASEC team.\n\n${SIGN}`,
      action: 'Open in Outlook & move to Accepted',
    }
    return null
  }, [kind, date, time, interviewer, replyBy, first, role, roleText])

  const ready = kind !== 'interview' || (date && time && interviewer.trim())
  const after = () => {
    if (kind === 'interview') onSchedule({ date, time, interviewer: interviewer.trim() })
    else if (kind === 'regret') onMove('rejected')
    else if (kind === 'offer') onMove('accepted')
  }
  const ccList = cc.split(/[;,\s]+/).filter(Boolean).join(',')
  /** Opens a new email in Outlook on the web, from the signed-in careers@ mailbox, with the ASEC signature added by Outlook. */
  const send = () => {
    if (!mail || !ready) return
    const q = new URLSearchParams({ to: email, ...(ccList ? { cc: ccList } : {}), subject: mail.subject, body: mail.body })
    window.open(`https://outlook.office.com/mail/deeplink/compose?${q.toString().replace(/\+/g, '%20')}`, '_blank', 'noopener')
    after()
  }
  /** Fallback: the computer's default email app (plain text, no logo). */
  const sendApp = () => { if (!mail || !ready) return; window.location.href = `mailto:${email}?${ccList ? `cc=${encodeURIComponent(ccList)}&` : ''}subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`; after() }
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
              <p className="rt__loc"><LuMapPin aria-hidden /> The Google Maps link to the ASEC head office is added automatically (the full address is in the signature).</p>
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
            <div className="rt__mail"><pre>{mail.body}</pre>
              <div className="rt__sig" aria-label="Outlook signature (added automatically)"><img src="/images/brand/logo-dark-full.png" alt="ASEC Automation" /><div><b>Recruitment Team</b><span>ASEC Automation · Careers</span><small>careers@asecautomation.com</small><small>9 Street 286, New Maadi, Cairo, Egypt</small><small>www.asecautomation.com · <em>LinkedIn</em></small></div></div></div>
          </div>
          <div className="rt__actions">
            <button type="button" className="btn btn--blue" onClick={send} disabled={!ready}><LuMail aria-hidden /> {mail.action}</button>
            <button type="button" className="btn btn--outline" onClick={sendApp} disabled={!ready}><LuMail aria-hidden /> Use my email app instead</button>
            {!ready && <span className="rt__hint">Fill in the date, time and interviewer first.</span>}
          </div>
          <p className="rt__note">Opens a new email in Outlook from <b>careers@asecautomation.com</b>, with the ASEC signature and logo added automatically. Check it, then press Send. (Sign in to the careers mailbox in this browser first.)</p>
        </div>
      )}
    </div>
  )
}

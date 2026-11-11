import React, { useEffect, useRef, useState } from 'react'
import { company } from '../content/company'
import { useJobs } from '../content/live-jobs'
import { Arrow } from './ui'
import { href } from '../lib/router'

const MAX_MB = 5
const OK_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const OK_EXT = /\.(pdf|doc|docx)$/i

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'cv' | 'consent', string>>

export function ApplicationForm() {
  const [v, setV] = useState({ name: '', email: '', phone: '', position: 'Open application', letter: '', consent: false, website: '' })
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error' | 'not-connected'>('idle')
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const sentRef = useRef(false)
  const { jobs } = useJobs()
  useEffect(() => {
    const on = (e: Event) => setV((x) => ({ ...x, position: (e as CustomEvent<string>).detail }))
    window.addEventListener('apply-position', on)
    return () => window.removeEventListener('apply-position', on)
  }, [])
  /** FormSubmit (formsubmit.co) emails the form and the attached CV straight to the careers inbox. */
  const viaFormSubmit = /formsubmit\.co\//.test(company.careersEndpoint) && !/\/ajax\//.test(company.careersEndpoint)

  const validate = (): Errors => {
    const e: Errors = {}
    if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
    if (v.phone && !/^[+()\d\s-]{6,20}$/.test(v.phone)) e.phone = 'Please use digits, spaces, +, - or brackets only.'
    if (!file) e.cv = 'Please attach your CV / résumé.'
    else if (!(OK_TYPES.includes(file.type) || OK_EXT.test(file.name))) e.cv = 'Please upload a PDF, DOC or DOCX file.'
    else if (file.size > MAX_MB * 1024 * 1024) e.cv = `The file is larger than ${MAX_MB} MB.`
    if (!v.consent) e.consent = 'Consent is required to process your application.'
    return e
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate(); setErrors(e)
    if (Object.keys(e).length) { document.getElementById(`a-${Object.keys(e)[0]}`)?.focus(); return }
    if (v.website) return
    if (!company.careersEndpoint) { setState('not-connected'); return }
    setState('sending')
    if (viaFormSubmit) { sentRef.current = true; formRef.current?.submit(); return }
    try {
      const fd = new FormData()
      fd.append('name', v.name); fd.append('email', v.email); fd.append('phone', v.phone)
      fd.append('position', v.position); fd.append('coverLetter', v.letter); fd.append('consent', 'yes')
      fd.append('cv', file!)
      const res = await fetch(company.careersEndpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(String(res.status))
      setState('sent')
    } catch { setState('error') }
  }

  if (state === 'sent') return <div className="notice notice--ok" role="status"><span>Thank you — your application and CV were received. Our HR team will be in touch if your profile matches an opening.</span></div>

  const err = (k: keyof Errors) => errors[k] && <span className="field__err" id={`a-${k}-err`}>{errors[k]}</span>
  const a = (k: keyof Errors) => ({ id: `a-${k}`, 'aria-invalid': !!errors[k] || undefined, 'aria-describedby': errors[k] ? `a-${k}-err` : undefined })

  return (
    <>
    {viaFormSubmit && <iframe name="cv-sink" title="Application upload" style={{ display: 'none' }} onLoad={() => { if (sentRef.current) { sentRef.current = false; setState('sent') } }} />}
    <form ref={formRef} className="form" onSubmit={submit} noValidate aria-label="Job application form"
      {...(viaFormSubmit ? { action: company.careersEndpoint, method: 'POST', encType: 'multipart/form-data', target: 'cv-sink' } : {})}>
      {viaFormSubmit && <>
        <input type="hidden" name="_subject" value={`Job application — ${v.position} — ${v.name}`} />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
      </>}
      <div className="form-row">
        <div className="field"><label htmlFor="a-name">Full name <span aria-hidden style={{ color: '#c53030' }}>*</span></label><input {...a('name')} name="Name" autoComplete="name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />{err('name')}</div>
        <div className="field"><label htmlFor="a-email">Email <span aria-hidden style={{ color: '#c53030' }}>*</span></label><input {...a('email')} name="email" type="email" autoComplete="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} />{err('email')}</div>
      </div>
      <div className="form-row">
        <div className="field"><label htmlFor="a-phone">Phone</label><input {...a('phone')} name="Phone" type="tel" autoComplete="tel" value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} />{err('phone')}</div>
        <div className="field"><label htmlFor="a-position">Position</label>
          <select id="a-position" name="Position" value={v.position} onChange={(e) => setV({ ...v, position: e.target.value })}>
            <option>Open application</option>{jobs.map((j) => <option key={j.slug}>{j.title}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="a-cv">CV / résumé <span aria-hidden style={{ color: '#c53030' }}>*</span></label>
        <div className={`dropzone ${errors.cv ? 'is-error' : ''}`} onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); try { if (fileRef.current) fileRef.current.files = e.dataTransfer.files } catch {} } }}>
          <input ref={fileRef} {...a('cv')} name="attachment" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="sr-only" />
          {file ? <span><strong>{file.name}</strong> · {(file.size / 1024 / 1024).toFixed(2)} MB — <u>change file</u></span>
            : <span><strong>Click to attach</strong> or drag your CV here · PDF, DOC or DOCX, up to {MAX_MB} MB</span>}
        </div>
        {err('cv')}
      </div>
      <div className="field"><label htmlFor="a-letter">Cover letter (optional)</label><textarea id="a-letter" name="Cover letter" value={v.letter} maxLength={4000} onChange={(e) => setV({ ...v, letter: e.target.value })} /></div>
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden><label>Website<input name="_honey" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => setV({ ...v, website: e.target.value })} /></label></div>
      <div>
        <label className="check"><input type="checkbox" {...a('consent')} checked={v.consent} onChange={(e) => setV({ ...v, consent: e.target.checked })} />
          <span>I agree that ASEC Automation may store and process my application and CV for recruitment purposes, as described in the <a href={href('/privacy')} style={{ textDecoration: 'underline' }}>Privacy Policy</a>.</span></label>
        {err('consent')}
      </div>
      <div aria-live="polite">
        {state === 'not-connected' && <div className="notice notice--warn"><span>Online applications aren’t connected yet. Please email your CV to <a href={`mailto:${company.contact.hrEmail}?subject=${encodeURIComponent('Job application — ' + (v.name || ''))}`} style={{ textDecoration: 'underline', fontWeight: 600 }}>{company.contact.hrEmail}</a> instead.</span></div>}
        {state === 'error' && <div className="notice notice--err"><span>Sorry — your application could not be sent. Please try again later.</span></div>}
      </div>
      <div><button className="btn btn--blue" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Submit application'} <Arrow /></button></div>
    </form>
    </>
  )
}

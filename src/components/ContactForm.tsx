import React, { useState } from 'react'
import { company } from '../content/company'
import { Arrow } from './ui'
import { href } from '../lib/router'

const CATEGORIES = ['General inquiry', 'Business / project inquiry', 'Industrial automation', 'Cement solutions', 'Partnerships', 'Careers', 'Other']
const DEPARTMENTS = ['No preference', 'Sales & business development', 'Engineering', 'Human resources', 'Management']

type Values = Record<'name' | 'company' | 'email' | 'phone' | 'country' | 'category' | 'department' | 'subject' | 'message', string> & { consent: boolean; website: string }
const empty: Values = { name: '', company: '', email: '', phone: '', country: '', category: '', department: 'No preference', subject: '', message: '', consent: false, website: '' }

function validate(v: Values) {
  const e: Partial<Record<keyof Values, string>> = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.phone && !/^[+()\d\s-]{6,20}$/.test(v.phone)) e.phone = 'Please use digits, spaces, +, - or brackets only.'
  if (!v.category) e.category = 'Please choose an inquiry category.'
  if (v.subject.trim().length < 3) e.subject = 'Please add a short subject.'
  if (v.message.trim().length < 20) e.message = 'Please write at least 20 characters.'
  if (v.message.length > 5000) e.message = 'Please keep your message under 5,000 characters.'
  if (!v.consent) e.consent = 'Consent is required so we can respond to you.'
  return e
}

export function ContactForm({ variant = 'general' }: { variant?: 'general' | 'business' }) {
  const [v, setV] = useState<Values>({ ...empty, category: variant === 'business' ? 'Business / project inquiry' : '' })
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error' | 'not-connected'>('idle')
  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`f-${variant}-${first}`)?.focus()
      return
    }
    if (v.website) return // honeypot: silently drop bots
    if (!company.formEndpoint) { setState('not-connected'); return }
    setState('sending')
    try {
      const { website, ...payload } = v
      const res = await fetch(company.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...payload, formType: variant }) })
      if (!res.ok) throw new Error(String(res.status))
      setState('sent'); setV(empty)
    } catch { setState('error') }
  }

  const f = (k: keyof Values, label: string, input: React.ReactNode, req = true) => (
    <div className="field">
      <label htmlFor={`f-${variant}-${k}`}>{label}{req && <span aria-hidden style={{ color: '#c53030' }}> *</span>}</label>
      {input}
      {errors[k] && <span className="field__err" id={`f-${variant}-${k}-err`}>{errors[k]}</span>}
    </div>
  )
  const a = (k: keyof Values) => ({ id: `f-${variant}-${k}`, 'aria-invalid': !!errors[k] || undefined, 'aria-describedby': errors[k] ? `f-${variant}-${k}-err` : undefined })

  if (state === 'sent') return <div className="notice notice--ok" role="status">Thank you — your message was delivered. Our team will respond as soon as possible.</div>

  return (
    <form className="form" onSubmit={submit} noValidate aria-label={variant === 'business' ? 'Business inquiry form' : 'General inquiry form'}>
      <div className="form-row">
        {f('name', 'Full name', <input {...a('name')} autoComplete="name" value={v.name} onChange={set('name')} />)}
        {f('company', 'Company', <input {...a('company')} autoComplete="organization" value={v.company} onChange={set('company')} />, variant === 'business')}
      </div>
      <div className="form-row">
        {f('email', 'Business email', <input {...a('email')} type="email" autoComplete="email" value={v.email} onChange={set('email')} />)}
        {f('phone', 'Phone', <input {...a('phone')} type="tel" autoComplete="tel" value={v.phone} onChange={set('phone')} />, false)}
      </div>
      <div className="form-row">
        {f('country', 'Country', <input {...a('country')} autoComplete="country-name" value={v.country} onChange={set('country')} />, false)}
        {f('category', 'Inquiry category', (
          <select {...a('category')} value={v.category} onChange={set('category')}>
            <option value="">Select…</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        ))}
      </div>
      {f('department', 'Department (optional)', <select {...a('department')} value={v.department} onChange={set('department')}>{DEPARTMENTS.map((c) => <option key={c}>{c}</option>)}</select>, false)}
      {f('subject', 'Subject', <input {...a('subject')} value={v.subject} onChange={set('subject')} />)}
      {f('message', 'Message', <textarea {...a('message')} value={v.message} onChange={set('message')} maxLength={5000} />)}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden>
        <label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} /></label>
      </div>
      <div>
        <label className="check">
          <input type="checkbox" {...a('consent')} checked={v.consent} onChange={set('consent')} />
          <span>I agree that ASEC Automation may store and use the information above to respond to my inquiry, as described in the <a href={href('/privacy')} style={{ textDecoration: 'underline' }}>Privacy Policy</a>.</span>
        </label>
        {errors.consent && <span className="field__err" id={`f-${variant}-consent-err`}>{errors.consent}</span>}
      </div>
      <div aria-live="polite">
        {state === 'not-connected' && (
          <div className="notice notice--warn"><span>
            Your message has <strong>not</strong> been sent: online submissions are not connected yet. The site administrator needs to add a form endpoint in <code>src/content/company.ts</code>.
          </span></div>
        )}
        {state === 'error' && <div className="notice notice--err">Sorry — your message could not be delivered. Please try again later.</div>}
      </div>
      <div><button className="btn btn--blue" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'} <Arrow /></button></div>
    </form>
  )
}

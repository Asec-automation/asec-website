import { company } from './company'
import { useEffect, useState } from 'react'
import { jobs as builtInJobs, type Job } from './catalogue'

declare const __ROUTER_MODE__: 'history' | 'hash'
/** The careers API exists only on the hosted site (Cloudflare Pages), not in the single-file preview. */
export const API_AVAILABLE = typeof __ROUTER_MODE__ === 'undefined' || __ROUTER_MODE__ === 'history'
/** Same-origin on the Cloudflare Worker; the full Worker address when the pages are hosted elsewhere (e.g. www.asecautomation.com on GitHub Pages). */
export const API_BASE = typeof location === 'undefined' || /workers\.dev$|^localhost$|^127\.0\.0\.1$/.test(location.hostname) ? '' : company.apiBase
export const CAREERS_API = API_BASE + '/api/careers'
/** Website inbox: stores contact messages, applications (with CV) and job alerts on the site itself. */
export const INBOX_API = API_BASE + '/api/inbox'

export interface EditableJob extends Job { show?: boolean }

/** Job openings published by HR from the Careers admin page (/careers/admin). */
export function useJobs() {
  const [state, setState] = useState<{ jobs: Job[]; loading: boolean }>({ jobs: builtInJobs, loading: API_AVAILABLE })
  useEffect(() => {
    if (!API_AVAILABLE) return
    let alive = true
    fetch(CAREERS_API, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => alive && setState({ jobs: [...builtInJobs, ...((d.jobs as Job[]) || [])], loading: false }))
      .catch(() => alive && setState({ jobs: builtInJobs, loading: false }))
    return () => { alive = false }
  }, [])
  return state
}

/* ---------- CSV import / export (opens in Excel) ---------- */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cell = ''; let q = false
  text = text.replace(/^﻿/, '')
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++ } else q = false } else cell += ch }
    else if (ch === '"') q = true
    else if (ch === ',' || ch === ';' && false) { row.push(cell); cell = '' }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = '' }
    else cell += ch
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows.filter((r) => r.some((c) => c.trim()))
}
const split = (s: string) => (s || '').split(/;|\n/).map((x) => x.trim()).filter(Boolean)
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)

export function csvToJobs(text: string): EditableJob[] {
  const [head, ...rows] = parseCsv(text)
  if (!head) return []
  const idx = (name: string) => head.findIndex((h) => h.trim().toLowerCase() === name)
  const col = (r: string[], name: string) => (idx(name) >= 0 ? (r[idx(name)] ?? '').trim() : '')
  return rows.filter((r) => col(r, 'title')).map((r) => ({
    slug: slugify(col(r, 'title') + '-' + col(r, 'location')) || `job-${Math.random().toString(36).slice(2, 8)}`,
    title: col(r, 'title'), department: col(r, 'department'), location: col(r, 'location'), type: col(r, 'type') || 'Full-time',
    summary: col(r, 'summary'), responsibilities: split(col(r, 'responsibilities')), requirements: split(col(r, 'requirements')),
    show: !/^n(o)?$/i.test(col(r, 'show')),
  }))
}

export function jobsToCsv(jobs: EditableJob[]): string {
  const esc = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
  const head = ['Title', 'Department', 'Location', 'Type', 'Summary', 'Responsibilities', 'Requirements', 'Show']
  const rows = jobs.map((j) => [j.title, j.department, j.location, j.type, j.summary, j.responsibilities.join('; '), j.requirements.join('; '), j.show === false ? 'No' : 'Yes'])
  return '﻿' + [head, ...rows].map((r) => r.map((c) => esc(String(c ?? ''))).join(',')).join('\r\n')
}

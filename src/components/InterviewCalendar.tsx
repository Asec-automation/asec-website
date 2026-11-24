import React, { useMemo, useState } from 'react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

export interface CalItem { id: string; name: string; title: string; date: string; time: string; interviewer: string }
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Small month calendar of scheduled interviews. Clicking a day filters the list below. */
export function InterviewCalendar({ items, day, onDay }: { items: CalItem[]; day: string; onDay: (d: string) => void }) {
  const first = items.map((i) => i.date).filter((d) => d >= iso(new Date())).sort()[0]
  const [month, setMonth] = useState(() => { const d = first ? new Date(`${first}T00:00:00`) : new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const byDay = useMemo(() => { const m: Record<string, CalItem[]> = {}; items.forEach((i) => { (m[i.date] ||= []).push(i) }); Object.values(m).forEach((l) => l.sort((a, b) => a.time.localeCompare(b.time))); return m }, [items])
  const start = new Date(month); start.setDate(1 - ((month.getDay() + 1) % 7)) // weeks start on Saturday
  const cells = Array.from({ length: 42 }, (_, k) => { const d = new Date(start); d.setDate(start.getDate() + k); return d })
  const today = iso(new Date())
  const move = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1))
  return (
    <div className="cal">
      <div className="cal__head">
        <button type="button" onClick={() => move(-1)} aria-label="Previous month"><LuChevronLeft aria-hidden /></button>
        <strong>{month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</strong>
        <button type="button" onClick={() => move(1)} aria-label="Next month"><LuChevronRight aria-hidden /></button>
      </div>
      <div className="cal__grid">
        {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => <span key={d} className="cal__dow">{d}</span>)}
        {cells.map((d) => {
          const k = iso(d); const list = byDay[k] || []
          return (
            <button key={k} type="button" className={`cal__day${d.getMonth() !== month.getMonth() ? ' is-out' : ''}${k === today ? ' is-today' : ''}${k === day ? ' is-on' : ''}${list.length ? ' has' : ''}`}
              onClick={() => onDay(k === day ? '' : k)} disabled={!list.length && k !== day}>
              <span className="cal__n">{d.getDate()}</span>
              {list.length > 0 && <span className="cal__ev">{list.length} interview{list.length > 1 ? 's' : ''}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

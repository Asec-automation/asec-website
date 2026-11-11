import React, { useMemo, useState } from 'react'
import { LuTriangleAlert } from 'react-icons/lu'

/**
 * ILLUSTRATIVE DEMO — every number here is generated synthetically in the
 * browser from a fixed seed. Nothing is connected to, or derived from, any
 * real plant or dataset.
 */
const C1 = '#4594d6' // brand-blue tint; pair validated on #030b38 (lightness, chroma, CVD, contrast all pass)
const C2 = '#cf7c22'

function rng(seed: number) {
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
}
function series(seed: number, n: number, base: number, amp: number, noise: number, drift = 0) {
  const r = rng(seed); let v = 0
  return Array.from({ length: n }, (_, i) => {
    v = v * 0.82 + (r() - 0.5) * noise
    return +(base + Math.sin(i / 7) * amp + v + drift * i).toFixed(2)
  })
}

const N = 48
const labels = Array.from({ length: N }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`)

type S = { name: string; color: string; data: number[]; dashed?: boolean }

function LineChart({ title, unit, series: ss, decimals = 0 }: { title: string; unit: string; series: S[]; decimals?: number }) {
  const [hover, setHover] = useState<number | null>(null)
  const w = 520, h = 200, pl = 44, pr = 12, pt = 10, pb = 24
  const all = ss.flatMap((s) => s.data)
  const min = Math.min(...all), max = Math.max(...all), pad = (max - min) * 0.12 || 1
  const lo = min - pad, hi = max + pad
  const x = (i: number) => pl + (i / (N - 1)) * (w - pl - pr)
  const y = (v: number) => pt + (1 - (v - lo) / (hi - lo)) * (h - pt - pb)
  const ticks = [0, 0.5, 1].map((f) => lo + f * (hi - lo))
  const fmt = (v: number) => v.toFixed(decimals)

  return (
    <figure className="chart" style={{ margin: 0 }}>
      <div className="chart__head"><h4>{title}</h4><span>{unit} · synthetic</span></div>
      <div style={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${title}, synthetic demonstration data`}
          onMouseMove={(e) => {
            const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
            const i = Math.round((((e.clientX - r.left) / r.width) * w - pl) / ((w - pl - pr) / (N - 1)))
            setHover(i >= 0 && i < N ? i : null)
          }}
          onMouseLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line className="grid-line" x1={pl} x2={w - pr} y1={y(t)} y2={y(t)} />
              <text className="axis-label" x={pl - 8} y={y(t) + 3} textAnchor="end">{fmt(t)}</text>
            </g>
          ))}
          {[0, 12, 24, 36, 47].map((i) => <text key={i} className="axis-label" x={x(i)} y={h - 6} textAnchor="middle">{labels[i]}</text>)}
          {ss.map((s) => (
            <path key={s.name} d={s.data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')}
              fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? '5 4' : undefined} />
          ))}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pt} y2={h - pb} stroke="rgba(255,255,255,.3)" />
              {ss.map((s) => <circle key={s.name} cx={x(hover)} cy={y(s.data[hover])} r={4.5} fill={s.color} stroke="#030b38" strokeWidth={2} />)}
            </g>
          )}
        </svg>
        {hover !== null && (
          <div style={{
            position: 'absolute', top: 6, left: `${(x(hover) / w) * 100}%`, transform: `translateX(${hover > N / 2 ? 'calc(-100% - 10px)' : '10px'})`,
            background: '#0a1a5e', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: '#fff', pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            <div style={{ color: 'rgba(255,255,255,.55)' }}>{labels[hover]}</div>
            {ss.map((s) => <div key={s.name}><i style={{ display: 'inline-block', width: 10, height: 2, background: s.color, verticalAlign: 'middle', marginRight: 6 }} />{s.name}: <b>{fmt(s.data[hover])}</b> {unit}</div>)}
          </div>
        )}
      </div>
      {ss.length > 1 && (
        <div className="legend">{ss.map((s) => <span key={s.name}><i style={{ background: s.color, height: 2, borderTop: s.dashed ? `2px dashed ${s.color}` : undefined }} />{s.name}</span>)}</div>
      )}
      <details style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
        <summary style={{ cursor: 'pointer' }}>View as table</summary>
        <div style={{ maxHeight: 160, overflow: 'auto', marginTop: 6 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={{ textAlign: 'left' }}>Time</th>{ss.map((s) => <th key={s.name} style={{ textAlign: 'right' }}>{s.name}</th>)}</tr></thead>
            <tbody>{labels.map((l, i) => <tr key={l}><td>{l}</td>{ss.map((s) => <td key={s.name} style={{ textAlign: 'right' }}>{fmt(s.data[i])}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}

export function DemoDashboard() {
  const d = useMemo(() => {
    const actual = series(11, N, 640, 18, 22)
    const r = rng(99)
    const predicted = actual.map((v) => +(v + (r() - 0.5) * 14).toFixed(2))
    return {
      temp: series(3, N, 880, 6, 9),
      pressure: series(7, N, -45, 6, 8),
      fuel: series(5, N, 9.2, 0.35, 0.4, 0.004),
      actual, predicted,
    }
  }, [])
  return (
    <div className="dash">
      <div className="dash__flag" role="note"><LuTriangleAlert aria-hidden /> Illustrative Demo — Not Live Plant Data. All values are synthetic and generated in your browser.</div>
      <div className="dash__grid">
        <LineChart title="Calciner outlet temperature" unit="°C" series={[{ name: 'Temperature', color: C1, data: d.temp }]} />
        <LineChart title="Kiln head pressure" unit="Pa" series={[{ name: 'Pressure', color: C1, data: d.pressure }]} />
        <LineChart title="Total kiln fuel flow" unit="t/h" decimals={2} series={[{ name: 'Fuel flow', color: C1, data: d.fuel }]} />
        <LineChart title="Kiln current — predicted vs actual" unit="A" series={[{ name: 'Actual', color: C1, data: d.actual }, { name: 'Predicted', color: C2, data: d.predicted, dashed: true }]} />
      </div>
    </div>
  )
}

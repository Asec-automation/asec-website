import React, { useState } from 'react'
import { processAreas } from '../content/cement'

type Node = { id: string; x: number; y: number; w: number; h: number; rot?: number }
const NODES: Node[] = [
  { id: 'raw-material', x: 30, y: 70, w: 150, h: 70 },
  { id: 'raw-mill', x: 215, y: 70, w: 140, h: 70 },
  { id: 'preheater', x: 400, y: 30, w: 92, h: 210 },
  { id: 'calciner', x: 510, y: 120, w: 90, h: 120 },
  { id: 'kiln', x: 450, y: 292, w: 300, h: 44, rot: 6 },
  { id: 'cooler', x: 772, y: 320, w: 110, h: 70 },
  { id: 'cement-mill', x: 700, y: 440, w: 150, h: 70 },
  { id: 'packing', x: 500, y: 440, w: 160, h: 70 },
  { id: 'ccr', x: 215, y: 440, w: 160, h: 70 },
  { id: 'utilities', x: 30, y: 440, w: 150, h: 70 },
]
const SHORT: Record<string, string> = {
  'raw-material': 'Raw Material', 'raw-mill': 'Raw Mill', preheater: 'Preheater', calciner: 'Calciner', kiln: 'Rotary Kiln',
  cooler: 'Clinker Cooler', 'cement-mill': 'Cement Mill', packing: 'Packing & Dispatch', ccr: 'Control Room', utilities: 'Utilities',
}
const FLOWS = [
  'M180,105 L215,105', 'M355,105 L400,105', 'M492,200 L510,200', 'M555,240 L555,262 L470,292',
  'M745,328 L772,348', 'M827,390 L800,440', 'M700,475 L660,475',
]

function Section({ title, items }: { title: string; items: string[] }) {
  return <div><h4>{title}</h4><ul>{items.map((i) => <li key={i}>{i}</li>)}</ul></div>
}

export function CementDiagram() {
  const [active, setActive] = useState('kiln')
  const area = processAreas.find((a) => a.id === active)!
  return (
    <div className="cement">
      <div>
        <svg className="cement__svg" viewBox="0 0 910 540" role="group" aria-label="Interactive cement production process diagram. Select a process area for details.">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#5aa6e6" /></marker>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="rgba(255,255,255,.04)" /></pattern>
            <linearGradient id="kilnG" x1="0" x2="1"><stop offset="0" stopColor="#1c75bc" stopOpacity=".35" /><stop offset=".8" stopColor="#f59e0b" stopOpacity=".55" /><stop offset="1" stopColor="#c11718" stopOpacity=".6" /></linearGradient>
          </defs>
          <rect width="910" height="540" fill="url(#grid)" />
          <text x="30" y="40" fill="rgba(255,255,255,.45)" fontSize="11" letterSpacing="2" fontFamily="Montserrat, sans-serif">RAW MATERIAL & PYROPROCESSING</text>
          <text x="30" y="428" fill="rgba(255,255,255,.45)" fontSize="11" letterSpacing="2" fontFamily="Montserrat, sans-serif">FINISH, DISPATCH & SUPPORT</text>
          <line x1="20" y1="410" x2="890" y2="410" stroke="rgba(255,255,255,.08)" />
          {FLOWS.map((d) => <path key={d} d={d} className="cement__flow" stroke="#5aa6e6" strokeWidth="1.6" fill="none" markerEnd="url(#arr)" />)}
          <path d="M295,440 L295,410 M455,236 L455,410" stroke="rgba(90, 166, 230,.25)" strokeDasharray="2 5" fill="none" />
          {NODES.map((n) => {
            const on = n.id === active
            const cx = n.x + n.w / 2, cy = n.y + n.h / 2
            return (
              <g
                key={n.id}
                className={`cement__node ${on ? 'is-active' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={on}
                aria-label={SHORT[n.id]}
                onClick={() => setActive(n.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(n.id) } }}
                transform={n.rot ? `rotate(${n.rot} ${cx} ${cy})` : undefined}
              >
                <rect className="box" x={n.x} y={n.y} width={n.w} height={n.h} rx={n.id === 'kiln' ? 22 : 12} fill={n.id === 'kiln' ? 'url(#kilnG)' : 'rgba(255,255,255,.035)'} stroke={on ? '#5aa6e6' : 'rgba(255,255,255,.18)'} strokeWidth={on ? 2 : 1} />
                {n.id === 'preheater' && [0, 1, 2, 3].map((i) => (
                  <path key={i} d={`M${n.x + 22},${n.y + 22 + i * 44} h48 l-14,26 h-20 z`} fill="none" stroke="rgba(90, 166, 230,.55)" />
                ))}
                {n.id === 'calciner' && <rect x={n.x + 30} y={n.y + 16} width={30} height={64} rx={8} fill="none" stroke="rgba(245,158,11,.6)" />}
                {n.id === 'kiln' && [0.2, 0.5, 0.8].map((f) => <line key={f} x1={n.x + n.w * f} y1={n.y} x2={n.x + n.w * f} y2={n.y + n.h} stroke="rgba(255,255,255,.25)" />)}
                <text
                  x={cx} y={n.id === 'preheater' || n.id === 'calciner' ? n.y + n.h - 12 : cy + 5}
                  textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700} fontFamily="Montserrat, sans-serif"
                  style={{ paintOrder: 'stroke', stroke: '#030b38', strokeWidth: 3 }}
                >{SHORT[n.id]}</text>
              </g>
            )
          })}
        </svg>
        <div className="cement__list filter-row" role="group" aria-label="Process areas">
          {processAreas.map((a) => <button key={a.id} aria-pressed={a.id === active} onClick={() => setActive(a.id)}>{SHORT[a.id]}</button>)}
        </div>
        <p style={{ marginTop: 14, fontSize: 13, color: 'rgba(255,255,255,.5)' }}>Simplified schematic of a dry-process cement plant with preheater and calciner. Select any area.</p>
      </div>
      <aside className="cement__panel" aria-live="polite">
        <div>
          <span className="eyebrow">Process area</span>
          <h3 className="h3" style={{ marginTop: 10 }}>{area.name}</h3>
          <p style={{ marginTop: 12, color: 'rgba(255,255,255,.75)', fontSize: 15 }}>{area.purpose}</p>
        </div>
        <Section title="Typical operating variables" items={area.variables} />
        <Section title="Automation considerations" items={area.automation} />
        <Section title="Monitoring requirements" items={area.monitoring} />
        <Section title="Optimisation opportunities" items={area.optimisation} />
        <div>
          <h4>Relevant technologies</h4>
          <ul className="chip-list" style={{ paddingLeft: 0 }}>{area.technologies.map((t) => <li key={t} className="chip" style={{ listStyle: 'none' }}>{t}</li>)}</ul>
        </div>
        <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.45)' }}>General engineering overview — not a description of a specific installed ASEC system.</p>
      </aside>
    </div>
  )
}

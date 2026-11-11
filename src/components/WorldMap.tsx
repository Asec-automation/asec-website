import React, { useMemo, useRef, useState } from 'react'
import { LuPlus, LuMinus, LuMaximize } from 'react-icons/lu'
import type { Country } from '../content/catalogue'

/* Simplified continent outlines (lon, lat) — stylised, not cartographically exact. */
const LAND: number[][][] = [
  [[-168,66],[-162,70],[-140,70],[-125,70],[-95,72],[-80,73],[-62,66],[-55,52],[-66,45],[-70,42],[-76,35],[-81,31],[-80,25],[-82,28],[-84,30],[-90,29],[-97,27],[-97,22],[-95,18],[-90,21],[-87,21],[-88,16],[-83,15],[-83,9],[-79,9],[-80,7],[-85,10],[-92,14],[-105,20],[-110,24],[-112,30],[-117,32],[-124,40],[-124,48],[-130,55],[-140,60],[-150,60],[-158,57],[-165,60]],
  [[-55,60],[-43,60],[-20,70],[-18,80],[-35,83],[-60,82],[-72,78],[-58,75],[-52,68]],
  [[-80,9],[-72,12],[-62,11],[-52,5],[-50,0],[-35,-5],[-35,-9],[-39,-15],[-41,-22],[-48,-26],[-53,-34],[-58,-38],[-65,-42],[-66,-47],[-69,-52],[-72,-54],[-75,-50],[-74,-42],[-71,-30],[-70,-18],[-76,-14],[-81,-6],[-80,0],[-78,6]],
  [[-10,36],[-9,43],[-2,43],[-5,48],[2,51],[5,53],[8,57],[5,62],[10,64],[15,68],[20,70],[28,71],[40,68],[45,66],[50,68],[60,69],[60,55],[50,47],[40,47],[36,45],[29,41],[26,40],[23,36],[20,40],[15,38],[16,41],[12,44],[8,44],[3,43],[0,39],[-2,37]],
  [[26,40],[36,36],[35,33],[34,28],[39,21],[43,13],[51,15],[57,19],[58,23],[56,26],[51,25],[48,30],[52,28],[57,26],[62,25],[67,24],[72,21],[73,16],[77,8],[80,13],[80,16],[87,21],[90,22],[94,17],[98,9],[100,4],[104,1],[103,8],[100,13],[105,9],[109,12],[108,17],[107,21],[111,21],[117,23],[121,29],[122,32],[119,35],[122,37],[121,40],[125,40],[129,35],[129,41],[135,43],[141,48],[140,53],[135,54],[143,59],[155,59],[163,61],[163,66],[180,66],[180,71],[160,70],[140,73],[130,71],[113,74],[105,78],[95,76],[80,73],[70,73],[66,69],[60,69],[60,55],[50,47],[40,47],[36,45],[41,41]],
  [[-17,21],[-16,28],[-10,30],[-6,35],[0,36],[10,37],[11,33],[20,31],[25,32],[32,31],[34,28],[37,22],[39,15],[43,12],[51,12],[48,5],[41,-2],[40,-10],[40,-16],[35,-22],[33,-27],[28,-33],[20,-35],[18,-32],[15,-27],[12,-17],[13,-11],[12,-5],[9,-1],[9,4],[5,6],[-2,5],[-8,4],[-13,8],[-17,13]],
  [[44,-25],[47,-25],[50,-15],[49,-12],[44,-16]],
  [[114,-22],[114,-34],[118,-35],[124,-33],[131,-31],[138,-35],[141,-38],[147,-38],[150,-37],[153,-28],[153,-25],[146,-19],[142,-11],[136,-12],[136,-15],[130,-12],[126,-14],[122,-18]],
  [[95,5],[98,4],[106,-6],[104,-6],[96,2]],
  [[109,1],[111,-3],[116,-4],[119,1],[117,7],[113,3]],
  [[105,-6],[114,-8],[106,-8]],
  [[131,-1],[141,-3],[150,-10],[141,-9],[137,-5]],
  [[119.5,18.5],[122.5,18.5],[124.5,12.5],[121.5,13.5],[119.8,15]],
  [[122,8],[126.5,9.5],[126.5,6],[123,6.5]],
  [[130,31],[132,34],[136,35],[140,36],[141,41],[140,42],[145,44],[142,45],[139,38],[135,34]],
  [[-5,50],[1,51],[0,53],[-2,56],[-5,58],[-6,56],[-3,54],[-4,52]],
  [[-10,52],[-6,52],[-6,55],[-8,55]],
  [[-24,64],[-14,64],[-14,66],[-22,66]],
  [[167,-46],[174,-41],[178,-38],[173,-35],[172,-41],[166,-45]],
]

export const markerColor = (c: Country) => c.relationship === 'Office' ? '#e5484d' : (c.relationship === 'Completed project' || c.relationship === 'Active project') ? '#5aa6e6' : '#a7b4d6'
export const markerGroup = (c: Country) => c.relationship === 'Office' ? 'Branches' : (c.relationship === 'Completed project' || c.relationship === 'Active project') ? 'Projects' : 'Footprint'

const W = 1000, H = 500
const LAT_TOP = 84, LAT_BOT = -58
const px = (lon: number) => ((lon + 180) / 360) * W
const py = (lat: number) => ((LAT_TOP - lat) / (LAT_TOP - LAT_BOT)) * H

function inside(lon: number, lat: number, poly: number[][]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

const DOTS = (() => {
  const out: [number, number][] = []
  for (let lat = LAT_TOP - 1; lat > LAT_BOT; lat -= 2.2) {
    for (let lon = -179; lon < 180; lon += 2.2) {
      if (LAND.some((p) => inside(lon, lat, p))) out.push([px(lon), py(lat)])
    }
  }
  return out
})()

export function WorldMap({
  countries, active, onSelect, interactive = true, height,
}: { countries: Country[]; active?: string; onSelect?: (id: string) => void; interactive?: boolean; height?: number }) {
  const [view, setView] = useState({ x: 0, y: 0, w: W, h: H })
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const clamp = (v: { x: number; y: number; w: number; h: number }) => ({
    ...v, x: Math.max(0, Math.min(W - v.w, v.x)), y: Math.max(0, Math.min(H - v.h, v.y)),
  })
  const zoom = (f: number, cx = view.x + view.w / 2, cy = view.y + view.h / 2) => {
    const w = Math.max(W / 6, Math.min(W, view.w * f)), h = (w / W) * H
    setView(clamp({ w, h, x: cx - (cx - view.x) * (w / view.w), y: cy - (cy - view.y) * (h / view.h) }))
  }
  const focus = (c: Country) => {
    const w = W / 2.4, h = H / 2.4
    setView(clamp({ w, h, x: px(c.lon) - w / 2, y: py(c.lat) - h / 2 }))
  }

  const arcs = useMemo(() => {
    if (countries.length < 2) return []
    const hub = countries[0]
    return countries.slice(1).map((c) => {
      const x1 = px(hub.lon), y1 = py(hub.lat), x2 = px(c.lon), y2 = py(c.lat)
      const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.22
      return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`
    })
  }, [countries])

  const toLocal = (e: React.PointerEvent | React.MouseEvent) => {
    const r = svgRef.current!.getBoundingClientRect()
    return { x: view.x + ((e.clientX - r.left) / r.width) * view.w, y: view.y + ((e.clientY - r.top) / r.height) * view.h }
  }

  return (
    <div className="map-wrap" style={height ? { height } : undefined}>
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        role="group"
        aria-label="World map showing featured countries"
        style={{ transition: drag.current ? 'none' : undefined }}
        onDoubleClick={interactive ? (e) => { const p = toLocal(e); zoom(0.6, p.x, p.y) } : undefined}
        onPointerDown={interactive ? (e) => { drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; (e.target as Element).setPointerCapture?.(e.pointerId) } : undefined}
        onPointerMove={interactive ? (e) => {
          if (!drag.current) return
          const r = svgRef.current!.getBoundingClientRect()
          const dx = ((e.clientX - drag.current.x) / r.width) * view.w, dy = ((e.clientY - drag.current.y) / r.height) * view.h
          setView((v) => clamp({ ...v, x: drag.current!.vx - dx, y: drag.current!.vy - dy }))
        } : undefined}
        onPointerUp={() => { drag.current = null }}
        onPointerCancel={() => { drag.current = null }}
      >
        <defs>
          <linearGradient id="arcGrad" x1="0" x2="1"><stop offset="0" stopColor="#5aa6e6" stopOpacity="0.15" /><stop offset="0.5" stopColor="#5aa6e6" stopOpacity="0.9" /><stop offset="1" stopColor="#1c75bc" stopOpacity="0.2" /></linearGradient>
          <radialGradient id="glow"><stop offset="0" stopColor="#5aa6e6" stopOpacity="0.5" /><stop offset="1" stopColor="#5aa6e6" stopOpacity="0" /></radialGradient>
        </defs>
        <g aria-hidden>{DOTS.map(([x, y], i) => <circle key={i} className="map-dot" cx={x} cy={y} r={1.55} />)}</g>
        <g aria-hidden>{arcs.map((d, i) => <path key={i} className="map-arc" d={d} />)}</g>
        {countries.map((c) => {
          const x = px(c.lon), y = py(c.lat), on = active === c.id
          return (
            <g
              key={c.id}
              className={`map-marker ${on ? 'is-active' : ''}`}
              transform={`translate(${x} ${y})`}
              tabIndex={0}
              role="button"
              aria-label={`${c.name}${c.published ? `: ${c.relationship}` : ' (relationship not yet published)'}`}
              aria-pressed={on}
              onClick={() => { onSelect?.(c.id); if (interactive) focus(c) }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(c.id); if (interactive) focus(c) } }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <circle r={16} fill="url(#glow)" />
              <circle className="pulse" r={6} fill="none" stroke={markerColor(c)} strokeWidth={1.2} />
              <circle className="core" r={c.relationship === 'Office' ? 5.4 : 4.2} fill={markerColor(c)} stroke="#040f47" strokeWidth={1.5} />
              {(c.featured || on) && <text x={9} y={-9} fill="#fff" fontSize={on ? 14 : 12} fontWeight={700} fontFamily="Montserrat, sans-serif" style={{ paintOrder: 'stroke', stroke: '#040f47', strokeWidth: 3 }}>{c.name}</text>}
            </g>
          )
        })}
      </svg>
      {interactive && (
        <div className="map-controls">
          <button aria-label="Zoom in" onClick={() => zoom(0.75)}><LuPlus aria-hidden /></button>
          <button aria-label="Zoom out" onClick={() => zoom(1.33)}><LuMinus aria-hidden /></button>
          <button aria-label="Reset map" onClick={() => setView({ x: 0, y: 0, w: W, h: H })}><LuMaximize aria-hidden /></button>
        </div>
      )}
      <div className="map-legend">Stylised map · drag to pan · double-click or buttons to zoom</div>
    </div>
  )
}

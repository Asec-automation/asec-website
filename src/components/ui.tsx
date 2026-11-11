import React from 'react'
import {
  LuArrowRight, LuCpu, LuGauge, LuMonitor, LuZap, LuLayers, LuActivity, LuFactory, LuSun, LuRecycle,
  LuRefreshCw, LuFolderOpen, LuNewspaper, LuBriefcase, LuHandshake, LuUsers, LuGlobe, LuMail,
  LuFlame, LuFlaskConical, LuDroplets, LuTrainFront, LuBuilding2, LuServer, LuMountain, LuLayoutGrid, LuSettings, LuCircuitBoard, LuBox, LuBoxes, LuSquareStack, LuConstruction, LuRuler, LuMapPin,
} from 'react-icons/lu'
import { SLOT_MAP, ALT, aspect } from '../config/images'
import available from '../config/available-images.json'
import { Link } from '../lib/router'
import type { Status } from '../content/company'

/* ---------------- icons ---------------- */
const ICONS: Record<string, React.ComponentType<{ 'aria-hidden'?: boolean }>> = {
  cpu: LuCpu, gauge: LuGauge, monitor: LuMonitor, zap: LuZap, layers: LuLayers, activity: LuActivity,
  factory: LuFactory, sun: LuSun, recycle: LuRecycle, refresh: LuRefreshCw, folder: LuFolderOpen,
  news: LuNewspaper, briefcase: LuBriefcase, handshake: LuHandshake, users: LuUsers, globe: LuGlobe, mail: LuMail,
  flame: LuFlame, flask: LuFlaskConical, droplets: LuDroplets, train: LuTrainFront, building: LuBuilding2, server: LuServer, mountain: LuMountain, grid: LuLayoutGrid, gear: LuSettings, motor: LuCircuitBoard, cube: LuBox, boxes: LuBoxes, copy: LuSquareStack, bridge: LuConstruction, beam: LuRuler, "map-pin": LuMapPin,
}
export function Icon({ name }: { name: string }) {
  const C = ICONS[name] ?? LuCpu
  return <C aria-hidden />
}
export const Arrow = () => <LuArrowRight aria-hidden />

/* ---------------- image slot ---------------- */
const AVAILABLE = available as Record<string, string>

export function ImagePlaceholder({
  imageKey, description, recommendedWidth, recommendedHeight, light, size = 'full',
}: {
  imageKey: string; description: string; recommendedWidth: number; recommendedHeight: number
  light?: boolean; size?: 'full' | 'compact' | 'tiny'
}) {
  return (
    <div className={`ph ${light ? 'ph--light' : ''} ${size !== 'full' ? `ph--${size}` : ''}`} role="img" aria-label={`Image placeholder: ${description}`}>
      <div className="ph__card">
        <span className="ph__tag">ADD IMAGE HERE</span>
        <span className="ph__id">{imageKey}</span>
        <span className="ph__dims">
          {recommendedWidth} × {recommendedHeight} · {aspect(recommendedWidth, recommendedHeight)}
        </span>
        <span className="ph__desc">{description}</span>
      </div>
    </div>
  )
}

/**
 * Renders the real image if a file exists for the slot, otherwise the placeholder.
 * Images are lazy-loaded except when `priority` is set (e.g. heroes).
 */
export function Img({
  id, className = '', style, priority, light, size, focal,
}: {
  id: string; className?: string; style?: React.CSSProperties; priority?: boolean
  light?: boolean; size?: 'full' | 'compact' | 'tiny'; focal?: string
}) {
  const slot = SLOT_MAP[id]
  if (!slot) return <div className={`media ${className}`} style={style} />
  const src = AVAILABLE[id]
  return (
    <div className={`media ${className}`} style={style} data-slot={id}>
      {src ? (
        <img
          src={src} alt={ALT[id] ?? slot.alt} width={slot.width} height={slot.height}
          loading={priority ? 'eager' : 'lazy'} decoding="async"
          {...(priority ? { fetchPriority: 'high' } : {})}
          style={focal ? { objectPosition: focal } : undefined}
        />
      ) : (
        <ImagePlaceholder imageKey={slot.id} description={slot.description} recommendedWidth={slot.width} recommendedHeight={slot.height} light={light} size={size} />
      )}
    </div>
  )
}

/* ---------------- content status ---------------- */
export function StatusBadge({ status, label }: { status: Status | 'demo'; label?: string }) {
  if (status === 'confirmed') return null
  const text = label ?? (status === 'proposed' ? 'Draft — needs approval' : status === 'missing' ? 'Info needed' : 'Illustrative demo')
  return <span className={`badge badge--${status}`}>{text}</span>
}

/* ---------------- section heading ---------------- */
export function SectionHead({
  eyebrow, title, lead, status, aside, className = '',
}: { eyebrow?: string; title: React.ReactNode; lead?: React.ReactNode; status?: Status; aside?: React.ReactNode; className?: string }) {
  const body = (
    <div style={{ display: 'grid', gap: 18 }}>
      {(eyebrow || status) && (
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {status && <StatusBadge status={status} />}
        </div>
      )}
      <h2 className="h2">{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  )
  if (aside) return <div className={`section-head section-head--row reveal ${className}`}>{body}<div>{aside}</div></div>
  return <div className={`section-head reveal ${className}`}>{body}</div>
}

/* ---------------- page hero ---------------- */
export function PageHero({
  image, eyebrow, title, lead, crumbs, children,
}: { image: string; eyebrow: string; title: React.ReactNode; lead?: React.ReactNode; crumbs: { label: string; to?: string }[]; children?: React.ReactNode }) {
  return (
    <section className="page-hero">
      <div className="hero__bg"><Img id={image} priority /></div>
      <div className="container page-hero__content">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li><Link to="/">Home</Link></li>
            {crumbs.map((c) => <li key={c.label}>{c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>)}
          </ol>
        </nav>
        <span className="eyebrow on-dark" style={{ color: 'var(--cyan)' }}>{eyebrow}</span>
        <h1 className="h1" style={{ maxWidth: '18ch' }}>{title}</h1>
        {lead && <p className="lead on-dark" style={{ color: 'rgba(255,255,255,.75)' }}>{lead}</p>}
        {children}
      </div>
    </section>
  )
}

/* ---------------- CTA ---------------- */
export function CTASection({
  title = 'Let’s Engineer What’s Next.',
  text = 'Connect with our team to explore industrial automation and engineering opportunities.',
}: { title?: string; text?: string }) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="hero__bg"><Img id="CTA_BG_01" /></div>
      <div className="container cta__inner">
        <span className="eyebrow" style={{ color: 'var(--cyan)' }}>Start a conversation</span>
        <h2 id="cta-title" className="display" style={{ maxWidth: '13ch' }}>{title}</h2>
        <p className="lead" style={{ color: 'rgba(255,255,255,.75)' }}>{text}</p>
        <div className="btn-row">
          <Link to="/contact" className="btn btn--primary">Contact Us <Arrow /></Link>
          <Link to="/projects" className="btn btn--ghost">View Projects</Link>
        </div>
      </div>
    </section>
  )
}

/* ---------------- empty state ---------------- */
export function EmptyState({ icon, title, text, children, skeleton }: { icon: string; title: string; text: React.ReactNode; children?: React.ReactNode; skeleton?: boolean }) {
  return (
    <div className="empty reveal">
      <div className="empty__icon"><Icon name={icon} /></div>
      <h3 className="h3">{title}</h3>
      <p>{text}</p>
      {children}
      {skeleton && <div className="preview-grid review-only" aria-hidden><div /><div /><div /></div>}
    </div>
  )
}

/* ---------------- photo gallery (small real photos) ---------------- */
export function Gallery({ items, dark }: { items: { src: string; alt: string }[]; dark?: boolean }) {
  return (
    <ul className={`gallery ${dark ? 'gallery--dark' : ''}`}>
      {items.map((it) => (
        <li key={it.src} className="reveal">
          <figure>
            <img src={it.src} alt={it.alt} loading="lazy" decoding="async" />
            <figcaption>{it.alt}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

/* ---------------- verified key figures (count up when scrolled into view) ---------------- */
function CountUp({ value, duration = 1600 }: { value: number; duration?: number }) {
  // Server render shows the final value (SEO / no-JS); the browser animates from 0 once visible.
  const [n, setN] = React.useState(value)
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    setN(0)
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration)
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value, duration])
  return <span ref={ref} className="count">{n}</span>
}

export function Stats({ items }: { items: { value: number; suffix?: string; label: string }[] }) {
  return (
    <dl className="stats reveal">
      {items.map((s) => (
        <div key={s.label}>
          <dt>{s.label}</dt>
          <dd aria-label={`${s.value}${s.suffix ?? ''}`}><CountUp value={s.value} /><span>{s.suffix}</span></dd>
        </div>
      ))}
    </dl>
  )
}

/* ---------------- partner card: official logo if the file exists, else the name ---------------- */
export function PartnerTile({ name, description, logo }: { name: string; description?: string; logo?: string }) {
  const src = logo ? AVAILABLE[logo] : undefined
  return (
    <div className="partner-card reveal">
      <div className="partner-card__logo">
        {src ? <img src={src} alt={`${name} logo`} loading="lazy" decoding="async" /> : <span className="partner-card__name">{name}</span>}
      </div>
      {description && <p className="partner-card__caption">{description}</p>}
    </div>
  )
}

/* ---------------- overlay photo tiles (image with navy caption bar + icon) ---------------- */
export function PhotoTiles({ items }: { items: { src: string; alt: string; icon?: string }[] }) {
  return (
    <ul className="photo-tiles">
      {items.map((it, i) => (
        <li key={it.src} className="photo-tile reveal" style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
          <img src={it.src} alt="" loading="lazy" decoding="async" />
          <div className="photo-tile__cap">
            {it.icon && <span className="photo-tile__icon"><Icon name={it.icon} /></span>}
            <span>{it.alt}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { LuMenu, LuX, LuChevronDown, LuArrowUpRight, LuEye, LuEyeOff } from 'react-icons/lu'
import { Link, useRouter } from '../lib/router'
import { useScrolled, useOutside } from '../lib/hooks'
import { company, REVIEW_MODE } from '../content/company'
import { services } from '../content/expertise'
import available from '../config/available-images.json'
import { Arrow } from './ui'

const AV = available as Record<string, string>

type NavItem = { label: string; to: string; mega?: { label: string; to: string; text: string }[] }

export const NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Partners', to: '/partners' },
  { label: 'Global Presence', to: '/global-presence' },
  { label: 'Careers', to: '/careers' },
]

function Logo({ footer }: { footer?: boolean }) {
  const src = footer ? AV.BRAND_LOGO_FULL_LIGHT ?? AV.BRAND_LOGO : AV.BRAND_LOGO
  return (
    <Link to="/" className={`logo ${footer ? 'logo--footer' : ''}`} aria-label={`${company.name.value} — home`}>
      {src ? <img src={src} alt={company.name.value} width={footer ? 900 : 538} height={footer ? 249 : 120} /> : <span>ASEC AUTOMATION</span>}
    </Link>
  )
}

function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const hoverAt = useRef(0)
  const close = useCallback(() => setOpen(false), [])
  const ref = useOutside<HTMLDivElement>(close)
  const { path } = useRouter()
  useEffect(() => setOpen(false), [path])
  const active = path === item.to || path.startsWith(item.to + '/')
  return (
    <div
      ref={ref}
      className={`nav__item ${open ? 'is-open' : ''}`}
      onMouseEnter={() => { hoverAt.current = Date.now(); setOpen(true) }}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => { if (e.key === 'Escape') { setOpen(false); (ref.current?.querySelector('button') as HTMLElement)?.focus() } }}
    >
      <button className="nav__link" aria-expanded={open} aria-haspopup="true" aria-current={active ? 'page' : undefined} onClick={() => setOpen((o) => (o && Date.now() - hoverAt.current < 600 ? true : !o))}>
        {item.label} <LuChevronDown aria-hidden size={14} />
      </button>
      <div className="mega" role="menu" aria-label={item.label}>
        {item.mega!.map((m) => (
          <Link key={m.to + m.label} to={m.to} role="menuitem" tabIndex={open ? 0 : -1}>
            <strong>{m.label}</strong><span>{m.text}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function WhatsAppButton() {
  if (!company.whatsapp) return null
  const msg = encodeURIComponent('Hello ASEC Automation, I would like to ask about your services.')
  return (
    <a className="wa-btn" href={`https://wa.me/${company.whatsapp}?text=${msg}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with ASEC Automation on WhatsApp">
      <svg viewBox="0 0 32 32" aria-hidden><path fill="currentColor" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.2c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3zm0 23.2c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.7C5.4 9.8 10.2 5.1 16 5.1s10.6 4.7 10.6 10.5S21.8 26.2 16 26.2zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1 2.9 1.1 3.4.9 4.1.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4z"/></svg>
      <span>WhatsApp</span>
    </a>
  )
}

export function Header() {
  const { scrolled, progress } = useScrolled()
  const [mobile, setMobile] = useState(false)
  const { path } = useRouter()
  useEffect(() => setMobile(false), [path])
  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
    if (!mobile) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setMobile(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [mobile])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`header ${scrolled ? 'is-solid' : ''}`}>
        <div className="container header__inner">
          <Logo />
          <nav className="nav" aria-label="Main">
            {NAV.map((n) => n.mega
              ? <NavDropdown key={n.label} item={n} />
              : <div className="nav__item" key={n.label}><Link to={n.to} className="nav__link" aria-current={n.to !== '/' && path.startsWith(n.to + '/') ? 'page' : undefined}>{n.label}</Link></div>)}
          </nav>
          <Link to="/contact" className="btn btn--primary header__cta">Contact Us</Link>
          <button className="burger" aria-label="Open menu" aria-expanded={mobile} onClick={() => setMobile(true)}><LuMenu size={22} aria-hidden /></button>
        </div>
        <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      </header>
      {mobile && (
        <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-nav__top">
            <Logo />
            <button className="burger" style={{ display: 'grid' }} aria-label="Close menu" onClick={() => setMobile(false)} autoFocus><LuX size={22} aria-hidden /></button>
          </div>
          <ul>
            {[...NAV, { label: 'Contact Us', to: '/contact' }].map((n) => (
              <li key={n.label}><Link to={n.to}>{n.label}<LuArrowUpRight aria-hidden /></Link></li>
            ))}
          </ul>
          <Link to="/contact" className="btn btn--primary">Contact Us <Arrow /></Link>
        </div>
      )}
    </>
  )
}

export function Footer() {
  const c = company.contact
  const socials = Object.entries(company.social).filter(([, v]) => v)
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div style={{ display: 'grid', gap: 18, alignContent: 'start' }}>
            <Logo footer />
            <p style={{ maxWidth: '38ch' }}>{company.shortDescription.value}</p>
            {socials.length > 0 ? (
              <ul style={{ display: 'flex', gap: 16 }}>{socials.map(([k, v]) => <li key={k}><a href={v} target="_blank" rel="noopener noreferrer" style={{ textTransform: 'capitalize' }}>{k}</a></li>)}</ul>
            ) : <p style={{ fontSize: 13, color: 'var(--steel)' }}>{company.socialHandles}</p>}
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About ASEC</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/global-presence">Global Presence</Link></li>
              <li><Link to="/partners">Partners & Technologies</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/partners">Partners & Technologies</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              {c.address ? <li>{c.address}</li> : <li className="review-only" style={{ color: 'var(--steel)' }}>Office address — to be provided</li>}
              {c.phone ? <li><a href={`tel:${c.phoneHref}`}>{c.phone}</a></li> : <li className="review-only" style={{ color: 'var(--steel)' }}>Phone — to be provided</li>}
              {c.email ? <li><a href={`mailto:${c.email}`}>{c.email}</a></li> : <li className="review-only" style={{ color: 'var(--steel)' }}>Email — to be provided</li>}
              <li><Link to="/contact" className="text-link" style={{ color: 'var(--cyan)' }}>Send an inquiry <Arrow /></Link></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {company.name.value}. All rights reserved.</span>
          <nav aria-label="Legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/cookies">Cookie Preferences</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export function ReviewBanner() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => { document.body.classList.toggle('hide-review', hidden) }, [hidden])
  if (!REVIEW_MODE) return null
  return (
    <div className="review-banner" role="status">
      <span>Review build — draft copy and image slots are marked.</span>
      <button onClick={() => setHidden((h) => !h)} aria-pressed={hidden}>
        {hidden ? <><LuEye aria-hidden /> Show markers</> : <><LuEyeOff aria-hidden /> Hide markers</>}
      </button>
    </div>
  )
}

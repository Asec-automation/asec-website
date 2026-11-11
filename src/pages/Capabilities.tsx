import { LuCheck } from 'react-icons/lu'
import React from 'react'
import { Link, href } from '../lib/router'
import { Img, Arrow, SectionHead, StatusBadge, CTASection, PageHero, Icon, EmptyState, Gallery, responsive } from '../components/ui'
import { services } from '../content/expertise'
import { solutions, industries, projects, industryTiles } from '../content/catalogue'
import { CementDiagram } from '../components/CementDiagram'
import { DemoDashboard } from '../components/DemoDashboard'
import NotFound from './NotFound'

/* ============================== EXPERTISE INDEX ============================== */
const XP_RELATED: Record<string, string[]> = {
  'industrial-automation': ['Industrial Automation', 'Control System Modernization', 'PLC & SCADA'],
  'process-control': ['Control System Modernization'],
  'plc-scada': ['PLC & SCADA', 'PLC & Control Panels'],
  'electrical-instrumentation': ['Electrical Installation', 'Instrumentation', 'Electrical & Mechanical Installation'],
  'pv-solar-epc': ['PV Solar EPC'],
  'lv-panel-builder': ['LV Panel Boards', 'PLC & Control Panels'],
  'industrial-eai': ['Control System Modernization', 'Electrical Installation'],
}

export function Expertise({ initial }: { initial?: string }) {
  const list = services.filter((s) => s.enabled)
  const start = Math.max(0, list.findIndex((x) => x.slug === initial))
  const [cur, setCur] = React.useState(start)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const s = list[cur]
  const select = (i: number, scroll = false) => {
    const n = (i + list.length) % list.length
    setCur(n)
    try { window.history.replaceState(window.history.state, '', href(`/expertise/${list[n].slug}`)) } catch {}
    if (scroll && window.innerWidth < 1000) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const related = projects.filter((p) => (XP_RELATED[s.slug] ?? []).includes(p.solution)).slice(0, 3)
  const num = (i: number) => String(i + 1).padStart(2, '0')
  return (
    <div className="font-inter">
      <PageHero image="EXPERTISE_HERO_01" eyebrow="Our expertise" crumbs={[{ label: 'Expertise' }]}
        title={<>Engineering depth across the <span className="accent">automation stack.</span></>}
        lead={`${list.length} areas of expertise — EPC, automation, operation & maintenance and our own workshops. Choose one to see the full details.`} />

      <section className="section xs-sec">
        <div className="container xs">
          <nav className="xs-nav" aria-label="Areas of expertise">
            <span className="xs-nav__label">{list.length} areas of expertise</span>
            <ul role="tablist">
              {list.map((x, i) => (
                <li key={x.slug}>
                  <a role="tab" aria-selected={i === cur} href={href(`/expertise/${x.slug}`)} className={i === cur ? 'is-on' : ''}
                    onClick={(e) => { e.preventDefault(); select(i, true) }}>
                    <span className="xs-nav__n">{num(i)}</span><span className="xs-nav__icon"><Icon name={x.icon} /></span><span className="xs-nav__t">{x.title}</span>
                  </a>
                </li>
              ))}
            </ul>
            <label className="xs-select">
              <span className="sr-only">Choose an area of expertise</span>
              <select value={cur} onChange={(e) => select(Number(e.target.value))}>
                {list.map((x, i) => <option key={x.slug} value={i}>{num(i)} — {x.title}</option>)}
              </select>
            </label>
          </nav>

          <div className="xs-panel" ref={panelRef} role="tabpanel" aria-live="polite" key={s.slug}>
            <div className="xs-media">
              <Img id={s.image} />
              <span className="xs-media__badge"><Icon name={s.icon} /></span>
            </div>
            <div className="xs-head">
              <div className="xp-text__meta"><span className="eyebrow">{num(cur)} of {list.length}</span><StatusBadge status={s.status} /></div>
              <h2 className="xs-title">{s.title}</h2>
              {(() => { const m = s.overview.match(/^(.+?[.!?])\s+(.*)$/s); return m
                ? <><p className="sd-intro">{m[1]}</p><p className="sd-body">{m[2]}</p></>
                : <p className="sd-intro">{s.overview}</p> })()}
            </div>

            <div className="xs-cols">
              <div className="xs-box"><h3>What we do</h3><ul className="sd-ticks">{s.capabilities.map((c) => <li key={c}>{c}</li>)}</ul></div>
              <div className="xs-box xs-box--dark"><h3>Challenges we solve</h3><ol>{s.challenges.map((c, i) => <li key={c}><span>{num(i)}</span>{c}</li>)}</ol></div>
              <div className="xs-box"><h3>What you gain</h3><ul className="sd-ticks">{s.benefits.map((b) => <li key={b}>{b}</li>)}</ul></div>
            </div>

            <div className="xs-meta">
              <div><h3>Technologies</h3><p>{s.technologies.join(' · ')}</p></div>
              <div><h3>Industries</h3><p>{s.industries.map((id) => industries.find((x) => x.slug === id)?.title).filter(Boolean).join(' · ')}</p></div>
            </div>

            {s.toolCards && (
              <div className="xs-block">
                <h3 className="xs-block__title">Diagnostic tools</h3>
                <div className="tool-grid">{s.toolCards.map((t) => (
                  <div key={t.title} className="x-card" style={{ padding: 0 }}>
                    <Img id={t.image} light size="compact" style={{ aspectRatio: '4 / 3', borderRadius: 0 }} />
                    <div style={{ padding: '14px 16px 16px', display: 'grid', gap: 4 }}><h4 className="h3" style={{ fontSize: 16, margin: 0 }}>{t.title}</h4><p style={{ fontSize: 13.5, margin: 0 }}>{t.text}</p></div>
                  </div>
                ))}</div>
              </div>
            )}

            {s.gallery && s.gallery.length > 0 && (
              <div className="xs-block"><h3 className="xs-block__title">From our sites and workshops</h3><Gallery items={s.gallery} /></div>
            )}

            {related.length > 0 && (
              <div className="xs-block">
                <h3 className="xs-block__title">Related projects</h3>
                <div className="xs-proj">{related.map((p) => (
                  <Link key={p.slug} to={`/projects#${p.slug}`} className="xs-proj__item">
                    <span>{p.clientVisible && p.clientName ? `${p.clientName} · ` : ''}{p.country}{p.year ? ` · ${p.year}` : ''}</span>
                    <strong>{p.title}</strong>
                  </Link>
                ))}</div>
              </div>
            )}

            <div className="xs-foot">
              <button type="button" className="xs-step" onClick={() => select(cur - 1, true)}><span className="xs-back"><Arrow /></span> {list[(cur - 1 + list.length) % list.length].title}</button>
              <Link to="/contact" className="btn btn--primary">Talk to an engineer <Arrow /></Link>
              <button type="button" className="xs-step xs-step--next" onClick={() => select(cur + 1, true)}>{list[(cur + 1) % list.length].title} <Arrow /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHead eyebrow="How we deliver" title="One process, from first survey to lifecycle support." />
          <ol className="xp-steps">
            {(list[0]?.approach ?? []).map((a, i) => (
              <li key={a.title}><span className="xp-steps__n">{num(i)}</span><h3>{a.title}</h3><p>{a.text}</p></li>
            ))}
          </ol>
        </div>
      </section>
      <CTASection />
    </div>
  )
}

/* ============================== SERVICE DETAIL ============================== */
export function ServiceDetail({ slug }: { slug: string }) {
  if (!services.find((x) => x.slug === slug && x.enabled)) return <NotFound />
  return <Expertise initial={slug} />
}

/* ============================== SOLUTIONS ============================== */
export function Solutions() {
  const list = solutions.filter((s) => s.enabled)
  return (
    <>
      <div className="sol-hero-bg">
        <PageHero image="SOLUTIONS_HERO_01" eyebrow="Solutions" crumbs={[{ label: 'Solutions' }]}
          title={<>Solutions engineered <span className="accent">around the process.</span></>}
          lead="From automation and control to energy management, digitalisation and maintenance — integrated solutions for heavy industry." />
      </div>
      <section className="section section--dark">
        <div className="container">
          <div className="grid grid-3">{list.map((s, i) => (
            <article key={s.title} className="sol-card reveal" style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
              <span className="sol-card__n">{String(i + 1).padStart(2, '0')}</span>
              <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}><h2 className="h3">{s.title}</h2><p>{s.summary}</p></div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>{s.tags.map((t) => <span className="chip" key={t}>{t}</span>)}<StatusBadge status={s.status} label="Proposed" /></div>
            </article>
          ))}</div>
        </div>
      </section>
      <CTASection />
    </>
  )
}

/* ============================== INDUSTRIES ============================== */
export function Industries() {
  return (
    <>
      <section className="ind-hero">
        <div className="ind-hero__media" aria-hidden><img src="/images/industries/hero.webp" {...responsive('/images/industries/hero.webp', '100vw')} alt="" /></div>
        <div className="container ind-hero__content">
          <nav aria-label="Breadcrumb"><ol className="crumbs"><li><Link to="/">Home</Link></li><li><span aria-current="page">Industries</span></li></ol></nav>
          <span className="eyebrow" style={{ color: 'var(--cyan)' }}>Industries</span>
          <h1 className="h1">Built for heavy industry.<br /><span className="accent">Focused on cement.</span></h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,.78)' }}>Industrial focus: cement, steel, glass, fertilizers and chemicals — plus solar and wider infrastructure.</p>
        </div>
        <div className="container">
          <ul className="ind-tiles">
            {industryTiles.map((t, i) => (
              <li key={t.title} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <Link to={t.to} className="ind-tile" aria-label={t.title}>
                  <img src={t.img} alt="" loading={i < 3 ? 'eager' : 'lazy'} />
                  <div className="ind-tile__body">
                    <span className="ind-tile__icon"><Icon name={t.icon} /></span>
                    <div className="ind-tile__row"><h2>{t.title}</h2><Arrow /></div>
                    <p>{t.text}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CTASection />
    </>
  )
}

/* ============================== CEMENT ============================== */
export function Cement() {
  return (
    <>
      <PageHero image="CEMENT_HERO_01" eyebrow="Cement industry solutions" crumbs={[{ label: 'Industries', to: '/industries' }, { label: 'Cement' }]}
        title={<>Automation from <span className="accent">quarry to dispatch.</span></>}
        lead="An interactive guide to the cement production process and the automation, monitoring and optimisation considerations in each area." />
      <section className="section section--dark" aria-labelledby="cement-diagram">
        <div className="container">
          <SectionHead eyebrow="Interactive process" title={<span id="cement-diagram">The cement production line.</span>}
            lead="Select a process area to see its purpose, typical operating variables and where automation adds value." />
          <CementDiagram />
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="reveal" style={{ display: 'grid', gap: 20 }}>
            <span className="eyebrow">Why it matters</span>
            <h2 className="h2">Stability is the foundation of performance.</h2>
            <p className="lead">Cement production is continuous, energy-intensive and tightly coupled: a disturbance in the kiln affects the cooler, the preheater and the quality of the clinker. Well-engineered control and monitoring keep the line stable and make optimisation possible.</p>
            <div className="btn-row"><Link to="/innovation" className="btn btn--blue">Industrial intelligence <Arrow /></Link><Link to="/contact" className="btn btn--outline">Discuss your plant</Link></div>
          </div>
          <Img id="INDUSTRY_CEMENT_01" style={{ aspectRatio: '4 / 3' }} />
        </div>
      </section>
      <CTASection />
    </>
  )
}

/* ============================== INNOVATION ============================== */
export function Innovation() {
  const features = [
    ['activity', 'Predictive analytics', 'Estimate key variables ahead of time to support operator decisions.'],
    ['gauge', 'Abnormal reading detection', 'Flag readings that drift away from expected process behaviour.'],
    ['layers', 'Trend visualisation', 'Clear, comparable trends across related process variables.'],
    ['zap', 'Energy & fuel analysis', 'Relate fuel and power use to operating conditions.'],
    ['monitor', 'Operational alerts', 'Context-rich notifications instead of more alarms.'],
    ['cpu', 'Performance dashboards', 'Shift and daily views of process performance.'],
  ]
  return (
    <>
      <section className="ind-hero inn-hero2">
        <div className="ind-hero__media" aria-hidden><img src="/images/tech/ai.webp" alt="" /></div>
        <div className="container ind-hero__content">
          <nav aria-label="Breadcrumb"><ol className="crumbs"><li><Link to="/">Home</Link></li><li><span aria-current="page">Innovation</span></li></ol></nav>
          <span className="eyebrow" style={{ color: 'var(--cyan)' }}>AI & industrial intelligence</span>
          <h1 className="h1">Industrial intelligence through <span className="accent">data and automation.</span></h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,.78)' }}>An R&D concept from ASEC’s Automation & Digitalization unit: predictive models that estimate key cement-kiln values from routine plant readings.</p>
          <div className="btn-row"><button type="button" className="btn btn--primary" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>Explore the demo <Arrow /></button><Link to="/contact" className="btn btn--ghost">Talk to our engineers</Link></div>
        </div>
      </section>
      <section className="inn-demo" id="demo" style={{ scrollMarginTop: 80 }}>
        <div className="container">
          <div className="reveal"><DemoDashboard /></div>
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(255,255,255,.6)' }}>Hover a chart to inspect values. Every number is synthetic — a research and prototype concept, not a deployed product.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Capabilities" title="Decision support, not black boxes." />
          <ul className="sector-grid">
            {features.map(([icon, t, d], i) => (
              <li key={t} className="sector-card reveal" style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                <span className="sector-card__icon"><Icon name={icon} /></span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: 28, fontSize: 14 }}>This website is entirely separate from any plant control or OT/SCADA network and does not connect to live plant systems.</p>
        </div>
      </section>
      <CTASection />
    </>
  )
}

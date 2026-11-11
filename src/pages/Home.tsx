import React, { useState } from 'react'
import { Link } from '../lib/router'
import { Img, Icon, Arrow, SectionHead, StatusBadge, CTASection, EmptyState, Stats, PartnerTile } from '../components/ui'
import { company, facts, REVIEW_MODE } from '../content/company'
import { services } from '../content/expertise'
import { solutions, industries, countries, projects, partners, sustainabilityThemes } from '../content/catalogue'
import { WorldMap } from '../components/WorldMap'

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg"><Img id="HOME_HERO_01" priority /></div>
      <div className="container hero__content">
        <p className="hero__brand">{company.officialTagline.value}</p>
        <h1 id="hero-title" className="display hero__title">
          <span className="line"><span>Engineering Intelligence.</span></span>
          <span className="line"><span className="accent">Automating Industry.</span></span>
        </h1>
        <p className="hero__sub">Automation and electrical engineering for some of the world’s most demanding heavy industries — since {facts.founded}.</p>
        <div className="btn-row">
          <Link to="/projects" className="btn btn--primary">View Our Projects <Arrow /></Link>
          <Link to="/about" className="btn btn--ghost">Discover ASEC</Link>
        </div>
        {REVIEW_MODE && <div style={{ marginTop: 24 }}><StatusBadge status="proposed" label="Headline: proposed marketing copy" /></div>}
      </div>
      <span className="scroll-cue" aria-hidden>Scroll</span>
    </section>
  )
}

function WhoWeAre() {
  return (
    <section className="section" aria-labelledby="who-title">
      <div className="container split" style={{ alignItems: 'start' }}>
        <div className="reveal" style={{ display: 'grid', gap: 24 }}>
          <span className="eyebrow">Who we are</span>
          <h2 id="who-title" className="h2">A regional pioneer since {facts.founded}.</h2>
          {facts.intro.map((t) => t.replace(/ from Mexico to the Philippines, while remaining a leader in the MENA region\./, ' for heavy industry.')).map((t) => <p key={t} className="lead">{t}</p>)}
          <p className="muted">Industrial focus: <strong style={{ color: 'var(--ink)' }}>{facts.focus.join(', ')}</strong> — {facts.focusExtra}.</p>
          <div className="btn-row"><Link to="/about" className="btn btn--blue">Discover Our Story <Arrow /></Link></div>
        </div>
        <div className="reveal" style={{ display: 'grid', gap: 18 }}>
          <div className="stats-2x2"><Stats items={facts.stats.filter((x) => !/countr|business units/i.test(x.label))} /></div>
          <div className="cert-strip"><strong>CERTIFIED</strong>{facts.certifications.map((c) => <span key={c}>{c}</span>)}</div>
        </div>
      </div>
    </section>
  )
}

function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured).slice(0, 3)
  if (projects.length === 0) return null
  return (
    <section className="section section--soft" aria-labelledby="proj-title">
      <div className="container">
        <SectionHead eyebrow="Featured projects" title={<span id="proj-title">{facts.stats[1].value}+ projects delivered.</span>} lead="A selection from ASEC’s project portfolio across cement, steel, solar, infrastructure and more." aside={<Link to="/projects" className="btn btn--outline">All projects <Arrow /></Link>} />
        {featured.length === 0 ? (
          <EmptyState icon="folder" title="Case studies are being prepared"
            text="Approved project case studies — with scope, technologies and results — will appear here. No project is shown until it has been reviewed and approved for publication, including client-name permission."
            skeleton />
        ) : (
          <div className="grid grid-3">{featured.map((p) => (
            <Link key={p.slug} to={`/projects#${p.slug}`} className="tile reveal" style={{ aspectRatio: '4/5' }}>
              {p.photo ? <div className="media"><img src={p.photo} alt="" loading="lazy" style={{ objectPosition: p.photoFocus }} /></div> : <Img id={p.image} size="compact" />}
              {p.illustrative && <span className="illus-tag">Illustration</span>}
              <div className="tile__body"><span className="eyebrow" style={{ color: 'var(--cyan)' }}>{p.clientVisible && p.clientName ? `${p.clientName} · ` : ''}{p.country}{p.year ? ` · ${p.year}` : ''}</span><h3 className="h3">{p.title}</h3><p>{p.summary}</p></div>
            </Link>
          ))}</div>
        )}
      </div>
    </section>
  )
}

function Partners() {
  return (
    <section className="section section--tight" aria-labelledby="partners-title">
      <div className="container">
        <SectionHead eyebrow="Partners & technologies" title={<span id="partners-title">Certified by industry leaders.</span>}
          lead="ASEC Automation is a Siemens System Integrator and a Schneider Electric certified panel builder." />
        <div className="partner-cards">
          {partners.map((p) => (
            <PartnerTile key={p.name} name={p.name} description={p.description} logo={p.logo} />
          ))}
        </div>
      </div>
    </section>
  )
}

const KEY_CLIENTS = ['LafargeHolcim', 'CEMEX', 'Heidelberg Materials', 'Titan Cement', 'Italcementi', 'FLSmidth', 'Eni', 'bp', 'TAQA Arabia', 'GE Vernova', 'Elsewedy Electric', 'Samsung', 'Saint-Gobain', 'Ezz Steel', 'Jotun', 'Air Liquide']

function Clients() {
  const row = [...KEY_CLIENTS, ...KEY_CLIENTS]
  return (
    <section className="clients-strip" aria-labelledby="clients-title">
      <div className="container clients-strip__head">
        <span className="eyebrow" id="clients-title">Selected clients</span>
        <Link to="/projects#clients" className="clients-strip__all">See all clients <Arrow /></Link>
      </div>
      <div className="clients-strip__track" aria-hidden>
        <ul>{row.map((n, i) => <li key={i}>{n}</li>)}</ul>
      </div>
      <ul className="sr-only">{KEY_CLIENTS.map((n) => <li key={n}>{n}</li>)}</ul>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <FeaturedProjects />
      <Partners />
      <Clients />
      <CTASection />
    </>
  )
}

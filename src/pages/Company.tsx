import React from 'react'
import { LuDownload } from 'react-icons/lu'
import { Link } from '../lib/router'
import { Img, Arrow, SectionHead, StatusBadge, CTASection, EmptyState, PageHero, Icon, Gallery, Stats, PartnerTile, PhotoTiles } from '../components/ui'
import { company, facts, REVIEW_MODE } from '../content/company'
import { countries, partners, sustainabilityThemes, workshopPhotos, mainPartners, strategicSuppliers, type Partner } from '../content/catalogue'
import { services } from '../content/expertise'
import { WorldMap } from '../components/WorldMap'
import { toolGroups } from '../content/software'
import AV from '../config/available-images.json'

/* ============================== CERTIFICATES ============================== */
const CERTS: { name: string; title: string; text: string; icon: string }[] = [
  { name: 'ISO 9001', title: 'ISO 9001', text: 'Quality management system', icon: 'gear' },
  { name: 'ISO 14001', title: 'ISO 14001', text: 'Environmental management system', icon: 'recycle' },
  { name: 'ISO 45001', title: 'ISO 45001', text: 'Occupational health & safety management system', icon: 'users' },
  { name: 'Siemens System Integrator', title: 'Siemens System Integrator', text: 'Engineering, programming and commissioning of Siemens control systems', icon: 'cpu' },
  { name: 'Schneider Electric Certified Panel Builder', title: 'Schneider Electric Certified Panel Builder', text: 'Low-voltage switchboards and control panels built to Schneider Electric standards', icon: 'layers' },
]
export function Certificates() {
  return (
    <section className="section" aria-labelledby="certs-title">
      <div className="container">
        <SectionHead eyebrow="Certificates & accreditations" title={<span id="certs-title">Certified quality, safety and partnerships.</span>} />
        <div className="cert-grid">
          {CERTS.map((c, i) => {
            const file = company.certificateFiles[c.name]
            return (
              <div key={c.name} className="cert-card reveal" style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                <span className="cert-card__icon"><Icon name={c.icon} /></span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                {file && <a className="text-link" href={file} target="_blank" rel="noopener">View certificate <Arrow /></a>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ============================== ABOUT ============================== */
export function About() {
  return (
    <>
      <PageHero image="ABOUT_HERO_01" eyebrow="About ASEC" crumbs={[{ label: 'About' }]}
        title={<>A regional pioneer <span className="accent">since {facts.founded}.</span></>}
        lead="An integrated electrical and automation EPC contractor, and a member of the ASEC Holding family." />

      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="reveal" style={{ display: 'grid', gap: 22 }}>
            <span className="eyebrow">Company overview</span>
            <h2 className="h2">Cutting-edge solutions for automation and electrical engineering.</h2>
            {facts.intro.map((t) => <p key={t} className="lead">{t}</p>)}
            <p className="muted">Over more than 25 years of success, ASA has become recognised as an integrated electrical and automation EPC contractor serving infrastructure and industry across MENA and Asia Pacific.</p>
            <div className="cert-strip"><strong>CERTIFIED</strong>{facts.certifications.map((c) => <span key={c}>{c}</span>)}</div>
            <p className="muted" style={{ fontSize: 14 }}>Award: {facts.award}</p>
            {company.profilePdf
              ? <div><a className="btn btn--blue" href={company.profilePdf} download target="_blank" rel="noopener">Download our profile (PDF) <LuDownload aria-hidden /></a></div>
              : REVIEW_MODE && <div><StatusBadge status="missing" label="Company profile PDF needed for the download button" /></div>}
          </div>
          <div className="reveal" style={{ display: 'grid', gap: 18 }}>
            <Img id="ABOUT_COMPANY_01" style={{ aspectRatio: '4 / 3' }} focal="50% 62%" />
            <Stats items={facts.stats} />
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHead eyebrow="Core goals" title="Vision & mission." />
          <div className="grid grid-2">
            <div className="x-card reveal"><span className="eyebrow">Vision</span><h3 className="h3">{facts.vision}</h3></div>
            <div className="x-card reveal"><span className="eyebrow">Mission</span><h3 className="h3">{facts.mission}</h3></div>
          </div>
          <div style={{ marginTop: 70 }}>
            <SectionHead eyebrow="Background & milestones" title="From 1997 to now." />
            <div className="timeline reveal">
              {facts.milestones.map((m) => <div key={m.year}><b>{m.year}</b><h3 className="h3">{m.title}</h3><p style={{ color: 'rgba(255,255,255,.7)' }}>{m.text}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <Certificates />

      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Our business units" title="Four business units, one integrated service." aside={<Link to="/projects" className="btn btn--outline">Our projects <Arrow /></Link>} />
          <div className="bu-grid">
            {facts.businessUnits.map((b, i) => (
              <div key={b.title} className="bu-card reveal" style={{ transitionDelay: `${(i % 2) * 80}ms` }}>
                <div className="bu-card__head">
                  <span className="bu-card__icon"><Icon name={b.icon} /></span>
                  <div><span className="bu-card__n">0{i + 1}</span><h3>{b.title}</h3></div>
                </div>
                <p className="bu-card__text">{b.text}</p>
                <ul className="checklist checklist--2">{b.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'clamp(60px, 8vw, 100px)' }}>
            <SectionHead eyebrow="Business sectors" title="Nine sectors. One integrated contractor." />
            <ul className="sector-grid">
              {facts.sectors.map((t, i) => (
                <li key={t.title} className="sector-card reveal" style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                  <span className="sector-card__icon"><Icon name={t.icon} /></span>
                  <div><h3>{t.title}</h3><p>{t.detail}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Our workshops" title="Panel assembly and motor rewinding workshops."
            lead="Well-equipped workshops in Tebbin (Cairo) and the Alexandria free zone, managed by experts in designing and building electrical switchboards and control panels, and in rewinding and repairing motors." />
          <PhotoTiles items={workshopPhotos} />
        </div>
      </section>

      <section className="section section--dark">
        <div className="container split">
          <div className="reveal" style={{ display: 'grid', gap: 22 }}>
            <span className="eyebrow">Global footprint</span>
            <h2 className="h2">{facts.stats[2].value} countries. {facts.stats[5].value} offices.</h2>
            <p className="lead">Offices in Egypt, Saudi Arabia, Libya and the UAE, with projects from Mexico and Honduras to Uganda and the Philippines.</p>
            <div><Link to="/global-presence" className="btn btn--ghost">Global presence <Arrow /></Link></div>
          </div>
          <div className="reveal"><WorldMap countries={countries.filter((c) => c.published || REVIEW_MODE)} interactive={false} /></div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container split">
          <div className="reveal" style={{ display: 'grid', gap: 20 }}>
            <span className="eyebrow">Quality assurance & HSE</span>
            <h2 className="h2">Safety is part of our culture.</h2>
            <p className="lead">Health, safety and environmental consciousness are an integral part of ASA’s culture, for both our teams and our clients. ASA is an ISO-certified company that follows international standards and is subject to continuous audits.</p>
            <ul className="checklist checklist--2 checklist--cards">{facts.hse.map((h) => <li key={h}>{h}</li>)}</ul>
          </div>
          <Img id="ABOUT_HSE_01" style={{ aspectRatio: '4 / 3' }} />
        </div>
      </section>

      <CTASection />
    </>
  )
}

/* ============================== SUSTAINABILITY ============================== */
export function Sustainability() {
  return (
    <>
      <PageHero image="SUSTAINABILITY_HERO_01" eyebrow="Sustainability" crumbs={[{ label: 'Sustainability' }]}
        title={<>Responsible <span className="accent">industrial performance.</span></>}
        lead="Efficient, stable and well-monitored operations are a practical foundation for more sustainable industry." />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Our approach" title="Efficiency is an engineering outcome." status="proposed"
            lead="We describe sustainability themes in terms of what good automation and monitoring can enable. We do not publish emissions savings, certifications or ESG figures unless they are verified." />
          <div className="grid grid-3">
            {sustainabilityThemes.map((t) => (
              <div key={t.title} className="x-card reveal"><span className="x-card__icon"><Icon name={t.icon} /></span><h3 className="h3">{t.title}</h3><p>{t.text}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--dark">
        <div className="container split">
          <div className="reveal"><Img id="SUSTAINABILITY_SOLAR_01" style={{ aspectRatio: '16/10' }} /></div>
          <div className="reveal" style={{ display: 'grid', gap: 20 }}>
            <span className="eyebrow">Renewable energy</span>
            <h2 className="h2">PV solar EPC.</h2>
            <p className="lead">ASEC Automation is an EPC contractor in solar energy — with plants of 6 MW for Dina Farms, 7 MW for ASCOM and 18 MW at NABQ, Sharm El Sheikh, among its projects.</p>
            <div><Link to="/projects" className="btn btn--ghost">Our projects <Arrow /></Link></div>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Monitoring" title="Environmental and energy monitoring opportunities." />
          <div className="grid grid-2">
            <Img id="SUSTAINABILITY_ENERGY_01" style={{ aspectRatio: '16/10' }} />
            <Img id="SUSTAINABILITY_EFFICIENCY_01" style={{ aspectRatio: '16/10' }} />
          </div>
        </div>
      </section>
      <CTASection />
    </>
  )
}

/* ============================== PARTNERS ============================== */
const PARTNER_CATS: Partner['category'][] = ['Official partner', 'Technology vendor', 'Client', 'Supplier', 'Integration ecosystem']
export function Partners() {
  const L = AV as Record<string, string>
  const certified = [
    { p: partners[0], title: 'Siemens System Integrator', text: 'We engineer, program and commission Siemens control systems — from PLC and HMI to plant-wide DCS.', to: '/projects', cta: 'our projects' },
    { p: partners[1], title: 'Schneider Electric Certified Panel Builder', text: 'Our own workshops build low-voltage switchboards and control panels to Schneider Electric standards.', to: '/projects', cta: 'our projects' },
  ]
  return (
    <>
      <PageHero image="PARTNERS_HERO_01" eyebrow="Partners & technologies" crumbs={[{ label: 'Partners & Technologies' }]}
        title={<>Certified by <span className="accent">industry leaders.</span></>}
        lead="ASEC Automation is a Siemens System Integrator and a Schneider Electric certified panel builder." />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Certified partnerships" title="Our certified partners." />
          <div className="pt4-cert">
            {certified.map((c) => (
              <Link key={c.title} to={c.to} className="pt4-cert__card reveal">
                <div className="pt4-cert__logo">{L[c.p.logo!] ? <img src={L[c.p.logo!]} alt={`${c.p.name} logo`} loading="lazy" /> : <span>{c.p.name}</span>}</div>
                <div className="pt4-cert__body">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <span className="pt4-cert__link">View {c.cta} <Arrow /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="sw-title">
        <div className="container">
          <SectionHead eyebrow="Engineering software" title={<span id="sw-title">Software we work with.</span>} />
          <div className="pt4-sw">
            {toolGroups.map((g) => (
              <div key={g.id} className="pt4-sw__col reveal">
                <h3><span className="pt4-sw__icon"><Icon name={g.icon} /></span>{g.filter}</h3>
                <ul>
                  {g.tools.map((t) => <li key={t.name}><strong>{t.name}</strong><span>{t.text}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="sw-note">Listing a tool does not imply a partnership with its vendor. Trademarks belong to their respective owners.</p>
        </div>
      </section>
      <CTASection />
    </>
  )
}

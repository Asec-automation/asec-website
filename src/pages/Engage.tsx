import React, { useMemo, useState } from 'react'
import { Link } from '../lib/router'
import { Img, Arrow, SectionHead, StatusBadge, CTASection, PageHero, EmptyState, Gallery, Icon, responsive } from '../components/ui'
import { projects, countries, industries, projectPhotos, clientGroups, type Relationship } from '../content/catalogue'
import { company, REVIEW_MODE } from '../content/company'
import { useJobs } from '../content/live-jobs'
import { WorldMap, markerGroup } from '../components/WorldMap'
import { ContactForm } from '../components/ContactForm'
import { ApplicationForm } from '../components/ApplicationForm'
import { JobAlerts } from '../components/JobAlerts'
import { API_AVAILABLE } from '../content/live-jobs'
import { getLang } from '../i18n'

/** Exact address as listed on Google Maps (Maadi police district, Cairo). */
const HQ_MAP_QUERY = '9 Street 286, El-Basatin Sharkeya, El Basatin, Cairo Governorate 4234220, Egypt'

/** Live Google map on the real website; a styled card in the offline preview (preview viewers block Google frames). */
function HqMap() {
  const c = company.contact
  if (!API_AVAILABLE) return (
    <a className="hq-map-card" href={company.offices[0].mapUrl} target="_blank" rel="noopener noreferrer">
      <span className="hq-map-card__pin" aria-hidden><Icon name="map-pin" /></span>
      <strong>ASEC Automation — Head office</strong>
      <span>{c.address}</span>
      <span className="hq-map-card__go">Open in Google Maps <Arrow /></span>
    </a>
  )
  return (
    <div className="media hq-map" style={{ aspectRatio: '21 / 9', minHeight: 320 }}>
      <iframe
        title="Map of ASEC Automation head office, Maadi, Cairo"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(HQ_MAP_QUERY)}&hl=${getLang()}&z=16&output=embed`}
        style={{ border: 0, width: '100%', height: '100%' }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={-1}
      />
      <a className="hq-map__link" href={company.offices[0].mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Open ASEC Automation head office in Google Maps">
        <span className="hq-map__badge">Open in Google Maps <Arrow /></span>
      </a>
    </div>
  )
}

/* ============================== PROJECTS ============================== */
export function Projects() {
  const [q, setQ] = useState(''); const [country, setCountry] = useState(''); const [industry, setIndustry] = useState(''); const [year, setYear] = useState('')
  const opts = (k: 'country' | 'industry') => Array.from(new Set(projects.map((p) => p[k]).filter(Boolean))).sort()
  const years = Array.from(new Set(projects.map((p) => p.year).filter(Boolean))).sort().reverse()
  const list = useMemo(() => projects.filter((p) =>
    (!q || `${p.title} ${p.summary} ${p.technologies.join(' ')}`.toLowerCase().includes(q.toLowerCase())) &&
    (!country || p.country === country) && (!industry || p.industry === industry) && (!year || String(p.year) === year)), [q, country, industry, year])
  return (
    <>
      <PageHero image="PROJECTS_HERO_01" eyebrow="Projects" crumbs={[{ label: 'Projects' }]}
        title={<>400+ projects <span className="accent">delivered.</span></>} lead="A selection from ASEC’s project portfolio — cement, infrastructure, oil & gas, facility management, solar, water, rail and more." />
      <section className="section">
        <div className="container">
          {projects.length > 0 && (
          <div className="toolbar" role="search">
            <label className="sr-only" htmlFor="pq">Search projects</label>
            <input id="pq" placeholder="Search projects or technologies…" value={q} onChange={(e) => setQ(e.target.value)} />
            <label className="sr-only" htmlFor="pc">Country</label>
            <select id="pc" value={country} onChange={(e) => setCountry(e.target.value)}><option value="">All countries</option>{opts('country').map((o) => <option key={o}>{o}</option>)}</select>
            <label className="sr-only" htmlFor="pi">Industry</label>
            <select id="pi" value={industry} onChange={(e) => setIndustry(e.target.value)}><option value="">All industries</option>{opts('industry').map((o) => <option key={o}>{o}</option>)}</select>
            <label className="sr-only" htmlFor="py">Year</label>
            <select id="py" value={year} onChange={(e) => setYear(e.target.value)}><option value="">All years</option>{years.map((o) => <option key={o}>{o}</option>)}</select>
          </div>
          )}
          {projects.length === 0 ? (
            <EmptyState icon="folder" title="Project references coming soon" text="Our latest project references will be published here shortly." />
          ) : list.length === 0 ? <p className="muted">No projects match these filters.</p> : (
            <div className="grid grid-3">{list.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}</div>
          )}
          <div style={{ marginTop: 'clamp(70px, 9vw, 110px)' }} id="clients">
            <SectionHead eyebrow="Our clients" title="Clients across eight sectors." lead="A selection of the clients ASEC Automation has worked with across cement, energy, industry, infrastructure and the public sector." />
            <div className="client-groups">
              {clientGroups.map((g) => (
                <div key={g.sector} className="client-group reveal">
                  <h3><span className="client-group__icon"><Icon name={g.icon} /></span>{g.sector}</h3>
                  <ul>{g.names.map((n) => <li key={n}>{n}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 80 }}>
            <SectionHead eyebrow="Project photos" title="Worldwide projects." lead="Photos from ASEC project sites." />
            <Gallery items={projectPhotos} />
          </div>
        </div>
      </section>
      <CTASection />
    </>
  )
}

/* ============================== GLOBAL PRESENCE ============================== */
const REGIONS: { id: string; name: string; short: string; text: string; countries: string[] }[] = [
  { id: 'mena', name: 'Middle East & North Africa', short: 'MENA',
    text: 'Our home region. Head office and workshops in Egypt, branches in Saudi Arabia, Libya and the UAE, mega infrastructure in Riyadh, and cement projects in Jordan, Morocco and Algeria.',
    countries: ['egypt', 'saudi-arabia', 'libya', 'uae', 'jordan', 'morocco', 'algeria', 'iraq'] },
  { id: 'africa', name: 'Sub-Saharan Africa', short: 'Africa',
    text: 'Control-system upgrades for cement plants, including LafargeHolcim’s Hima Plant Line 3 in Uganda, with a footprint across Kenya and Tanzania.',
    countries: ['uganda', 'kenya', 'tanzania'] },
  { id: 'apac', name: 'Asia Pacific', short: 'APAC',
    text: 'Cement projects in the Philippines, including the APO cement mill for CEMEX.',
    countries: ['philippines'] },
  { id: 'americas', name: 'The Americas', short: 'Americas',
    text: 'Cement projects for Lafarge in Honduras — Piedras Azules and a PPC upgrade — and projects delivered in Mexico.',
    countries: ['honduras', 'mexico'] },
]

export function GlobalPresence() {
  const visible = countries.filter((c) => c.published || REVIEW_MODE)
  const byId = Object.fromEntries(visible.map((c) => [c.id, c]))
  const projOf = (name: string) => projects.filter((p) => p.country === name)
  const [active, setActive] = useState('egypt')
  const sel = byId[active] ?? visible[0]
  const selProj = sel ? projOf(sel.name).slice(0, 3) : []
  return (
    <>
      <section className="gp3-hero">
        <div className="container">
          <nav aria-label="Breadcrumb"><ol className="crumbs"><li><Link to="/">Home</Link></li><li><span aria-current="page">Global Presence</span></li></ol></nav>
          <div className="gp3-hero__head">
            <div>
              <span className="eyebrow" style={{ color: 'var(--cyan)' }}>Global presence</span>
              <h1 className="h1">An international <span className="accent">industrial perspective.</span></h1>
            </div>
            <p className="lead">Across continents, one engineering standard — with offices in Egypt, Saudi Arabia, Libya and the UAE, and projects across four regions.</p>
          </div>
          <dl className="gp3-stats">
            <div><dd>17</dd><dt>Countries footprint</dt></div>
            <div><dd>4</dd><dt>Offices worldwide</dt></div>
            <div><dd>4</dd><dt>Regions</dt></div>
            <div><dd>400<span>+</span></dd><dt>Projects delivered</dt></div>
          </dl>
          <div className="gp3-map">
            <div className="gp3-map__canvas"><WorldMap countries={visible} active={active} onSelect={setActive} /></div>
            {sel && (
              <aside className="gp3-map__card" aria-live="polite">
                <span className={`gp3-tag gp3-tag--${markerGroup(sel).toLowerCase()}`}><i className={`gp-dot gp-dot--${markerGroup(sel).toLowerCase()}`} aria-hidden />{sel.label ?? sel.relationship}</span>
                <h2>{sel.name}</h2>
                <p>{sel.description}</p>
                {selProj.length > 0 && <ul>{selProj.map((p) => <li key={p.slug}><Link to={`/projects#${p.slug}`}>{p.title}<Arrow /></Link></li>)}</ul>}
                <div className="gp3-map__chips" role="group" aria-label="Choose a country">
                  {visible.map((c) => <button key={c.id} aria-pressed={c.id === active} onClick={() => setActive(c.id)}>{c.name}</button>)}
                </div>
              </aside>
            )}
          </div>
          <p className="gp2-legend gp3-legend"><span><i className="gp-dot gp-dot--branches" />Branch / office</span><span><i className="gp-dot gp-dot--projects" />Projects</span><span><i className="gp-dot gp-dot--footprint" />Footprint</span></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Where we work" title="Four regions. One engineering team." />
          <div className="gp3-regions">
            {REGIONS.map((r, i) => {
              const list = r.countries.map((id) => byId[id]).filter(Boolean)
              const proj = list.flatMap((c) => projOf(c.name))
              const highlight = [...proj.filter((p) => p.featured), ...proj.filter((p) => !p.featured)].slice(0, 3)
              return (
                <article key={r.id} className="gp3-region reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                  <header>
                    <span className="gp3-region__n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="gp3-region__count"><strong>{list.length}</strong> {list.length === 1 ? 'country' : 'countries'}</span>
                  </header>
                  <span className="gp3-region__short" aria-hidden>{r.short}</span>
                  <h3>{r.name}</h3>
                  <p>{r.text}</p>
                  <ul className="gp3-region__countries">
                    {list.map((c) => <li key={c.id}><button onClick={() => { setActive(c.id); document.querySelector('.gp3-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}><i className={`gp-dot gp-dot--${markerGroup(c).toLowerCase()}`} aria-hidden />{c.name}</button></li>)}
                  </ul>
                  {highlight.length > 0 && (
                    <div className="gp3-region__proj">
                      <span>Selected projects</span>
                      <ul>{highlight.map((p) => <li key={p.slug}><Link to={`/projects#${p.slug}`}><strong>{p.title}</strong><em>{[p.clientName, p.country].filter(Boolean).join(' · ')}</em></Link></li>)}</ul>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHead eyebrow="Our branches" title="Four offices. One team." aside={<Link to="/contact" className="btn btn--primary">Contact us <Arrow /></Link>} />
          <div className="gp3-branches">
            {company.offices.map((o, i) => (
              <div key={o.country} className="gp3-branch reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="gp3-branch__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="gp3-branch__label">{o.label}</span>
                <h3>{o.country}</h3>
                {o.address && <p>{o.address}</p>}
                {o.address && <a href={'mapUrl' in o && o.mapUrl ? (o.mapUrl as string) : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`} target="_blank" rel="noopener noreferrer" className="gp3-branch__link">Open in Maps <Arrow /></a>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ProjectCard({ p }: { p: (typeof projects)[number] }) {
  const pics = p.photos && p.photos.length ? p.photos : p.photo ? [p.photo] : []
  const [cur, setCur] = useState(0)
  const where = [p.city, p.country].filter(Boolean).join(', ')
  return (
    <article id={p.slug} className="x-card reveal pc" style={{ padding: 0, scrollMarginTop: 100 }}>
      {pics.length > 0
        ? <div className="pc__media"><img src={pics[cur]} {...responsive(pics[cur])} alt={`${p.title} — photo ${cur + 1}`} loading="lazy" />{p.illustrative && <span className="illus-tag">Illustration</span>}{pics.length > 1 && <span className="pc__count">{cur + 1} / {pics.length}</span>}</div>
        : <div className="proj-band"><span>{p.industry}</span><b>{p.country}</b></div>}
      {pics.length > 1 && (
        <div className="pc__thumbs">{pics.map((src, i) => (
          <button key={src} type="button" className={i === cur ? 'is-on' : ''} onClick={() => setCur(i)} aria-label={`Show photo ${i + 1}`}><img src={src} alt="" loading="lazy" /></button>
        ))}</div>
      )}
      <div className="pc__body">
        <span className="eyebrow">{[p.clientVisible && p.clientName, p.period ?? p.year].filter(Boolean).join(' · ')}</span>
        <h2 className="h3"><Link to={`/projects/${p.slug}`} className="pc__title-link">{p.title}</Link></h2>
        <p>{p.summary}</p>
        <dl className="kv" style={{ gridTemplateColumns: '90px 1fr', fontSize: 13.5 }}>
          {where && <><dt>Location</dt><dd>{where}</dd></>}<dt>Sector</dt><dd>{p.industry}</dd><dt>Scope</dt><dd>{p.solution}</dd>
        </dl>
        <Link to={`/projects/${p.slug}`} className="text-link">View project <Arrow /></Link>
      </div>
    </article>
  )
}

/* ============================== PROJECT DETAIL ============================== */
export function ProjectDetail({ slug }: { slug: string }) {
  const p = projects.find((x) => x.slug === slug)!
  const pics = p.photos && p.photos.length ? p.photos : p.photo ? [p.photo] : []
  const [cur, setCur] = useState(0)
  const where = [p.city, p.country].filter(Boolean).join(', ')
  const others = projects.filter((x) => x.slug !== slug && (x.industry === p.industry || x.country === p.country)).slice(0, 3)
  const more = others.length ? others : projects.filter((x) => x.slug !== slug).slice(0, 3)
  return (
    <>
      <section className="pd-hero">
        <div className="container">
          <nav aria-label="Breadcrumb"><ol className="crumbs"><li><Link to="/">Home</Link></li><li><Link to="/projects">Projects</Link></li><li><span aria-current="page">{p.title}</span></li></ol></nav>
          <span className="eyebrow" style={{ color: 'var(--cyan)' }}>{[p.clientVisible && p.clientName, p.period ?? p.year].filter(Boolean).join(' · ')}</span>
          <h1 className="h1 pd-hero__title">{p.title}</h1>
          <p className="lead">{p.summary}</p>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container pd-grid">
          <div className="pd-gallery">
            {pics.length > 0 && <div className="pd-gallery__main media" style={{ ['--pd-bg' as string]: `url(${pics[cur]})` } as React.CSSProperties}><img src={pics[cur]} {...responsive(pics[cur], '(max-width: 960px) 100vw, 66vw')} alt={`${p.title} — photo ${cur + 1}`} /></div>}
            {pics.length > 1 && <div className="pc__thumbs">{pics.map((src, i) => (
              <button key={src} type="button" className={i === cur ? 'is-on' : ''} onClick={() => setCur(i)} aria-label={`Show photo ${i + 1}`}><img src={src} alt="" loading="lazy" /></button>
            ))}</div>}
          </div>
          <aside className="panel pd-facts">
            <h2 className="h3">Project facts</h2>
            <dl className="kv" style={{ gridTemplateColumns: '100px 1fr' }}>
              {p.clientVisible && p.clientName && <><dt>Client</dt><dd>{p.clientName}</dd></>}
              {where && <><dt>Location</dt><dd>{where}</dd></>}
              <dt>Sector</dt><dd>{p.industry}</dd>
              <dt>Scope</dt><dd>{p.solution}</dd>
              {(p.period ?? p.year) && <><dt>Year</dt><dd>{p.period ?? p.year}</dd></>}
              <dt>Status</dt><dd>{p.status}</dd>
            </dl>
            <Link to="/contact" className="btn btn--blue">Discuss a similar project <Arrow /></Link>
            <Link to="/projects" className="text-link">← All projects</Link>
          </aside>
        </div>
      </section>
      {more.length > 0 && (
        <section className="section section--soft">
          <div className="container" style={{ display: 'grid', gap: 28 }}>
            <SectionHead eyebrow="More projects" title="Related work." />
            <div className="grid grid-3">{more.map((x) => <ProjectCard key={x.slug} p={x} />)}</div>
          </div>
        </section>
      )}
      <CTASection />
    </>
  )
}

/* ============================== CAREERS ============================== */
export function Careers() {
  const [q, setQ] = useState('')
  const { jobs, loading } = useJobs()
  const list = jobs.filter((j) => !q || `${j.title} ${j.location} ${j.department}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHero image="CAREERS_HERO_01" eyebrow="Careers" crumbs={[{ label: 'Careers' }]}
        title={<>Build the future of <span className="accent">industrial automation.</span></>} lead="Join engineers and specialists who work where technology meets heavy industry." />
      <section className="section" style={{ paddingBottom: 'clamp(48px, 5vw, 72px)' }}>
        <div className="container split">
          <div className="reveal" style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}><span className="eyebrow">Culture</span><StatusBadge status="proposed" /></div>
            <h2 className="h2">Learn on real plants. Grow with real responsibility.</h2>
            <p className="lead">We value curiosity, technical rigour and teamwork — and we put safety first, on every site.</p>
            <ul className="perks">
              <li><span className="perks__icon"><Icon name="factory" /></span><div><strong>Real projects</strong><p>400+ projects in cement, energy, infrastructure, oil & gas and more — across 17 countries.</p></div></li>
              <li><span className="perks__icon"><Icon name="users" /></span><div><strong>Safety & training</strong><p>HSE team training and HSE awareness training for all employees.</p></div></li>
              <li><span className="perks__icon"><Icon name="globe" /></span><div><strong>Where we work</strong><p>Head office in Cairo, workshops in Tebbin and the Alexandria free zone, branches in Saudi Arabia, Libya and the UAE.</p></div></li>
            </ul>
            <p className="review-only muted" style={{ fontSize: 14 }}>Benefits and development programmes: to be provided by HR.</p>
          </div>
          <Img id="CAREERS_CULTURE_01" style={{ aspectRatio: '4/3' }} />
        </div>
      </section>
      <section className="section section--soft" id="openings" style={{ paddingTop: 'clamp(48px, 5vw, 72px)' }}>
        <div className="container">
          <SectionHead eyebrow="Open positions" title="Current openings." />
          {jobs.length > 3 && <div className="toolbar" role="search"><label className="sr-only" htmlFor="jq">Search jobs</label><input id="jq" placeholder="Search by title, location or department…" value={q} onChange={(e) => setQ(e.target.value)} /></div>}
          {loading ? <p className="muted">Loading current openings…</p> : jobs.length === 0 ? (
            <EmptyState icon="briefcase" title="No open positions right now"
              text="Approved vacancies will be listed here with full job details. You can still send us your CV below as an open application." />
          ) : (
            <div style={{ display: 'grid', gap: 14 }}>{list.map((j) => (
              <details key={j.slug} className="job-tab">
                <summary className="job-tab__head"><span className="job-tab__title"><strong className="h3" dir="auto">{j.title}</strong><span className="job-tab__meta" dir="auto">{[j.department, j.location, j.type].filter(Boolean).join(' · ')}</span></span><span className="job-tab__chev" aria-hidden>+</span></summary>
                <div className="job-tab__body">
                  <p dir="auto">{j.summary}</p>
                  <div className="grid grid-2"><div><h4>Responsibilities</h4><ul className="ticks">{j.responsibilities.map((r) => <li key={r} dir="auto">{r}</li>)}</ul></div><div><h4>Requirements</h4><ul className="ticks">{j.requirements.map((r) => <li key={r} dir="auto">{r}</li>)}</ul></div></div>
                  <div><button type="button" className="btn btn--blue" onClick={() => { window.dispatchEvent(new CustomEvent('apply-position', { detail: j.title })); document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }) }}>Apply for this role <Arrow /></button></div>
                </div>
              </details>
            ))}</div>
          )}
          <div style={{ marginTop: 40 }}><JobAlerts /></div>
        </div>
      </section>
      <section className="section" id="apply" aria-labelledby="apply-title">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="reveal" style={{ display: 'grid', gap: 18 }}>
            <span className="eyebrow">Apply</span>
            <h2 id="apply-title" className="h2">Send us your CV.</h2>
            <p className="lead">Apply for an open position, or send an open application. Attach your CV or résumé as a PDF or Word file.</p>
            <p className="muted" style={{ fontSize: 14 }}>Your CV is sent privately to our HR team and is not published on this website.</p>
            <p style={{ fontSize: 15, margin: 0 }}>Prefer email? Send your CV to <a href={`mailto:${company.contact.hrEmail}`} style={{ fontWeight: 600, color: 'var(--blue)' }}>{company.contact.hrEmail}</a></p>
          </div>
          <div className="panel"><ApplicationForm /></div>
        </div>
      </section>
      <CTASection title="Interested in joining us?" text="Questions about careers at ASEC? Get in touch with our team." />
    </>
  )
}

/* ============================== NEWS & INSIGHTS HUB ============================== */

/* ============================== CONTACT ============================== */
export function Contact() {
  const [tab, setTab] = useState<'general' | 'business'>('general')
  const c = company.contact
  return (
    <>
      <PageHero image="CONTACT_HERO_01" eyebrow="Contact" crumbs={[{ label: 'Contact' }]}
        title={<>Let’s engineer <span className="accent">what’s next.</span></>} lead="Tell us about your plant, project or question. Our team will route it to the right specialist." />
      <section className="section section--soft">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 40 }} data-contact-grid>
          <div className="panel">
            <div className="tabs" role="tablist" aria-label="Inquiry type" style={{ marginBottom: 28 }}>
              <button role="tab" aria-selected={tab === 'general'} onClick={() => setTab('general')}>General inquiry</button>
              <button role="tab" aria-selected={tab === 'business'} onClick={() => setTab('business')}>Business inquiry</button>
            </div>
            <div role="tabpanel"><ContactForm key={tab} variant={tab} /></div>
          </div>
          <aside style={{ display: 'grid', gap: 22, alignContent: 'start' }}>
            <div className="panel" style={{ display: 'grid', gap: 14 }}>
              <h2 className="h3">Contact details</h2>
              {c.email || c.phone || c.address ? (
                <dl className="kv" style={{ gridTemplateColumns: '90px 1fr' }}>
                  {c.email && <><dt>Email</dt><dd><a href={`mailto:${c.email}`}>{c.email}</a></dd></>}
                  {c.hrEmail && <><dt>Careers</dt><dd><a href={`mailto:${c.hrEmail}`}>{c.hrEmail}</a></dd></>}
                  {c.phone && <><dt>Phone</dt><dd><a href={`tel:${c.phoneHref}`}>{c.phone}</a></dd></>}
                  {c.website && <><dt>Web</dt><dd>{c.website}</dd></>}
                </dl>
              ) : <p className="muted">Office addresses, telephone numbers and email addresses will be published here once provided. <StatusBadge status="missing" /></p>}
            </div>
            <div className="panel" style={{ display: 'grid', gap: 14 }}>
              <h2 className="h3">Branches</h2>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 14 }}>
                {company.offices.map((o) => (
                  <li key={o.country}>
                    <strong>{o.country}</strong> <span className="muted">— {o.label}</span><br />
                    {o.address && <><span style={{ fontSize: 14.5 }}>{o.address}</span><br /></>}
                    {o.address && <a className="text-link" href={'mapUrl' in o && o.mapUrl ? o.mapUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`} target="_blank" rel="noopener noreferrer">Open in Google Maps <Arrow /></a>}
                  </li>
                ))}
              </ul>
              <Link to="/global-presence" className="text-link">View global presence <Arrow /></Link>
            </div>
          </aside>
        </div>
      </section>
      <section className="section section--tight" aria-labelledby="hq-title">
        <div className="container" style={{ display: 'grid', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gap: 10 }}>
              <span className="eyebrow">Head office — Cairo</span>
              <h2 id="hq-title" className="h2">Visit us in Maadi, Cairo.</h2>
              <p className="lead">{company.offices[0].address}</p>
              <p className="muted"><a href={`tel:${c.phoneHref}`}>{c.phone}</a> · <a href={`mailto:${c.email}`}>{c.email}</a></p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a className="btn btn--blue" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(HQ_MAP_QUERY)}`} target="_blank" rel="noopener noreferrer">Get directions <Arrow /></a>
            </div>
          </div>
          <HqMap />
        </div>
      </section>
    </>
  )
}

/* ============================== LEGAL ============================== */
function Legal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="section section--dark" style={{ paddingTop: 170, paddingBottom: 70 }}>
        <div className="container" style={{ display: 'grid', gap: 18 }}><span className="eyebrow">Legal</span><h1 className="h1">{title}</h1><p className="muted" style={{ color: 'rgba(255,255,255,.7)' }}>Last updated: November 2026</p></div>
      </section>
      <section className="section"><div className="container"><div className="prose">{children}</div></div></section>
    </>
  )
}
const Mail = () => <a href={`mailto:${company.contact.email}`}>{company.contact.email}</a>
export const Privacy = () => (
  <Legal title="Privacy Policy">
    <p>This policy explains how ASEC Automation (“ASEC”, “we”) handles personal information collected through this website.</p>
    <h2>Information we collect</h2>
    <ul>
      <li>Contact form: your name, company, email address, phone number, country, inquiry type and message.</li>
      <li>Job applications: your name, contact details, the position you apply for, your cover letter and your CV.</li>
      <li>Job alerts: your email address and the area of work you are interested in.</li>
    </ul>
    <p>We do not ask for sensitive personal information. Please do not include it in your messages or CV unless it is necessary.</p>
    <h2>How we use it</h2>
    <ul>
      <li>To respond to your inquiry and follow up on business opportunities you request.</li>
      <li>To assess job applications and contact candidates.</li>
      <li>To email you about job openings, if you signed up for job alerts.</li>
      <li>To keep a record of correspondence.</li>
      <li>We do not sell personal information.</li>
    </ul>
    <h2>Third-party processors</h2>
    <ul>
      <li>Cloudflare hosts this website and securely stores form submissions, including CVs, so that only our authorised staff can read them. It may also provide privacy-friendly visitor statistics that do not use cookies.</li>
      <li>FormSubmit delivers email copies of contact-form messages, job applications and job-alert sign-ups to our company mailboxes.</li>
      <li>Google provides the fonts and the embedded map on the Contact page.</li>
    </ul>
    <h2>Retention</h2>
    <p>We keep inquiries for as long as needed to handle them and maintain the business relationship. Job applications are kept for as long as they are needed for recruitment. Job-alert sign-ups are kept until you unsubscribe. Information that is no longer needed is deleted.</p>
    <h2>Your rights</h2>
    <p>You may request access to, correction or deletion of your personal data, or unsubscribe from job alerts, by contacting <Mail />.</p>
  </Legal>
)
export const Terms = () => (
  <Legal title="Terms of Use">
    <h2>Use of this website</h2>
    <p>The content of this website is provided for general information about {company.name.value} and its capabilities. It does not constitute an offer or engineering advice for any specific installation.</p>
    <h2>Intellectual property</h2>
    <p>Unless otherwise stated, content on this site is owned by {company.name.value}. Third-party trademarks belong to their respective owners and their display does not imply endorsement.</p>
    <h2>Accuracy</h2>
    <p>We take care to keep the information on this website accurate and up to date, but it may change without notice and is provided “as is”.</p>
    <h2>Liability</h2>
    <p>To the extent permitted by law, ASEC Automation is not liable for any loss arising from the use of this website or reliance on its content. Links to other websites are provided for convenience; we are not responsible for their content.</p>
    <h2>Governing law</h2>
    <p>These terms are governed by the laws of the Arab Republic of Egypt.</p>
    <h2>Contact</h2>
    <p>Questions about these terms can be sent to <Mail />.</p>
  </Legal>
)
export function Cookies() {
  return (
    <Legal title="Cookie Preferences">
      <p>This website does not set advertising cookies, and sets no cookies of its own.</p>
      <p>Visitor statistics, where used, are collected by Cloudflare Web Analytics, which does not use cookies.</p>
      <p>The Contact page shows an embedded Google Map of our Cairo head office. Google may set its own cookies when that map loads.</p>
      <p>Questions about cookies can be sent to <Mail />.</p>
    </Legal>
  )
}

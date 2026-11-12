/**
 * COMPANY INFORMATION
 * ----------------------------------------------------------------------------
 * Every field carries an approval status:
 *   confirmed — supplied/approved by ASEC and safe to publish
 *   proposed  — draft marketing copy, needs approval before launch
 *   missing   — information not yet supplied; an editable placeholder is shown
 *
 * Fields left empty ('') are NOT rendered publicly (e.g. phone, email,
 * address) — the site shows a neutral placeholder instead of inventing data.
 */
export type Status = 'confirmed' | 'proposed' | 'missing'

/** Official brand colours (from the supplied brand sheet) — confirmed. */
export const BRAND_COLORS = { navy: '#040F47', blue: '#1C75BC', red: '#C11718', greyLight: '#BCBEC0', greyDark: '#6D6E71' }

export const company = {
  name: { value: 'ASEC Automation', status: 'confirmed' as Status },
  /** Official brand tagline, from the supplied logo artwork. */
  officialTagline: { value: 'Innovating Industries, Powering Progress', status: 'confirmed' as Status },
  /** Website hero headline from the brief — proposed marketing copy. */
  tagline: { value: 'Engineering Intelligence. Automating Industry.', status: 'proposed' as Status },
  altTagline: { value: 'Driving Industrial Excellence Through Intelligent Automation.', status: 'proposed' as Status },
  shortDescription: {
    value: 'ASEC Automation (ASA), a member of the ASEC Holding family, delivers automation and electrical engineering to some of the world’s most demanding heavy industries.',
    status: 'confirmed' as Status,
  },
  // From the Company Profile 2025 (contact page).
  contact: {
    email: 'contact@asecautomation.com',
    hrEmail: 'careers@asecautomation.com',
    phone: '+20 106 564 8082',
    phoneHref: '+201065648082',
    address: '9 Street 286, El-Basatin Sharkeya, Maadi, Cairo 4234220, Egypt',
    website: 'www.asecautomation.com',
    status: 'confirmed' as Status,
  },
  offices: [
    { country: 'Egypt', label: 'Head office', address: '9 Street 286, El-Basatin Sharkeya, Maadi, Cairo 4234220, Egypt', mapUrl: 'https://share.google/eQS8scbe6vybANS2W' },
    { country: 'UAE', label: 'Branch', address: 'Al Jazeera Al Hamra, Ras Al Khaimah 31291, UAE' },
    { country: 'Saudi Arabia', label: 'Branch — ASA (Saudi)', address: 'Saudi Arabia — full address to be confirmed' },
    { country: 'Libya', label: 'Branch', address: 'Libya — full address to be confirmed' },
  ],
  /** Social profile URLs. The profile lists handles only — paste full URLs to show icons. */
  social: {
    linkedin: '',
    facebook: '',
    youtube: '',
    x: '',
  },
  socialHandles: 'LinkedIn: ASA-Automation · Facebook: @ASA-Automation · X/Twitter: @ASA_Automation',
  /**
   * Contact form delivery. This static edition has no server of its own, so
   * submissions must go to a form service (e.g. Formspree, Basin, Getform —
   * all have free tiers). Paste the endpoint URL here. While it is empty the
   * form validates input but clearly states that online submission is not
   * yet connected — it never shows a fake success message.
   */
  /** Contact form → emails contact@ via FormSubmit (activate once from the first email received). */
  formEndpoint: 'https://formsubmit.co/ajax/contact@asecautomation.com',
  /**
   * Careers applications with CV upload. Use a form service that accepts file
   * uploads and stores them privately (e.g. Basin, Getform or Formspree paid plan).
   * While empty, the form validates but states clearly that nothing was sent.
   */
  careersEndpoint: 'https://formsubmit.co/careers@asecautomation.com',
  /** WhatsApp number in international format, digits only (e.g. '201001234567'). Empty = button hidden. */
  whatsapp: '201065648082', // +20 106 564 8082 — digits only, used for the WhatsApp chat button
  /** Public site URL, used for canonical links and the sitemap. */
  /** Public web address. Change to 'https://www.asecautomation.com' when the domain is connected. */
  siteUrl: 'https://asec-website.sara-sabry.workers.dev',
  /**
   * Visitor tracking & Google.
   *  - cloudflareAnalyticsToken: Cloudflare → Analytics & Logs → Web Analytics → Add a site → copy the "token" from the snippet.
   *  - googleSiteVerification: Google Search Console → HTML tag method → copy the content="…" value.
   */
  cloudflareAnalyticsToken: '',
  /** Approved company profile PDF, placed in public/docs/ (e.g. '/docs/ASEC-Automation-Profile.pdf'). Empty = button hidden. */
  profilePdf: '/docs/asec-automation-company-profile-2025.pdf',
  /** Certificate scans (PDF or image) in public/docs/certificates/. Empty = card shows without a "View" link. */
  certificateFiles: {
    'ISO 9001': '',
    'ISO 14001': '',
    'ISO 45001': '',
    'Siemens System Integrator': '',
    'Schneider Electric Certified Panel Builder': '',
  } as Record<string, string>,
  googleSiteVerification: '',
}

/**
 * CONFIRMED COMPANY FACTS — from ASEC's own presentation slides
 * ("Who We Are — A Regional Pioneer Since 1997", 2026).
 */
export const facts = {
  status: 'confirmed' as Status,
  source: 'ASEC Automation presentation (2026) and Company Profile 2025',
  founded: 1997,
  holding: 'ASEC Holding',
  intro: [
    'ASEC Automation (ASA), a member of the ASEC Holding family, delivers automation and electrical engineering to some of the world’s most demanding heavy industries.',
    'For more than 25 years we have delivered quality projects from Mexico to the Philippines, while remaining a leader in the MENA region.',
  ],
  focus: ['Cement', 'Steel', 'Glass', 'Fertilizers', 'Chemicals'],
  focusExtra: 'plus Solar and wider infrastructure',
  stats: [
    { value: 25, suffix: '+', label: 'Years of expertise' },
    { value: 400, suffix: '+', label: 'Projects delivered' },
    { value: 17, suffix: '', label: 'Countries footprint' },
    { value: 500, suffix: '+', label: 'Employees' },
    { value: 4, suffix: '', label: 'Strategic business units' },
    { value: 4, suffix: '', label: 'Offices worldwide' },
  ],
  certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'BS OHSAS 18001', 'Siemens System Integrator', 'Schneider Panel Builder'],
  award: 'Siemens / Elsewedy Electric — Contractor of the Month',
  maintenanceTeam: 'around 250 qualified and experienced maintenance staff',
  vision: 'To be the first electrical contractor of choice, offering our clients sustainable growth by stimulating the positive impact of energy-saving technologies, renewable energy and remote solutions.',
  mission: 'To put our clients’ goals and needs at the centre of an integrated service and technology offering — not just electrical contracting.',
  milestones: [
    { year: '1997', title: 'Foundation', text: 'ASEC Automation (ASA) was established as a junior member of the ASEC Holding family, to pioneer the delivery of integrated electrical contracting services.' },
    { year: '2004', title: 'Reinforcement', text: 'Qalaa Holdings’ acquisition of ASEC Holding gave a reviving push to the Arab Swiss Engineering Company — and gave ASEC Automation a firm footing in a growing, competitive electrical contracting market.' },
    { year: 'Now', title: 'Sustainability', text: 'ASA has entered a maturity phase — recognising changes in the local and global industry, and quickly adapting its lines of business and services to sustain its 25-year record of expertise.' },
  ],
  businessUnits: [
    { title: 'EPC Contracting', icon: 'layers', text: 'Engineering, procurement, construction, training and post start-up — backed by over 25 years as an EPC contractor.', items: ['Engineering', 'Procurement', 'Construction', 'Training & post start-up'] },
    { title: 'Automation', icon: 'cpu', text: 'Full-package engineering and commissioning for industrial process automation.', items: ['Process automation', 'PLC programming', 'SCADA systems', 'Industrial networks'] },
    { title: 'Operation & Maintenance / FM', icon: 'activity', text: 'Long-term service agreements, overhauls, commissioning and testing, with a maintenance team of around 250 staff.', items: ['Long-term projects & service agreements', 'Overhauling projects', 'Equipment commissioning', 'Testing & measuring', 'Energy efficiency', 'Smart cities & digital FM'] },
    { title: 'Workshops', icon: 'factory', text: 'Panel assembly and motor rewinding workshops in Cairo and the Alexandria free zone.', items: ['Schneider- and Siemens-certified panel assembly', 'Motor rewinding & MV motor overhaul', 'EV charger assembly'] },
  ],
  // Business sectors (Company Profile 2025); details summarise projects listed in the profile.
  sectors: [
    { title: 'Industrial', icon: 'factory', detail: 'Cement, steel, glass, fertilizers and chemicals.' },
    { title: 'Oil & Gas', icon: 'flame', detail: 'Commissioning, DCS upgrades and integrated electrical works.' },
    { title: 'Petrochemical', icon: 'flask', detail: 'Control system upgrades and new MCC control systems.' },
    { title: 'Renewable Energy & Solar', icon: 'sun', detail: 'PV solar EPC — plants from 6 MW to 18 MW.' },
    { title: 'Water & Wastewater', icon: 'droplets', detail: 'MCCs, panel boards and SCADA for treatment plants and water stations.' },
    { title: 'Railway & Transportation', icon: 'train', detail: 'PLC and control panels for rail lines, metro and tunnels.' },
    { title: 'Residential & Commercial', icon: 'building', detail: 'Infrastructure, electrical and MEP works for major developments.' },
    { title: 'Data Centres', icon: 'server', detail: 'Electrical works for critical data centre facilities.' },
    { title: 'Geology & Mining', icon: 'mountain', detail: 'Control panels and junction boxes for mining operations.' },
  ],
  hse: ['HSE policy', 'HSE team training', 'HSE awareness training for all employees', 'Permit-to-work & risk assessments', 'HSE statistics', 'Internal audits'],
}

/** Show draft/placeholder markers to reviewers. Set to false for launch. */
export const REVIEW_MODE = true

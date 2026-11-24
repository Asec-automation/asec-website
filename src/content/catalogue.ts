import type { Status } from './company'

/* ============================================================================
   SOLUTIONS — proposed categories. Do not present as commercial offerings
   until confirmed. Toggle `enabled`, rename, or reorder freely.
   ========================================================================== */
export interface Solution { title: string; summary: string; tags: string[]; status: Status; enabled: boolean }
export const solutions: Solution[] = [
  { title: 'Distributed Control Systems', summary: 'Plant-wide control architectures for continuous processes, from engineering through commissioning.', tags: ['DCS', 'Architecture'], status: 'proposed', enabled: true },
  { title: 'PLC & SCADA Systems', summary: 'Controller logic, HMI graphics and supervisory monitoring for plant areas and utilities.', tags: ['PLC', 'HMI'], status: 'proposed', enabled: true },
  { title: 'Industrial Instrumentation', summary: 'Measurement selection, loop design and integration of field instruments.', tags: ['Field devices', 'Loops'], status: 'proposed', enabled: true },
  { title: 'Process Monitoring', summary: 'Trends, alarms and operating views that show the true state of the process.', tags: ['Trends', 'Alarms'], status: 'proposed', enabled: true },
  { title: 'Plant Performance Optimization', summary: 'Stabilisation and set-point optimisation built on sound regulatory control.', tags: ['Optimisation'], status: 'proposed', enabled: true },
  { title: 'Data Acquisition & Reporting', summary: 'Historians, shift reports and KPI dashboards from reliable plant data.', tags: ['Historian', 'KPIs'], status: 'proposed', enabled: true },
  { title: 'Predictive Analytics', summary: 'Models that anticipate process behaviour and support operator decisions.', tags: ['Models'], status: 'proposed', enabled: true },
  { title: 'Industrial AI Applications', summary: 'Applied machine learning for soft sensors and abnormal-condition detection.', tags: ['ML', 'R&D'], status: 'proposed', enabled: true },
  { title: 'Control System Modernization', summary: 'Phased migration from obsolete controllers and HMIs with minimal downtime.', tags: ['Migration'], status: 'proposed', enabled: true },
  { title: 'Energy Performance Monitoring', summary: 'Metering and analysis of electrical and thermal energy use by area.', tags: ['Energy'], status: 'proposed', enabled: true },
]

/* ============================================================================
   INDUSTRIES — Cement is the stated priority; others are proposed.
   ========================================================================== */
export interface Industry { slug: string; title: string; summary: string; image: string; status: Status }
// Industrial focus confirmed by ASEC: Cement, Steel, Glass, Fertilizers, Chemicals — plus Solar and wider infrastructure.
export const industries: Industry[] = [
  { slug: 'cement', title: 'Cement Industry', summary: 'Automation, process control and monitoring across the cement production chain — from quarry to dispatch.', image: 'INDUSTRY_CEMENT_01', status: 'confirmed' },
  { slug: 'steel-glass', title: 'Steel & Glass', summary: 'Automation and electrical engineering for steel and glass production.', image: 'INDUSTRY_MANUFACTURING_01', status: 'confirmed' },
  { slug: 'solar', title: 'Solar Energy', summary: 'PV solar EPC — design, construction and commissioning.', image: 'INDUSTRY_ENERGY_01', status: 'confirmed' },
  { slug: 'infrastructure', title: 'Infrastructure', summary: 'Electrical and automation works for wider infrastructure.', image: 'INDUSTRY_INFRASTRUCTURE_01', status: 'confirmed' },
  { slug: 'fertilizers-chemicals', title: 'Fertilizers & Chemicals', summary: 'Control and electrical systems for fertilizer and chemical plants.', image: 'INDUSTRY_PROCESS_01', status: 'confirmed' },
]

/* ============================================================================
   GLOBAL PRESENCE — the four storytelling countries. ALL UNPUBLISHED.
   A country's relationship is shown publicly only when `published: true`
   AND `relationship` is set to an approved category.
   ========================================================================== */
export type Relationship = 'Office' | 'Active project' | 'Completed project' | 'Client location' | 'Target market' | 'Other approved relationship' | 'Unconfirmed'
export interface Country {
  id: string; name: string; lat: number; lon: number; image: string
  relationship: Relationship; description: string; published: boolean
  /** Optional display label overriding the relationship category name. */
  label?: string
  /** Shown in the homepage storytelling panels. */
  featured?: boolean
}
export const countries: Country[] = [
  // From ASEC's Company Profile 2025 (branches, footprint map, project tables) and 2026 presentation.
  { id: 'egypt', name: 'Egypt', lat: 30.04, lon: 31.24, image: 'GLOBAL_EGYPT_01', relationship: 'Office', label: 'Head office & workshops', description: 'Head office in Maadi, Cairo, and ASEC’s panel-assembly and motor-rewinding workshops in Cairo and the Alexandria free zone. Most of the projects in ASEC’s portfolio are in Egypt.', published: true, featured: true },
  { id: 'saudi-arabia', name: 'Saudi Arabia', lat: 24.71, lon: 46.68, image: 'GLOBAL_SAUDI_01', relationship: 'Office', label: 'Branch — ASA (Saudi)', description: 'ASA (Saudi) branch — mega infrastructure works in Riyadh for the Royal Authority, including Green Riyadh and Diriyah.', published: true, featured: true },
  { id: 'philippines', name: 'Philippines', lat: 14.55, lon: 121.02, image: 'GLOBAL_PHILIPPINES_01', relationship: 'Completed project', label: 'Projects delivered', description: 'Cement projects, including the APO cement mill for CEMEX.', published: true, featured: true },
  { id: 'mexico', name: 'Mexico', lat: 19.43, lon: -99.13, image: 'GLOBAL_MEXICO_01', relationship: 'Completed project', label: 'Projects delivered', description: 'ASEC Automation has delivered quality projects from Mexico to the Philippines.', published: true, featured: true },
  { id: 'libya', name: 'Libya', lat: 32.89, lon: 13.19, image: 'GLOBAL_EGYPT_01', relationship: 'Office', label: 'Branch', description: 'ASEC Automation branch in Libya.', published: true },
  { id: 'uae', name: 'UAE', lat: 25.79, lon: 55.94, image: 'GLOBAL_UAE_01', relationship: 'Office', label: 'Branch', description: 'Branch in Al Jazeera Al Hamra, Ras Al Khaimah.', published: true },
  { id: 'honduras', name: 'Honduras', lat: 14.08, lon: -87.21, image: 'GLOBAL_HONDURAS_01', relationship: 'Completed project', description: 'Cement projects for Lafarge, including Piedras Azules and a PPC upgrade.', published: true },
  { id: 'jordan', name: 'Jordan', lat: 31.95, lon: 35.93, image: 'GLOBAL_JORDAN_01', relationship: 'Completed project', description: 'Cement projects for Lafarge at the Rashadiya and Fuheis plants.', published: true },
  { id: 'morocco', name: 'Morocco', lat: 33.89, lon: -5.55, image: 'GLOBAL_MOROCCO_01', relationship: 'Completed project', description: 'Cement project for Lafarge at Meknes Line 1.', published: true },
  { id: 'algeria', name: 'Algeria', lat: 35.6, lon: -0.27, image: 'GLOBAL_ALGERIA_01', relationship: 'Completed project', description: 'CCR and PCS upgrade at the LafargeHolcim Oggaz cement plant (2020).', published: true },
  { id: 'uganda', name: 'Uganda', lat: 0.35, lon: 32.58, image: 'GLOBAL_UGANDA_01', relationship: 'Completed project', description: 'PCS control system upgrade for LafargeHolcim’s Hima Plant Line 3 (2020).', published: true },
  { id: 'iraq', name: 'Iraq', lat: 33.31, lon: 44.36, image: 'GLOBAL_IRAQ_01', relationship: 'Other approved relationship', label: 'Footprint', description: 'Part of ASEC Automation’s footprint map.', published: true },
  { id: 'kenya', name: 'Kenya', lat: -1.29, lon: 36.82, image: 'GLOBAL_KENYA_01', relationship: 'Other approved relationship', label: 'Footprint', description: 'Part of ASEC Automation’s footprint map.', published: true },
  { id: 'tanzania', name: 'Tanzania', lat: -6.79, lon: 39.21, image: 'GLOBAL_TANZANIA_01', relationship: 'Other approved relationship', label: 'Footprint', description: 'Part of ASEC Automation’s footprint map.', published: true },
]

/* ============================================================================
   CONTENT COLLECTIONS — intentionally EMPTY. Add only approved records.
   Each page shows a designed empty state until entries exist.
   ========================================================================== */
export interface Project {
  slug: string; title: string; country: string; city?: string; industry: string; solution: string
  year?: number; status: 'Completed' | 'In progress'; summary: string; scope: string[]; technologies: string[]
  image: string; clientName?: string; clientVisible: boolean; featured: boolean
  /** Optional real photo (path in /public); otherwise the `image` slot is shown. */
  photo?: string
  /** CSS object-position for the photo crop, e.g. '70% 50%'. */
  photoFocus?: string
  /** True for AI-generated / illustrative images (shows an "Illustration" tag). */
  illustrative?: boolean
  /** Extra project photos (shown as thumbnails). */
  photos?: string[]
  /** Shown instead of year when a project spans years, e.g. '2024–2025'. */
  period?: string
}
/**
 * Selected projects from ASEC's Company Profile 2025 ("Previous projects — selected sample"
 * and "Projects samples"). Client names are shown because ASEC publishes them in its own profile.
 */
const P = (o: Partial<Project> & Pick<Project, 'slug' | 'title' | 'country' | 'industry' | 'solution' | 'summary' | 'image'>): Project =>
  ({ status: 'Completed', scope: [], technologies: [], clientVisible: true, featured: false, ...o })
const baseProjects: Project[] = [
  P({ slug: 'hima-line-3', title: 'Hima Plant Line 3 — PCS Upgrade', clientName: 'LafargeHolcim', country: 'Uganda', city: 'Hima', industry: 'Cement', solution: 'Control System Modernization', year: 2020, summary: 'Upgrading the PCS control system of the Hima cement plant, Line 3.', scope: ['PCS control system upgrade', 'Central control room'], technologies: ['PCS', 'SCADA'], image: 'INDUSTRY_CEMENT_01', photo: '/images/projects/hima-ccr.webp', photoFocus: '72% 50%', illustrative: true, featured: true }),
  P({ slug: 'oggaz-ccr-pcs', title: 'Oggaz Cement Plant — CCR & PCS Upgrade', clientName: 'LafargeHolcim', country: 'Algeria', city: 'Oggaz', industry: 'Cement', solution: 'Control System Modernization', year: 2020, summary: 'Central control room and PCS upgrade at the Oggaz cement plant.', scope: ['CCR upgrade', 'PCS upgrade'], technologies: ['PCS', 'CCR'], image: 'INDUSTRY_CEMENT_01', photo: '/images/projects/oggaz-ccr.webp', photoFocus: '68% 50%', illustrative: true, featured: true }),
  P({ slug: 'italcementi-egypt', title: 'Cement Lines — PCS Upgrades', clientName: 'Italcementi', country: 'Egypt', industry: 'Cement', solution: 'Control System Modernization', summary: 'PCS upgrade at Minya, with work on Tourah L1 & L2, Suez L1 & L2, Helwan L1 & L2 and Kattameya L1.', scope: ['Minya PCS upgrade', 'Tourah L1 & L2', 'Suez L1 & L2', 'Helwan L1 & L2', 'Kattameya L1'], technologies: ['PCS'], image: 'INDUSTRY_CEMENT_01' }),
  P({ slug: 'cemex-assiut', title: 'Assiut Cement Lines 1–3', clientName: 'CEMEX', country: 'Egypt', city: 'Assiut', industry: 'Cement', solution: 'Industrial Automation', summary: 'Work on Lines 1, 2 and 3 of the Assiut cement plant.', scope: ['Assiut L1, L2 & L3'], image: 'INDUSTRY_CEMENT_01' }),
  P({ slug: 'cemex-apo', title: 'APO Cement Mill', clientName: 'CEMEX', country: 'Philippines', industry: 'Cement', solution: 'Industrial Automation', summary: 'Cement mill project at the APO plant.', scope: ['APO cement mill'], image: 'INDUSTRY_CEMENT_01' }),
  P({ slug: 'flsmidth-egypt', title: 'NCC & Sinai Grey Cement Lines', clientName: 'FLSmidth', country: 'Egypt', industry: 'Cement', solution: 'Industrial Automation', summary: 'Work on NCC Lines 1 & 2 and Sinai grey cement Lines 1 & 2.', scope: ['NCC L1 & L2', 'Sinai grey Line 1 & Line 2'], image: 'INDUSTRY_CEMENT_01' }),
  P({ slug: 'lafarge-honduras', title: 'Piedras Azules & PPC Upgrade', clientName: 'Lafarge', country: 'Honduras', industry: 'Cement', solution: 'Control System Modernization', summary: 'Projects at Lafarge Piedras Azules and a PPC upgrade.', scope: ['Lafarge Piedras Azules', 'PPC upgrade'], image: 'INDUSTRY_CEMENT_01' }),
  P({ slug: 'lafarge-jordan', title: 'Rashadiya & Fuheis Cement Lines', clientName: 'Lafarge', country: 'Jordan', industry: 'Cement', solution: 'Industrial Automation', summary: 'Work on Rashadiya Lines 1 & 2 and Fuheis Lines 1 & 2.', scope: ['Rashadiya L1 & L2', 'Fuheis L1 & L2'], image: 'INDUSTRY_CEMENT_01' }),
  P({ slug: 'lafarge-meknes', title: 'Meknes Cement Line 1', clientName: 'Lafarge', country: 'Morocco', city: 'Meknes', industry: 'Cement', solution: 'Industrial Automation', summary: 'Project at the Meknes cement plant, Line 1.', scope: ['Meknes L1'], image: 'INDUSTRY_CEMENT_01' }),
  P({ slug: 'ezz-steel-csp', title: 'CSP Plant Modernization', clientName: 'Ezz Steel', country: 'Egypt', industry: 'Steel', solution: 'Electrical & Mechanical Installation', summary: 'Electro-mechanical installations for the CSP plant modernization project.', scope: ['Electro-mechanical installations'], image: 'INDUSTRY_MANUFACTURING_01', photo: '/images/projects/ezz-steel-ccr.webp', photoFocus: '70% 50%', illustrative: true, featured: true }),
  P({ slug: 'dina-farms-solar', title: 'Dina Farms Solar Plant — 6 MW', clientName: 'Dina Farms', country: 'Egypt', industry: 'Solar Energy', solution: 'PV Solar EPC', year: 2021, summary: '6 MW solar PV plant.', scope: ['6 MW PV plant'], image: 'INDUSTRY_ENERGY_01' }),
  P({ slug: 'taqa-nabq-solar', title: 'NABQ Solar Plant — 18 MW', clientName: 'TAQA', country: 'Egypt', city: 'Sharm El Sheikh', industry: 'Solar Energy', solution: 'PV Solar EPC', summary: '18 MW solar PV plant at NABQ, Sharm El Sheikh.', scope: ['18 MW PV plant'], image: 'INDUSTRY_ENERGY_01' }),
  P({ slug: 'taqa-ascom-solar', title: 'ASCOM Solar Plant — 7 MW', clientName: 'TAQA', country: 'Egypt', industry: 'Solar Energy', solution: 'PV Solar EPC', summary: '7 MW solar PV plant for ASCOM.', scope: ['7 MW PV plant'], image: 'INDUSTRY_ENERGY_01' }),
  P({ slug: 'thales-cairo-banha', title: 'Cairo–Banha Rail Line Modernization', clientName: 'Thales', country: 'Egypt', city: 'Delta', industry: 'Railway & Transportation', solution: 'PLC & Control Panels', year: 2021, summary: 'PLC and control panels for the modernization of the Cairo–Banha rail line.', scope: ['PLC panels', 'Control panels'], technologies: ['PLC'], image: 'EXPERTISE_PANELS_01' }),
  P({ slug: 'cairo-metro-line-2', title: 'Greater Cairo Metro Line 2 — Phase 2C', clientName: 'SPIE', country: 'Egypt', city: 'Cairo', industry: 'Railway & Transportation', solution: 'LV Panel Boards', year: 2003, summary: 'Low-voltage panel boards for the extension of Greater Cairo Metro Line 2, Phase 2C.', scope: ['LV panel boards'], image: 'EXPERTISE_PANELS_01' }),
  P({ slug: 'orascom-ncwwtp', title: 'NCWWTP Plant — MCCs, Panels & SCADA', clientName: 'Orascom Construction', country: 'Egypt', industry: 'Water & Wastewater', solution: 'PLC & SCADA', year: 2011, summary: 'MCCs, panel boards, SCADA and automation system for the NCWWTP plant.', scope: ['MCCs', 'Panel boards', 'SCADA & automation system'], technologies: ['SCADA', 'MCC'], image: 'EXPERTISE_PLC_SCADA_01' }),
  P({ slug: 'elsewedy-power-station', title: 'Power Station Electrical Erection', clientName: 'Elsewedy PSP', country: 'Egypt', industry: 'Power Generation', solution: 'Electrical Installation', year: 2017, summary: 'Power station electrical works with a large site team — 70 electricians, 60 fitters and 300 helpers.', scope: ['Electrical erection works'], image: 'INDUSTRY_INFRASTRUCTURE_01' }),
  P({ slug: 'taqa-oil-alexandria', title: 'Integrated Electrical Works — 40,000 m²', clientName: 'TAQA Oil Marketing', country: 'Egypt', city: 'Alexandria', industry: 'Oil & Gas', solution: 'Electrical Installation', year: 2021, summary: 'Fully integrated electrical works over an area of 40,000 square metres.', scope: ['Integrated electrical works'], image: 'INDUSTRY_PROCESS_01' }),
  P({ slug: 'samsung-beni-suef', title: 'Samsung Factory, Beni Suef', clientName: 'Samsung', country: 'Egypt', city: 'Beni Suef', industry: 'Industrial', solution: 'Electrical Installation', year: 2021, summary: 'Electrical and light-current works for all buildings, and erection of special process equipment.', scope: ['Electrical works', 'Light-current works', 'Process equipment erection'], image: 'INDUSTRY_INFRASTRUCTURE_01' }),
  P({ slug: 'jotun-10th-ramadan', title: 'Jotun Plant — Instrumentation & Erection', clientName: 'Jotun', country: 'Egypt', city: '10th of Ramadan', industry: 'Industrial', solution: 'Instrumentation', year: 2021, summary: 'Instrumentation and erection for phases 1 and 2.', scope: ['Instrumentation', 'Erection'], image: 'INDUSTRY_PROCESS_01' }),
]

export interface Partner { name: string; logo?: string; website?: string; category: 'Official partner' | 'Technology vendor' | 'Client' | 'Supplier' | 'Integration ecosystem'; description?: string }
export const partners: Partner[] = [
  { name: 'Siemens', category: 'Official partner', description: 'Siemens System Integrator', logo: 'PARTNER_SIEMENS' },
  { name: 'Schneider Electric', category: 'Official partner', description: 'Schneider Electric Certified Panel Builder', logo: 'PARTNER_SCHNEIDER' },
]

/** Real project photos from ASEC presentation slides (small originals — send larger files to improve). */
export const projectPhotos = [
  { src: '/images/gallery/project-commissioning-cement.webp', alt: 'Engineers commissioning a cement plant control system' },
  { src: '/images/gallery/project-modern-ccr.webp', alt: 'Modern central control room with operators and process screens' },
  { src: '/images/gallery/project-steel-structure.webp', alt: 'Steel structure with cable routing on a plant site' },
  { src: '/images/gallery/project-cement-site-trench.webp', alt: 'Cable trench on a plant site, with a cement plant in the distance' },
  { src: '/images/gallery/project-conveyor-gallery.webp', alt: 'Conveyor gallery under construction' },
  { src: '/images/gallery/project-cable-trays.webp', alt: 'Multi-level cable tray installation' },
  { src: '/images/gallery/project-panel-interior.webp', alt: 'Drive and control panel interior' },
  { src: '/images/gallery/project-inverter-room.webp', alt: 'Inverter / drive cabinets in an electrical room' },
  { src: '/images/gallery/project-cable-routing.webp', alt: 'Cable trays routed along a plant building' },
]
export const workshopPhotos = [
  { src: '/images/gallery/workshop-building-real.webp', alt: 'ASEC Automation Workshop Building', icon: 'building' },
  { src: '/images/gallery/panel-floor-2.webp', alt: 'Panel Workshop Floor with Switchboards', icon: 'grid' },
  { src: '/images/gallery/switchboard-assembly-2.webp', alt: 'Switchboards Under Assembly', icon: 'zap' },
  { src: '/images/gallery/motor-service-2.webp', alt: 'Motor Service Workshop', icon: 'motor' },
  { src: '/images/gallery/motor-equipment-2.webp', alt: 'Motor Workshop Equipment', icon: 'gear' },
]


export interface Job { slug: string; title: string; location: string; type: string; department: string; summary: string; responsibilities: string[]; requirements: string[]; applyEmail?: string }
export const jobs: Job[] = []

export interface Leader { name: string; title: string; bio: string; image: string; linkedin?: string }
export const leadership: Leader[] = []

/* ============================================================================
   DRAFT VALUES / NARRATIVE (pending approval)
   ========================================================================== */
export const values = [
  { title: 'Engineering Excellence', text: 'Rigour in design, testing and documentation.' },
  { title: 'Innovation', text: 'Applying new technology where it creates real value.' },
  { title: 'Reliability', text: 'Systems and commitments that hold up in operation.' },
  { title: 'Integrity', text: 'Honest advice, transparent delivery.' },
  { title: 'Collaboration', text: 'Working as one team with clients and partners.' },
  { title: 'Continuous Improvement', text: 'Learning from every project and every plant.' },
]

export const sustainabilityThemes = [
  { title: 'Energy efficiency', icon: 'zap', text: 'Visibility of where energy is used is the first step toward using less of it.' },
  { title: 'Operational optimisation', icon: 'gauge', text: 'Stable processes typically run with less specific fuel and power than unstable ones.' },
  { title: 'Reduced resource waste', icon: 'recycle', text: 'Better control can reduce off-spec production, rework and material losses.' },
  { title: 'Solar energy EPC', icon: 'sun', text: 'ASEC Automation is an EPC contractor in solar energy, delivering PV plants tailored to each client.' },
  { title: 'Energy monitoring', icon: 'activity', text: 'Metering and dashboards that attribute consumption to areas and equipment.' },
  { title: 'Industrial modernisation', icon: 'refresh', text: 'Upgrading obsolete control equipment can improve reliability and efficiency.' },
]

// Previous project list kept for reference only (not shown). Projects now come from my-projects.ts.
void baseProjects
import { myProjects } from './my-projects'
export const projects: Project[] = myProjects

/* ============================================================================
   CLIENTS & PARTNERS — names only (from ASEC's Company Profile 2025,
   Prequalification profile and 2026 presentations). Logos are not reproduced.
   ========================================================================== */
export const clientGroups: { sector: string; icon: string; names: string[] }[] = [
  { sector: 'Cement', icon: 'factory', names: ['LafargeHolcim', 'Lafarge', 'Holcim Philippines', 'CEMEX', 'Heidelberg Materials', 'Italcementi', 'Titan Cement', 'Fives FCB', 'FLSmidth', 'CRH Philippines', 'Cementos Fortaleza', 'Amreyah Cement (Cimpor)', 'Jordan Cement', 'Arabian Cement', 'National Cement Company', 'Sinai Grey Cement', 'Sinai White Cement', 'El-Sewedy Cement', 'Wadi El-Nile Cement', 'Masr Beni Suef Cement', 'Qena Cement', 'South Valley Cement', 'Saida Cement', 'Zahana Cement', 'Groupe GICA', 'Benghazi Cement', 'Atbara Cement', 'Al-Takamol Cement', 'Union Cement', 'QNCC'] },
  { sector: 'Oil, Gas & Petrochemical', icon: 'flame', names: ['ENPPI', 'TAQA Arabia', 'TAQA Petroleum', 'Petrojet', 'Petroleum Pipelines Company', 'ANRPC', 'ECHEM', 'Egyptian Petrochemicals Holding Co.', 'Air Liquide', 'Nile Valley Gas', 'REPCO Gas', 'Engineering Gulf Suez', 'AKFEL'] },
  { sector: 'Industrial & Manufacturing', icon: 'gear', names: ['Samsung', 'Jotun', 'Saint-Gobain', 'Sphinx Glass', 'Ezz Steel', 'ARCOSTEEL', 'Ferkeem Fertilizers & Chemicals', 'Aswan Fertilizers & Chemicals', 'Alexandria Carbon Black', 'Birla Carbon', 'Canal Sugar', 'Egyptian Black Sand Company'] },
  { sector: 'Power & Energy', icon: 'zap', names: ['GE Vernova', 'Elsewedy Electric', 'TAQA Power', 'Ansaldo', 'Grid Solutions', 'Alstom', 'Dina Farms'] },
  { sector: 'Real Estate & Infrastructure', icon: 'building', names: ['Royal Authority (KSA)', 'NEOM', 'Emaar Misr', 'Madinet Masr', 'Orascom Development', 'SODIC', 'Palm Hills Developments', 'Tower Developments', 'Misr Italia', 'Al Ahly Sabbour', 'Larz Development', 'Mahgoub', 'Central Agency for Reconstruction', 'Administrative Capital Environment Services'] },
  { sector: 'Construction & Contracting', icon: 'layers', names: ['Orascom Construction', 'Hassan Allam', 'Redcon Construction', 'Arab Contractors', 'Consolidated Contractors Company (CCC)', 'Dar Al Benaa', 'Delta Block'] },
  { sector: 'Water, Transport & Public Sector', icon: 'droplets', names: ['TAQA Water', 'ORASqualia', 'Thales', 'Egyptian National Railways', 'Cairo Metro', 'EgyptAir', 'Cairo Airport', 'October Dry Port', 'Ministry of Communications & IT'] },
  { sector: 'Healthcare & Commercial', icon: 'users', names: ['Cleopatra Hospitals Group', 'Global Medical City', 'Egyptian Health Authority', 'EFS Facility Services', 'Banque Misr', 'Al Ahly SC', 'McDonald’s Egypt'] },
]

export const mainPartners = ['Siemens', 'Schneider Electric', 'ABB', 'Rockwell Automation', 'Mitsubishi Electric', 'Elsewedy Electric', 'Arab Contractors', 'Nidec', 'thyssenkrupp', 'Sinoma (CBMI)', 'TAQA Arabia', 'EFS Facility Services']
export const strategicSuppliers = ['Elsewedy Electric', 'Electro Cable Egypt', 'MEMECO', '2M Electric Group', 'EGYTRAFO']

/** Industries page tiles (from ASEC's industrial focus: cement, steel, glass, fertilizers, chemicals, solar, infrastructure). */
export const industryTiles = [
  { title: 'Cement & Building Materials', icon: 'boxes', img: '/images/industries/tiles/cement.webp', to: '/projects', text: 'Process control and automation from quarry to dispatch.' },
  { title: 'Steel & Metals', icon: 'beam', img: '/images/industries/tiles/steel.webp', to: '/projects', text: 'Electrical and automation works for steel production.' },
  { title: 'Glass Manufacturing', icon: 'copy', img: '/images/industries/tiles/glass.webp', to: '/projects', text: 'Control and electrical systems for glass plants.' },
  { title: 'Fertilizers & Chemicals', icon: 'flask', img: '/images/industries/tiles/fertilizers.webp', to: '/projects', text: 'New control systems and MCCs for process plants.' },
  { title: 'Solar Energy', icon: 'sun', img: '/images/industries/tiles/solar.webp', to: '/projects', text: 'PV solar EPC — design, construction and commissioning.' },
  { title: 'Infrastructure', icon: 'bridge', img: '/images/industries/tiles/infrastructure.webp', to: '/projects', text: 'Electrical infrastructure for cities, utilities and water.' },
]

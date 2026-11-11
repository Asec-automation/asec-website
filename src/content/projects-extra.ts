import type { Project } from './catalogue'

/**
 * Additional projects from ASEC's own documents (Company Profile 2025, Infrastructure
 * Services 2026, FM Service 2026, Solar profile). Contract values are deliberately
 * not published. Client names appear because ASEC lists them in its own material.
 */
type Row = [slug: string, title: string, client: string, country: string, city: string, industry: string, solution: string, summary: string, year?: number, ongoing?: boolean]

const rows: Row[] = [
  // ---- Infrastructure (Infrastructure Services 2026) ----
  ['green-riyadh', 'Green Riyadh — Mega Infrastructure', 'Royal Authority', 'Saudi Arabia', 'Riyadh', 'Infrastructure', 'Electrical Infrastructure', 'Mega infrastructure works in Riyadh as general contractor, for the Royal Authority’s Green Riyadh programme.', 2025, true],
  ['diriyah', 'Diriyah — Mega Infrastructure', 'Royal Authority', 'Saudi Arabia', 'Riyadh', 'Infrastructure', 'Electrical Infrastructure', 'Mega infrastructure works as general contractor in historic Diriyah, Riyadh, for the Royal Authority.', 2025, true],
  ['sarai-compound', 'Sarai Compound — Mega Infrastructure', 'Madinet Masr', 'Egypt', 'New Cairo', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure for Madinet Masr’s Sarai compound in New Cairo, including panels and transformers.', 2024, true],
  ['cavana-compound', 'CAVANA Compound — Infrastructure', 'Madinet Masr', 'Egypt', 'New Cairo', 'Infrastructure', 'Electrical Infrastructure', 'Panels, transformers and the full electrical network for the CAVANA compound in New Cairo, for Madinet Masr.', 2024, true],
  ['zahw-compound', 'Zahw Compound — Infrastructure', 'Madinet Masr', 'Egypt', 'Assiut', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure, panels and transformers for Madinet Masr’s Zahw compound in Assiut.', 2025, true],
  ['north-bay-gouna', 'North Bay — Infrastructure', 'Orascom Development', 'Egypt', 'El Gouna', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure with panels and transformers for Orascom Development’s North Bay in El Gouna.', 2024, true],
  ['kamaran-gouna', 'Kamaran K1–K6 — Infrastructure', 'Orascom Development', 'Egypt', 'El Gouna', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure for the Kamaran K1–K6 phases in El Gouna, for Orascom Development.', 2024, true],
  ['fanadir-seafront', 'Fanadir Seafront — Infrastructure', 'Orascom Development', 'Egypt', 'El Gouna', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure for the Fanadir Seafront development on El Gouna’s coast, for Orascom Development.', 2025],
  ['sabina-miramar', 'Sabina & Miramar Sheraton — Infrastructure', 'Orascom Development', 'Egypt', 'El Gouna', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure for the Sabina and Miramar Sheraton areas of El Gouna, for Orascom Development.', 2025],
  ['tuban-gouna', 'Tuban — Infrastructure', 'Orascom Development', 'Egypt', 'El Gouna', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure for the Tuban development in El Gouna, for Orascom Development.', 2026, true],
  ['fanadir-shore', 'Fanadir Shore — Infrastructure', 'Orascom Development', 'Egypt', 'El Gouna', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure for the Fanadir Shore development in El Gouna, for Orascom Development.', 2026, true],
  ['o-west-hillside', 'O West Hillside — Infrastructure', 'Orascom Development', 'Egypt', '6th of October', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure for the Hillside phase of O West, 6th of October, for Orascom Development.', 2025],
  ['o-west-clubyard', 'O West ClubYard — Infrastructure', 'Orascom Development', 'Egypt', '6th of October', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure for the ClubYard phase of O West, 6th of October, for Orascom Development.', 2025, true],
  ['sodic-east', 'SODIC East — Infrastructure', 'SODIC', 'Egypt', 'El Sherouk', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure for SODIC East in El Sherouk.', 2024, true],
  ['palm-hills-px', 'PX — Landscape Lighting', 'Palm Hills Developments', 'Egypt', '6th of October', 'Infrastructure', 'Electrical Infrastructure', 'Landscape lighting works.', 2026],
  ['tower-bay-1', 'Tower Bay Phase 1 — Infrastructure', 'Tower Developments', 'Egypt', 'Port Said', 'Infrastructure', 'Electrical Infrastructure', 'Electrical and light-current infrastructure network.', 2021],
  ['tower-bay-2', 'Tower Bay Phase 2 — Infrastructure', 'Tower Developments', 'Egypt', 'Port Said', 'Infrastructure', 'Electrical Infrastructure', 'Electrical infrastructure for Phase 2 of Tower Bay in Port Said, for Tower Developments.', 2024, true],
  ['al-ahly-club', 'Al Ahly Club — Electromechanical Works', 'Dar Al Benaa', 'Egypt', 'Cairo', 'Infrastructure', 'Electrical Installation', 'Electromechanical works including a 1,000-car parking garage.', 2021],
  ['haya-karima', 'Hayah Karima — Infrastructure Networks', 'Central Agency for Reconstruction', 'Egypt', 'Damietta & El Beheira', 'Infrastructure', 'Electrical Infrastructure', 'Infrastructure network development works (two phases).', 2021],
  ['beni-suef-heavy-industries', 'Beni Suef Heavy Industries Zone — Infrastructure', 'Beni Suef Heavy Industries Investors Association', 'Egypt', 'Beni Suef', 'Infrastructure', 'Electrical Infrastructure', 'Infrastructure network as general contractor.', 2023, true],
  // ---- Facility management / O&M (FM Service 2026) ----
  ['fm-mivida', 'Mivida — O&M MEP', 'Emaar Misr', 'Egypt', 'New Cairo', 'Facility Management', 'Operation & Maintenance', 'Operation and maintenance of MEP systems: fire alarm, lighting, firefighting, CCTV and more.', 2024, true],
  ['fm-uptown', 'Uptown Cairo — O&M MEP', 'Emaar Misr', 'Egypt', 'Mokattam', 'Facility Management', 'Operation & Maintenance', 'Operation and maintenance of MEP systems across Uptown Cairo in Mokattam, for Emaar Misr.', 2026, true],
  ['fm-o-west', 'O West — O&M MEP', 'Orascom Development', 'Egypt', '6th of October', 'Facility Management', 'Operation & Maintenance', 'MEP operation and maintenance for the O West community in 6th of October, for Orascom Development.', 2026, true],
  ['fm-kai-sokhna', 'Kai El Sokhna — O&M MEP', 'Misr Italia', 'Egypt', 'El Sokhna', 'Facility Management', 'Operation & Maintenance', 'MEP operation and maintenance for the Kai El Sokhna resort, for Misr Italia.', 2025, true],
  ['fm-central-bus-station', 'Central Bus Station — O&M MEP', 'Administrative Capital Environment Services', 'Egypt', 'New Capital', 'Facility Management', 'Operation & Maintenance', 'MEP operation and maintenance for the New Administrative Capital’s Central Bus Station.', 2026, true],
  ['fm-october-dry-port', 'October Dry Port — O&M MEP', 'Elsewedy', 'Egypt', '6th of October', 'Facility Management', 'Operation & Maintenance', 'MEP operation and maintenance for the October Dry Port logistics hub, for Elsewedy.', 2025, true],
  ['fm-20-west', '20 West Mall — O&M MEP', 'Mahgoub', 'Egypt', '6th of October', 'Facility Management', 'Operation & Maintenance', 'MEP operation and maintenance for the 20 West shopping mall in 6th of October.', 2024, true],
  ['fm-arkadia', 'Arkadia Mall — O&M MEP', 'Al Ahly Sabbour', 'Egypt', 'Cairo', 'Facility Management', 'Operation & Maintenance', 'MEP operation and maintenance for Arkadia Mall in Cairo, for Al Ahly Sabbour.', 2026, true],
  ['fm-kov', 'KOV Mall — O&M MEP', 'Larz Development', 'Egypt', 'New Cairo', 'Facility Management', 'Operation & Maintenance', 'MEP operation and maintenance for KOV Mall in New Cairo, for Larz Development.', 2026, true],
  ['fm-cleopatra-hospitals', 'Cleopatra Group Hospitals — O&M MEP', 'Cleopatra Hospitals Group', 'Egypt', 'Cairo & Giza', 'Healthcare', 'Operation & Maintenance', 'Operation and maintenance for Nile Badrawi, El Sherouk and Heaven hospitals.', 2021, true],
  ['fm-al-azhar-hospital', 'Al Azhar Hospital — O&M MEP', 'Global Medical City', 'Egypt', 'Nasr City', 'Healthcare', 'Operation & Maintenance', 'MEP operation and maintenance for Al Azhar Hospital in Nasr City, for Global Medical City.', 2026, true],
  ['fm-new-capital-hospitals', 'El Yasmine & El Narges Hospitals — O&M MEP', 'New Capital hospitals', 'Egypt', 'New Capital', 'Healthcare', 'Operation & Maintenance', 'MEP operation and maintenance for El Yasmine and El Narges hospitals in the New Administrative Capital.', 2025, true],
  ['fm-port-said-hospitals', 'Port Said Hospitals — O&M MEP', 'Egyptian Health Authority', 'Egypt', 'Port Said', 'Healthcare', 'Operation & Maintenance', 'O&M for El Mabarah, El Tadamon, El Shefa and El Hayah hospitals.', 2026, true],
  // ---- Oil & gas, petrochemical, fertilizers ----
  ['eni-zohr', 'Zohr — Commissioning & Compressor Upgrade', 'ENI', 'Egypt', 'Zohr', 'Oil & Gas', 'Commissioning', 'Atlas Copco compressor upgrade, plus commissioning and engineering technical support.'],
  ['bp-wnd', 'West Nile Delta — Commissioning Support', 'bp', 'Egypt', 'West Nile Delta', 'Oil & Gas', 'Commissioning', 'Commissioning and engineering technical support.'],
  ['air-liquide-asu', 'Air Separation Units — DCS Upgrade', 'Air Liquide', 'Egypt', '', 'Oil & Gas', 'Control System Modernization', 'DCS upgrade for air separation units; PLC and control system modifications at TCI Sanmar, Port Said.'],
  ['nile-valley-gas-scada', 'Beni Suef Gas Network — SCADA', 'Nile Valley Gas Company', 'Egypt', 'Beni Suef', 'Oil & Gas', 'PLC & SCADA', 'SCADA system for the Beni Suef gas network.'],
  ['akfel-assiut-prms', 'Assiut PRMS & Odorant Plant — Automation', 'AKFEL', 'Egypt', 'Assiut', 'Oil & Gas', 'PLC & SCADA', 'Automation system for the Assiut PRMS and odorant plant.'],
  ['new-giza-prms', 'New Giza PRMS — Automation System', 'Engineering Gulf Suez Company', 'Egypt', 'Giza', 'Oil & Gas', 'PLC & SCADA', 'PRMS automation system.'],
  ['repco-damietta', 'Damietta PRMS — HMI Replacement', 'REPCO Gas', 'Egypt', 'Damietta', 'Oil & Gas', 'PLC & SCADA', 'Replacement of the HMI system for the Damietta PRMS.'],
  ['echem-vcm', 'VCM Refrigeration Compression — Control Upgrade', 'Egyptian Petrochemicals Holding Co.', 'Egypt', '', 'Petrochemical', 'Control System Modernization', 'Upgrade of the refrigeration-compression control system in the VCM plant.'],
  ['ferkeem-npk', 'NPK Projects — Sadat & Abu Zaabal', 'Ferkeem Fertilizers & Chemicals', 'Egypt', 'Sadat & Abu Zaabal', 'Fertilizers & Chemicals', 'Industrial Automation', 'NPK projects at the Sadat and Abu Zaabal plants.'],
  ['aswan-npk-mcc', 'NPK Plant — New Control Systems & MCC', 'Aswan Fertilizers & Chemicals', 'Egypt', 'Aswan', 'Fertilizers & Chemicals', 'Industrial Automation', 'New control systems for the new NPK MCC.'],
  // ---- Water, power, transport, industrial ----
  ['taqa-water-stations', 'Water Stations — Electrical & Automation', 'TAQA Water', 'Egypt', 'Soma Bay, North Coast & Ain El Sokhna', 'Water & Wastewater', 'PLC & SCADA', 'Electrical and automation for the Soma Bay, Mountain View and La Vista water stations.'],
  ['new-cairo-wwtp', 'New Cairo WWTP — MCC, Panels & Process Control', 'Delta Block', 'Egypt', 'New Cairo', 'Water & Wastewater', 'PLC & SCADA', 'MCC and panels package with process control system.'],
  ['alstom-komombo', 'El Tawisa & Ballana Stations — Electrical Package', 'Alstom', 'Egypt', 'Kom Ombo', 'Water & Wastewater', 'Electrical Installation', 'Electrical package for two pumping stations.'],
  ['ansaldo-500kv', '6th of October 500 kV — AC/DC Panels', 'Ansaldo', 'Egypt', '6th of October', 'Power Generation', 'LV Panel Boards', 'AC/DC panels for the 500 kV substation.'],
  ['grid-solutions-suez', 'Suez Extension 500 kV — AC/DC Panels', 'Grid Solutions', 'Egypt', 'Suez', 'Power Generation', 'LV Panel Boards', 'AC/DC panels for the Suez 500 kV extension.'],
  ['komombo-control', 'Kom Ombo — Control Panels & Systems', 'Arab Contractors', 'Egypt', 'Kom Ombo', 'Power Generation', 'PLC & Control Panels', 'Control panels and control systems for power generation.'],
  ['mcit-data-center', 'MCIT Data Center — Electrical Works', 'Schneider Electric', 'Egypt', 'Smart Village', 'Data Centres', 'Electrical Installation', 'Electrical works for the Ministry of Communications and IT data center.'],
  ['third-of-july-tunnels', '3rd of July Tunnels — PLC & Control Panels', 'Schneider Electric', 'Egypt', 'Port Said', 'Railway & Transportation', 'PLC & Control Panels', 'Completion of PLC and control panels.', 2018],
  ['egyptair-gsb', 'EgyptAir Ground Services Building — LV Panels', 'EgyptAir', 'Egypt', 'Cairo', 'Railway & Transportation', 'LV Panel Boards', 'LV panels for the ground-servicing building.'],
  ['new-alamein-mcc', 'New Alamein City — MCC Panels', 'Red Sea Construction & Development', 'Egypt', 'New Alamein', 'Industrial', 'LV Panel Boards', 'MCC panels.', 2021],
  ['ebsc-panels', 'Egyptian Black Sand Company — Panels', 'Egyptian Black Sand Company', 'Egypt', 'Kafr El Sheikh', 'Geology & Mining', 'LV Panel Boards', 'Local control panels and junction boxes.', 2021],
  ['canal-sugar', 'Canal Sugar Plant', 'Canal Sugar Company', 'Egypt', '', 'Industrial', 'Electrical & Mechanical Installation', 'Civil, electrical and mechanical works for the sugar plant.', 2020],
  ['arcosteel-trays', 'ARCOSTEEL — Cable Tray Installation', 'ARCOSTEEL', 'Egypt', '', 'Steel', 'Electrical Installation', 'Supply and installation of cable trays.'],
  ['el-minya-pv', 'El-Minya PV Plant — 7 MWp', 'Not disclosed', 'Egypt', 'El-Minya', 'Solar Energy', 'PV Solar EPC', '7 MWp DC solar PV plant.'],
]

export const extraProjects: Project[] = rows.map(([slug, title, client, country, city, industry, solution, summary, year, ongoing]) => ({
  slug, title, country, city: city || undefined, industry, solution, summary, year,
  status: ongoing ? 'In progress' : 'Completed', scope: [], technologies: [], image: 'INDUSTRY_INFRASTRUCTURE_01',
  clientName: client === 'Not disclosed' ? undefined : client, clientVisible: client !== 'Not disclosed', featured: false,
}))

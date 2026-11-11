import type { Status } from './company'

/**
 * EXPERTISE / SERVICES — proposed website categories (all status: proposed).
 * Copy describes capability areas in general engineering terms and does not
 * claim specific installed systems. Edit freely; set `enabled: false` to hide.
 */
export interface Service {
  slug: string
  title: string
  icon: string
  image: string
  summary: string
  overview: string
  challenges: string[]
  capabilities: string[]
  approach: { title: string; text: string }[]
  technologies: string[]
  benefits: string[]
  industries: string[]
  status: Status
  enabled: boolean
  /** Optional photo gallery (files in public/images/gallery). */
  gallery?: { src: string; alt: string }[]
  /** Optional equipment cards, each with its own image slot. */
  toolCards?: { title: string; text: string; image: string }[]
  /** Optional list of software / equipment shown as chips. */
  tools?: { title: string; items: string[] }
}


const approach = [
  { title: 'Assess', text: 'Site survey, review of existing control architecture, drawings and operating practice.' },
  { title: 'Engineer', text: 'Functional specification, control philosophy, hardware and network design.' },
  { title: 'Implement', text: 'Configuration, panel build or integration, factory and site acceptance testing.' },
  { title: 'Support', text: 'Commissioning, operator training, documentation and lifecycle support.' },
]

export const services: Service[] = [
  {
    slug: 'industrial-automation',
    title: 'Industrial Automation',
    icon: 'cpu',
    image: 'EXPERTISE_AUTOMATION_01',
    summary: 'Automation architecture, control and instrumentation integration for continuous and batch processes.',
    overview: 'ASEC Automation has solid experience in automation process control engineering, commissioning and start-up. Industrial automation brings plant equipment, instrumentation and operators into one coherent control architecture. Work in this area spans the layers of a plant — from field devices and drives, through PLC and DCS controllers, to supervisory systems and plant networks — with the aim of safe, repeatable and observable operation.',
    challenges: ['Ageing or mixed-vendor control systems that are hard to maintain', 'Limited visibility of equipment status across plant areas', 'Manual interventions that create variability between shifts', 'Fragmented documentation and undocumented changes'],
    capabilities: ['Control architecture and network design', 'PLC / DCS configuration and integration', 'Instrumentation and drive integration', 'Interlocks, sequences and alarm philosophy', 'Factory and site acceptance testing', 'Commissioning and operator training'],
    approach,
    technologies: ['PLC', 'DCS', 'HMI / SCADA', 'Industrial Ethernet', 'Fieldbus', 'Variable-speed drives'],
    benefits: ['More consistent operation', 'Faster fault diagnosis', 'A maintainable, documented control system'],
    industries: ['cement', 'steel-glass', 'fertilizers-chemicals'],
    status: 'confirmed', enabled: true,
  },
  {
    slug: 'process-control',
    title: 'Process Control & Optimization',
    icon: 'gauge',
    image: 'EXPERTISE_PROCESS_01',
    summary: 'Control strategies, loop tuning and stabilisation to keep processes on target.',
    overview: 'Process control focuses on keeping key variables — temperatures, pressures, flows and levels — close to their targets despite disturbances. Stable processes are the foundation for any optimisation: they reduce operator workload, protect equipment and create room to move set-points closer to constraints.',
    challenges: ['Oscillating loops and frequent manual mode operation', 'Disturbances from raw material or fuel variability', 'Conservative set-points to protect against instability', 'Alarm floods during upsets'],
    capabilities: ['Control loop assessment and tuning', 'Cascade, ratio and feed-forward strategies', 'Control philosophy reviews', 'Alarm rationalisation support', 'Performance monitoring of control loops'],
    approach,
    technologies: ['PID control', 'Advanced regulatory control', 'Process historians', 'Trend analysis'],
    benefits: ['Reduced process variability', 'Lower operator intervention', 'A stable base for optimisation'],
    industries: ['cement', 'fertilizers-chemicals', 'solar'],
    status: 'proposed', enabled: true,
  },
  {
    slug: 'plc-scada',
    title: 'PLC & SCADA',
    icon: 'monitor',
    image: 'EXPERTISE_PLC_SCADA_01',
    summary: 'PLC-based control, HMI design and supervisory monitoring for plant operations.',
    overview: 'PLC and SCADA systems are where operators meet the process. Good systems combine robust controller logic with clear, consistent HMI graphics, meaningful alarms and reliable data collection — so that operators can see the state of the plant at a glance and act with confidence.',
    challenges: ['Cluttered or inconsistent HMI graphics', 'Obsolete PLC hardware and software', 'Poor integration between plant areas', 'Limited remote visibility for engineering teams'],
    capabilities: ['PLC programming and migration', 'HMI / SCADA design using high-performance principles', 'Alarm and event management', 'Data acquisition and reporting', 'System integration across vendors'],
    approach,
    technologies: ['PLC', 'SCADA', 'HMI', 'OPC UA', 'Historians'],
    benefits: ['Clearer situational awareness', 'Easier maintenance and change control', 'Reliable operational data'],
    industries: ['cement', 'steel-glass', 'infrastructure'],
    status: 'proposed', enabled: true,
  },
  {
    slug: 'electrical-instrumentation',
    title: 'Electrical & Control Engineering',
    icon: 'zap',
    image: 'EXPERTISE_ELECTRICAL_01',
    summary: 'Electrical, instrumentation and control engineering as an integrated discipline.',
    overview: 'Electrical and instrumentation engineering connects the physical plant to its control system. It covers power distribution to motors and drives, control panels and marshalling, field instrumentation selection and installation, and the documentation that keeps these systems maintainable.',
    challenges: ['Instrument reliability and calibration drift', 'Undocumented panel and cable changes', 'Integration of new equipment into existing systems', 'Coordination across electrical and control disciplines'],
    capabilities: ['Electrical and control design documentation', 'Instrument selection and loop design', 'Control panel engineering', 'Installation supervision', 'Loop checks and pre-commissioning'],
    approach,
    technologies: ['MCC / LV distribution', 'Field instrumentation', 'Control panels', 'Drives'],
    benefits: ['Integrated E&I documentation', 'Fewer interface issues at commissioning', 'Reliable field signals'],
    industries: ['cement', 'solar', 'infrastructure'],
    status: 'proposed', enabled: true,
  },
  {
    slug: 'digital-transformation',
    title: 'Digital Transformation',
    icon: 'layers',
    image: 'EXPERTISE_DIGITAL_01',
    summary: 'Digital monitoring, data platforms, reporting and system integration.',
    overview: 'Digital transformation in industry starts with reliable data. By connecting control systems, historians and business systems — securely and with clear boundaries — plants can move from manual logs and spreadsheets to consistent reporting and shared operational insight.',
    challenges: ['Data trapped in individual systems', 'Manual shift reports and spreadsheets', 'Unclear ownership of operational data', 'Cyber-security concerns when connecting OT and IT'],
    capabilities: ['Operational data architecture', 'Historian and reporting solutions', 'Dashboards and KPI reporting', 'OT/IT integration with segmented networks'],
    approach,
    technologies: ['Historians', 'OPC UA', 'SQL databases', 'Web dashboards', 'Network segmentation'],
    benefits: ['A single source of operational truth', 'Less manual reporting', 'Foundation for analytics'],
    industries: ['cement', 'steel-glass', 'fertilizers-chemicals'],
    status: 'proposed', enabled: true,
  },
  {
    slug: 'advanced-analytics',
    title: 'Industrial Monitoring & Analytics',
    icon: 'activity',
    image: 'EXPERTISE_ANALYTICS_01',
    summary: 'Industrial data analysis, predictive modelling and decision support.',
    overview: 'Advanced analytics uses historical and real-time process data to understand behaviour, detect abnormal conditions earlier and support better decisions. Models are built with process engineers, validated against plant knowledge and deployed as decision support — not as a replacement for operators.',
    challenges: ['Large volumes of data with little analysis', 'Abnormal situations detected too late', 'Energy and fuel use that is hard to attribute', 'Scepticism toward “black-box” models'],
    capabilities: ['Exploratory process data analysis', 'Predictive and soft-sensor modelling', 'Abnormal reading detection', 'Energy and fuel analysis', 'Performance dashboards'],
    approach,
    technologies: ['Python data science stack', 'Machine learning', 'Statistical process control', 'Historians'],
    benefits: ['Earlier warning of deviations', 'Better understanding of process drivers', 'Data-backed decisions'],
    industries: ['cement', 'solar', 'fertilizers-chemicals'],
    status: 'proposed', enabled: true,
  },
  /* ---------------- Confirmed services from ASEC presentation slides (2026) ---------------- */
  {
    slug: 'pv-solar-epc',
    title: 'Renewable Energy — PV Solar EPC',
    icon: 'sun',
    image: 'EXPERTISE_SOLAR_01',
    summary: 'EPC contractor in solar energy, providing services tailored to each client’s requirements.',
    overview: 'ASEC Automation is an EPC contractor in the field of solar energy and provides services tailored to each client’s requirements — from PV system design and simulation through site works, installation and commissioning.',
    challenges: ['Sizing a PV plant to the site, load and grid conditions', 'Shading and layout losses that reduce yield', 'Coordinating civil, mechanical and electrical works on site', 'Integrating PV generation with existing power systems'],
    capabilities: ['PV system design and energy simulation', '3D modelling and shading analysis', 'Engineering, procurement and construction (EPC)', 'Piling, trenching and cabling site works', 'Electrical installation and commissioning'],
    approach,
    technologies: ['PVsyst', 'SketchUp', 'Autodesk Revit'],
    benefits: ['A single EPC partner from design to handover', 'Designs based on site-specific simulation', 'Solutions tailored to each client'],
    industries: ['solar', 'infrastructure'],
    status: 'confirmed', enabled: true,
    gallery: [{ src: '/images/gallery/solar-piling-rig.webp', alt: 'Piling rig installing PV mounting foundations' }, { src: '/images/gallery/solar-field-trench.webp', alt: 'Cable trench alongside a ground-mounted PV field' }],
  },
  {
    slug: 'lv-panel-builder',
    title: 'Low-Voltage Panel Builder',
    icon: 'layers',
    image: 'EXPERTISE_PANELS_01',
    summary: 'One of Egypt’s leading low-voltage panel builders, with more than 20 years of experience.',
    overview: 'A well-equipped workshop managed by a team of experts in designing and building all types of electrical switchboards and control panels. ASEC Automation is one of Egypt’s leading low-voltage panel builders, with more than 20 years of experience in designing, building, installing and servicing electrical panels. Panels are designed, built and supplied to the client’s specification, without limitation to a specific brand other than ultimate quality.',
    challenges: ['Switchboards that must match a client’s exact specification', 'Reliable protection and clean bus-bar arrangement', 'Integration with energy management and control systems', 'Short delivery times without compromising quality'],
    capabilities: ['Design and build of switchboards and control panels', 'Copper bending and bus-bar fabrication', 'Panel assembly and wiring', 'Factory testing', 'Installation and servicing of electrical panels', 'Certified Schneider Electric panel builder'],
    approach: [
      { title: 'Specify', text: 'Panels designed to the client’s specification, not limited to one brand.' },
      { title: 'Build', text: 'Assembly, copper bending and wiring in ASEC’s own workshop.' },
      { title: 'Test', text: 'Testing with the workshop’s dedicated testing equipment.' },
      { title: 'Install & service', text: 'Installation on site and lifecycle servicing.' },
    ],
    technologies: ['LV switchboards', 'MCC', 'Control panels', 'Bus-bar systems', 'Energy management integration'],
    benefits: ['Advanced protection', 'Seamless integration with energy management and control systems', 'Complete technical support'],
    industries: ['cement', 'steel-glass', 'infrastructure'],
    status: 'confirmed', enabled: true,
    gallery: [{ src: '/images/gallery/workshop-building.webp', alt: 'ASEC Automation workshop building' }, { src: '/images/gallery/workshop-panel-line.webp', alt: 'Panels lined up on the workshop floor' }, { src: '/images/gallery/workshop-panels-open.webp', alt: 'Switchboards with open doors during assembly' }, { src: '/images/gallery/panel-workshop-floor.webp', alt: 'Panel assembly area in the workshop' }],
  },
  {
    slug: 'predictive-maintenance',
    title: 'Predictive Maintenance & Online Tests',
    icon: 'activity',
    image: 'EXPERTISE_TESTING_01',
    summary: 'Predictive maintenance services delivered with the latest testing technology.',
    overview: 'ASEC Automation maximises the role of predictive maintenance for proper implementation of maintenance services through the latest technology. Online tests assess the condition of earthing systems, motors, power quality and electrical connections while equipment stays in service.',
    challenges: ['Unplanned outages from undetected electrical faults', 'Degrading motor health that is not visible until failure', 'Power-quality problems such as harmonics, dips and swells', 'Loose or corroded connections that create fire risk'],
    capabilities: [
      'Earthing measurements — earth ground loop resistance and non-intrusive leakage current',
      'Online motor testing per NEMA MG 1-2003 — power circuit, loading, voltage balance, rotor cage',
      'Power quality analysis per IEC 61000-4-30 — RMS values, dips, swells, harmonics, flicker',
      'Thermograph monitoring — connections, unbalance and overloads in substations and switchgear',
      'Partial discharge detection on MV switchgear and cables',
      'MV circuit breaker tests — contact resistance and switching time',
      'Tan delta testing',
      'Slip ring motor inspection',
      'Transformer oil tests — DGA, chemical, physical and dielectric',
      'Motor vibration diagnostics',
    ],
    approach,
    technologies: ['Earth ground clamp (Megger)', 'Dynamic motor analyser (Baker EXP4000)', 'Power quality analyser (Fluke 435)', 'Thermal camera (Fluke Ti32)', 'MV breaker analyser (Megger-EGIL)'],
    toolCards: [
      { title: 'Earthing Measurements', text: 'Earth ground clamp — loop resistance & leakage current', image: 'TOOL_EARTHING_01' },
      { title: 'Online Motor Testing', text: 'Dynamic motor analyser — NEMA MG 1-2003', image: 'TOOL_MOTOR_ANALYZER_01' },
      { title: 'Power Quality Analysis', text: 'Power quality analyser — IEC 61000-4-30', image: 'TOOL_POWER_QUALITY_01' },
      { title: 'Thermograph Monitoring', text: 'Thermal camera — connections, unbalance, overloads', image: 'TOOL_THERMAL_01' },
      { title: 'Partial Discharge Detection', text: 'MV switchgear & cables', image: 'TOOL_PARTIAL_DISCHARGE_01' },
      { title: 'MV Circuit Breaker Tests', text: 'Contact resistance & switching time', image: 'TOOL_BREAKER_01' },
      { title: 'Tan Delta', text: 'Insulation condition', image: 'TOOL_TAN_DELTA_01' },
      { title: 'Slip Ring Motors', text: 'Ovality, brush spring pressure & roughness', image: 'TOOL_SLIP_RING_01' },
      { title: 'Transformer Oil Tests', text: 'DGA, chemical, physical & dielectric', image: 'TOOL_OIL_01' },
      { title: 'Motor Vibration Diagnostics', text: 'Mechanical condition', image: 'TOOL_VIBRATION_01' },
    ],
    benefits: ['Problems found before they cause outages', 'Tests carried out with equipment in service', 'Maintenance planned on measured condition'],
    industries: ['cement', 'steel-glass', 'fertilizers-chemicals'],
    status: 'confirmed', enabled: true,
  },
  {
    slug: 'mv-motor-overhaul',
    title: 'MV Motor Overhaul',
    icon: 'refresh',
    image: 'EXPERTISE_MOTORS_01',
    summary: 'A complete workshop process from disassembly to on-site verification after overhaul.',
    overview: 'ASEC Automation’s motor service workshop overhauls medium-voltage motors through a complete, documented process — from disassembly and inspection, through winding cleaning, drying, varnishing and testing, to reassembly and on-site verification with online motor analysis.',
    challenges: ['Insulation degradation in ageing MV motors', 'Contaminated windings reducing reliability', 'Worn bearings and slip-ring wear', 'Confirming motor health after return to service'],
    capabilities: ['Full MV motor disassembly and inspection', 'Stator and rotor condition assessment', 'Winding cleaning, drying, varnishing and curing', 'Insulation testing before and after treatment', 'Bearing replacement and reassembly', 'Slip-ring maintenance for SR motors', 'On-site online motor analysis after overhaul'],
    approach: [
      { title: '1. Disassembly', text: 'Motor disassembly.' },
      { title: '2. Inspection', text: 'Rotor and stator visual inspection.' },
      { title: '3. Assessment', text: 'Stator and rotor condition assessment and measurements.' },
      { title: '4. Cleaning', text: 'Windings cleaned with heated steam at adjustable pressure.' },
      { title: '5. Drying', text: 'Windings dried in an oven, then insulation tested.' },
      { title: '6. Varnish curing', text: 'Varnish cured in special ovens at 120 °C for 12 hours, then 150 °C for 6 hours.' },
      { title: '7. Anti-flash coating', text: 'Windings coated with anti-flash red varnish.' },
      { title: '8. Shop test', text: 'Post insulation-enhancement shop test of the windings.' },
      { title: '9. Bearings', text: 'A new set of bearings is fitted.' },
      { title: '10. Assembly', text: 'Motor reassembled.' },
      { title: '11. Painting', text: 'Motor painted and finished.' },
    ],
    technologies: ['Insulation testing', 'Varnish curing ovens', 'Baker online motor analyser'],
    benefits: ['Restored insulation and reliability', 'Documented, repeatable workshop process', 'Verified on site after overhaul'],
    industries: ['cement', 'steel-glass', 'fertilizers-chemicals'],
    status: 'confirmed', enabled: true,
    gallery: [{ src: '/images/gallery/motor-stator-rewind.webp', alt: 'MV motor stator during overhaul' }, { src: '/images/gallery/motor-rotor-coated.webp', alt: 'Rotor windings after anti-flash varnish coating' }, { src: '/images/gallery/motor-winding-detail.webp', alt: 'Close-up of stator end windings' }, { src: '/images/gallery/motor-rotor-assembly.webp', alt: 'Technicians handling a rotor during reassembly' }, { src: '/images/gallery/workshop-motor-bay.webp', alt: 'Motor service workshop bay' }, { src: '/images/gallery/workshop-motor-tools.webp', alt: 'Motor workshop equipment' }],
  },
  {
    slug: 'industrial-eai',
    title: 'Industrial EAI Engineering',
    icon: 'cpu',
    image: 'EXPERTISE_EAI_01',
    summary: 'Projects basic and detailed engineering by experienced in-house teams.',
    overview: 'ASEC Automation’s in-house experienced teams deliver projects basic engineering and detailed engineering across electrical, automation and instrumentation (EAI), supported by state-of-the-art engineering software.',
    challenges: ['Complete, consistent engineering packages', 'Coordinating electrical, automation and instrumentation design', 'Accurate load-flow, protection and cable sizing', 'Documentation that supports construction and maintenance'],
    capabilities: ['Projects basic engineering', 'Projects detailed engineering', 'Single-line diagrams and electrical studies', 'Panel and cabinet design', 'Control system configuration'],
    approach,
    technologies: ['Siemens', 'WinCC', 'SIMATIC PCS 7', 'TIA Portal', 'Schneider Electric', 'ABB', 'EPLAN', 'SAP', 'Caneco', 'Autodesk Revit', 'EasyPower', 'ETAP'],
    benefits: ['In-house engineering teams', 'Industry-standard software platforms', 'Engineering that carries through to construction'],
    industries: ['cement', 'steel-glass', 'solar'],
    status: 'confirmed', enabled: true,
  },
]

export const expertiseCardsExtra = [
  { title: 'Smart Manufacturing Solutions', icon: 'factory', summary: 'Connected equipment, consistent data and automated workflows across production.', to: '/solutions' },
]

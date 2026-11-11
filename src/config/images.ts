/**
 * CENTRAL IMAGE REGISTRY
 * ----------------------------------------------------------------------------
 * Every image slot on the website is declared here — nowhere else.
 *
 * To fill a slot: save a photo at the slot's `path` inside `public/`
 * (e.g. public/images/home/home-hero.jpg) and rebuild. The build detects the
 * file automatically — no component code changes are needed. You may also use
 * .webp / .png / .avif with the same base filename.
 *
 * Until a file exists, the slot renders a designed <ImagePlaceholder />.
 * `npm run images` regenerates IMAGE_REQUIREMENTS.md from this list.
 */

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'

export interface ImageSlot {
  id: string
  page: string
  section: string
  description: string
  width: number
  height: number
  path: string
  priority: Priority
  required: boolean
  alt: string
}

const s = (
  id: string, page: string, section: string, description: string,
  width: number, height: number, path: string, priority: Priority, required = true, alt?: string,
): ImageSlot => ({ id, page, section, description, width, height, path, priority, required, alt: alt ?? description })

export const IMAGE_SLOTS: ImageSlot[] = [
  // Brand
  s('BRAND_LOGO', 'Global', 'Header', 'Official ASEC Automation wordmark, white + red, for dark backgrounds (transparent PNG or SVG).', 538, 120, '/images/brand/logo-light.png', 'Critical', true, 'ASEC Automation'),
  s('BRAND_LOGO_DARK', 'Global', 'Light backgrounds', 'Official ASEC Automation wordmark, navy + red, for light backgrounds (transparent PNG or SVG).', 525, 120, '/images/brand/logo-dark.png', 'High', true, 'ASEC Automation'),
  s('BRAND_LOGO_FULL_LIGHT', 'Global', 'Footer', 'Official logo with tagline “Innovating Industries, Powering Progress”, for dark backgrounds.', 900, 249, '/images/brand/logo-light-full.png', 'High', true, 'ASEC Automation — Innovating Industries, Powering Progress'),
  s('BRAND_MARK', 'Global', 'Icon / favicon', 'ASEC globe symbol only, white + red, for dark backgrounds.', 237, 256, '/images/brand/mark-light.png', 'Medium', true, 'ASEC Automation symbol'),
  s('OG_DEFAULT_01', 'Global', 'Social sharing', 'Default social-share image with logo over an industrial photograph.', 1200, 630, '/images/brand/og-default.jpg', 'High'),

  // Home
  s('HOME_HERO_01', 'Home', 'Hero', 'Dramatic aerial view of a modern cement plant at sunrise — massive industrial structures, atmospheric light, cinematic composition.', 1920, 1080, '/images/home/home-hero.jpg', 'Critical'),
  s('GLOBAL_EGYPT_01', 'Home / Global Presence', 'Global panels', 'Industrial landscape in Egypt — cement or process plant, warm desert light.', 1200, 1600, '/images/global/egypt.jpg', 'High'),
  s('GLOBAL_SAUDI_01', 'Home / Global Presence', 'Global panels', 'Industrial facility in Saudi Arabia — large-scale plant at golden hour.', 1200, 1600, '/images/global/saudi-arabia.jpg', 'High'),
  s('GLOBAL_PHILIPPINES_01', 'Home / Global Presence', 'Global panels', 'Industrial site in the Philippines — plant with tropical surroundings.', 1200, 1600, '/images/global/philippines.jpg', 'High'),
  s('GLOBAL_MEXICO_01', 'Home / Global Presence', 'Global panels', 'Industrial plant in Mexico — wide view with mountains or open sky.', 1200, 1600, '/images/global/mexico.jpg', 'High'),
  s('GLOBAL_UAE_01', 'Global Presence', 'Country panel', 'Image for UAE — a project or site photo, or the generated map artwork.', 1200, 1600, '/images/global/uae.jpg', 'Low', false),
  s('GLOBAL_HONDURAS_01', 'Global Presence', 'Country panel', 'Image for Honduras — a project or site photo, or the generated map artwork.', 1200, 1600, '/images/global/honduras.jpg', 'Low', false),
  s('GLOBAL_JORDAN_01', 'Global Presence', 'Country panel', 'Image for Jordan — a project or site photo, or the generated map artwork.', 1200, 1600, '/images/global/jordan.jpg', 'Low', false),
  s('GLOBAL_MOROCCO_01', 'Global Presence', 'Country panel', 'Image for Morocco — a project or site photo, or the generated map artwork.', 1200, 1600, '/images/global/morocco.jpg', 'Low', false),
  s('GLOBAL_ALGERIA_01', 'Global Presence', 'Country panel', 'Image for Algeria — a project or site photo, or the generated map artwork.', 1200, 1600, '/images/global/algeria.jpg', 'Low', false),
  s('GLOBAL_UGANDA_01', 'Global Presence', 'Country panel', 'Image for Uganda — a project or site photo, or the generated map artwork.', 1200, 1600, '/images/global/uganda.jpg', 'Low', false),
  s('GLOBAL_IRAQ_01', 'Global Presence', 'Country panel', 'Image for Iraq — a project or site photo, or the generated map artwork.', 1200, 1600, '/images/global/iraq.jpg', 'Low', false),
  s('GLOBAL_KENYA_01', 'Global Presence', 'Country panel', 'Image for Kenya — a project or site photo, or the generated map artwork.', 1200, 1600, '/images/global/kenya.jpg', 'Low', false),
  s('GLOBAL_TANZANIA_01', 'Global Presence', 'Country panel', 'Image for Tanzania — a project or site photo, or the generated map artwork.', 1200, 1600, '/images/global/tanzania.jpg', 'Low', false),
  s('ABOUT_COMPANY_01', 'Home / About', 'Who we are', 'ASEC engineers on site or in a control room — confident, authentic, well lit.', 1200, 1500, '/images/about/company.jpg', 'Critical'),
  s('TECH_AI_01', 'Home / Innovation', 'Technology & innovation', 'Engineer reviewing data models / analytics on large screens in a dim control environment.', 1200, 1400, '/images/tech/ai.jpg', 'High'),
  s('TECH_ANALYTICS_01', 'Home / Innovation', 'Technology & innovation', 'Close-up of industrial trend charts and process graphics on an HMI screen.', 1200, 800, '/images/tech/analytics.jpg', 'High'),
  s('TECH_CONTROL_ROOM_01', 'Home / Innovation', 'Technology & innovation', 'Modern central control room with operator consoles and video wall.', 1200, 800, '/images/tech/control-room.jpg', 'High'),
  s('INDUSTRY_CEMENT_01', 'Home / Industries', 'Industries grid', 'Cement plant preheater tower and kiln line, dramatic perspective.', 1600, 1100, '/images/industries/cement.jpg', 'Critical'),
  s('INDUSTRY_MANUFACTURING_01', 'Home / Industries', 'Industries grid', 'Steel or glass plant — electrical and control systems (industry: Steel & Glass).', 1000, 800, '/images/industries/manufacturing.jpg', 'Medium'),
  s('INDUSTRY_ENERGY_01', 'Home / Industries', 'Industries grid', 'Solar PV plant (industry: Solar Energy).', 1000, 800, '/images/industries/energy.jpg', 'Medium'),
  s('INDUSTRY_INFRASTRUCTURE_01', 'Home / Industries', 'Industries grid', 'Industrial infrastructure — utilities, pipe racks or large civil works.', 1200, 800, '/images/industries/infrastructure.jpg', 'Medium'),
  s('INDUSTRY_PROCESS_01', 'Home / Industries', 'Industries grid', 'Fertilizer or chemical plant — process equipment and instrumentation.', 1200, 800, '/images/industries/process.jpg', 'Medium'),
  s('SUSTAINABILITY_SOLAR_01', 'Home / Sustainability', 'Energy & sustainability', 'Solar PV installation at an industrial site, low sun angle.', 1600, 1000, '/images/sustainability/solar.jpg', 'High'),
  s('SUSTAINABILITY_ENERGY_01', 'Home / Sustainability', 'Energy & sustainability', 'Energy monitoring — power meters, electrical rooms or energy dashboards.', 1000, 800, '/images/sustainability/energy.jpg', 'Medium'),
  s('SUSTAINABILITY_EFFICIENCY_01', 'Home / Sustainability', 'Energy & sustainability', 'Efficient, clean plant operations — modern equipment, orderly site.', 1000, 800, '/images/sustainability/efficiency.jpg', 'Medium'),
  s('PARTNER_SIEMENS', 'Home / Partners', 'Certified partners', 'Official Siemens logo (turquoise wordmark) — supplied by ASEC. Replace with an SVG from Siemens for maximum sharpness.', 1000, 200, '/images/partners/siemens.png', 'High', false, 'Siemens'),
  s('PARTNER_SCHNEIDER', 'Home / Partners', 'Certified partners', 'Official Schneider Electric logo (green) — supplied by ASEC. Replace with an SVG from Schneider Electric for maximum sharpness.', 2000, 700, '/images/partners/schneider-electric.png', 'High', false, 'Schneider Electric'),
  ...Array.from({ length: 6 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0')
    return s(`PARTNER_LOGO_${n}`, 'Home / Partners', 'Logo showcase', `Approved partner or technology logo #${n} (transparent PNG/SVG). Only add with written approval.`, 400, 200, `/images/partners/partner-${n}.png`, 'Low', false, `Partner logo ${n}`)
  }),
  s('CTA_BG_01', 'Global', 'Contact call-to-action', 'Dark industrial background — plant at night or control-room silhouette, space for text on the left.', 1920, 900, '/images/home/cta-bg.jpg', 'High'),

  // Inner page heroes
  s('ABOUT_HERO_01', 'About', 'Hero', 'Wide cinematic shot of ASEC team or engineering work at a plant.', 1920, 1080, '/images/about/hero.jpg', 'High'),
  s('ABOUT_LEADERSHIP_01', 'About', 'Leadership', 'Professional portrait of a leadership team member (one file per profile; duplicate the slot as needed).', 800, 1000, '/images/about/leader-01.jpg', 'Medium', false),
  s('ABOUT_HSE_01', 'About', 'Quality assurance & HSE', 'HSE toolbox talk or safety training with ASEC team in PPE.', 1200, 900, '/images/about/hse.jpg', 'Medium'),
  s('ABOUT_PEOPLE_01', 'About', 'Our people', 'Group or candid photo of ASEC engineers and technicians.', 1600, 900, '/images/about/people.jpg', 'Medium'),
  s('EXPERTISE_HERO_01', 'Expertise', 'Hero', 'Engineer commissioning a control panel / PLC cabinet.', 1920, 1080, '/images/expertise/hero.jpg', 'High'),
  s('EXPERTISE_AUTOMATION_01', 'Expertise', 'Industrial Automation', 'PLC / control cabinets with neat wiring.', 1200, 800, '/images/expertise/automation.jpg', 'High'),
  s('EXPERTISE_PROCESS_01', 'Expertise', 'Process Control', 'Process graphics on an operator screen with trends.', 1200, 800, '/images/expertise/process-control.jpg', 'Medium'),
  s('EXPERTISE_PLC_SCADA_01', 'Expertise', 'PLC & SCADA', 'SCADA overview screen or HMI workstation.', 1200, 800, '/images/expertise/plc-scada.jpg', 'Medium'),
  s('EXPERTISE_ELECTRICAL_01', 'Expertise', 'Electrical & Instrumentation', 'MCC / switchgear room or field instrumentation.', 1200, 800, '/images/expertise/electrical.jpg', 'Medium'),
  s('EXPERTISE_DIGITAL_01', 'Expertise', 'Digital Transformation', 'Engineers with tablets / data platform in an industrial setting.', 1200, 800, '/images/expertise/digital.jpg', 'Medium'),
  s('EXPERTISE_ANALYTICS_01', 'Expertise', 'Advanced Analytics', 'Data visualisation and analytics on large displays.', 1200, 800, '/images/expertise/analytics.jpg', 'Medium'),
  s('EXPERTISE_SOLAR_01', 'Expertise', 'PV Solar EPC', 'Utility-scale or industrial PV installation built by ASEC.', 1200, 800, '/images/expertise/solar.jpg', 'High'),
  s('EXPERTISE_PANELS_01', 'Expertise', 'Low-Voltage Panel Builder', 'ASEC panel workshop — switchboards in assembly.', 1200, 800, '/images/expertise/panels.jpg', 'High'),
  s('EXPERTISE_TESTING_01', 'Expertise', 'Predictive Maintenance', 'Engineer performing online tests (thermography, power quality) in a switchroom.', 1200, 800, '/images/expertise/testing.jpg', 'Medium'),
  s('EXPERTISE_MOTORS_01', 'Expertise', 'MV Motor Overhaul', 'MV motor stator or rotor in the ASEC motor workshop (high resolution).', 1200, 800, '/images/expertise/motors.jpg', 'Medium'),
  s('EXPERTISE_EAI_01', 'Expertise', 'Industrial EAI Engineering', 'Engineers working on electrical / automation design drawings.', 1200, 800, '/images/expertise/eai.jpg', 'Medium'),
  s('TOOL_EARTHING_01', 'Expertise — Predictive Maintenance', 'Diagnostic tools', 'Product-style photo: earth ground clamp meter clamped around an earthing cable at a substation. Clean light background, no brand names.', 800, 600, '/images/tools/earthing.jpg', 'Medium', false),
  s('TOOL_MOTOR_ANALYZER_01', 'Expertise — Predictive Maintenance', 'Diagnostic tools', 'Product-style photo: portable dynamic motor analyser case with current clamps, connected to a motor terminal box. Clean light background, no brand names.', 800, 600, '/images/tools/motor-analyzer.jpg', 'Medium', false),
  s('TOOL_POWER_QUALITY_01', 'Expertise — Predictive Maintenance', 'Diagnostic tools', 'Product-style photo: handheld three-phase power quality analyser with clamps on switchboard busbars. Clean light background, no brand names.', 800, 600, '/images/tools/power-quality.jpg', 'Medium', false),
  s('TOOL_THERMAL_01', 'Expertise — Predictive Maintenance', 'Diagnostic tools', 'Product-style photo: handheld thermal imaging camera showing a hot spot on a switchgear connection. Clean light background, no brand names.', 800, 600, '/images/tools/thermal.jpg', 'Medium', false),
  s('TOOL_PARTIAL_DISCHARGE_01', 'Expertise — Predictive Maintenance', 'Diagnostic tools', 'Product-style photo: partial discharge detector held against medium-voltage switchgear. Clean light background, no brand names.', 800, 600, '/images/tools/partial-discharge.jpg', 'Medium', false),
  s('TOOL_BREAKER_01', 'Expertise — Predictive Maintenance', 'Diagnostic tools', 'Product-style photo: medium-voltage circuit breaker test set connected to a breaker on a test bench. Clean light background, no brand names.', 800, 600, '/images/tools/breaker.jpg', 'Medium', false),
  s('TOOL_TAN_DELTA_01', 'Expertise — Predictive Maintenance', 'Diagnostic tools', 'Product-style photo: tan delta insulation test instrument with tablet controller. Clean light background, no brand names.', 800, 600, '/images/tools/tan-delta.jpg', 'Medium', false),
  s('TOOL_SLIP_RING_01', 'Expertise — Predictive Maintenance', 'Diagnostic tools', 'Product-style photo: close-up of an industrial motor slip ring assembly with brush holders. Clean light background, no brand names.', 800, 600, '/images/tools/slip-ring.jpg', 'Medium', false),
  s('TOOL_OIL_01', 'Expertise — Predictive Maintenance', 'Diagnostic tools', 'Product-style photo: transformer oil test analyser with oil sample vials. Clean light background, no brand names.', 800, 600, '/images/tools/oil.jpg', 'Medium', false),
  s('TOOL_VIBRATION_01', 'Expertise — Predictive Maintenance', 'Diagnostic tools', 'Product-style photo: handheld vibration analyser with magnetic sensor on a motor bearing housing. Clean light background, no brand names.', 800, 600, '/images/tools/vibration.jpg', 'Medium', false),
  s('SOLUTIONS_HERO_01', 'Solutions', 'Hero', 'Control system modernisation — new DCS consoles or cabinets.', 1920, 1080, '/images/solutions/hero.jpg', 'High'),
  s('INDUSTRIES_HERO_01', 'Industries', 'Hero', 'Wide industrial skyline — plants and infrastructure.', 1920, 1080, '/images/industries/hero.jpg', 'High'),
  s('CEMENT_HERO_01', 'Cement Solutions', 'Hero', 'Rotary kiln close-up with glowing burning zone or preheater tower.', 1920, 1080, '/images/cement/hero.jpg', 'Critical'),
  s('PROJECTS_HERO_01', 'Projects', 'Hero', 'Project site during commissioning — team and equipment.', 1920, 1080, '/images/projects/hero.jpg', 'High'),
  s('INNOVATION_HERO_01', 'Innovation', 'Hero', 'Abstract industrial data visualisation or control-room screens.', 1920, 1080, '/images/innovation/hero.jpg', 'High'),
  s('GLOBAL_HERO_01', 'Global Presence', 'Hero', 'Aerial industrial landscape suggesting international scale.', 1920, 1080, '/images/global/hero.jpg', 'High'),
  s('SUSTAINABILITY_HERO_01', 'Sustainability', 'Hero', 'Solar field next to an industrial facility at sunset.', 1920, 1080, '/images/sustainability/hero.jpg', 'High'),
  s('PARTNERS_HERO_01', 'Partners', 'Hero', 'Equipment detail — branded hardware deliberately unreadable/neutral.', 1920, 1080, '/images/partners/hero.jpg', 'Medium'),
  s('TOOL_LOGO_WINCC', 'Partners', 'Engineering software', 'Official WinCC logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/wincc.png', 'Low', false, 'WinCC logo'),
  s('TOOL_LOGO_SIMATIC_PCS7', 'Partners', 'Engineering software', 'Official SIMATIC PCS 7 logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/simatic-pcs7.png', 'Low', false, 'SIMATIC PCS 7 logo'),
  s('TOOL_LOGO_TIA_PORTAL', 'Partners', 'Engineering software', 'Official TIA Portal logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/tia-portal.png', 'Low', false, 'TIA Portal logo'),
  s('TOOL_LOGO_ABB', 'Partners', 'Engineering software', 'Official ABB logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/abb.png', 'Low', false, 'ABB logo'),
  s('TOOL_LOGO_EPLAN', 'Partners', 'Engineering software', 'Official EPLAN logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/eplan.png', 'Low', false, 'EPLAN logo'),
  s('TOOL_LOGO_ETAP', 'Partners', 'Engineering software', 'Official ETAP logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/etap.png', 'Low', false, 'ETAP logo'),
  s('TOOL_LOGO_EASYPOWER', 'Partners', 'Engineering software', 'Official EasyPower logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/easypower.png', 'Low', false, 'EasyPower logo'),
  s('TOOL_LOGO_CANECO', 'Partners', 'Engineering software', 'Official Caneco logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/caneco.png', 'Low', false, 'Caneco logo'),
  s('TOOL_LOGO_AUTODESK_REVIT', 'Partners', 'Engineering software', 'Official Autodesk Revit logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/autodesk-revit.png', 'Low', false, 'Autodesk Revit logo'),
  s('TOOL_LOGO_SKETCHUP', 'Partners', 'Engineering software', 'Official SketchUp logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/sketchup.png', 'Low', false, 'SketchUp logo'),
  s('TOOL_LOGO_PVSYST', 'Partners', 'Engineering software', 'Official PVsyst logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/pvsyst.png', 'Low', false, 'PVsyst logo'),
  s('TOOL_LOGO_SAP', 'Partners', 'Engineering software', 'Official SAP logo (transparent PNG or SVG, used with permission).', 400, 160, '/images/software/sap.png', 'Low', false, 'SAP logo'),
  s('CAREERS_HERO_01', 'Careers', 'Hero', 'Young engineers collaborating on site, positive atmosphere.', 1920, 1080, '/images/careers/hero.jpg', 'High'),
  s('CAREERS_CULTURE_01', 'Careers', 'Culture', 'Team training, workshop or mentoring moment.', 1200, 900, '/images/careers/culture.jpg', 'Medium'),
  s('CONTACT_HERO_01', 'Contact', 'Hero', 'Office exterior or reception, or plant at dusk.', 1920, 1080, '/images/contact/hero.jpg', 'Medium'),
]

export const SLOT_MAP: Record<string, ImageSlot> = Object.fromEntries(IMAGE_SLOTS.map((x) => [x.id, x]))

export function aspect(w: number, h: number) {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a)
  const d = g(w, h)
  return `${w / d}:${h / d}`
}

/**
 * Alt text describing the photo actually placed in each slot (the slot
 * `description` above is the brief for the ideal photo). Update when a photo changes.
 */
export const ALT: Record<string, string> = {
  HOME_HERO_01: 'Modern central control room with operator consoles, cement plant towers and silos visible through the windows at dusk',
  ABOUT_COMPANY_01: 'Three ASEC Automation engineers in hard hats and safety vests looking at a cement plant with kiln and silos at dusk',
  INDUSTRY_CEMENT_01: 'Cement plant with preheater towers, silos and rotary kiln at dusk',
  CTA_BG_01: 'Cement plant at dusk with preheater tower, silos and conveyors, overlaid with digital automation graphics',
  TECH_AI_01: 'Engineer at HMI screens with process graphics, an ASEC hard hat on the desk and plant lights outside',
  TECH_ANALYTICS_01: 'SCADA process graphic with cyclones, silos and live values',
  TECH_CONTROL_ROOM_01: 'Modern control room with curved operator consoles and a video wall',
  INDUSTRY_MANUFACTURING_01: 'Electrical control cabinets inside an industrial plant',
  INDUSTRY_ENERGY_01: 'Ground-mounted solar panels at sunset',
  INDUSTRY_INFRASTRUCTURE_01: 'Two engineers in ASEC safety vests and hard hats reviewing a building under construction',
  INDUSTRY_PROCESS_01: 'Long corridor of electrical switchgear and control cabinets',
  SUSTAINABILITY_SOLAR_01: 'Rooftop solar panels at sunset',
  SUSTAINABILITY_ENERGY_01: 'Long corridor of electrical switchgear and control cabinets',
  SUSTAINABILITY_EFFICIENCY_01: 'Process plant pumps and insulated pipework at sunset',
  SUSTAINABILITY_HERO_01: 'Solar panels on an industrial roof under an evening sky',
  EXPERTISE_HERO_01: 'Open control cabinet with Siemens SIMATIC S7-1500 PLC modules, with an industrial plant behind',
  EXPERTISE_AUTOMATION_01: 'Engineer monitoring kiln process graphics beside an open PLC cabinet in a cement plant',
  EXPERTISE_PROCESS_01: 'Engineer reviewing kiln control trends on a tablet beside field instruments at a cement plant',
  EXPERTISE_PLC_SCADA_01: 'Open PLC cabinet beside an engineering desk with SCADA process graphics, plant visible through the window',
  EXPERTISE_ELECTRICAL_01: 'Row of electrical control panels with an open cabinet showing breakers and wiring, and an HMI on the front',
  EXPERTISE_DIGITAL_01: 'Engineer at a multi-screen desk with dashboards, process graphics and a data-platform view, plant visible outside',
  EXPERTISE_ANALYTICS_01: 'Three monitors showing kiln process graphics, energy trends, predictions and anomaly heatmaps, with the plant outside',
  SOLUTIONS_HERO_01: 'Solutions graphic over a cement plant at dusk: automation & control, process optimisation, energy management, engineering, digitalisation and maintenance',
  INDUSTRIES_HERO_01: 'Wheel loader and site crew at a construction site',
  CEMENT_HERO_01: 'Two engineers in hard hats with drawings and a tablet overlooking a cement plant and rotary kiln at sunset',
  PROJECTS_HERO_01: 'Collage of project types: cement plant, solar farm, switchgear room, motors and pumps, process instrumentation and a control room',
  INNOVATION_HERO_01: 'Operators at control room screens with a kiln camera feed',
  GLOBAL_HERO_01: 'Excavator working on a site with buildings under construction',
  PARTNERS_HERO_01: 'Automation cabinets with glass doors showing PLC modules and wiring',
  CAREERS_HERO_01: 'Two ASEC Automation technicians installing cable trays at a cement plant site',
  CAREERS_CULTURE_01: 'ASEC Automation engineers reviewing drawings together in an office overlooking a cement plant',
  CONTACT_HERO_01: 'ASEC engineers reviewing drawings in a control office, with process screens and a cement plant outside the window',
  ABOUT_HERO_01: 'ASEC Automation engineers at workstations in a control office, with a plant visible through the windows at dusk',
  EXPERTISE_SOLAR_01: 'Engineers with a tablet reviewing a PV array beside inverters and an electrical cabinet at sunset',
  EXPERTISE_PANELS_01: 'ASA technicians wiring low-voltage panels in the workshop',
  EXPERTISE_TESTING_01: 'Engineer running online motor and power-quality tests on a rugged laptop, with a thermal camera on the motor',
  EXPERTISE_MOTORS_01: 'Technician inspecting an MV motor stator winding, with the rotor and test instruments on the workbench',
  EXPERTISE_EAI_01: 'Cement plant with electrical panels, field instruments and a motor-driven pump in the foreground and the preheater tower and kiln behind',
  ABOUT_HSE_01: 'HSE safety briefing for ASEC Automation technicians in hard hats and blue coveralls in a workshop',
  ABOUT_PEOPLE_01: 'Site team setting cable spacers in a trench',
  GLOBAL_EGYPT_01: 'Illustration: dot map centred on Egypt',
  GLOBAL_SAUDI_01: 'Illustration: dot map centred on Saudi Arabia',
  GLOBAL_PHILIPPINES_01: 'Illustration: dot map centred on the Philippines',
  GLOBAL_MEXICO_01: 'Illustration: dot map centred on Mexico',
  GLOBAL_UAE_01: 'Illustration: dot map centred on UAE',
  GLOBAL_HONDURAS_01: 'Illustration: dot map centred on Honduras',
  GLOBAL_JORDAN_01: 'Illustration: dot map centred on Jordan',
  GLOBAL_MOROCCO_01: 'Illustration: dot map centred on Morocco',
  GLOBAL_ALGERIA_01: 'Illustration: dot map centred on Algeria',
  GLOBAL_UGANDA_01: 'Illustration: dot map centred on Uganda',
  GLOBAL_IRAQ_01: 'Illustration: dot map centred on Iraq',
  GLOBAL_KENYA_01: 'Illustration: dot map centred on Kenya',
  GLOBAL_TANZANIA_01: 'Illustration: dot map centred on Tanzania',
}

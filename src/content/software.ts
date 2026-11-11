/**
 * ENGINEERING SOFTWARE & TECHNOLOGY — platforms used by ASEC's engineering teams
 * (from ASEC presentation material). Listing a tool does not imply a partnership
 * with its vendor. `logo` is an optional image-slot ID: add the vendor's official
 * logo file only with permission; otherwise the name is shown as text.
 */
/** `mark` + `vendor`: a plain text wordmark in ASEC's own style, shown when no official logo file is supplied. */
export interface Tool { name: string; text: string; logo?: string; mark?: string; vendor?: string }
export interface ToolGroup { id: string; title: string; filter: string; icon: string; tools: Tool[] }

export const toolGroups: ToolGroup[] = [
  { id: 'automation', title: 'Industrial Automation & Control', filter: 'Automation & Control', icon: 'monitor', tools: [
    { name: 'Siemens', text: 'Industrial automation and control solutions', logo: 'PARTNER_SIEMENS' },
    { name: 'WinCC', mark: 'WinCC', vendor: 'Siemens', text: 'SCADA system for monitoring and process control', logo: 'TOOL_LOGO_WINCC' },
    { name: 'SIMATIC PCS 7', mark: 'SIMATIC PCS 7', vendor: 'Siemens', text: 'Distributed control system for complex processes', logo: 'TOOL_LOGO_SIMATIC_PCS7' },
    { name: 'TIA Portal', mark: 'TIA Portal', vendor: 'Siemens', text: 'Engineering platform for PLC, HMI and automation', logo: 'TOOL_LOGO_TIA_PORTAL' },
    { name: 'Schneider Electric', text: 'Control and energy management solutions', logo: 'PARTNER_SCHNEIDER' },
    { name: 'ABB', mark: 'ABB', vendor: 'Automation', text: 'Industrial automation, control and drives', logo: 'TOOL_LOGO_ABB' },
  ] },
  { id: 'electrical', title: 'Electrical Engineering & Power Systems', filter: 'Electrical & Power', icon: 'zap', tools: [
    { name: 'EPLAN', mark: 'EPLAN', vendor: 'Electrical CAE', text: 'Electrical design, documentation and engineering', logo: 'TOOL_LOGO_EPLAN' },
    { name: 'ETAP', mark: 'ETAP', vendor: 'Power systems', text: 'Power system analysis, design and simulation', logo: 'TOOL_LOGO_ETAP' },
    { name: 'EasyPower', mark: 'EasyPower', vendor: 'Power systems', text: 'Electrical power system design and analysis', logo: 'TOOL_LOGO_EASYPOWER' },
    { name: 'Caneco', mark: 'Caneco', vendor: 'ALPI', text: 'Electrical design and cable sizing', logo: 'TOOL_LOGO_CANECO' },
  ] },
  { id: 'design', title: 'Engineering Design & BIM', filter: 'Design & BIM', icon: 'cube', tools: [
    { name: 'Autodesk Revit', mark: 'Revit', vendor: 'Autodesk', text: 'BIM for industrial and infrastructure projects', logo: 'TOOL_LOGO_AUTODESK_REVIT' },
    { name: 'SketchUp', mark: 'SketchUp', vendor: '3D modelling', text: '3D modelling and design visualisation', logo: 'TOOL_LOGO_SKETCHUP' },
  ] },
  { id: 'energy', title: 'Energy & Enterprise Platforms', filter: 'Energy & Enterprise', icon: 'layers', tools: [
    { name: 'PVsyst', mark: 'PVsyst', vendor: 'Solar PV', text: 'Solar PV system design, simulation and analysis', logo: 'TOOL_LOGO_PVSYST' },
    { name: 'SAP', mark: 'SAP', vendor: 'Enterprise', text: 'Enterprise resource planning (ERP) for operations, projects and asset management', logo: 'TOOL_LOGO_SAP' },
  ] },
]

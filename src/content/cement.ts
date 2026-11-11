/**
 * CEMENT PROCESS AREAS — general, technically standard descriptions of a
 * dry-process cement plant. These describe the process and typical
 * automation considerations; they do NOT state that ASEC has installed
 * any specific solution.
 */
export interface ProcessArea {
  id: string
  name: string
  purpose: string
  variables: string[]
  automation: string[]
  monitoring: string[]
  optimisation: string[]
  technologies: string[]
}

export const processAreas: ProcessArea[] = [
  {
    id: 'raw-material', name: 'Raw Material Handling',
    purpose: 'Receives limestone, clay and corrective materials from the quarry, crushes them and builds blended stockpiles that reduce chemical variability before grinding.',
    variables: ['Crusher motor load', 'Belt conveyor speed and load', 'Stacker / reclaimer position', 'Cross-belt analyser readings (where fitted)'],
    automation: ['Conveyor sequencing and interlocks', 'Belt-scale based feed control', 'Stacker-reclaimer automatic modes'],
    monitoring: ['Pull-cord, belt-sway and speed switches', 'Chute blockage detection', 'Stockpile inventory'],
    optimisation: ['Improved pre-blending to stabilise raw meal chemistry', 'Reduced conveyor idle running'],
    technologies: ['PLC', 'Belt weighers', 'Online analysers', 'Motor protection relays'],
  },
  {
    id: 'raw-mill', name: 'Raw Mill',
    purpose: 'Grinds and dries the proportioned raw materials into fine raw meal, using hot kiln exhaust gas for drying in most modern plants.',
    variables: ['Mill feed rate', 'Mill differential pressure', 'Mill outlet temperature', 'Separator speed', 'Mill fan speed / damper position', 'Vibration (vertical roller mills)'],
    automation: ['Feeder proportioning by quality control', 'Mill load and outlet temperature control', 'Water-spray control for bed stability'],
    monitoring: ['Fineness and residue sampling', 'Vibration trips', 'Bag filter differential pressure'],
    optimisation: ['Higher throughput at stable vibration', 'Lower specific power through separator and fan tuning'],
    technologies: ['DCS', 'Raw-mix control', 'Vibration monitoring', 'Variable-speed drives'],
  },
  {
    id: 'preheater', name: 'Preheater',
    purpose: 'A tower of cyclones where raw meal is heated by rising kiln gases, recovering heat and beginning decarbonation before the meal reaches the kiln.',
    variables: ['Cyclone stage temperatures', 'Cyclone outlet pressures', 'Cyclone 1 outlet temperature', 'Gas analysis (O₂, CO) at preheater exit'],
    automation: ['ID fan control for draft', 'Kiln feed rate control', 'Air-blaster sequencing'],
    monitoring: ['Cyclone blockage detection via pressure and temperature', 'Gas analyser health', 'Meal flow indications'],
    optimisation: ['Lower exit gas temperature through stable operation', 'Fewer cyclone blockages'],
    technologies: ['Pressure transmitters', 'Thermocouples', 'Gas analysers', 'Blockage detection logic'],
  },
  {
    id: 'calciner', name: 'Calciner',
    purpose: 'A combustion vessel between preheater and kiln where most of the raw meal is calcined, using a large share of the plant’s fuel.',
    variables: ['Calciner outlet temperature', 'Calciner outlet pressure', 'Calciner fuel flow', 'Tertiary air damper position', 'O₂ / CO at outlet'],
    automation: ['Calciner outlet temperature control via fuel flow', 'Tertiary air balancing', 'Fuel feeder control'],
    monitoring: ['Combustion quality (CO peaks)', 'Pressure conditions', 'Degree of calcination sampling'],
    optimisation: ['Fuel efficiency through tighter temperature control', 'Stable combustion with alternative fuels'],
    technologies: ['DCS', 'Gravimetric fuel feeders', 'Gas analysers', 'Advanced process control'],
  },
  {
    id: 'kiln', name: 'Rotary Kiln',
    purpose: 'The heart of the plant: a rotating inclined cylinder in which calcined meal reaches clinkering temperature and forms clinker minerals.',
    variables: ['Kiln main motor speed and current', 'Kiln head (hood) pressure', 'Kiln inlet temperature and gas analysis', 'Main burner fuel flow (e.g. total kiln oil / coal)', 'Shell temperature profile'],
    automation: ['Kiln drive control', 'Burner fuel flow control', 'Kiln hood draft control via ID fan', 'Kiln feed / speed coordination'],
    monitoring: ['Burning zone temperature (pyrometer)', 'Kiln shell scanner for coating and refractory', 'Alarm monitoring and trip interlocks', 'Kiln current as a proxy for burning conditions'],
    optimisation: ['Process stability to avoid upsets and ring formation', 'Reduced specific heat consumption', 'Better refractory life'],
    technologies: ['DCS', 'Shell scanners', 'Pyrometers', 'Main-drive VFDs', 'Expert / model-based control'],
  },
  {
    id: 'cooler', name: 'Clinker Cooler',
    purpose: 'Rapidly cools hot clinker leaving the kiln while recovering heat as secondary and tertiary combustion air.',
    variables: ['Cooler grate speed', 'Undergrate pressures', 'Cooling fan airflows', 'Secondary / tertiary air temperature', 'Clinker outlet temperature'],
    automation: ['Grate speed control from bed pressure', 'Fan airflow control', 'Hood pressure coordination with kiln'],
    monitoring: ['Temperature monitoring along the cooler', 'Red river / snowman detection', 'Clinker breaker load'],
    optimisation: ['Heat recovery opportunities through better air distribution', 'Lower clinker exit temperature'],
    technologies: ['Variable-speed fans', 'Hydraulic grate drives', 'Thermal cameras', 'DCS'],
  },
  {
    id: 'cement-mill', name: 'Cement Mill',
    purpose: 'Grinds clinker with gypsum and supplementary materials into finished cement of the required fineness and composition.',
    variables: ['Mill feed rate and proportions', 'Mill sound / elevator load', 'Separator speed', 'Mill outlet temperature', 'Fineness (Blaine)'],
    automation: ['Mill load control', 'Proportioning by product recipe', 'Product changeover sequences'],
    monitoring: ['Quality sampling and laboratory feedback', 'Bearing temperatures', 'Filter performance'],
    optimisation: ['Lower specific power per tonne', 'More consistent product quality'],
    technologies: ['PLC / DCS', 'Mill load sensors', 'Laboratory information systems'],
  },
  {
    id: 'packing', name: 'Packing & Dispatch',
    purpose: 'Stores finished cement in silos and dispatches it in bags or in bulk by truck, rail or ship.',
    variables: ['Silo levels', 'Packer bag weight', 'Truck loading weight', 'Dispatch throughput'],
    automation: ['Silo extraction sequences', 'Rotary packer control', 'Truck-loading automation with weighbridges'],
    monitoring: ['Bag weight statistics', 'Level and overfill protection', 'Dispatch records'],
    optimisation: ['Reduced give-away on bag weight', 'Shorter truck turnaround'],
    technologies: ['PLC', 'Weighing systems', 'Dispatch software', 'RFID / barcode'],
  },
  {
    id: 'utilities', name: 'Utility Systems',
    purpose: 'Compressed air, water, power distribution, fuel handling and dust collection that support the main process.',
    variables: ['Compressor pressure and load', 'Power demand by area', 'Water flow and tank levels', 'Filter differential pressure'],
    automation: ['Compressor sequencing', 'Pump and tank level control', 'Power management and load shedding'],
    monitoring: ['Energy metering', 'Equipment run-hours', 'Emission monitoring systems (where required)'],
    optimisation: ['Energy savings from compressor and pump sequencing', 'Leak reduction'],
    technologies: ['Power meters', 'PLC', 'Energy management software'],
  },
  {
    id: 'ccr', name: 'Central Control Room',
    purpose: 'Where operators supervise and control the whole plant — the integration point for every process area.',
    variables: ['All critical process variables', 'Alarm rates and standing alarms', 'Equipment status'],
    automation: ['Plant-wide supervisory control', 'Interlock and sequence management', 'Operator workflows'],
    monitoring: ['Trends and process overviews', 'Alarm management', 'Shift logs and reporting'],
    optimisation: ['Ergonomic, high-performance HMI', 'Decision support and analytics'],
    technologies: ['DCS / SCADA', 'Video walls', 'Historians', 'Reporting systems'],
  },
]

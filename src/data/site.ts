// Single source of truth for company details, copy and navigation.
// Everything here comes from the Narmada Engineering Works brochure.

export const site = {
  name: 'Narmada Engineering Works',
  shortName: 'Narmada Engineering',
  tagline: 'Precision Engineering. Quality Manufacturing.',
  headline: 'Industrial Fabrication & Sheet Metal Solutions',
  subHeadline:
    'Trusted manufacturing partner for precision fabrication and engineering excellence.',
  speciality:
    'Fabrication work & services of any Stenter Machine & Textile Machinery, and Boiler Manpower Supplier.',
  description:
    'Narmada Engineering Works, Umbergaon, Gujarat — precision sheet metal fabrication, heavy fabrication, structural steel works, stenter machine hot panels, nozzle chambers, yarn trolleys, ducting, AHU components, portable cabins and customised engineering solutions.',
  url: 'https://www.narmadaengineeringworks.com',
  email: 'narmada.engworks@yahoo.com',
  founded: '',
  contacts: [
    { name: 'Jaimin Makwana', phone: '+917698555564', display: '+91 76985 55564' },
    { name: 'Vinod Makwana', phone: '+919879565719', display: '+91 98795 65719' },
  ],
  address: {
    street: 'Survey No. 918, Bhomti Faliya, Village Solsumba',
    locality: 'Umbergaon',
    region: 'Gujarat',
    district: 'Valsad',
    postalCode: '396165',
    country: 'IN',
    countryName: 'India',
    full: 'Survey No. 918, Bhomti Faliya, Village: Solsumba, Taluka: Umbergaon, Dist. Valsad, Gujarat – 396165, India',
  },
  geo: { lat: 20.1736, lng: 72.7906 },
  hours: 'Mon – Sat, 9:00 AM – 7:00 PM',
  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '19:00',
  },
  /** Facebook / Instagram / IndiaMART URLs — add them here once the pages are live. */
  social: [] as string[],
} as const

export const nav = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Products', href: '#products' },
  { label: 'Industries', href: '#industries' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
] as const

export const aboutParagraphs = [
  'Narmada Engineering Works is a trusted manufacturing and fabrication company specialising in precision sheet metal fabrication, heavy fabrication, structural steel works, industrial components and customised engineering solutions. We are also specialised in Stenter Machine Hot Panels, Stenter Nozzle Chambers, Yarn Trolleys and textile machinery fabrication work.',
  'With strong industry experience, we deliver reliable products for various industrial applications with a focus on quality manufacturing, dimensional accuracy, durable finishing and timely project execution.',
  'Supported by skilled manpower, modern fabrication practices and a dedicated technical team, we handle both precision jobs and heavy industrial fabrication requirements with confidence.',
  'Our aim is to provide dependable engineering solutions through continuous improvement, quick turnaround, on-time delivery and complete customer satisfaction.',
]

export const vision =
  'To make Narmada Engineering Works a trusted name in India’s fabrication and engineering industry by providing reliable, innovative and high-quality solutions for industrial supply chains.'

export const mission =
  'To continuously improve our manufacturing systems and deliver precision-engineered products with excellent quality, quick turnaround, on-time delivery and dependable customer service.'

export const capabilities = [
  {
    icon: 'panel',
    title: 'Stenter Machine Hot Panels',
    body: 'Insulated hot panels and chamber panels for stenter ranges, built to hold shape and sealing under continuous heat.',
  },
  {
    icon: 'cylinder',
    title: 'Stenter Nozzle Chambers',
    body: 'MS and stainless nozzle chambers and air distribution boxes fabricated to drawing for uniform airflow.',
  },
  {
    icon: 'trolley',
    title: 'Yarn Trolleys & Handling',
    body: 'Yarn trolleys, bobbin trolleys and material handling frames for textile plants and warehouses.',
  },
  {
    icon: 'duct',
    title: 'Industrial Ducting & Hoods',
    body: 'GI and MS ducting, transitions, exhaust hoods, canopies and plenums for process and ventilation lines.',
  },
  {
    icon: 'fan',
    title: 'Fans, Impellers & Housings',
    body: 'Axial and centrifugal fan housings, impellers, inlet cones and mounting plates, balanced and finished.',
  },
  {
    icon: 'filter',
    title: 'AHU Components & Filter Housings',
    body: 'AHU sections, filter frames, mesh screens and filter housings for HVAC and clean-air systems.',
  },
  {
    icon: 'louver',
    title: 'Louvers & Dampers',
    body: 'Louvered ventilation panels, multi-blade dampers and blade assemblies in galvanised and coated finishes.',
  },
  {
    icon: 'structure',
    title: 'MS Structures & Machine Frames',
    body: 'Structural steel works, base frames, skids, machine enclosures, guards and fabricated covers.',
  },
  {
    icon: 'cabin',
    title: 'Portable Cabins & Bunk Houses',
    body: 'Portable site offices, security cabins and bunk house containers with cladding, doors and windows.',
  },
  {
    icon: 'hopper',
    title: 'Hoppers, Chutes & Enclosures',
    body: 'Heavy-duty hoppers, chutes, transition boxes and fabricated enclosures for process plants.',
  },
  {
    icon: 'spray',
    title: 'Finishing & Coating',
    body: 'In-house surface preparation, priming, painting and powder-coated finishes before dispatch.',
  },
  {
    icon: 'people',
    title: 'Boiler Manpower Supply',
    body: 'Skilled manpower supply for boiler and plant operations alongside our fabrication services.',
  },
]

export const industries = [
  'Textile Industry',
  'Engineering Industry',
  'Pharmaceutical Industry',
  'Chemical Industry',
  'HVAC Industry',
  'Manufacturing Plants',
  'Industrial Automation',
  'Power Distribution Sector',
  'Warehousing & Logistics',
  'Infrastructure Projects',
  'Commercial & Industrial Construction',
  'Fabrication & Processing Industry',
]

export const whyChooseUs = [
  'High-Quality Manufacturing Standards',
  'Reliable Product Performance',
  'Skilled & Experienced Workforce',
  'Quick Turnaround Time',
  'Accurate Fabrication & Finishing',
  'Competitive Pricing',
  'Customized Product Development',
  'On-Time Delivery',
  'Strong Industrial Experience',
  'Customer-Focused Service',
  'Modern Fabrication Capabilities',
  'Strict Quality Control at Every Stage',
]

export const processSteps = [
  {
    step: '01',
    title: 'Enquiry & Drawing Review',
    body: 'Share your drawing, sample or requirement. We review material, tolerance and finish before quoting.',
  },
  {
    step: '02',
    title: 'Quotation & Approval',
    body: 'You receive a clear quotation with scope and lead time. Work starts on your confirmation.',
  },
  {
    step: '03',
    title: 'Fabrication & Assembly',
    body: 'Cutting, bending, welding and assembly by skilled fabricators using modern practices.',
  },
  {
    step: '04',
    title: 'Inspection & Finishing',
    body: 'Dimensional checks at every stage, followed by surface treatment, painting or powder coating.',
  },
  {
    step: '05',
    title: 'Packing & Dispatch',
    body: 'Protective packing and on-time dispatch, with support after delivery whenever you need it.',
  },
]

export const highlights = [
  'Precision Sheet Metal',
  'Heavy Fabrication',
  'Structural Steel Works',
  'Textile Machinery Parts',
  'Custom Job Work',
]

export const mapQuery = encodeURIComponent(
  'Solsumba, Umbergaon, Valsad, Gujarat 396165, India',
)

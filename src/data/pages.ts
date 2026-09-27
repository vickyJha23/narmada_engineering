/**
 * The site's page table.
 *
 * This one list drives the header nav, the footer links, the per-page <title>
 * and meta description, the breadcrumbs, the prerender step (which renders one
 * static HTML file per path) and sitemap.xml. Add a page here and everything
 * downstream picks it up.
 */

export type PageDef = {
  path: string
  /** Text used in the header and footer navigation. */
  label: string
  /** <title>, without the company-name suffix. */
  title: string
  description: string
  /** Heading shown in the page banner. */
  heading: string
  /** Supporting line under the banner heading. */
  intro: string
  inNav: boolean
}

export const pages: PageDef[] = [
  {
    path: '/',
    label: 'Home',
    title: 'Industrial Fabrication & Sheet Metal Manufacturer in Umbergaon, Gujarat',
    description:
      'Precision sheet metal fabrication, heavy fabrication and structural steel works from Umbergaon, Gujarat. Stenter machine hot panels, nozzle chambers, yarn trolleys, ducting, AHU components and portable cabins, made to your drawing.',
    heading: 'Industrial Fabrication & Sheet Metal Solutions',
    intro:
      'Trusted manufacturing partner for precision fabrication and engineering excellence.',
    inNav: true,
  },
  {
    path: '/about',
    label: 'About',
    title: 'About Us — Fabrication Company in Umbergaon, Valsad',
    description:
      'Narmada Engineering Works is a trusted manufacturing and fabrication company specialising in precision sheet metal, heavy fabrication, structural steel works and textile machinery components. Read about our vision, mission and way of working.',
    heading: 'A dependable fabrication partner for Indian industry',
    intro:
      'Skilled manpower, modern fabrication practices and a technical team that reads your drawing before it quotes it.',
    inNav: true,
  },
  {
    path: '/capabilities',
    label: 'Capabilities',
    title: 'Our Fabrication Capabilities & Services',
    description:
      'Stenter hot panels, nozzle chambers, yarn trolleys, industrial ducting, fan housings, AHU and filter components, louvers, dampers, MS structures, portable cabins, hoppers, in-house finishing and custom job work to drawing.',
    heading: 'Fabrication capabilities under one roof',
    intro:
      'Precision sheet metal, heavy fabrication and structural steel work — built to your drawing, finished in house and inspected before dispatch.',
    inNav: true,
  },
  {
    path: '/products',
    label: 'Products',
    title: 'Our Products — Fabricated Sheet Metal & Textile Machinery Parts',
    description:
      'Browse fabricated products delivered from our Umbergaon works: stenter panels, nozzle chambers, ducting, hoods, fan housings, louvers, dampers, filter housings, AHU parts, trolleys, hoppers, MS structures, cabins and bunk houses.',
    heading: 'Products built to drawing',
    intro:
      'A selection of jobs delivered from our Umbergaon works. Filter by category, or open any product to enquire about it.',
    inNav: true,
  },
  {
    path: '/gallery',
    label: 'Our Work',
    title: 'Our Work — Shop Floor, Fabrication & Dispatch Gallery',
    description:
      'Photographs from the Narmada Engineering Works shop floor in Umbergaon: fabrication in progress, finishing and powder coating, packed jobs and loaded dispatches.',
    heading: 'From the shop floor',
    intro:
      'Work in progress, finished jobs and dispatch days, photographed at our Umbergaon works.',
    inNav: true,
  },
  {
    path: '/industries',
    label: 'Industries',
    title: 'Industries We Serve — Textile, HVAC, Pharma, Chemical & More',
    description:
      'We supply fabricated components to the textile, engineering, pharmaceutical, chemical and HVAC industries, manufacturing plants, warehousing, infrastructure projects and industrial construction across Gujarat and Maharashtra.',
    heading: 'Supplying plants across Gujarat, Maharashtra and beyond',
    intro:
      'The same fabrication discipline, applied to whatever your process demands.',
    inNav: true,
  },
  {
    path: '/contact',
    label: 'Contact',
    title: 'Contact Us — Get a Fabrication Quote',
    description:
      'Contact Narmada Engineering Works, Survey No. 918, Solsumba, Umbergaon, Dist. Valsad, Gujarat 396165. Call +91 76985 55564 or send your drawing on WhatsApp for a quotation and lead time.',
    heading: 'Tell us what you need fabricated',
    intro:
      'Call, WhatsApp or send the form. We reply with feasibility, material options and a lead time.',
    inNav: true,
  },
]

export const navPages = pages.filter((p) => p.inNav)

export function findPage(path: string) {
  return pages.find((p) => p.path === path)
}

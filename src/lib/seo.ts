import { site, capabilities, industries } from '../data/site'
import { products, productCategories, type Product } from '../data/products'
import { pages, findPage } from '../data/pages'

const baseUrl = (
  (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || site.url
).replace(/\/$/, '')

export const siteUrl = baseUrl

export const orgId = `${baseUrl}/#organization`
const siteId = `${baseUrl}/#website`

export const abs = (path: string) => `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`

/** Everything a page needs in <head>. */
export type PageMeta = {
  title: string
  description: string
  canonical: string
  image: string
  structuredData: object
}

/* ------------------------------------------------------------------ nodes -- */

function organisationNode() {
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': orgId,
    name: site.name,
    alternateName: site.shortName,
    url: baseUrl,
    logo: abs('/brand/logo.png'),
    image: abs('/og-image.jpg'),
    slogan: site.tagline,
    description: site.description,
    email: site.email,
    telephone: site.contacts.map((c) => c.phone),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: { '@type': 'Country', name: 'India' },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: site.openingHours.days,
        opens: site.openingHours.opens,
        closes: site.openingHours.closes,
      },
    ],
    ...(site.social.length > 0 ? { sameAs: site.social.map((s) => s.url) } : {}),
    knowsAbout: capabilities.map((c) => c.title),
    contactPoint: site.contacts.map((c) => ({
      '@type': 'ContactPoint',
      contactType: 'sales',
      name: c.name,
      telephone: c.phone,
      email: site.email,
      availableLanguage: ['en', 'hi', 'gu'],
    })),
  }
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': siteId,
    url: baseUrl,
    name: site.name,
    publisher: { '@id': orgId },
    inLanguage: 'en-IN',
  }
}

/** Breadcrumb trail; Google renders this above the result title. */
function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  }
}

function catalogNode() {
  return {
    '@type': 'OfferCatalog',
    '@id': `${baseUrl}/#catalog`,
    name: 'Fabrication Products & Services',
    provider: { '@id': orgId },
    itemListElement: productCategories.map((category, i) => ({
      '@type': 'OfferCatalog',
      position: i + 1,
      name: category,
      itemListElement: products
        .filter((p) => p.category === category)
        .map((p) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: p.title,
            category,
            url: abs(`/products/${p.slug}`),
            image: abs(p.src),
            provider: { '@id': orgId },
          },
        })),
    })),
  }
}

/* ------------------------------------------------------------------ pages -- */

/** Meta + schema.org graph for one of the fixed pages in `pages.ts`. */
export function pageMeta(path: string): PageMeta {
  const page = findPage(path) ?? pages[0]
  const isHome = page.path === '/'

  const graph: object[] = [
    organisationNode(),
    websiteNode(),
    {
      '@type': isHome ? 'WebPage' : 'CollectionPage',
      '@id': `${abs(page.path)}#webpage`,
      url: abs(page.path),
      name: `${page.title} | ${site.name}`,
      isPartOf: { '@id': siteId },
      about: { '@id': orgId },
      description: page.description,
      primaryImageOfPage: abs('/og-image.jpg'),
      inLanguage: 'en-IN',
    },
  ]

  if (!isHome) {
    graph.push(
      breadcrumbNode([
        { name: 'Home', path: '/' },
        { name: page.label, path: page.path },
      ]),
    )
  }

  if (isHome || page.path === '/products') graph.push(catalogNode())

  if (isHome || page.path === '/capabilities') {
    graph.push({
      '@type': 'Service',
      '@id': `${baseUrl}/#service`,
      serviceType: 'Industrial fabrication and sheet metal job work',
      provider: { '@id': orgId },
      areaServed: industries.map((name) => ({ '@type': 'Audience', name })),
    })
  }

  if (isHome || page.path === '/contact') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${abs(page.path)}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  return {
    title: `${page.title} | ${site.name}`,
    description: page.description,
    canonical: abs(page.path),
    image: abs('/og-image.jpg'),
    structuredData: { '@context': 'https://schema.org', '@graph': graph },
  }
}

/** Meta + Service schema for a single product page. */
export function productMeta(product: Product): PageMeta {
  const title = `${product.title} Manufacturer in Umbergaon, Gujarat`
  const description = `${product.title} — ${product.category.toLowerCase()} fabricated to drawing by ${
    site.name
  }, Umbergaon, Dist. Valsad, Gujarat. Enquire for material options, sizes and lead time.`

  return {
    title: `${title} | ${site.name}`,
    description,
    canonical: abs(`/products/${product.slug}`),
    image: abs(product.src),
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        organisationNode(),
        websiteNode(),
        // Every item is made to drawing and quoted per job, so there is no list
        // price. Schema.org Product without a price, review or rating is flagged
        // invalid by Google's product-snippet checks — describe it as a service.
        {
          '@type': 'Service',
          '@id': `${abs(`/products/${product.slug}`)}#service`,
          name: product.title,
          serviceType: `${product.title} fabrication`,
          category: product.category,
          image: abs(product.src),
          description,
          url: abs(`/products/${product.slug}`),
          provider: { '@id': orgId },
          brand: { '@id': orgId },
          areaServed: { '@type': 'Country', name: 'India' },
        },
        breadcrumbNode([
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: product.title, path: `/products/${product.slug}` },
        ]),
      ],
    },
  }
}

/** Resolves any URL the prerender step asks for, including product pages. */
export function metaForPath(path: string): PageMeta {
  const clean = path.length > 1 ? path.replace(/\/$/, '') : path
  if (clean.startsWith('/products/')) {
    const slug = clean.slice('/products/'.length)
    const product = products.find((p) => p.slug === slug)
    if (product) return productMeta(product)
  }
  return pageMeta(clean)
}

/* -------------------------------------------------------------------- faq -- */

export const faqs = [
  {
    q: 'What does Narmada Engineering Works manufacture?',
    a: 'We manufacture precision sheet metal and heavy fabricated products including stenter machine hot panels, stenter nozzle chambers, yarn trolleys, fabricated enclosures, machine covers, industrial ducting, louvers, dampers, filter housings, AHU components, MS structures, portable cabins, bunk house containers, textile machinery parts and fully customised fabrication products.',
  },
  {
    q: 'Where is your fabrication unit located?',
    a: `Our works is at ${site.address.full}. Umbergaon is on the Gujarat–Maharashtra border, giving us easy access to industrial belts in both states.`,
  },
  {
    q: 'Do you take up custom fabrication as per drawing?',
    a: 'Yes. Send us a drawing, sample or sketch with material, quantity and finish requirements. We review it, confirm feasibility and share a quotation with a committed lead time.',
  },
  {
    q: 'Which industries do you supply to?',
    a: `We supply to the ${industries.slice(0, 6).join(', ')} and other sectors including warehousing, infrastructure and industrial construction.`,
  },
  {
    q: 'Do you provide finishing such as painting or powder coating?',
    a: 'Yes. Surface preparation, priming, painting and powder-coated finishes are done in house, and every job is dimensionally checked before protective packing and dispatch.',
  },
  {
    q: 'Which materials do you fabricate in?',
    a: 'We work in mild steel (MS), stainless steel and galvanised (GI) sheet, along with structural steel sections — selected to suit the duty, temperature and finish your application needs.',
  },
]

/** Every URL the site publishes — used by the prerender step and the sitemap. */
export const allPaths = [
  ...pages.map((p) => p.path),
  ...products.map((p) => `/products/${p.slug}`),
]

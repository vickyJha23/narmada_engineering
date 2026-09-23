import { site, capabilities, industries } from '../data/site'
import { products, productCategories } from '../data/products'

const baseUrl = (
  (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || site.url
).replace(/\/$/, '')

export const siteUrl = baseUrl

/**
 * schema.org graph for the homepage. Google uses this for the knowledge panel,
 * the business card in local search and rich results.
 */
export function buildStructuredData() {
  const orgId = `${baseUrl}/#organization`
  const siteId = `${baseUrl}/#website`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': orgId,
        name: site.name,
        alternateName: site.shortName,
        url: baseUrl,
        logo: `${baseUrl}/brand/logo.png`,
        image: `${baseUrl}/og-image.jpg`,
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
      },
      {
        '@type': 'WebSite',
        '@id': siteId,
        url: baseUrl,
        name: site.name,
        publisher: { '@id': orgId },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/#webpage`,
        url: baseUrl,
        name: `${site.name} | ${site.headline}`,
        isPartOf: { '@id': siteId },
        about: { '@id': orgId },
        description: site.description,
        primaryImageOfPage: `${baseUrl}/og-image.jpg`,
      },
      {
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
                '@type': 'Product',
                name: p.title,
                category,
                image: `${baseUrl}${p.src}`,
                manufacturer: { '@id': orgId },
              },
            })),
        })),
      },
      {
        '@type': 'Service',
        '@id': `${baseUrl}/#service`,
        serviceType: 'Industrial fabrication and sheet metal job work',
        provider: { '@id': orgId },
        areaServed: industries.map((name) => ({ '@type': 'Audience', name })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/#faq`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

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

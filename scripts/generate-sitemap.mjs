/**
 * Writes dist/sitemap.xml: every route the site publishes, plus an image entry
 * for each product photo so the catalogue can surface in Google Images.
 *
 * Override the domain with VITE_SITE_URL in .env before building.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()

/** Minimal .env reader — this script runs outside Vite, so nothing loads it for us. */
async function envValue(key) {
  if (process.env[key]) return process.env[key]
  for (const file of ['.env.local', '.env']) {
    try {
      const text = await readFile(resolve(root, file), 'utf8')
      const hit = text.match(new RegExp(`^\\s*${key}\\s*=\\s*(.*)$`, 'm'))
      if (hit) {
        const value = hit[1].trim().replace(/^["']|["']$/g, '')
        if (value) return value
      }
    } catch {
      /* file absent — keep looking */
    }
  }
  return ''
}

const siteUrl = (
  (await envValue('VITE_SITE_URL')) || 'https://www.narmadaengineeringworks.com'
).replace(/\/$/, '')

// Read the generated data without needing a TS toolchain.
const productSrc = await readFile(resolve(root, 'src/data/products.ts'), 'utf8')
const products = [
  ...productSrc.matchAll(
    /slug: '(.+?)',\s*title: '(.+?)',\s*category: '(.+?)',\s*src: '(.+?)',/g,
  ),
].map(([, slug, title, category, src]) => ({ slug, title, category, src }))

if (!products.length) {
  throw new Error('generate-sitemap: no products parsed from src/data/products.ts')
}

const pageSrc = await readFile(resolve(root, 'src/data/pages.ts'), 'utf8')
const pagePaths = [...pageSrc.matchAll(/^\s*path: '(.+?)',$/gm)].map(([, p]) => p)

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const today = new Date().toISOString().slice(0, 10)

function urlNode(path, { priority, changefreq, images = [] }) {
  const imageXml = images
    .map(
      (p) => `    <image:image>
      <image:loc>${siteUrl}${p.src}</image:loc>
      <image:title>${esc(p.title)}</image:title>
      <image:caption>${esc(`${p.title} — ${p.category} fabricated by Narmada Engineering Works, Umbergaon, Gujarat`)}</image:caption>
    </image:image>`,
    )
    .join('\n')

  return `  <url>
    <loc>${siteUrl}${path === '/' ? '/' : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${imageXml}${imageXml ? '\n' : ''}  </url>`
}

const nodes = []

for (const path of pagePaths) {
  nodes.push(
    urlNode(path, {
      priority: path === '/' ? '1.0' : path === '/products' ? '0.9' : '0.8',
      changefreq: 'monthly',
      // The products page carries the whole catalogue's images.
      images: path === '/products' ? products : [],
    }),
  )
}

for (const p of products) {
  nodes.push(
    urlNode(`/products/${p.slug}`, {
      priority: '0.7',
      changefreq: 'yearly',
      images: [p],
    }),
  )
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${nodes.join('\n')}
</urlset>
`

await writeFile(resolve(root, 'dist/sitemap.xml'), xml)
console.log(
  `sitemap: ${pagePaths.length} pages + ${products.length} product pages, ${products.length} images`,
)

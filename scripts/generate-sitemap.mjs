/**
 * Writes dist/sitemap.xml with the homepage plus an image entry for every
 * product photo, so Google Images can index the catalogue.
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
      const hit = text.match(new RegExp(`^\s*${key}\s*=\s*(.*)$`, 'm'))
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

// Read the generated catalogue without needing a TS toolchain.
const source = await readFile(resolve(root, 'src/data/products.ts'), 'utf8')
const entries = [...source.matchAll(/title: '(.+?)',\s*category: '(.+?)',\s*src: '(.+?)',/g)].map(
  ([, title, category, src]) => ({ title, category, src }),
)

if (!entries.length) throw new Error('generate-sitemap: no products parsed from src/data/products.ts')

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const today = new Date().toISOString().slice(0, 10)

const images = entries
  .map(
    (p) => `    <image:image>
      <image:loc>${siteUrl}${p.src}</image:loc>
      <image:title>${esc(p.title)}</image:title>
      <image:caption>${esc(`${p.title} — ${p.category} fabricated by Narmada Engineering Works, Umbergaon, Gujarat`)}</image:caption>
    </image:image>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${images}
  </url>
</urlset>
`

await writeFile(resolve(root, 'dist/sitemap.xml'), xml)
console.log(`sitemap: wrote dist/sitemap.xml (${entries.length} product images)`)

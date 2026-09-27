/**
 * Renders every route to its own static HTML file.
 *
 * Search engines and link-preview scrapers then read each page's real content
 * and its own title, description, canonical URL and JSON-LD without executing
 * any JavaScript. The browser hydrates the same markup, so the site stays a
 * single-page app once it loads.
 *
 * Run after `vite build` and `vite build --ssr` — see the `build` script.
 */
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = resolve(root, 'dist')
const serverDir = resolve(dist, 'server')

const template = await readFile(resolve(dist, 'index.html'), 'utf8')
const { render, allPaths } = await import(
  pathToFileURL(resolve(serverDir, 'entry-server.js')).href
)

const ROOT_MARKER = '<div id="root"></div>'
if (!template.includes(ROOT_MARKER)) {
  throw new Error('prerender: could not find <div id="root"></div> in dist/index.html')
}

const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const escapeText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

/** Swap one meta tag's content, matched on its name/property attribute. */
function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[\\s\\S]*?(")`, 'i')
  if (!re.test(html)) {
    return html.replace(
      '</head>',
      `    <meta ${attr}="${key}" content="${escapeAttr(value)}" />\n  </head>`,
    )
  }
  return html.replace(re, `$1${escapeAttr(value)}$2`)
}

function buildPage(html, meta) {
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(meta.title)}</title>`)
    .replace(
      /(<link\s+rel="canonical"\s+href=")[\s\S]*?(")/i,
      `$1${escapeAttr(meta.canonical)}$2`,
    )

  out = setMeta(out, 'name', 'description', meta.description)
  out = setMeta(out, 'property', 'og:title', meta.title)
  out = setMeta(out, 'property', 'og:description', meta.description)
  out = setMeta(out, 'property', 'og:url', meta.canonical)
  out = setMeta(out, 'property', 'og:image', meta.image)
  out = setMeta(out, 'name', 'twitter:title', meta.title)
  out = setMeta(out, 'name', 'twitter:description', meta.description)
  out = setMeta(out, 'name', 'twitter:image', meta.image)

  const ld = `    <script type="application/ld+json" data-route>${JSON.stringify(
    meta.structuredData,
  ).replace(/</g, '\\u003c')}</script>\n  </head>`
  out = out.replace('</head>', ld)

  return out
}

let written = 0
let bytes = 0

for (const path of allPaths) {
  const { html, meta } = render(path)
  const page = buildPage(template, meta).replace(
    ROOT_MARKER,
    `<div id="root">${html}</div>`,
  )

  const file =
    path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${path}`, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page)
  written++
  bytes += html.length
}

// A 404 that still carries the site chrome, for hosts that serve one.
{
  const { html, meta } = render('/this-page-does-not-exist')
  await writeFile(
    resolve(dist, '404.html'),
    buildPage(template, meta).replace(ROOT_MARKER, `<div id="root">${html}</div>`),
  )
}

// The SSR bundle is a build artefact, not something to deploy.
await rm(serverDir, { recursive: true, force: true })

console.log(
  `prerender: ${written} routes + 404.html (${(bytes / written / 1024).toFixed(1)} kB of markup per page, average)`,
)

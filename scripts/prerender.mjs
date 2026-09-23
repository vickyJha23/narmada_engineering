/**
 * Bakes the React app into dist/index.html.
 *
 * Search engines (and every social preview scraper) then see the full page
 * text without running JavaScript. The client still hydrates the same markup,
 * so the site stays interactive.
 *
 * Run after `vite build` and `vite build --ssr` — see the `build` script.
 */
import { readFile, writeFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = resolve(root, 'dist')
const serverDir = resolve(dist, 'server')

const template = await readFile(resolve(dist, 'index.html'), 'utf8')
const { render } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href)

const html = render()

const marker = '<div id="root"></div>'
if (!template.includes(marker)) {
  throw new Error('prerender: could not find <div id="root"></div> in dist/index.html')
}

await writeFile(resolve(dist, 'index.html'), template.replace(marker, `<div id="root">${html}</div>`))

// The SSR bundle is a build artefact, not something to deploy.
await rm(serverDir, { recursive: true, force: true })

console.log(`prerender: wrote dist/index.html (${(html.length / 1024).toFixed(1)} kB of markup)`)

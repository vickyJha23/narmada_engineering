import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.tsx'
import { metaForPath, allPaths } from './lib/seo'

export { allPaths }

/** Called by scripts/prerender.mjs once per route. */
export function render(url: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return { html, meta: metaForPath(url) }
}

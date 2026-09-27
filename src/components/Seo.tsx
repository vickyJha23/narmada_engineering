import { useEffect } from 'react'
import type { PageMeta } from '../lib/seo'

/**
 * Keeps <head> in step with the current route.
 *
 * Crawlers get the right tags without this — the prerender step bakes them into
 * each route's static HTML. This handles the client-side case: once react-router
 * swaps pages without a reload, the title, description, canonical, Open Graph
 * tags and JSON-LD all have to be rewritten for the new page.
 */
export function Seo({ meta }: { meta: PageMeta }) {
  useEffect(() => {
    document.title = meta.title

    setMeta('name', 'description', meta.description)
    setMeta('property', 'og:title', meta.title)
    setMeta('property', 'og:description', meta.description)
    setMeta('property', 'og:url', meta.canonical)
    setMeta('property', 'og:image', meta.image)
    setMeta('name', 'twitter:title', meta.title)
    setMeta('name', 'twitter:description', meta.description)
    setMeta('name', 'twitter:image', meta.image)

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = meta.canonical

    let ld = document.head.querySelector<HTMLScriptElement>(
      'script[type="application/ld+json"][data-route]',
    )
    if (!ld) {
      ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.dataset.route = 'true'
      document.head.appendChild(ld)
    }
    ld.textContent = JSON.stringify(meta.structuredData)
  }, [meta])

  return null
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

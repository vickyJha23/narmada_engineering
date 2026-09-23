/**
 * Website traffic + behaviour tracking.
 *
 * Nothing loads unless you put an ID in `.env` (copy `.env.example` to `.env`).
 * Three providers are supported and you can enable any combination:
 *
 *   VITE_GA_MEASUREMENT_ID   Google Analytics 4  — visitor counts, sources, geography
 *   VITE_CLARITY_PROJECT_ID  Microsoft Clarity   — session replays + heatmaps (free)
 *   VITE_PLAUSIBLE_DOMAIN    Plausible           — cookie-free, privacy friendly
 *
 * See ANALYTICS.md for setup instructions.
 */

type Params = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
    plausible?: (event: string, opts?: { props?: Params }) => void
  }
}

const env = import.meta.env

export const analyticsConfig = {
  gaId: (env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() || '',
  clarityId: (env.VITE_CLARITY_PROJECT_ID as string | undefined)?.trim() || '',
  plausibleDomain: (env.VITE_PLAUSIBLE_DOMAIN as string | undefined)?.trim() || '',
  /** Set VITE_ANALYTICS_IN_DEV=true to test tracking on localhost. */
  allowInDev: String(env.VITE_ANALYTICS_IN_DEV ?? '').toLowerCase() === 'true',
  /** Set VITE_ANALYTICS_RESPECT_DNT=false to ignore the browser Do-Not-Track signal. */
  respectDnt: String(env.VITE_ANALYTICS_RESPECT_DNT ?? 'true').toLowerCase() !== 'false',
}

const isBrowser = typeof window !== 'undefined'

function doNotTrack() {
  if (!isBrowser) return false
  const nav = window.navigator as Navigator & { msDoNotTrack?: string }
  return (
    nav.doNotTrack === '1' ||
    nav.msDoNotTrack === '1' ||
    (window as unknown as { doNotTrack?: string }).doNotTrack === '1'
  )
}

function enabled() {
  if (!isBrowser) return false
  if (env.DEV && !analyticsConfig.allowInDev) return false
  if (analyticsConfig.respectDnt && doNotTrack()) return false
  return true
}

function loadScript(src: string, attrs: Record<string, string> = {}) {
  const el = document.createElement('script')
  el.async = true
  el.src = src
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  document.head.appendChild(el)
  return el
}

let started = false

export function initAnalytics() {
  if (started || !enabled()) return
  started = true

  const { gaId, clarityId, plausibleDomain } = analyticsConfig

  if (gaId) {
    const layer: unknown[] = window.dataLayer || []
    window.dataLayer = layer
    // GA reads the raw `arguments` object off dataLayer, so keep the official
    // snippet shape here rather than a rest-parameter arrow function.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params -- gtag.js reads the Arguments object
      layer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', gaId, { send_page_view: true, anonymize_ip: true })
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`)
  }

  if (clarityId) {
    // Queue calls until clarity.ms answers, exactly like the official snippet.
    const queue: unknown[][] = []
    const stub = (...args: unknown[]) => queue.push(args)
    ;(stub as unknown as { q: unknown[][] }).q = queue
    window.clarity = window.clarity || stub
    loadScript(`https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`)
  }

  if (plausibleDomain) {
    const queue: unknown[][] = []
    const stub = (...args: unknown[]) => queue.push(args)
    ;(stub as unknown as { q: unknown[][] }).q = queue
    window.plausible = window.plausible || (stub as Window['plausible'])
    loadScript('https://plausible.io/js/script.js', {
      'data-domain': plausibleDomain,
      defer: 'true',
    })
  }

  trackScrollDepth()
}

/** Send a custom event to every provider that is switched on. */
export function track(event: string, params: Params = {}) {
  if (!enabled()) return
  const clean: Params = {}
  for (const [k, v] of Object.entries(params)) if (v !== undefined) clean[k] = v

  window.gtag?.('event', event, clean)
  window.clarity?.('event', event)
  window.plausible?.(event, Object.keys(clean).length ? { props: clean } : undefined)

  if (env.DEV) console.debug('[analytics]', event, clean)
}

/** Fires once per threshold so you can see how far visitors actually read. */
function trackScrollDepth() {
  const marks = [25, 50, 75, 100]
  const seen = new Set<number>()
  let ticking = false

  const measure = () => {
    ticking = false
    const doc = document.documentElement
    const scrollable = doc.scrollHeight - window.innerHeight
    if (scrollable <= 0) return
    const pct = ((window.scrollY / scrollable) * 100) | 0
    for (const m of marks) {
      if (pct >= m && !seen.has(m)) {
        seen.add(m)
        track('scroll_depth', { percent: m })
      }
    }
    if (seen.size === marks.length) window.removeEventListener('scroll', onScroll)
  }

  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(measure)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
}

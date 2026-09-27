import { useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer, FloatingActions, MobileBar } from './Footer'
import { Icon } from './Icons'
import { initAnalytics, track } from '../lib/analytics'
import {
  useParallax,
  useScrollProgress,
  useScrollReveal,
  useScrollTriggerRefresh,
} from '../lib/animate'

/** Jump to the top on navigation — a router does not do this for you. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}

export function Layout() {
  const { pathname } = useLocation()

  useScrollReveal()
  useScrollProgress()
  useParallax()
  useScrollTriggerRefresh()

  useEffect(() => {
    initAnalytics()
  }, [])

  // Report each route change as its own page view.
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    track('page_view', { page_path: pathname })
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />
      <div className="progress" aria-hidden="true" />
      <ScrollToTop />

      <main id="main">
        <Outlet />
      </main>

      <Footer />
      <FloatingActions />
      <MobileBar />
    </>
  )
}

/** Banner at the top of every page except the home page. */
export function PageHero({
  eyebrow,
  heading,
  intro,
  trail,
}: {
  eyebrow: string
  heading: string
  intro: string
  trail?: { label: string; to?: string }[]
}) {
  const scope = useRef<HTMLElement>(null)

  return (
    <section className="page-hero" ref={scope}>
      <div className="page-hero__aurora" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {(trail ?? []).map((c) => (
            <span key={c.label}>
              <Icon name="chevronRight" />
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </span>
          ))}
        </nav>

        <p className="eyebrow">{eyebrow}</p>
        <h1>{heading}</h1>
        <p className="page-hero__intro">{intro}</p>
      </div>

      <svg className="hero__cut" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 90H1440V34H700L640 62H0Z" />
      </svg>
    </section>
  )
}

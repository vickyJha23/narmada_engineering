import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navPages } from '../data/pages'
import { site } from '../data/site'
import { track } from '../lib/analytics'
import { useBodyLock, useEscape, useScrolledPast } from '../lib/hooks'
import { telLink, waLink } from '../lib/links'
import { Icon } from './Icons'

export function Header() {
  const stuck = useScrolledPast(40)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useBodyLock(open)
  useEscape(() => setOpen(false), open)

  // The drawer links close it themselves on click; this handles the viewport
  // growing back to desktop width while it is still open.
  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 861px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [open])

  const primary = site.contacts[0]
  // Only the home page has a dark hero behind the header to sit transparently over.
  const solid = stuck || !isHome

  return (
    <>
      <header className={`header${solid ? ' is-stuck' : ''}`}>
        <div className="container">
          <Link className="brand" to="/" aria-label={`${site.name} — home`}>
            <img
              src="/brand/logo.png"
              alt={site.name}
              width={900}
              height={248}
              fetchPriority="high"
            />
          </Link>

          <nav className="nav" aria-label="Primary">
            {navPages.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link
            className="btn header-cta"
            to="/contact"
            onClick={() => track('cta_click', { location: 'header', label: 'Get a Quote' })}
          >
            Get a Quote
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>

      {open && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Site menu">
          <button
            type="button"
            className="drawer__scrim"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="drawer__panel">
            <div className="drawer__top">
              <img src="/brand/logo.png" alt={site.name} width={900} height={248} />
              <button
                type="button"
                className="icon-btn"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>

            {navPages.map((item) => (
              <NavLink
                key={item.path}
                className="drawer__link"
                to={item.path}
                end={item.path === '/'}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <Icon name="chevronRight" />
              </NavLink>
            ))}

            <div className="drawer__actions">
              <a
                className="btn btn--wa btn--block"
                href={waLink()}
                target="_blank"
                rel="noopener"
                onClick={() => track('whatsapp_click', { location: 'drawer' })}
              >
                <Icon name="whatsapp" /> WhatsApp Us
              </a>
              <a
                className="btn btn--outline btn--block"
                href={telLink(primary.phone)}
                onClick={() => track('call_click', { location: 'drawer' })}
              >
                <Icon name="phone" /> {primary.display}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

import { useEffect, useState } from 'react'
import { nav, site } from '../data/site'
import { track } from '../lib/analytics'
import { useActiveSection, useBodyLock, useEscape, useScrolledPast } from '../lib/hooks'
import { telLink, waLink } from '../lib/links'
import { Icon } from './Icons'

const sectionIds = nav.map((n) => n.href.slice(1))

export function Header() {
  const stuck = useScrolledPast(40)
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)

  useBodyLock(open)
  useEscape(() => setOpen(false), open)

  // Close the drawer if the viewport grows back to desktop width.
  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 861px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [open])

  const primary = site.contacts[0]

  return (
    <>
      <header className={`header${stuck ? ' is-stuck' : ''}`}>
        <div className="container">
          <a className="brand" href="#home" aria-label={`${site.name} — home`}>
            <img
              src="/brand/logo.png"
              alt={site.name}
              width={900}
              height={248}
              fetchPriority="high"
            />
          </a>

          <nav className="nav" aria-label="Primary">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href.slice(1) ? 'true' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className="btn header-cta"
            href="#contact"
            onClick={() => track('cta_click', { location: 'header', label: 'Get a Quote' })}
          >
            Get a Quote
          </a>

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

            {nav.map((item) => (
              <a
                key={item.href}
                className="drawer__link"
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
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

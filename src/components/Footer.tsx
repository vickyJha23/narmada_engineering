import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { navPages } from '../data/pages'
import { productCategories } from '../data/products'
import { track } from '../lib/analytics'
import { mailLink, mapsLink, telLink, waLink } from '../lib/links'
import { Icon } from './Icons'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <img
              className="footer__logo"
              src="/brand/logo-light.png"
              alt={site.name}
              width={900}
              height={248}
              loading="lazy"
            />
            <p className="footer__tagline">{site.tagline}</p>
            <p>{site.speciality}</p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              {navPages.map((n) => (
                <li key={n.path}>
                  <Link to={n.path}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Products</h4>
            <ul>
              {productCategories.map((c) => (
                <li key={c}>
                  <Link to={`/products?category=${encodeURIComponent(c)}`}>{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Get in Touch</h4>
            <address className="footer__address">
              {site.address.full}
              <br />
              <br />
              {site.contacts.map((c) => (
                <span key={c.phone}>
                  {c.name}:{' '}
                  <a
                    href={telLink(c.phone)}
                    onClick={() => track('call_click', { location: 'footer', name: c.name })}
                  >
                    {c.display}
                  </a>
                  <br />
                </span>
              ))}
              <a href={mailLink()} onClick={() => track('email_click', { location: 'footer' })}>
                {site.email}
              </a>
              <br />
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener"
                onClick={() => track('map_click', { location: 'footer' })}
              >
                View on Google Maps
              </a>
            </address>

            {site.social.length > 0 && (
              <ul className="footer__social">
                {site.social.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener"
                      aria-label={`${site.name} on ${s.label}`}
                      onClick={() => track('social_click', { network: s.label })}
                    >
                      <Icon name={s.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <img
            className="footer__mii"
            src="/brand/make-in-india.png"
            alt="Make in India"
            width={420}
            height={202}
            loading="lazy"
          />
        </div>
      </div>
    </footer>
  )
}

/**
 * Phone-only action bar pinned to the bottom of the screen. It slides up once
 * the visitor leaves the hero, where the same three actions are already on show.
 */
export function MobileBar() {
  const [on, setOn] = useState(false)

  useEffect(() => {
    const onScroll = () => setOn(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const primary = site.contacts[0]

  return (
    <div className={`mobile-bar${on ? ' is-on' : ''}`}>
      <div className="mobile-bar__inner">
        <a
          href={telLink(primary.phone)}
          onClick={() => track('call_click', { location: 'mobile_bar' })}
        >
          <Icon name="phone" />
          Call
        </a>
        <a
          className="is-wa"
          href={waLink()}
          target="_blank"
          rel="noopener"
          onClick={() => track('whatsapp_click', { location: 'mobile_bar' })}
        >
          <Icon name="whatsapp" />
          WhatsApp
        </a>
        <Link
          className="is-quote"
          to="/contact"
          onClick={() => track('cta_click', { location: 'mobile_bar', label: 'Get a Quote' })}
        >
          <Icon name="mail" />
          Get a Quote
        </Link>
      </div>
    </div>
  )
}

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fabs">
      <a
        className="fab fab--wa"
        href={waLink()}
        target="_blank"
        rel="noopener"
        aria-label="Chat with us on WhatsApp"
        onClick={() => track('whatsapp_click', { location: 'fab' })}
      >
        <Icon name="whatsapp" />
      </a>
      <a
        className="fab fab--call"
        href={telLink(site.contacts[0].phone)}
        aria-label={`Call ${site.contacts[0].name}`}
        onClick={() => track('call_click', { location: 'fab' })}
      >
        <Icon name="phone" />
      </a>
      <button
        type="button"
        className={`fab fab--top${showTop ? ' is-on' : ''}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Icon name="arrow" />
      </button>
    </div>
  )
}

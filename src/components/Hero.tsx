import type { CSSProperties } from 'react'
import { highlights, site } from '../data/site'
import { products } from '../data/products'
import { track } from '../lib/analytics'
import { waLink } from '../lib/links'
import { Icon } from './Icons'

const showcase = [
  'stenter-machine-hot-panels',
  'axial-fan-impeller-mounting-plate',
  'ss-nozzle-chambers-cylindrical',
  'bunk-house-container',
]
  .map((slug) => products.find((p) => p.slug === slug))
  .filter((p): p is (typeof products)[number] => Boolean(p))

/** Drives the staggered entrance animation defined in the stylesheet. */
const enter = (index: number) => ({ '--enter-index': index }) as CSSProperties

export function Hero() {
  return (
    <section className="hero" id="home">
      {/* slow drifting colour behind the blueprint grid */}
      <div className="hero__aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hero__sweep" aria-hidden="true" />

      <img
        className="hero__art"
        src="/hero-art.webp"
        alt=""
        aria-hidden="true"
        width={1400}
        height={712}
        data-parallax="42"
      />

      <div className="container hero__grid">
        <div>
          <p className="hero__badge" data-enter style={enter(0)}>
            <span>Umbergaon, Gujarat</span>
            <span>{site.tagline}</span>
          </p>

          <h1 data-enter style={enter(1)}>
            Industrial Fabrication &amp; <em>Sheet Metal Solutions</em>
          </h1>

          <p className="hero__sub" data-enter style={enter(2)}>
            Trusted manufacturing partner for precision fabrication and engineering
            excellence — from stenter machine hot panels and nozzle chambers to heavy
            structures, ducting and portable cabins.
          </p>

          <p className="hero__speciality" data-enter style={enter(3)}>
            {site.speciality}
          </p>

          <div className="hero__actions" data-enter style={enter(4)}>
            <a
              className="btn btn--lg"
              href="#contact"
              onClick={() => track('cta_click', { location: 'hero', label: 'Request a Quote' })}
            >
              Request a Quote <Icon name="arrow" />
            </a>
            <a
              className="btn btn--ghost btn--lg"
              href="#products"
              onClick={() => track('cta_click', { location: 'hero', label: 'View Products' })}
            >
              View Our Products
            </a>
          </div>

          <ul className="hero__chips" data-enter style={enter(5)}>
            {highlights.map((h) => (
              <li key={h} className="chip">
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__panel">
          {showcase.map((p, i) => (
            <figure className="hero__tile" key={p.slug} style={enter(i)}>
              <img
                src={p.src}
                alt={p.title}
                width={p.width}
                height={p.height}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </figure>
          ))}

          <div className="hero__stat" data-enter style={enter(6)}>
            <Icon name="whatsapp" />
            <div>
              <strong>Send your drawing on WhatsApp</strong>
              Quick feasibility check and quotation.
            </div>
            <a
              className="btn btn--wa"
              href={waLink()}
              target="_blank"
              rel="noopener"
              onClick={() => track('whatsapp_click', { location: 'hero' })}
              style={{ marginLeft: 'auto' }}
            >
              Chat
            </a>
          </div>
        </div>
      </div>

      <svg
        className="hero__cut"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 90H1440V34H700L640 62H0Z" />
      </svg>
    </section>
  )
}

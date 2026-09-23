import {
  aboutParagraphs,
  capabilities,
  highlights,
  industries,
  mission,
  processSteps,
  vision,
  whyChooseUs,
} from '../data/site'
import { products } from '../data/products'
import { faqs } from '../lib/seo'
import { track } from '../lib/analytics'
import { waLink } from '../lib/links'
import { Icon, type IconName } from './Icons'

/* ---------------------------------------------------------------- strip -- */

export function Strip() {
  const line = [...highlights, 'Stenter Machine Fabrication', 'Fabrication to Drawing']
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip__track">
        {/* duplicated once so the loop is seamless at translateX(-50%) */}
        {[0, 1].map((n) => (
          <span key={n}>
            {line.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- about -- */

const collage = [
  'stenter-machine-hot-panels',
  'ss-nozzle-chamber-cylinders',
  'yarn-trolley-with-bobbins',
  'air-handling-units-pair',
]
  .map((slug) => products.find((p) => p.slug === slug))
  .filter((p): p is (typeof products)[number] => Boolean(p))

export function About() {
  return (
    <section className="section" id="about">
      <div className="container about__grid">
        <div className="about__copy reveal reveal--left">
          <p className="eyebrow">About Us</p>
          <h2>A dependable fabrication partner for Indian industry</h2>
          {aboutParagraphs.map((p, i) => (
            <p key={i} className={i === 0 ? 'lede' : undefined}>
              {p}
            </p>
          ))}
        </div>

        <div className="about__media reveal reveal--right">
          <div className="about__collage" data-stagger="90">
            {collage.map((p) => (
              <figure className="reveal reveal--scale" key={p.slug}>
                <img
                  src={p.src}
                  alt={p.title}
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="vm-grid" data-stagger="120">
          <article className="vm-card reveal">
            <Icon name="eye" />
            <h3>Our Vision</h3>
            <p>{vision}</p>
          </article>
          <article className="vm-card reveal">
            <Icon name="target" />
            <h3>Our Mission</h3>
            <p>{mission}</p>
          </article>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------- capabilities -- */

export function Capabilities() {
  return (
    <section className="section section--tint" id="capabilities">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow">What We Manufacture</p>
          <h2>Fabrication capabilities under one roof</h2>
          <p>
            Precision sheet metal, heavy fabrication and structural steel work — built to
            your drawing, finished in house and inspected before dispatch.
          </p>
        </div>

        <div className="cards" data-stagger="70">
          {capabilities.map((c) => (
            <article className="card reveal reveal--scale" key={c.title}>
              <span className="card__icon">
                <Icon name={c.icon as IconName} />
              </span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- process -- */

export function Process() {
  return (
    <section className="section section--dark" id="process">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">How We Work</p>
          <h2>From your drawing to dispatch</h2>
          <p>
            A simple, predictable route for every job — whether it is a single custom
            component or a repeat production batch.
          </p>
        </div>

        <div className="process" data-stagger="90">
          {processSteps.map((s) => (
            <article className="process__item reveal" key={s.step}>
              <span>{s.step}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- industries -- */

export function Industries() {
  return (
    <section className="section industries" id="industries">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow">Industries We Serve</p>
          <h2>Supplying plants across Gujarat, Maharashtra and beyond</h2>
        </div>

        <ul className="pill-list" data-stagger="45">
          {industries.map((i) => (
            <li className="reveal" key={i}>
              <Icon name="check" />
              {i}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- why us -- */

export function WhyUs() {
  return (
    <section className="section why" id="why-us">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow">Why Choose Us</p>
          <h2>Quality you can measure, delivery you can plan around</h2>
        </div>

        <ul className="pill-list" data-stagger="45">
          {whyChooseUs.map((w) => (
            <li className="reveal" key={w}>
              <Icon name="check" />
              {w}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ faq -- */

export function Faq() {
  return (
    <section className="section section--tint" id="faq">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow">Questions</p>
          <h2>Frequently asked questions</h2>
        </div>

        <div className="faq" data-stagger="60">
          {faqs.map((f) => (
            <details
              className="reveal"
              key={f.q}
              onToggle={(e) => {
                if (e.currentTarget.open) track('faq_open', { question: f.q })
              }}
            >
              <summary>
                {f.q}
                <Icon name="plus" />
              </summary>
              <div className="faq__body">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- cta band -- */

export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <div className="reveal reveal--left">
          <h2>Have a drawing ready? Let’s get it quoted.</h2>
          <p>
            Share your drawing, sample or requirement and our technical team will confirm
            feasibility, material and lead time.
          </p>
        </div>
        <div className="cta-band__actions reveal reveal--right">
          <a
            className="btn btn--wa btn--lg"
            href={waLink()}
            target="_blank"
            rel="noopener"
            onClick={() => track('whatsapp_click', { location: 'cta_band' })}
          >
            <Icon name="whatsapp" /> WhatsApp Enquiry
          </a>
          <a
            className="btn btn--ghost btn--lg"
            href="#contact"
            onClick={() => track('cta_click', { location: 'cta_band', label: 'Contact Us' })}
          >
            Contact Us <Icon name="arrow" />
          </a>
        </div>
      </div>
    </section>
  )
}

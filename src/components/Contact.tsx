import { useRef, useState } from 'react'
import { mapQuery, site } from '../data/site'
import { productCategories } from '../data/products'
import { track } from '../lib/analytics'
import { mailLink, mapsLink, telLink, waLink } from '../lib/links'
import { Icon } from './Icons'

type Enquiry = {
  name: string
  company: string
  phone: string
  email: string
  requirement: string
  message: string
}

const empty: Enquiry = {
  name: '',
  company: '',
  phone: '',
  email: '',
  requirement: '',
  message: '',
}

/** Turns the form into a readable enquiry we can drop into WhatsApp or email. */
function compose(form: Enquiry) {
  const lines = [
    `New enquiry for ${site.name}`,
    '',
    `Name: ${form.name}`,
    form.company && `Company: ${form.company}`,
    `Phone: ${form.phone}`,
    form.email && `Email: ${form.email}`,
    form.requirement && `Requirement: ${form.requirement}`,
    '',
    form.message && `Details: ${form.message}`,
  ].filter(Boolean)
  return lines.join('\n')
}

export function Contact() {
  const [form, setForm] = useState<Enquiry>(empty)
  const formRef = useRef<HTMLFormElement>(null)

  const set = (key: keyof Enquiry) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit =
    (channel: 'whatsapp' | 'email') => (e: { preventDefault: () => void }) => {
      e.preventDefault()
      // The email button is type="button", so run the same native validation.
      if (formRef.current && !formRef.current.reportValidity()) return

      const body = compose(form)
      track('enquiry_submit', { channel, requirement: form.requirement || 'unspecified' })

      if (channel === 'whatsapp') {
        window.open(waLink(body), '_blank', 'noopener')
      } else {
        window.location.href = mailLink(`Enquiry from ${form.name || 'website'}`, body)
      }
    }

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow">Contact Us</p>
          <h2>Tell us what you need fabricated</h2>
          <p>
            Call, WhatsApp or send the form below. We reply with feasibility, material
            options and a lead time.
          </p>
        </div>

        <div className="contact__grid">
          <div className="reveal">
            <div className="contact-cards">
              {site.contacts.map((c) => (
                <div className="contact-card" key={c.phone}>
                  <span className="contact-card__icon">
                    <Icon name="phone" />
                  </span>
                  <div>
                    <h3>{c.name}</h3>
                    <a
                      href={telLink(c.phone)}
                      onClick={() => track('call_click', { location: 'contact', name: c.name })}
                    >
                      {c.display}
                    </a>
                  </div>
                </div>
              ))}

              <div className="contact-card">
                <span className="contact-card__icon">
                  <Icon name="mail" />
                </span>
                <div>
                  <h3>Email</h3>
                  <a
                    href={mailLink()}
                    onClick={() => track('email_click', { location: 'contact' })}
                  >
                    {site.email}
                  </a>
                </div>
              </div>

              <div className="contact-card">
                <span className="contact-card__icon">
                  <Icon name="pin" />
                </span>
                <div>
                  <h3>Works Address</h3>
                  <p>{site.address.full}</p>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener"
                    onClick={() => track('map_click', { location: 'contact' })}
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>

              <div className="contact-card">
                <span className="contact-card__icon">
                  <Icon name="clock" />
                </span>
                <div>
                  <h3>Working Hours</h3>
                  <p>{site.hours}</p>
                  <small>Closed on public holidays</small>
                </div>
              </div>
            </div>

            <div className="map">
              <iframe
                title={`Location of ${site.name} in Umbergaon, Gujarat`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <form className="form reveal" ref={formRef} onSubmit={submit('whatsapp')}>
            <div className="form__row">
              <div className="field">
                <label htmlFor="f-name">
                  Your Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="f-name"
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={set('name')}
                />
              </div>
              <div className="field">
                <label htmlFor="f-company">Company</label>
                <input
                  id="f-company"
                  name="company"
                  autoComplete="organization"
                  value={form.company}
                  onChange={set('company')}
                />
              </div>
            </div>

            <div className="form__row">
              <div className="field">
                <label htmlFor="f-phone">
                  Phone <span aria-hidden="true">*</span>
                </label>
                <input
                  id="f-phone"
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91"
                  value={form.phone}
                  onChange={set('phone')}
                />
              </div>
              <div className="field">
                <label htmlFor="f-email">Email</label>
                <input
                  id="f-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="f-requirement">What do you need?</label>
              <select
                id="f-requirement"
                name="requirement"
                value={form.requirement}
                onChange={set('requirement')}
              >
                <option value="">Select a category</option>
                {productCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Custom job work as per drawing">
                  Custom job work as per drawing
                </option>
                <option value="Boiler manpower supply">Boiler manpower supply</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="f-message">Requirement details</label>
              <textarea
                id="f-message"
                name="message"
                placeholder="Material, size, quantity, finish, delivery location…"
                value={form.message}
                onChange={set('message')}
              />
            </div>

            <div className="form__actions">
              <button type="submit" className="btn btn--wa btn--lg">
                <Icon name="whatsapp" /> Send on WhatsApp
              </button>
              <button
                type="button"
                className="btn btn--outline btn--lg"
                onClick={submit('email')}
              >
                <Icon name="mail" /> Send by Email
              </button>
            </div>

            <p className="form__note">
              No data is stored on this site — your enquiry opens directly in WhatsApp or
              your email app.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

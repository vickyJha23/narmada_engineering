import { Link } from 'react-router-dom'
import { PageHero } from '../components/Layout'
import { Icon } from '../components/Icons'
import { navPages } from '../data/pages'

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="404"
        heading="That page has moved or never existed"
        intro="Use the links below to get back to what you were looking for."
        trail={[{ label: 'Not found' }]}
      />
      <section className="section">
        <div className="container">
          <ul className="pill-list" data-stagger="45">
            {navPages.map((p) => (
              <li className="reveal" key={p.path}>
                <Icon name="arrow" />
                <Link to={p.path}>{p.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

import { PageHero } from '../components/Layout'
import { Contact } from '../components/Contact'
import { Faq } from '../components/Sections'
import { Seo } from '../components/Seo'
import { pageMeta } from '../lib/seo'
import { findPage } from '../data/pages'

const meta = pageMeta('/contact')
const page = findPage('/contact')!

export default function ContactPage() {
  return (
    <>
      <Seo meta={meta} />
      <PageHero
        eyebrow="Contact Us"
        heading={page.heading}
        intro={page.intro}
        trail={[{ label: 'Contact' }]}
      />
      <Contact />
      <Faq />
    </>
  )
}

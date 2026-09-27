import { PageHero } from '../components/Layout'
import { Capabilities, Process, CtaBand } from '../components/Sections'
import { Seo } from '../components/Seo'
import { pageMeta } from '../lib/seo'
import { findPage } from '../data/pages'

const meta = pageMeta('/capabilities')
const page = findPage('/capabilities')!

export default function CapabilitiesPage() {
  return (
    <>
      <Seo meta={meta} />
      <PageHero
        eyebrow="What We Manufacture"
        heading={page.heading}
        intro={page.intro}
        trail={[{ label: 'Capabilities' }]}
      />
      <Capabilities />
      <Process />
      <CtaBand />
    </>
  )
}

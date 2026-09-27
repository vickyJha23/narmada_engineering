import { PageHero } from '../components/Layout'
import { Industries, WhyUs, CtaBand } from '../components/Sections'
import { Seo } from '../components/Seo'
import { pageMeta } from '../lib/seo'
import { findPage } from '../data/pages'

const meta = pageMeta('/industries')
const page = findPage('/industries')!

export default function IndustriesPage() {
  return (
    <>
      <Seo meta={meta} />
      <PageHero
        eyebrow="Industries We Serve"
        heading={page.heading}
        intro={page.intro}
        trail={[{ label: 'Industries' }]}
      />
      <Industries />
      <WhyUs />
      <CtaBand />
    </>
  )
}

import { PageHero } from '../components/Layout'
import { About, Process, WhyUs, CtaBand } from '../components/Sections'
import { VideoSection } from '../components/VideoSection'
import { Seo } from '../components/Seo'
import { pageMeta } from '../lib/seo'
import { findPage } from '../data/pages'

const meta = pageMeta('/about')
const page = findPage('/about')!

export default function AboutPage() {
  return (
    <>
      <Seo meta={meta} />
      <PageHero
        eyebrow="About Us"
        heading={page.heading}
        intro={page.intro}
        trail={[{ label: 'About' }]}
      />
      <About />
      <VideoSection />
      <Process />
      <WhyUs />
      <CtaBand />
    </>
  )
}

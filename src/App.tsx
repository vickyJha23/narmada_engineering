import { useEffect } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Products } from './components/Products'
import { Contact } from './components/Contact'
import { Footer, FloatingActions } from './components/Footer'
import {
  About,
  Capabilities,
  CtaBand,
  Faq,
  Industries,
  Process,
  Strip,
  WhyUs,
} from './components/Sections'
import { initAnalytics } from './lib/analytics'
import { useScrollReveal } from './lib/hooks'
import { buildStructuredData } from './lib/seo'

const structuredData = JSON.stringify(buildStructuredData())

export default function App() {
  useScrollReveal()

  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <>
      {/* schema.org graph — prerendered into dist/index.html for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Strip />
        <About />
        <Capabilities />
        <Products />
        <Process />
        <Industries />
        <WhyUs />
        <CtaBand />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}

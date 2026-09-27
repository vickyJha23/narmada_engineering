import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { Strip, About, Capabilities, Process, Industries, WhyUs, CtaBand } from '../components/Sections'
import { ProductGrid } from '../components/ProductGrid'
import { VideoSection } from '../components/VideoSection'
import { Seo } from '../components/Seo'
import { Icon } from '../components/Icons'
import { pageMeta } from '../lib/seo'
import { products } from '../data/products'

const meta = pageMeta('/')

export default function Home() {
  return (
    <>
      <Seo meta={meta} />
      <Hero />
      <Strip />

      <section className="section section--tint" id="products">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">Our Products</p>
            <h2>{products.length} fabricated products, built to drawing</h2>
            <p>
              A selection of jobs delivered from our Umbergaon works. Open any product to
              enquire about material, size and lead time.
            </p>
          </div>

          <ProductGrid limit={12} showFilters={false} showMore={false} />

          <div className="gallery__more">
            <Link className="btn btn--lg" to="/products">
              View all products <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <About compact />
      <Capabilities compact />
      <VideoSection />
      <Process />
      <Industries compact />
      <WhyUs />
      <CtaBand />
    </>
  )
}

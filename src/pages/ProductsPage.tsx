import { useSearchParams } from 'react-router-dom'
import { PageHero } from '../components/Layout'
import { ProductGrid, ALL } from '../components/ProductGrid'
import { CtaBand } from '../components/Sections'
import { Seo } from '../components/Seo'
import { pageMeta } from '../lib/seo'
import { findPage } from '../data/pages'
import { productCategories, products } from '../data/products'

const meta = pageMeta('/products')
const page = findPage('/products')!

export default function ProductsPage() {
  const [params, setParams] = useSearchParams()

  // The chosen category lives in the URL, so a filtered view can be shared or
  // linked to directly from the footer.
  const requested = params.get('category') ?? ''
  const category = (productCategories as readonly string[]).includes(requested)
    ? requested
    : ALL

  const setCategory = (next: string) => {
    if (next === ALL) setParams({}, { replace: true })
    else setParams({ category: next }, { replace: true })
  }

  return (
    <>
      <Seo meta={meta} />
      <PageHero
        eyebrow="Our Products"
        heading={category === ALL ? page.heading : category}
        intro={
          category === ALL
            ? `${products.length} fabricated products delivered from our Umbergaon works. Filter by category, or open any product to enquire.`
            : `${category} fabricated to drawing at our Umbergaon works.`
        }
        trail={[{ label: 'Products' }]}
      />

      <section className="section">
        <div className="container">
          <ProductGrid category={category} onCategory={setCategory} limit={24} />
        </div>
      </section>

      <CtaBand />
    </>
  )
}

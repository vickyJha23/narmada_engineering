import { useMemo, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { products } from '../data/products'
import { site } from '../data/site'
import { Seo } from '../components/Seo'
import { Icon } from '../components/Icons'
import { ProductCard } from '../components/ProductGrid'
import { CtaBand } from '../components/Sections'
import { productMeta } from '../lib/seo'
import { track } from '../lib/analytics'
import { mailLink, telLink, waLink } from '../lib/links'
import { useScrollReveal } from '../lib/animate'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const scope = useRef<HTMLDivElement>(null)

  const product = products.find((p) => p.slug === slug)

  const related = useMemo(
    () =>
      product
        ? products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4)
        : [],
    [product],
  )

  useScrollReveal([slug])

  if (!product) return <Navigate to="/products" replace />

  const meta = productMeta(product)
  const enquiry = `Hello ${site.name}, I would like to enquire about: ${product.title}. Please share material options, sizes and lead time.`

  return (
    <>
      <Seo meta={meta} />

      <div className="product" ref={scope}>
        <div className="container">
          <nav className="crumbs crumbs--dark" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>
              <Icon name="chevronRight" />
              <Link to="/products">Products</Link>
            </span>
            <span>
              <Icon name="chevronRight" />
              <span aria-current="page">{product.title}</span>
            </span>
          </nav>

          <div className="product__grid">
            <figure
              className="product__figure reveal reveal--scale"
              style={{ aspectRatio: `${product.width} / ${product.height}` }}
            >
              <img
                src={product.src}
                alt={`${product.title} fabricated by ${site.name}, Umbergaon`}
                width={product.width}
                height={product.height}
                fetchPriority="high"
                decoding="async"
              />
            </figure>

            <div className="product__body reveal reveal--right">
              <Link
                className="product__category"
                to={`/products?category=${encodeURIComponent(product.category)}`}
              >
                {product.category}
              </Link>

              <h1>{product.title}</h1>

              <p className="lede">
                {product.title} fabricated to drawing at our Umbergaon works, in Dist.
                Valsad, Gujarat. Cut, formed, welded and finished in house, then
                dimensionally checked and protectively packed before dispatch.
              </p>

              <dl className="product__specs">
                <div>
                  <dt>Category</dt>
                  <dd>{product.category}</dd>
                </div>
                <div>
                  <dt>Materials</dt>
                  <dd>MS, stainless steel or GI sheet, to suit the duty</dd>
                </div>
                <div>
                  <dt>Sizes</dt>
                  <dd>Made to your drawing or sample</dd>
                </div>
                <div>
                  <dt>Finish</dt>
                  <dd>Primed, painted or powder coated in house</dd>
                </div>
                <div>
                  <dt>Quantity</dt>
                  <dd>Single pieces or repeat production batches</dd>
                </div>
                <div>
                  <dt>Made at</dt>
                  <dd>
                    {site.address.locality}, Dist. {site.address.district}, {site.address.region}
                  </dd>
                </div>
              </dl>

              <div className="product__actions">
                <a
                  className="btn btn--wa btn--lg"
                  href={waLink(enquiry)}
                  target="_blank"
                  rel="noopener"
                  onClick={() =>
                    track('whatsapp_click', { location: 'product_page', product: product.title })
                  }
                >
                  <Icon name="whatsapp" /> Enquire on WhatsApp
                </a>
                <a
                  className="btn btn--outline btn--lg"
                  href={telLink(site.contacts[0].phone)}
                  onClick={() =>
                    track('call_click', { location: 'product_page', product: product.title })
                  }
                >
                  <Icon name="phone" /> {site.contacts[0].display}
                </a>
                <a
                  className="btn btn--outline btn--lg"
                  href={mailLink(`Enquiry — ${product.title}`, enquiry)}
                  onClick={() =>
                    track('email_click', { location: 'product_page', product: product.title })
                  }
                >
                  <Icon name="mail" /> Email us
                </a>
              </div>

              <p className="product__note">
                Send a drawing, sketch or photograph with the size, material and quantity you
                need — we confirm feasibility and come back with a price and lead time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Related</p>
              <h2>More from {product.category}</h2>
            </div>
            <div className="gallery" data-stagger="60">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
            <div className="gallery__more">
              <Link
                className="btn btn--outline btn--lg"
                to={`/products?category=${encodeURIComponent(product.category)}`}
              >
                View all {product.category} <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  )
}

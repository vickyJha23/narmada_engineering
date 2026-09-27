import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { productCategories, products, type Product } from '../data/products'
import { track } from '../lib/analytics'
import { useScrollReveal } from '../lib/animate'
import { Icon } from './Icons'

export const ALL = 'All Products'

/** One product card. Links through to the product's own page. */
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <Link
      className="tile reveal reveal--scale"
      to={`/products/${product.slug}`}
      style={{ animationDelay: `${Math.min(index, 12) * 28}ms` } as CSSProperties}
      onClick={() =>
        track('product_view', { product: product.title, category: product.category })
      }
    >
      <img
        src={product.src}
        alt={`${product.title} fabricated by Narmada Engineering Works`}
        width={product.width}
        height={product.height}
        loading="lazy"
        decoding="async"
      />
      <span className="tile__label">{product.title}</span>
    </Link>
  )
}

/**
 * The filterable catalogue grid.
 *
 * `category` and `onCategory` are optional: pass them from the products page so
 * the chosen category lives in the URL, or leave them out for a plain grid.
 */
export function ProductGrid({
  category,
  onCategory,
  limit,
  showFilters = true,
  showMore = true,
}: {
  category?: string
  onCategory?: (c: string) => void
  limit?: number
  showFilters?: boolean
  showMore?: boolean
}) {
  const active = category ?? ALL
  const [shown, setShown] = useState(limit ?? 16)

  const counts = useMemo(() => {
    const map = new Map<string, number>([[ALL, products.length]])
    for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + 1)
    return map
  }, [])

  const filtered = useMemo(
    () => (active === ALL ? products : products.filter((p) => p.category === active)),
    [active],
  )

  const visible = filtered.slice(0, shown)
  useScrollReveal([active, shown])

  return (
    <>
      {showFilters && (
        <div className="filters reveal" role="group" aria-label="Filter products by category">
          {[ALL, ...productCategories].map((c) => (
            <button
              key={c}
              type="button"
              className="filter"
              aria-pressed={active === c}
              onClick={() => {
                setShown(limit ?? 16)
                onCategory?.(c)
                track('product_filter', { category: c })
              }}
            >
              {c}
              <small>{counts.get(c) ?? 0}</small>
            </button>
          ))}
        </div>
      )}

      <div className="gallery" data-stagger="40" key={active}>
        {visible.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>

      {showMore && visible.length < filtered.length && (
        <div className="gallery__more">
          <button
            type="button"
            className="btn btn--outline btn--lg"
            onClick={() => {
              setShown((n) => n + 20)
              track('gallery_load_more', { category: active })
            }}
          >
            Show more products <Icon name="plus" />
          </button>
        </div>
      )}
    </>
  )
}

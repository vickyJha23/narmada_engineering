import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { productCategories, products, type Product } from '../data/products'
import { track } from '../lib/analytics'
import { waLink } from '../lib/links'
import { useBodyLock, useEscape, useScrollReveal, useSwipe } from '../lib/hooks'
import { Icon } from './Icons'

const INITIAL_COUNT = 16
const ALL = 'All Products'

export function Products() {
  const [filter, setFilter] = useState<string>(ALL)
  const [limit, setLimit] = useState(INITIAL_COUNT)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const counts = useMemo(() => {
    const map = new Map<string, number>([[ALL, products.length]])
    for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + 1)
    return map
  }, [])

  const filtered = useMemo(
    () => (filter === ALL ? products : products.filter((p) => p.category === filter)),
    [filter],
  )

  const visible = filtered.slice(0, limit)

  // Re-run the reveal observer whenever the visible set changes.
  useScrollReveal([filter, limit])

  const choose = (category: string) => {
    setFilter(category)
    setLimit(INITIAL_COUNT)
    track('product_filter', { category })
  }

  const open = (index: number) => {
    setOpenIndex(index)
    track('product_view', {
      product: filtered[index].title,
      category: filtered[index].category,
    })
  }

  return (
    <section className="section" id="products">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow">Our Products</p>
          <h2>{products.length} fabricated products, built to drawing</h2>
          <p>
            A selection of jobs delivered from our Umbergaon works. Filter by category, or
            tap any product to see it larger.
          </p>
        </div>

        <div className="filters reveal" role="group" aria-label="Filter products by category">
          {[ALL, ...productCategories].map((c) => (
            <button
              key={c}
              type="button"
              className="filter"
              aria-pressed={filter === c}
              onClick={() => choose(c)}
            >
              {c}
              <small>{counts.get(c) ?? 0}</small>
            </button>
          ))}
        </div>

        <div className="gallery" data-stagger="40" key={filter}>
          {visible.map((p, i) => (
            <button
              type="button"
              className="tile reveal reveal--scale"
              key={p.slug}
              style={{ animationDelay: `${Math.min(i, 12) * 28}ms` } as CSSProperties}
              onClick={() => open(i)}
              aria-label={`View ${p.title}`}
            >
              <img
                src={p.src}
                alt={`${p.title} fabricated by Narmada Engineering Works`}
                width={p.width}
                height={p.height}
                loading="lazy"
                decoding="async"
              />
              <span className="tile__label">{p.title}</span>
            </button>
          ))}
        </div>

        {visible.length < filtered.length && (
          <div className="gallery__more">
            <button
              type="button"
              className="btn btn--outline btn--lg"
              onClick={() => {
                setLimit((l) => l + 20)
                track('gallery_load_more', { category: filter })
              }}
            >
              Show more products <Icon name="plus" />
            </button>
          </div>
        )}
      </div>

      {openIndex !== null && (
        <Lightbox
          items={filtered}
          index={openIndex}
          onIndex={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  )
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: Product[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const item = items[index]
  const [direction, setDirection] = useState<1 | -1>(1)

  useBodyLock(true)
  useEscape(onClose)

  const step = useCallback(
    (delta: 1 | -1) => {
      setDirection(delta)
      onIndex((index + delta + items.length) % items.length)
    },
    [index, items.length, onIndex],
  )

  const swipe = useSwipe(step)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <figure className="lightbox__figure" {...swipe}>
        <span className="lightbox__hint">Swipe to browse</span>

        <button type="button" className="lightbox__close" aria-label="Close" onClick={onClose}>
          <Icon name="close" />
        </button>
        <button
          type="button"
          className="lightbox__nav lightbox__nav--prev"
          aria-label="Previous product"
          onClick={() => step(-1)}
        >
          <Icon name="chevronLeft" />
        </button>
        <button
          type="button"
          className="lightbox__nav lightbox__nav--next"
          aria-label="Next product"
          onClick={() => step(1)}
        >
          <Icon name="chevronRight" />
        </button>

        <img
          key={item.slug}
          src={item.src}
          alt={item.title}
          width={item.width}
          height={item.height}
          style={{ '--slide-from': `${direction * 26}px` } as CSSProperties}
        />

        <figcaption className="lightbox__caption">
          <div>
            <h3>{item.title}</h3>
            <p>
              {item.category} · {index + 1} of {items.length}
            </p>
          </div>
          <a
            className="btn btn--wa"
            href={waLink(
              `Hello Narmada Engineering Works, I am interested in: ${item.title}. Please share details.`,
            )}
            target="_blank"
            rel="noopener"
            onClick={() => track('whatsapp_click', { location: 'lightbox', product: item.title })}
          >
            <Icon name="whatsapp" /> Enquire
          </a>
        </figcaption>
      </figure>
    </div>
  )
}

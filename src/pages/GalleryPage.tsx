import { useState } from 'react'
import { PageHero } from '../components/Layout'
import { Lightbox } from '../components/Lightbox'
import { CtaBand } from '../components/Sections'
import { Seo } from '../components/Seo'
import { pageMeta } from '../lib/seo'
import { findPage } from '../data/pages'
import { gallery } from '../data/gallery'
import { track } from '../lib/analytics'

const meta = pageMeta('/gallery')
const page = findPage('/gallery')!

export default function GalleryPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <Seo meta={meta} />
      <PageHero
        eyebrow="Our Work"
        heading={page.heading}
        intro={page.intro}
        trail={[{ label: 'Our Work' }]}
      />

      <section className="section">
        <div className="container">
          <div className="masonry" data-stagger="50">
            {gallery.map((shot, i) => (
              <button
                type="button"
                className="masonry__item reveal reveal--scale"
                key={shot.src}
                onClick={() => {
                  setOpen(i)
                  track('gallery_view', { photo: shot.title })
                }}
                aria-label={`View photo: ${shot.title}`}
              >
                <img
                  src={shot.src}
                  alt={shot.title}
                  width={shot.width}
                  height={shot.height}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <span className="masonry__caption">{shot.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {open !== null && (
        <Lightbox
          items={gallery}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}

      <CtaBand />
    </>
  )
}

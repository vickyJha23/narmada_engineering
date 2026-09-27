import { useCallback, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { useBodyLock, useEscape, useSwipe } from '../lib/hooks'
import { Icon } from './Icons'

export type Shot = { src: string; title: string; width: number; height: number }

export function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: Shot[]
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
          aria-label="Previous photo"
          onClick={() => step(-1)}
        >
          <Icon name="chevronLeft" />
        </button>
        <button
          type="button"
          className="lightbox__nav lightbox__nav--next"
          aria-label="Next photo"
          onClick={() => step(1)}
        >
          <Icon name="chevronRight" />
        </button>

        <img
          key={item.src}
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
              {index + 1} of {items.length}
            </p>
          </div>
        </figcaption>
      </figure>
    </div>
  )
}

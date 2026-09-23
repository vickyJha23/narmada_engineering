import { useEffect, useRef, useState, type TouchEvent } from 'react'

/**
 * Adds `.is-visible` to every `.reveal` element once it scrolls into view.
 *
 * Elements inside a container marked `data-stagger` are revealed one after the
 * other: the hook writes a `--reveal-delay` custom property based on the child's
 * position, which the stylesheet turns into a transition-delay.
 *
 * One shared observer for the whole page; re-runs when `deps` change so newly
 * rendered tiles (e.g. after a gallery filter) get picked up too.
 */
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)')
    if (!nodes.length) return

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-visible'))
      return
    }

    const reveal = (el: HTMLElement) => {
      const group = el.closest<HTMLElement>('[data-stagger]')
      if (group) {
        const step = Number(group.dataset.stagger) || 70
        const index = [...group.querySelectorAll('.reveal')].indexOf(el)
        el.style.setProperty('--reveal-delay', `${Math.min(index, 10) * step}ms`)
      }
      el.classList.add('is-visible')
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          reveal(entry.target as HTMLElement)
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
    )

    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** True once the page has been scrolled past `offset` pixels. */
export function useScrolledPast(offset = 24) {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return past
}

/**
 * Drives the thin progress bar under the header by writing `--scroll-progress`
 * (0→1) onto <html>. Kept in CSS-land so no component re-renders while scrolling.
 */
export function useScrollProgress() {
  useEffect(() => {
    let ticking = false

    const measure = () => {
      ticking = false
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      doc.style.setProperty('--scroll-progress', max > 0 ? String(window.scrollY / max) : '0')
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

/**
 * Gentle parallax: writes `--parallax` (pixels) onto each `[data-parallax]`
 * element as it travels through the viewport. Skipped when the visitor has asked
 * for reduced motion, and on coarse pointers where it mostly costs battery.
 */
export function useParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const nodes = [...document.querySelectorAll<HTMLElement>('[data-parallax]')]
    if (!nodes.length) return

    let ticking = false
    const measure = () => {
      ticking = false
      const h = window.innerHeight
      for (const el of nodes) {
        const rect = el.getBoundingClientRect()
        if (rect.bottom < -200 || rect.top > h + 200) continue
        const strength = Number(el.dataset.parallax) || 20
        const progress = (rect.top + rect.height / 2 - h / 2) / h
        el.style.setProperty('--parallax', `${(progress * strength).toFixed(2)}px`)
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

/** Returns the id of the section currently filling most of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState('')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const ratios = new Map<string, number>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0)
        let best = ''
        let bestRatio = 0
        for (const [id, r] of ratios) {
          if (r > bestRatio) {
            best = id
            bestRatio = r
          }
        }
        if (best) setActive(best)
      },
      { threshold: [0.15, 0.35, 0.6], rootMargin: '-80px 0px -45% 0px' },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [ids])

  return active
}

/** Locks body scroll while a modal or drawer is open. */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [locked])
}

/** Fires `handler` on Escape. */
export function useEscape(handler: () => void, active = true) {
  const ref = useRef(handler)

  useEffect(() => {
    ref.current = handler
  }, [handler])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') ref.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])
}

/** Horizontal swipe detection for the mobile lightbox. */
export function useSwipe(onSwipe: (direction: 1 | -1) => void) {
  const start = useRef<{ x: number; y: number } | null>(null)
  const cb = useRef(onSwipe)

  useEffect(() => {
    cb.current = onSwipe
  }, [onSwipe])

  return {
    onTouchStart: (e: TouchEvent) => {
      const t = e.touches[0]
      start.current = { x: t.clientX, y: t.clientY }
    },
    onTouchEnd: (e: TouchEvent) => {
      if (!start.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - start.current.x
      const dy = t.clientY - start.current.y
      start.current = null
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) cb.current(dx < 0 ? 1 : -1)
    },
  }
}

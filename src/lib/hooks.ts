import { useEffect, useRef, useState } from 'react'

/**
 * Adds `.is-visible` to every `.reveal` element once it scrolls into view.
 * One shared observer for the whole page; re-runs when `deps` change so
 * newly-rendered tiles (e.g. after a gallery filter) get picked up too.
 */
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)')
    if (!nodes.length) return

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
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

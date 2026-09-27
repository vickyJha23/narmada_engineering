/**
 * GSAP animation layer.
 *
 * GSAP owns every scroll-driven effect on the site. The stylesheet only supplies
 * the *initial* hidden state (`.reveal { opacity: 0 }`), so prerendered HTML never
 * flashes its content before GSAP takes over — and `<noscript>` plus the
 * reduced-motion media query both force everything visible again, so nothing is
 * ever locked behind an animation that did not run.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function ensureGsap() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

/** Honour the OS "reduce motion" setting for everything below. */
const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Makes every `.reveal` on the page visible immediately, with no animation. */
function showAll(scope?: Element | Document) {
  const root = scope ?? document
  root.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    el.classList.add('is-visible')
    gsap.set(el, { clearProps: 'all' })
  })
}

/**
 * Scroll reveals for the whole page.
 *
 * `ScrollTrigger.batch` groups elements that enter together and staggers them as
 * one batch, which looks far better than animating each element independently.
 * Direction comes from the same `reveal--left/right/scale` classes the CSS used.
 */
export function useScrollReveal(deps: unknown[] = []) {
  const { pathname } = useLocation()

  useEffect(() => {
    ensureGsap()

    if (reduced()) {
      showAll()
      return
    }

    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray<HTMLElement>('.reveal:not(.is-visible)')
      if (!nodes.length) return

      const from = (el: HTMLElement) => {
        if (el.classList.contains('reveal--left')) return { x: -40, y: 0, scale: 1 }
        if (el.classList.contains('reveal--right')) return { x: 40, y: 0, scale: 1 }
        if (el.classList.contains('reveal--scale')) return { x: 0, y: 18, scale: 0.94 }
        return { x: 0, y: 28, scale: 1 }
      }

      nodes.forEach((el) => gsap.set(el, { ...from(el), opacity: 0 }))

      ScrollTrigger.batch(nodes, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
            stagger: { each: 0.07, from: 'start' },
            onStart: () => batch.forEach((el) => el.classList.add('is-visible')),
            onComplete: () => gsap.set(batch, { clearProps: 'transform' }),
          })
        },
      })
    })

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, ...deps])
}

/** Hero entrance: one timeline, so the order is readable and easy to retune. */
export function useHeroIntro(scope: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    ensureGsap()
    const root = scope.current
    if (!root) return

    if (reduced()) {
      showAll(root)
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-hero="badge"]', { y: 22, opacity: 0, duration: 0.6 })
        .from('[data-hero="title"] .hero__line', {
          yPercent: 115,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
        }, '-=0.3')
        .from('[data-hero="sub"]', { y: 20, opacity: 0, duration: 0.7 }, '-=0.55')
        .from('[data-hero="speciality"]', { y: 18, opacity: 0, duration: 0.6 }, '-=0.5')
        .from('[data-hero="actions"] > *', {
          y: 18,
          opacity: 0,
          duration: 0.55,
          stagger: 0.09,
        }, '-=0.4')
        .from('[data-hero="chips"] li', {
          y: 14,
          opacity: 0,
          duration: 0.45,
          stagger: 0.05,
        }, '-=0.35')
        .from('.hero__tile', {
          y: 36,
          opacity: 0,
          scale: 0.92,
          duration: 0.8,
          stagger: 0.1,
        }, '-=0.9')
        .from('[data-hero="stat"]', { y: 22, opacity: 0, duration: 0.6 }, '-=0.45')

      // Tiles keep breathing once they have landed.
      gsap.to('.hero__tile', {
        y: -9,
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.45, from: 'random' },
        delay: 1.6,
      })
    }, root)

    return () => ctx.revert()
  }, [scope])
}

/** Scrubbed parallax for anything marked `data-parallax="<pixels>"`. */
export function useParallax() {
  const { pathname } = useLocation()

  useEffect(() => {
    ensureGsap()
    if (reduced() || window.matchMedia('(pointer: coarse)').matches) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const distance = Number(el.dataset.parallax) || 40
        gsap.fromTo(
          el,
          { yPercent: -distance / 20 },
          {
            yPercent: distance / 20,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('section') ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          },
        )
      })
    })

    return () => ctx.revert()
  }, [pathname])
}

/** Thin progress bar under the header, scrubbed against total scroll distance. */
export function useScrollProgress() {
  const { pathname } = useLocation()

  useEffect(() => {
    ensureGsap()
    const bar = document.querySelector<HTMLElement>('.progress')
    if (!bar) return

    gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' })
    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.25 },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [pathname])
}

/**
 * Turns a row of cards into a horizontally-scrolling strip that is pinned while
 * you scroll past it. Falls back to ordinary vertical stacking on small screens
 * and under reduced motion.
 */
export function useHorizontalScroll(
  scope: React.RefObject<HTMLElement | null>,
  trackSelector: string,
) {
  useEffect(() => {
    ensureGsap()
    const root = scope.current
    if (!root) return

    const mm = gsap.matchMedia()

    mm.add(
      { wide: '(min-width: 861px) and (prefers-reduced-motion: no-preference)' },
      (context) => {
        if (!context.conditions?.wide) return
        const track = root.querySelector<HTMLElement>(trackSelector)
        if (!track) return

        const distance = () => track.scrollWidth - root.offsetWidth
        if (distance() <= 0) return

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top+=80',
            end: () => `+=${distance() + window.innerHeight * 0.4}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      },
    )

    return () => mm.revert()
  }, [scope, trackSelector])
}

/** Slow zoom-out on a background image as it scrolls through the viewport. */
export function useKenBurns(scope: React.RefObject<HTMLElement | null>, selector: string) {
  useEffect(() => {
    ensureGsap()
    const root = scope.current
    if (!root || reduced()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        selector,
        { scale: 1.18 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [scope, selector])
}

/**
 * ScrollTrigger measures the document on setup. Images finishing later, or a
 * route change swapping the whole page, both invalidate those measurements.
 */
export function useScrollTriggerRefresh() {
  const { pathname } = useLocation()

  useEffect(() => {
    ensureGsap()
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('load', onLoad)
    }
  }, [pathname])
}

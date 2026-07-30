import { useEffect } from 'react'

/**
 * Soft fade + slide reveal on scroll.
 * Observes every [data-reveal] node once, then unobserves — no
 * re-animation on scroll-back, no layout thrash.
 * Falls back to fully visible when IntersectionObserver is absent.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!nodes.length) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('reveal--in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          const delay = Number(el.dataset.revealDelay || 0)
          window.setTimeout(() => el.classList.add('reveal--in'), delay)
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )

    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Adds a boolean-ish class trigger once the page has scrolled past
 * `offset`. Used to swap the header from transparent to solid.
 */
export function useScrolled(offset = 24) {
  useEffect(() => {
    const el = document.getElementById('siteHeader')
    if (!el) return

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        // Routes that force the solid header opt out of scroll control
        if (el.dataset.solid !== 'true') el.dataset.stuck = String(window.scrollY > offset)
        frame = 0
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [offset])
}

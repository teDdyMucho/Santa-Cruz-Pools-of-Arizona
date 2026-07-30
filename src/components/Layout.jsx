import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import { useReveal, useScrolled } from '../hooks/useReveal'

/**
 * Restores scroll position sensibly across route changes:
 *   /studio          → top of the new page
 *   /#services       → the anchor, once it has actually rendered
 * Native anchor restoration doesn't apply, since the target only exists after
 * React has mounted the destination route.
 */
function useRouteScroll() {
  const { pathname, hash, key } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    // Staying on the same page (e.g. Work → Process in the nav) should glide,
    // the way a plain anchor would. Arriving on a new page should not.
    const samePage = prevPath.current === pathname
    prevPath.current = pathname
    const behavior = samePage ? 'smooth' : 'instant'

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior })
      return
    }

    let frames = 0
    let raf = 0
    const seek = () => {
      const el = document.querySelector(hash)
      if (el) {
        // scroll-padding-top on <html> keeps the fixed header from covering it
        el.scrollIntoView({ behavior, block: 'start' })
        return
      }
      // Give the destination route a few frames to mount before giving up
      if (frames++ < 30) raf = window.requestAnimationFrame(seek)
    }
    raf = window.requestAnimationFrame(seek)
    return () => window.cancelAnimationFrame(raf)
  }, [pathname, hash, key])
}

export default function Layout() {
  const { pathname } = useLocation()

  useRouteScroll()
  // Re-run the observers whenever the route changes, since each page mounts
  // its own set of [data-reveal] nodes.
  useReveal([pathname])
  useScrolled(24)

  return (
    <>
      <a
        href="#main"
        className="absolute left-4 top-[-100px] z-999 bg-ink px-5 py-3 text-eyebrow tracking-[0.08em] uppercase text-bone focus:top-4"
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        <span id="top" />
        <Outlet />
      </main>

      <Footer />
    </>
  )
}

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { brand, imageProps, nav } from '../data/site'
import { Button, SmartLink, WRAP_WIDE } from './ui'

const LOGO_ASPECT = '1148 / 415'

/**
 * The supplied lockup is navy, which reads at 1.05:1 on the charcoal footer —
 * invisible. So `auto` stacks both variants and crossfades them off the
 * header's `data-stuck` state: the bone knockout while the header floats over
 * photography, the original artwork once it locks to a solid plate.
 */
export function Wordmark({ variant = 'auto', className = '', sizes = '11rem' }) {
  const img = 'absolute inset-0 h-full w-full object-contain object-left'
  const fade = 'transition-opacity duration-500 ease-[var(--ease-out-soft)]'

  return (
    <Link to="/" aria-label={`${brand.nameFull} — home`} className={`block ${className}`}>
      <span className="relative block w-full" style={{ aspectRatio: LOGO_ASPECT }}>
        {variant !== 'dark' && (
          <img
            {...imageProps('logo-light', sizes)}
            alt={brand.nameFull}
            className={`${img} ${fade} ${
              variant === 'auto' ? 'group-data-[stuck=true]/hdr:opacity-0' : ''
            }`}
          />
        )}
        {variant !== 'light' && (
          <img
            {...imageProps('logo-dark', sizes)}
            /* Decorative duplicate of the same name — announced once, above. */
            alt={variant === 'dark' ? brand.nameFull : ''}
            aria-hidden={variant === 'auto' ? 'true' : undefined}
            className={`${img} ${fade} ${
              variant === 'auto' ? 'opacity-0 group-data-[stuck=true]/hdr:opacity-100' : ''
            }`}
          />
        )}
      </span>
    </Link>
  )
}

/* Routes with no photographic hero. The header floats transparent with white
   text over imagery; on a light page that would be invisible, so it locks to
   its solid state from the first paint. */
const SOLID_HEADER = new Set(['/contact'])

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const solid = SOLID_HEADER.has(pathname)

  /* Lock body scroll while the drawer is open, and close on Escape
     or on resize up to desktop so state can't get stranded. */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    /* The drawer is charcoal, so the header must show its light treatment even
       if we were scrolled and locked to the solid plate — otherwise the navy
       logo lands on a near-black panel. Body scroll is frozen while open, so
       the scroll listener can't race this. */
    const hdr = document.getElementById('siteHeader')
    if (hdr) hdr.dataset.stuck = solid ? 'true' : open ? 'false' : String(window.scrollY > 24)

    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth >= 1024 && setOpen(false)

    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open, solid])

  return (
    <>
      <header
        id="siteHeader"
        data-stuck={solid ? 'true' : 'false'}
        data-solid={solid ? 'true' : 'false'}
        className="group/hdr fixed inset-x-0 top-0 z-100 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-soft)] data-[stuck=true]:border-ink/10 data-[stuck=true]:bg-bone/94 data-[stuck=true]:backdrop-blur-md"
      >
        <div
          className={`${WRAP_WIDE} on-photo-nav flex min-h-[4.375rem] items-center gap-6 text-white transition-colors duration-500 group-data-[stuck=true]/hdr:text-ink lg:min-h-[5.25rem]`}
        >
          <Wordmark
            className="mr-auto w-[8.25rem] sm:w-[9.5rem] lg:w-[10.5rem]"
            sizes="(min-width: 1024px) 10.5rem, (min-width: 640px) 9.5rem, 8.25rem"
          />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex gap-[clamp(1.25rem,2.4vw,2.4rem)]">
              {nav.map((item) => {
                /* Only page routes can be "current" — a link to a homepage
                   section is never a page in its own right. */
                const current = !item.to.includes('#') && pathname === item.to
                return (
                  <li key={item.to}>
                    <SmartLink
                      to={item.to}
                      aria-current={current ? 'page' : undefined}
                      className={`relative block py-1.5 text-eyebrow tracking-[0.13em] uppercase after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-450 after:ease-[var(--ease-out-soft)] hover:after:scale-x-100 ${
                        current ? 'after:scale-x-100' : 'after:scale-x-0'
                      }`}
                    >
                      {item.label}
                    </SmartLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Wrapper owns the responsive `display` so it can't collide with
              the button's own `inline-flex` utility. */}
          <div className="hidden lg:block">
            {/* Explicitly the homepage's CTA block, not "the CTA on whatever
                page you happen to be on" — this button always goes home. */}
            <Button
              variant="ghost"
              to="/#contact"
              className="hover:bg-white hover:text-ink group-data-[stuck=true]/hdr:hover:bg-ink group-data-[stuck=true]/hdr:hover:text-bone"
            >
              {brand.primaryCta}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobileNav"
            className="flex items-center gap-2.5 py-2 text-eyebrow tracking-[0.14em] uppercase lg:hidden"
          >
            <span aria-hidden="true" className="grid w-[1.375rem] gap-[5px]">
              <i
                className={`h-px bg-current transition-transform duration-400 ease-[var(--ease-out-soft)] ${
                  open ? 'translate-y-[3px] rotate-45' : ''
                }`}
              />
              <i
                className={`h-px bg-current transition-transform duration-400 ease-[var(--ease-out-soft)] ${
                  open ? '-translate-y-[3px] -rotate-45' : ''
                }`}
              />
            </span>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobileNav"
        className={`fixed inset-0 z-99 flex flex-col gap-10 overflow-y-auto bg-ink px-5 pt-28 pb-16 text-bone transition-opacity duration-450 ease-[var(--ease-out-soft)] xs:px-6 sm:px-8 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        {...(open ? {} : { 'aria-hidden': 'true' })}
      >
        <nav aria-label="Mobile">
          <ul className="grid gap-4">
            {[...nav.slice(0, 4), { label: 'Testimonials', to: '/#voices' }, nav[4]].map(
              (item) => (
                <li key={item.to}>
                  <SmartLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className="font-serif text-[clamp(1.5rem,7vw,2.1rem)] leading-tight"
                  >
                    {item.label}
                  </SmartLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <Button
          variant="solid"
          to="/#contact"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className="self-start"
        >
          {brand.primaryCta}
        </Button>

        <p className="mt-auto text-eyebrow tracking-[0.2em] uppercase text-bone/55">
          {brand.serviceArea}
        </p>
      </div>
    </>
  )
}

import { Link } from 'react-router'
import { imageProps } from '../data/site'

/* Routes start with "/" and go through the router. Everything else — a bare
   "#contact", a mailto:, a tel: — stays a native anchor. That distinction
   matters for "#contact": it must hit the CTA on the page you are already on,
   not send you to the homepage's. */
const isRoute = (dest) => typeof dest === 'string' && dest.startsWith('/')

export function SmartLink({ to, href, children, ...rest }) {
  const dest = to ?? href
  return isRoute(dest) ? (
    <Link to={dest} {...rest}>
      {children}
    </Link>
  ) : (
    <a href={dest} {...rest}>
      {children}
    </a>
  )
}

/* Shared class fragments so spacing/rhythm stay identical site-wide */
export const WRAP = 'mx-auto w-full max-w-[77.5rem] px-5 xs:px-6 sm:px-8 lg:px-12 xl:px-16'
export const WRAP_WIDE = 'mx-auto w-full max-w-[100rem] px-5 xs:px-6 sm:px-8 lg:px-12 xl:px-16'
export const SECTION_Y = 'py-[clamp(4.5rem,12vw,11rem)]'

const cx = (...c) => c.filter(Boolean).join(' ')

/* ---------- Reveal wrapper ---------- */
export function Reveal({ as: Tag = 'div', delay = 0, className, children, ...rest }) {
  return (
    <Tag
      data-reveal=""
      data-reveal-delay={delay || undefined}
      className={cx('reveal', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ---------- Eyebrow ----------
   Colour is chosen by `tone`, never by a caller's className, so the two can
   never collide in the same property group. */
const EYEBROW_TONES = {
  dark: 'text-graphite', // on bone / sand
  light: 'text-white/75', // on photography
  onInk: 'text-bone/70', // on the charcoal process band
}

export function Eyebrow({ light = false, tone, className, children }) {
  return (
    <p
      className={cx(
        /* Slightly tighter on phones so long strings like the service-area
           list stay on one line instead of orphaning a word. */
        'text-[0.72rem] font-normal tracking-[0.16em] uppercase sm:text-eyebrow sm:tracking-[0.22em]',
        EYEBROW_TONES[tone ?? (light ? 'light' : 'dark')],
        className,
      )}
    >
      {children}
    </p>
  )
}

/* ---------- Buttons ---------- */
/* Base carries no `display`, `padding`, or `tracking` — those live in the
   variants. Keeping conflicting utilities out of the base means a caller's
   `className` (e.g. `hidden lg:inline-flex`) can never lose the specificity
   coin-flip against a base utility in the same property group. */
const BTN_BASE =
  'items-center justify-center border text-eyebrow font-normal uppercase ' +
  'transition-colors duration-500 ease-[var(--ease-out-soft)]'

const VARIANTS = {
  /* Light plate on photography — reads as the quiet primary */
  solid:
    'inline-flex px-7 py-4 tracking-[0.16em] border-transparent bg-bone text-ink hover:bg-pool hover:text-white',
  /* Dark plate on light sections */
  dark: 'inline-flex px-7 py-4 tracking-[0.16em] border-transparent bg-ink text-bone hover:bg-pool hover:text-white',
  /* Outline on photography */
  line: 'inline-flex px-7 py-4 tracking-[0.16em] border-white/55 text-white hover:bg-white hover:text-ink hover:border-white',
  /* Header pill — inherits the header's current colour */
  ghost: 'inline-flex px-6 py-3.5 tracking-[0.13em] border-current',
}

export function Button({ variant = 'dark', href = '#contact', to, className, children, ...rest }) {
  return (
    <SmartLink to={to} href={href} className={cx(BTN_BASE, VARIANTS[variant], className)} {...rest}>
      {children}
    </SmartLink>
  )
}

/* ---------- Arrow link ----------
   `quiet` starts with no rule and gains one from a parent `.group` hover —
   used inside larger clickable blocks like the service tiles. */
const ARROW_TONES = {
  dark: 'border-stone text-ink hover:border-pool hover:text-pool',
  light: 'border-white/50 text-white hover:border-white',
  quiet: 'border-transparent text-ink group-hover:border-pool group-hover:text-pool',
}

export function LinkArrow({ tone = 'dark', className, children }) {
  return (
    <span
      className={cx(
        'group/arrow inline-flex items-center gap-2.5 border-b pb-1 text-eyebrow tracking-[0.16em] uppercase',
        'transition-colors duration-400 ease-[var(--ease-out-soft)]',
        ARROW_TONES[tone],
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover/arrow:translate-x-1.5 group-hover:translate-x-1.5"
      >
        &#8594;
      </span>
    </span>
  )
}

export function ArrowLink({ href = '#contact', to, children, ...rest }) {
  return (
    <SmartLink to={to} href={href} className="mt-8 inline-block" {...rest}>
      <LinkArrow>{children}</LinkArrow>
    </SmartLink>
  )
}

/* ---------- Photographic frame ----------
   Every image on the site goes through here so crop, grade, and
   hover behaviour are identical. Aspect ratios only — never fixed
   pixel heights — so it holds at any viewport. */
const RATIOS = {
  cinema: 'aspect-16/9',
  wide: 'aspect-3/2',
  tall: 'aspect-4/5',
  portrait: 'aspect-3/4',
  square: 'aspect-square',
}

/* On narrow screens tall/portrait crops become 3:2 — a 3:4 plate is
   too tall to read on a phone. */
const RATIO_SM = {
  tall: 'aspect-3/2 sm:aspect-4/5',
  portrait: 'aspect-3/2 sm:aspect-3/4',
}

export function Frame({
  image,
  alt = '',
  ratio = 'wide',
  sizes = '100vw',
  priority = false,
  overlay = false,
  className,
}) {
  return (
    <div
      className={cx(
        'relative overflow-hidden bg-sand',
        RATIO_SM[ratio] || RATIOS[ratio],
        className,
      )}
    >
      <img
        {...imageProps(image, sizes)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className="photo"
      />
      {overlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#091014]/55 to-transparent to-60% opacity-0 transition-opacity duration-600 ease-[var(--ease-out-soft)] group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      )}
    </div>
  )
}

/* ---------- Full-bleed background plate ---------- */
export function BleedMedia({ image, objectPosition = 'center 58%', scrim }) {
  return (
    <>
      <div className="absolute inset-0 -z-20 overflow-hidden bg-ink">
        <img
          {...imageProps(image, '100vw')}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition }}
        />
      </div>
      <div aria-hidden="true" className={cx('absolute inset-0 -z-10', scrim)} />
    </>
  )
}

/* ---------- Section heading ---------- */
export function SectionHead({
  eyebrow,
  title,
  aside,
  center = false,
  tone = 'dark',
  flush = false,
  className,
}) {
  const light = tone === 'light'
  return (
    <div
      className={cx(
        /* `flush` omits the margin rather than letting a caller try to
           override it with a competing margin utility. */
        !flush && 'mb-[clamp(2.5rem,6vw,5rem)]',
        aside ? 'grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16' : '',
        center && 'mx-auto max-w-[30rem] text-center',
        className,
      )}
    >
      {/* Measure is set in rem, not ch: `ch` resolves against the parent's
          body font-size and would strangle the much larger display serif. */}
      <div className={cx(!aside && !center && 'max-w-[36rem] lg:max-w-[46rem]')}>
        <Eyebrow light={light} className="mb-5">
          {eyebrow}
        </Eyebrow>
        <h2
          className={cx(
            'font-serif text-h2 leading-[1.14] tracking-[-0.015em]',
            light ? 'text-bone' : 'text-ink',
          )}
        >
          {Array.isArray(title)
            ? title.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))
            : title}
        </h2>
      </div>
      {aside && (
        <p className={cx('max-w-[40ch] lg:pb-1.5', light ? 'text-bone/70' : 'text-graphite')}>
          {aside}
        </p>
      )}
    </div>
  )
}

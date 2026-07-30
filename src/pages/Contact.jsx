import { useState } from 'react'
import { brand, contactPage } from '../data/site'
import { Eyebrow, Reveal, WRAP } from '../components/ui'

const FIELD =
  'w-full border-b border-stone bg-transparent pb-2.5 text-ink outline-none ' +
  'transition-colors duration-300 placeholder:text-graphite/60 focus:border-pool'
const LABEL = 'block text-eyebrow font-normal tracking-[0.18em] uppercase text-graphite'

export default function Contact() {
  const { eyebrow, title, lede, formNote, hours, interests } = contactPage
  const [sent, setSent] = useState(false)

  /* No backend exists, so rather than a form that silently does nothing, this
     composes a mailto: with everything filled in. Swap for a real endpoint
     when there is one — only this handler needs to change. */
  function handleSubmit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = [
      `Name: ${f.get('name')}`,
      `Email: ${f.get('email')}`,
      `Phone: ${f.get('phone') || '—'}`,
      `Property: ${f.get('property') || '—'}`,
      `Interested in: ${f.get('interest')}`,
      '',
      f.get('message') || '',
    ].join('\n')

    window.location.href =
      `mailto:${brand.email}` +
      `?subject=${encodeURIComponent(`Consultation enquiry — ${f.get('name')}`)}` +
      `&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    /* pt clears the fixed header: this page has no hero plate to sit under. */
    <section
      aria-labelledby="contactTitle"
      className="bg-bone pt-[clamp(8rem,14vw,11rem)] pb-[clamp(4.5rem,12vw,11rem)]"
    >
      <div className={WRAP}>
        <Reveal className="max-w-[46rem]">
          <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
          <h1
            id="contactTitle"
            className="font-serif text-[clamp(2.1rem,5.4vw,4.2rem)] leading-[1.08] tracking-[-0.022em] text-ink"
          >
            {title.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-[46ch] text-lede text-graphite">{lede}</p>
        </Reveal>

        <div className="mt-[clamp(3rem,7vw,5.5rem)] grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1.15fr_0.85fr]">
          {/* ---------- Form ---------- */}
          <Reveal>
            <form onSubmit={handleSubmit} className="grid gap-7">
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <label className={LABEL} htmlFor="name">
                    Name
                  </label>
                  <input id="name" name="name" required autoComplete="name" className={`${FIELD} mt-3`} />
                </div>
                <div>
                  <label className={LABEL} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={`${FIELD} mt-3`}
                  />
                </div>
                <div>
                  <label className={LABEL} htmlFor="phone">
                    Phone <span className="normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className={`${FIELD} mt-3`}
                  />
                </div>
                <div>
                  <label className={LABEL} htmlFor="property">
                    Property location
                  </label>
                  <input
                    id="property"
                    name="property"
                    placeholder="Paradise Valley"
                    className={`${FIELD} mt-3`}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL} htmlFor="interest">
                  Interested in
                </label>
                <select id="interest" name="interest" className={`${FIELD} mt-3`} defaultValue={interests[0]}>
                  {interests.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={LABEL} htmlFor="message">
                  Tell us about the project
                </label>
                <textarea id="message" name="message" rows={5} className={`${FIELD} mt-3 resize-y`} />
              </div>

              <div className="flex flex-col gap-4 pt-2 xs:flex-row xs:items-center">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center border border-transparent bg-ink px-7 py-4 text-eyebrow font-normal tracking-[0.16em] uppercase text-bone transition-colors duration-500 ease-[var(--ease-out-soft)] hover:bg-pool hover:text-white"
                >
                  {brand.primaryCta}
                </button>
                <p aria-live="polite" className="text-eyebrow text-graphite">
                  {sent ? 'Your email client should now be open.' : formNote}
                </p>
              </div>
            </form>
          </Reveal>

          {/* ---------- Details ---------- */}
          <Reveal delay={120} as="aside">
            <h2 className="text-eyebrow font-normal tracking-[0.18em] uppercase text-graphite">
              Direct
            </h2>
            <ul className="mt-4 grid gap-2">
              <li>
                <a
                  href={brand.phoneHref}
                  className="font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] text-ink transition-colors duration-300 hover:text-pool"
                >
                  {brand.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${brand.email}`}
                  className="break-words font-serif text-[clamp(1.05rem,1.5vw,1.25rem)] text-ink transition-colors duration-300 hover:text-pool"
                >
                  {brand.email}
                </a>
              </li>
            </ul>

            <h2 className="mt-10 text-eyebrow font-normal tracking-[0.18em] uppercase text-graphite">
              Studio
            </h2>
            <address className="mt-4 not-italic leading-relaxed text-ink-soft">
              {brand.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>

            <dl className="mt-10 grid">
              {hours.map((h) => (
                <div key={h.k} className="border-t border-stone py-4">
                  <dt className="text-eyebrow font-normal tracking-[0.18em] uppercase text-graphite">
                    {h.k}
                  </dt>
                  <dd className="mt-1.5 text-ink-soft">{h.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

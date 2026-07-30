import { projects, workPage } from '../data/site'
import Closing from '../components/Closing'
import PageHero from '../components/PageHero'
import { Eyebrow, Frame, Reveal, SECTION_Y, SectionHead, WRAP, WRAP_WIDE } from '../components/ui'

/* Same asymmetric 6-column bed as the homepage grid. */
const SPAN = { full: 'sm:col-span-6', half: 'sm:col-span-3' }

export default function Work() {
  const { hero, intro, index } = workPage

  return (
    <>
      <PageHero {...hero} />

      {/* ---------- Selection ---------- */}
      <section aria-labelledby="selectionTitle" className={`bg-bone ${SECTION_Y}`}>
        <div className={WRAP}>
          <Reveal>
            <div className="grid items-start gap-[clamp(2rem,6vw,5rem)] lg:grid-cols-[1fr_1fr]">
              <div>
                <Eyebrow className="mb-5">{intro.eyebrow}</Eyebrow>
                <h2
                  id="selectionTitle"
                  className="font-serif text-h2 leading-[1.14] tracking-[-0.015em] text-ink"
                >
                  {intro.title.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
              </div>
              <div className="max-w-[46ch] space-y-[1.15em] text-graphite">
                {intro.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- The commissions ---------- */}
      <section aria-labelledby="commissionsTitle" className="bg-bone pb-[clamp(4.5rem,12vw,11rem)]">
        <h2 id="commissionsTitle" className="sr-only">
          Completed commissions
        </h2>

        <div className={`${WRAP_WIDE} grid gap-[clamp(1.25rem,2.6vw,2.5rem)] sm:grid-cols-6`}>
          {projects.map((p, i) => (
            <Reveal
              as="article"
              key={p.name}
              delay={p.span === 'half' ? (i % 2) * 110 : 0}
              className={SPAN[p.span]}
            >
              <a href="#contact" className="group relative block">
                <Frame
                  image={p.image}
                  alt={p.alt}
                  ratio={p.ratio}
                  overlay
                  sizes={p.span === 'full' ? '100vw' : '(min-width: 640px) 48vw, 100vw'}
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-6 left-6 translate-y-2.5 border-b border-white/70 pb-1.5 text-eyebrow tracking-[0.18em] uppercase text-white opacity-0 transition-[opacity,transform] duration-550 ease-[var(--ease-out-soft)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:left-8"
                >
                  Enquire
                </span>

                {/* Richer caption than the homepage tile: year and scope too */}
                <div className="pt-4">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="font-serif text-h3 text-ink transition-colors duration-400 ease-[var(--ease-out-soft)] group-hover:text-pool">
                      {p.name}
                    </h3>
                    <p className="text-eyebrow font-normal tracking-[0.16em] uppercase text-graphite">
                      {p.loc} · {p.year}
                    </p>
                  </div>
                  <p className="mt-1.5 max-w-[42ch] text-eyebrow font-normal tracking-[0.06em] text-graphite">
                    {p.scope}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Index ---------- */}
      <section aria-labelledby="indexTitle" className={`bg-sand ${SECTION_Y}`}>
        <div className={WRAP}>
          <Reveal>
            <SectionHead eyebrow={index.eyebrow} title={index.title} />
          </Reveal>

          <table className="w-full border-collapse text-left">
            <caption className="sr-only">All completed commissions</caption>
            <thead>
              <tr>
                {index.cols.map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className={`border-b border-ink/20 pb-3 text-eyebrow font-normal tracking-[0.18em] uppercase text-graphite ${
                      c === 'Scope' ? 'hidden lg:table-cell' : ''
                    } ${c === 'Location' ? 'hidden sm:table-cell' : ''}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.name} className="align-baseline">
                  <th
                    scope="row"
                    className="border-b border-ink/12 py-4 pr-6 font-serif text-[clamp(1rem,1.4vw,1.2rem)] font-normal text-ink"
                  >
                    {p.name}
                    <span className="mt-1 block text-eyebrow tracking-[0.12em] uppercase text-graphite sm:hidden">
                      {p.loc}
                    </span>
                  </th>
                  <td className="hidden border-b border-ink/15 py-4 pr-6 text-ink-soft sm:table-cell">
                    {p.loc}
                  </td>
                  <td className="hidden border-b border-ink/15 py-4 pr-6 text-ink-soft lg:table-cell">
                    {p.scope}
                  </td>
                  <td className="border-b border-ink/15 py-4 text-ink-soft tabular-nums">{p.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Closing />
    </>
  )
}

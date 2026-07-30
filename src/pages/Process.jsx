import { process as homeProcess, processPage } from '../data/site'
import Closing from '../components/Closing'
import PageHero from '../components/PageHero'
import { Eyebrow, Reveal, SECTION_Y, SectionHead, WRAP } from '../components/ui'

export default function Process() {
  const { hero, intro, detail, close } = processPage

  /* Titles and lead copy come from the homepage's step list, so the two can
     never drift; `detail` only adds to each one. */
  const steps = homeProcess.steps.map((s, i) => ({ ...s, ...detail[i] }))

  return (
    <>
      <PageHero {...hero} />

      {/* ---------- Overview ---------- */}
      <section aria-labelledby="overviewTitle" className={`bg-bone ${SECTION_Y}`}>
        <div className={WRAP}>
          <Reveal>
            <div className="grid items-start gap-[clamp(2rem,6vw,5rem)] lg:grid-cols-[1fr_1fr]">
              <div>
                <Eyebrow className="mb-5">{intro.eyebrow}</Eyebrow>
                <h2
                  id="overviewTitle"
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

      {/* ---------- The five stages ----------
          Set on bone rather than the homepage's charcoal: this is the page
          people actually read to understand what they're buying, so it gets
          ink-on-bone (15.9:1) instead of bone-on-ink at 70% (8.3:1). */}
      <section aria-labelledby="stagesTitle" className="bg-bone pb-[clamp(4.5rem,12vw,11rem)]">
        <h2 id="stagesTitle" className="sr-only">
          The five stages in detail
        </h2>

        <ol className={WRAP}>
          {steps.map((s, i) => (
            <Reveal
              as="li"
              key={s.num}
              delay={i * 60}
              className="border-t border-stone py-[clamp(2.25rem,4.5vw,3.5rem)] last:border-b"
            >
              <div className="grid gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-6 lg:grid-cols-[7rem_1fr_16rem]">
                {/* Stage number — large enough to scan down the page */}
                <p
                  aria-hidden="true"
                  className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-none text-stone"
                >
                  {s.num}
                </p>

                <div>
                  <h3 className="font-serif text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.2] tracking-[-0.012em] text-ink">
                    {s.title}
                  </h3>
                  {/* The homepage line, set as the lead-in */}
                  <p className="mt-4 max-w-[52ch] text-lede text-ink-soft">{s.body}</p>
                  <p className="mt-4 max-w-[56ch] text-graphite">{s.detail}</p>
                </div>

                <div className="lg:pt-1.5">
                  <p className="text-eyebrow font-normal tracking-[0.18em] uppercase text-graphite">
                    What you receive
                  </p>
                  <ul className="mt-3 grid gap-1.5">
                    {s.gives.map((g) => (
                      <li key={g} className="text-ink-soft">
                        {g}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 border-t border-stone pt-3 text-eyebrow font-normal tracking-[0.12em] uppercase text-graphite">
                    {s.takes}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------- After handover ---------- */}
      <section aria-labelledby="afterTitle" className={`bg-sand ${SECTION_Y}`}>
        <div className={WRAP}>
          <Reveal>
            <SectionHead eyebrow={close.eyebrow} title={close.title} aside={close.body} />
          </Reveal>
        </div>
      </section>

      <Closing />
    </>
  )
}

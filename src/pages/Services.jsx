import { servicesPage } from '../data/site'
import Closing from '../components/Closing'
import PageHero from '../components/PageHero'
import {
  ArrowLink,
  Eyebrow,
  Frame,
  Reveal,
  SECTION_Y,
  SectionHead,
  WRAP,
  WRAP_WIDE,
} from '../components/ui'

export default function Services() {
  const { hero, intro, detail, close } = servicesPage

  return (
    <>
      <PageHero {...hero} />

      {/* ---------- Scope ---------- */}
      <section aria-labelledby="scopeTitle" className={`bg-bone ${SECTION_Y}`}>
        <div className={WRAP}>
          <Reveal>
            <div className="grid items-start gap-[clamp(2rem,6vw,5rem)] lg:grid-cols-[1fr_1fr]">
              <div>
                <Eyebrow className="mb-5">{intro.eyebrow}</Eyebrow>
                <h2
                  id="scopeTitle"
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

      {/* ---------- The four disciplines ---------- */}
      <section aria-labelledby="disciplinesTitle" className="bg-bone">
        <h2 id="disciplinesTitle" className="sr-only">
          The four disciplines in detail
        </h2>

        {detail.map((d, i) => {
          const flip = i % 2 === 1
          return (
            <article
              key={d.num}
              className={`${i % 2 ? 'bg-sand' : 'bg-bone'} py-[clamp(3.5rem,8vw,7rem)]`}
            >
              <div
                className={`${WRAP} grid items-center gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-2`}
              >
                <Reveal className={flip ? 'lg:order-2' : ''}>
                  <div className="group">
                    <Frame
                      image={d.image}
                      alt={d.alt}
                      ratio="wide"
                      sizes="(min-width: 1024px) 46vw, 100vw"
                    />
                  </div>
                </Reveal>

                <Reveal delay={110} className={flip ? 'lg:order-1' : ''}>
                  <span aria-hidden="true" className="text-eyebrow tracking-[0.2em] text-graphite">
                    {d.num}
                  </span>
                  <h3 className="mt-2 mb-4 font-serif text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.2] tracking-[-0.012em] text-ink">
                    {d.title}
                  </h3>

                  {/* The homepage tile's line, set larger as the lead-in */}
                  <p className="max-w-[44ch] text-lede text-ink-soft">{d.lead}</p>

                  <div className="mt-5 max-w-[46ch] space-y-[1.15em] text-graphite">
                    {d.body.map((para, k) => (
                      <p key={k}>{para}</p>
                    ))}
                  </div>

                  <ul className="mt-7 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                    {d.includes.map((item) => (
                      <li
                        key={item}
                        /* font-normal to match every other eyebrow on the site;
                           13px uppercase at weight 300 is too thin to hold. */
                        className="border-t border-stone pt-2.5 text-eyebrow font-normal tracking-[0.1em] uppercase text-graphite"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </article>
          )
        })}
      </section>

      {/* ---------- Together ---------- */}
      <section aria-labelledby="closeTitle" className={`bg-ink text-bone ${SECTION_Y}`}>
        <div className={WRAP}>
          <Reveal>
            <SectionHead
              eyebrow={close.eyebrow}
              title={close.title}
              aside={close.body}
              tone="light"
            />
            <ArrowLink to="/process">How a project runs</ArrowLink>
          </Reveal>
        </div>
      </section>

      <Closing />
    </>
  )
}

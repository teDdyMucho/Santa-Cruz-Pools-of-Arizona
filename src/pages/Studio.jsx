import { studio } from '../data/site'
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

export default function Studio() {
  const { hero, intro, principles, materials, facts, atmosphere } = studio

  return (
    <>
      <PageHero {...hero} />

      {/* ---------- Position ---------- */}
      <section aria-labelledby="introTitle" className={`bg-bone ${SECTION_Y}`}>
        <div
          className={`${WRAP} grid items-start gap-[clamp(2.5rem,7vw,7rem)] lg:grid-cols-[1.05fr_0.95fr]`}
        >
          <Reveal>
            <Eyebrow className="mb-5">{intro.eyebrow}</Eyebrow>
            <h2
              id="introTitle"
              className="font-serif text-h2 leading-[1.14] tracking-[-0.015em] text-ink"
            >
              {intro.title.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <div className="mt-7 max-w-[46ch] space-y-[1.15em] text-graphite">
              {intro.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <blockquote className="mt-10 max-w-[34ch] border-t border-stone pt-7">
              <p className="font-serif text-[clamp(1.15rem,1.7vw,1.5rem)] leading-[1.5] text-ink-soft">
                {intro.pull}
              </p>
            </blockquote>

            <ArrowLink to="/services">Our disciplines</ArrowLink>
          </Reveal>

          <Reveal as="figure" delay={120} className="m-0 lg:sticky lg:top-32">
            <div className="group">
              <Frame
                image={intro.image}
                alt={intro.imageAlt}
                ratio="tall"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
            <figcaption className="mt-4 text-eyebrow tracking-[0.04em] text-graphite">
              {intro.caption}
            </figcaption>
          </Reveal>
        </div>
      </section>

      {/* ---------- How we work ---------- */}
      <section aria-labelledby="principlesTitle" className={`bg-ink text-bone ${SECTION_Y}`}>
        <div className={WRAP}>
          <Reveal>
            <SectionHead
              eyebrow={principles.eyebrow}
              title={principles.title}
              aside={principles.aside}
              tone="light"
            />
          </Reveal>

          <ol className="grid gap-x-[clamp(2rem,5vw,4.5rem)] sm:grid-cols-2">
            {principles.items.map((p, i) => (
              <Reveal
                as="li"
                key={p.num}
                delay={(i % 2) * 110}
                className="border-t border-bone/18 py-[clamp(1.75rem,3.2vw,2.75rem)]"
              >
                <span
                  aria-hidden="true"
                  className="mb-5 block text-eyebrow tracking-[0.2em] text-stone"
                >
                  {p.num}
                </span>
                <h3 className="mb-3 font-serif text-h3 text-bone">{p.title}</h3>
                <p className="max-w-[44ch] text-bone/70">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Palette ---------- */}
      <section aria-labelledby="materialsTitle" className={`bg-sand ${SECTION_Y}`}>
        <div className={WRAP}>
          <Reveal>
            <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
              <div>
                <Eyebrow className="mb-5">{materials.eyebrow}</Eyebrow>
                <h2
                  id="materialsTitle"
                  className="max-w-[36rem] font-serif text-h2 leading-[1.14] tracking-[-0.015em] text-ink lg:max-w-[46rem]"
                >
                  {materials.title.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
              </div>
              <div className="max-w-[44ch] space-y-[1.15em] text-graphite lg:pb-1.5">
                {materials.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <ul
          className={`${WRAP_WIDE} mt-[clamp(2.5rem,6vw,4.5rem)] grid gap-x-[clamp(1rem,2vw,2rem)] gap-y-[clamp(2rem,3.5vw,3rem)] sm:grid-cols-2 lg:grid-cols-4`}
        >
          {materials.items.map((m, i) => (
            <Reveal as="li" key={m.label} delay={i * 90}>
              <div className="group">
                <Frame
                  image={m.image}
                  alt={m.alt}
                  ratio="wide"
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                />
              </div>
              <p className="mt-4 text-eyebrow tracking-[0.18em] uppercase text-graphite">
                {m.label}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- The practice ---------- */}
      <section aria-labelledby="factsTitle" className={`bg-bone ${SECTION_Y}`}>
        <div className={WRAP}>
          <Reveal>
            <Eyebrow className="mb-8">{facts.eyebrow}</Eyebrow>
            <h2 id="factsTitle" className="sr-only">
              The practice at a glance
            </h2>
          </Reveal>

          {/* A quiet definition list, not a stats strip — the brand doesn't shout numbers. */}
          <dl className="grid gap-x-[clamp(2rem,5vw,4rem)] sm:grid-cols-2 lg:grid-cols-4">
            {facts.items.map((f, i) => (
              <Reveal key={f.k} delay={i * 80} className="border-t border-stone py-6">
                <dt className="text-eyebrow tracking-[0.18em] uppercase text-graphite">{f.k}</dt>
                <dd className="mt-2 font-serif text-[clamp(1.1rem,1.5vw,1.35rem)] text-ink">
                  {f.v}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- In practice ---------- */}
      <section aria-labelledby="atmosphereTitle" className={`bg-bone pb-[clamp(4.5rem,12vw,11rem)]`}>
        <div className={WRAP}>
          <Reveal>
            <SectionHead eyebrow={atmosphere.eyebrow} title={atmosphere.title} />
          </Reveal>
        </div>

        <div
          className={`${WRAP_WIDE} grid gap-[clamp(1.25rem,2.6vw,2.5rem)] sm:grid-cols-2 lg:grid-cols-3`}
        >
          {atmosphere.items.map((a, i) => (
            <Reveal key={a.image} delay={i * 110}>
              <div className="group">
                <Frame
                  image={a.image}
                  alt={a.alt}
                  ratio="wide"
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                />
              </div>
            </Reveal>
          ))}
        </div>

        <div className={`${WRAP} mt-[clamp(2rem,4vw,3rem)]`}>
          <Reveal>
            <ArrowLink to="/work">See selected work</ArrowLink>
          </Reveal>
        </div>
      </section>

      <Closing />
    </>
  )
}

import { services } from '../data/site'
import { Frame, LinkArrow, Reveal, SECTION_Y, SectionHead, WRAP, WRAP_WIDE } from './ui'

export default function Services() {
  return (
    <section id="services" aria-labelledby="servicesTitle" className={`bg-sand ${SECTION_Y}`}>
      <div className={WRAP}>
        <Reveal>
          <SectionHead
            eyebrow="Disciplines"
            title={['Four practices,', 'one composition.']}
            flush
          />
        </Reveal>
      </div>

      <ul
        className={`${WRAP_WIDE} mt-[clamp(2.5rem,6vw,5rem)] grid gap-x-[clamp(1.5rem,3.5vw,3.5rem)] gap-y-[clamp(2.5rem,4.5vw,4rem)] sm:grid-cols-2`}
      >
        {services.map((s, i) => (
          <Reveal as="li" key={s.num} delay={(i % 2) * 110}>
            <a href="#contact" className="group block">
              <Frame
                image={s.image}
                alt={s.alt}
                ratio="wide"
                sizes="(min-width: 640px) 48vw, 100vw"
              />

              <div className="pt-6">
                <span
                  aria-hidden="true"
                  className="text-eyebrow tracking-[0.2em] text-graphite"
                >
                  {s.num}
                </span>
                <h3 className="mt-2 mb-4 font-serif text-h3 text-ink transition-colors duration-400 ease-[var(--ease-out-soft)] group-hover:text-pool">
                  {s.title}
                </h3>
                <p className="max-w-[42ch] text-graphite">{s.desc}</p>
                <span className="mt-6 inline-block">
                  <LinkArrow tone="quiet">Enquire</LinkArrow>
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

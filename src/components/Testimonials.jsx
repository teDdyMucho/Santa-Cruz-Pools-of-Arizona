import { testimonials } from '../data/site'
import { Reveal, SECTION_Y, SectionHead, WRAP } from './ui'

export default function Testimonials() {
  return (
    <section id="voices" aria-labelledby="voicesTitle" className={`bg-bone ${SECTION_Y}`}>
      <div className={WRAP}>
        <Reveal>
          <SectionHead eyebrow="In Their Words" title="Clients on the work." center />
        </Reveal>

        <div className="grid gap-10 sm:gap-12 lg:grid-cols-3 lg:gap-[clamp(2.5rem,5vw,4.5rem)]">
          {testimonials.map((t, i) => (
            <Reveal as="figure" key={t.name} delay={i * 120} className="m-0">
              <blockquote className="m-0">
                <p className="border-t border-stone pt-8 font-serif text-[clamp(1.08rem,1.5vw,1.32rem)] leading-[1.6] tracking-[-0.005em] text-ink-soft">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-6 grid gap-1 text-eyebrow">
                <span className="tracking-[0.1em] uppercase text-ink">{t.name}</span>
                <span className="tracking-[0.16em] uppercase text-graphite">{t.loc}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

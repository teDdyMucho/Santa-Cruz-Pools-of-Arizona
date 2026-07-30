import { pillars } from '../data/site'
import { BleedMedia, Reveal, WRAP } from './ui'

export default function Pillars() {
  return (
    <section
      aria-labelledby="pillarsTitle"
      className="relative isolate py-[clamp(4.5rem,11vw,9rem)] text-white"
    >
      {/* Scrim is set at the lightest value that still clears 3:1 for the
          26px headings over the plate's brightest region (measured, not eyeballed). */}
      <BleedMedia
        image={pillars.image}
        objectPosition="center 55%"
        scrim="bg-[linear-gradient(180deg,rgba(11,20,26,0.84),rgba(11,20,26,0.74))]"
      />

      <div className={WRAP}>
        <h2 id="pillarsTitle" className="sr-only">
          Why clients choose our studio
        </h2>

        <ol className="grid gap-8 sm:gap-10 lg:grid-cols-3 lg:gap-[clamp(2rem,5vw,4.5rem)]">
          {pillars.items.map((p, i) => (
            <Reveal as="li" key={p.num} delay={i * 110} className="border-t border-white/28 pt-6">
              <span
                aria-hidden="true"
                className="mb-5 block text-eyebrow tracking-[0.2em] text-white/60"
              >
                {p.num}
              </span>
              <h3 className="on-photo mb-4 font-serif text-h3 leading-[1.25]">{p.title}</h3>
              <p className="max-w-[36ch] text-white/80">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

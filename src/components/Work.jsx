import { projects } from '../data/site'
import { Frame, Reveal, SECTION_Y, SectionHead, WRAP, WRAP_WIDE } from './ui'

/* Asymmetric editorial grid: full-width cinematic plates bracket
   paired portrait/landscape rows — magazine rhythm, not a card wall. */
const SPAN = {
  full: 'sm:col-span-6',
  half: 'sm:col-span-3',
}

export default function Work() {
  return (
    <section id="work" aria-labelledby="workTitle" className={`bg-bone ${SECTION_Y}`}>
      <div className={WRAP}>
        <Reveal>
          <SectionHead
            eyebrow="Selected Work"
            title={['Private commissions', 'across the valley.']}
            aside="A small number of projects each year, documented in full. Every image below is a completed commission."
          />
        </Reveal>
      </div>

      <div
        className={`${WRAP_WIDE} grid gap-[clamp(1.25rem,2.6vw,2.5rem)] sm:grid-cols-6`}
      >
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

              {/* Hover reveal — sits inside the plate, above the caption */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-6 left-6 translate-y-2.5 border-b border-white/70 pb-1.5 text-eyebrow tracking-[0.18em] uppercase text-white opacity-0 transition-[opacity,transform] duration-550 ease-[var(--ease-out-soft)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:left-8"
              >
                View Project
              </span>

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-4">
                <h3 className="font-serif text-h3 text-ink transition-colors duration-400 ease-[var(--ease-out-soft)] group-hover:text-pool">
                  {p.name}
                </h3>
                <p className="text-eyebrow tracking-[0.16em] uppercase text-graphite">{p.loc}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

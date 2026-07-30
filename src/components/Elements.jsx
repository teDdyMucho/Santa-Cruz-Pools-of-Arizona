import { elements } from '../data/site'
import { Frame, Reveal, SECTION_Y, SectionHead, WRAP, WRAP_WIDE } from './ui'

/* Capability band: the photography carries the labels. No cards, no icons —
   a caption sits under each plate the way it would in a printed portfolio. */
export default function Elements() {
  return (
    <section id="elements" aria-labelledby="elementsTitle" className={`bg-sand ${SECTION_Y}`}>
      <div className={WRAP}>
        <Reveal>
          <SectionHead eyebrow={elements.eyebrow} title={elements.title} center flush />
        </Reveal>
      </div>

      <ul
        className={`${WRAP_WIDE} mt-[clamp(2.5rem,6vw,4.5rem)] grid gap-x-[clamp(1rem,2vw,2rem)] gap-y-[clamp(2rem,3.5vw,3rem)] sm:grid-cols-2 lg:grid-cols-4`}
      >
        {elements.items.map((el, i) => (
          <Reveal as="li" key={el.label} delay={i * 90}>
            <div className="group">
              <Frame
                image={el.image}
                alt={el.alt}
                ratio="wide"
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
              />
            </div>
            <p className="mt-4 text-eyebrow tracking-[0.18em] uppercase text-graphite">
              {el.label}
            </p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

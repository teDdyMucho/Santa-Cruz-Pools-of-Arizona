import { promise } from '../data/site'
import { ArrowLink, Eyebrow, Frame, Reveal, SECTION_Y, WRAP } from './ui'

export default function Promise() {
  return (
    <section id="studio" aria-labelledby="promiseTitle" className={`bg-bone ${SECTION_Y}`}>
      <div
        className={`${WRAP} grid items-center gap-[clamp(2.5rem,7vw,7rem)] lg:grid-cols-[1.05fr_0.95fr]`}
      >
        <Reveal>
          <Eyebrow className="mb-5">{promise.eyebrow}</Eyebrow>
          <h2
            id="promiseTitle"
            className="font-serif text-h2 leading-[1.14] tracking-[-0.015em] text-ink"
          >
            {promise.title.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>

          <div className="mt-7 max-w-[46ch] space-y-[1.15em] text-graphite">
            {promise.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <ArrowLink href="#services">Our disciplines</ArrowLink>
        </Reveal>

        <Reveal as="figure" delay={120} className="m-0">
          <div className="group">
            <Frame
              image={promise.image}
              alt={promise.alt}
              ratio="tall"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
          <figcaption className="mt-4 text-eyebrow tracking-[0.04em] text-graphite">
            {promise.caption}
          </figcaption>
        </Reveal>
      </div>
    </section>
  )
}

import { process as proc } from '../data/site'
import { Eyebrow, Frame, Reveal, SECTION_Y, WRAP } from './ui'

export default function Process() {
  return (
    <section
      id="process"
      aria-labelledby="processTitle"
      className={`bg-ink text-bone ${SECTION_Y}`}
    >
      <div
        className={`${WRAP} grid items-start gap-[clamp(2.5rem,7vw,7rem)] lg:grid-cols-[0.9fr_1.1fr]`}
      >
        <Reveal>
          <Eyebrow tone="onInk" className="mb-5">
            The Process
          </Eyebrow>
          <h2
            id="processTitle"
            className="font-serif text-h2 leading-[1.14] tracking-[-0.015em] text-bone"
          >
            <span className="block">Measured,</span>
            <span className="block">and in order.</span>
          </h2>
          <p className="mt-6 max-w-[38ch] text-bone/72">
            A single studio holds the drawing from the first walk of the site to the tenth year of
            care. You will always know what happens next.
          </p>

          <figure className="mt-10 max-w-[30rem] lg:mt-12">
            <div className="group">
              <Frame
                image={proc.image}
                alt={proc.alt}
                ratio="tall"
                sizes="(min-width: 1024px) 38vw, 100vw"
              />
            </div>
          </figure>
        </Reveal>

        <ol className="grid">
          {proc.steps.map((s, i) => (
            <Reveal
              as="li"
              key={s.num}
              delay={i * 90}
              className={`grid gap-x-6 gap-y-1 border-t border-bone/18 py-[clamp(1.5rem,3.2vw,2.5rem)] sm:grid-cols-[4.5rem_1fr] ${
                i === proc.steps.length - 1 ? 'border-b border-bone/18' : ''
              }`}
            >
              <span className="font-serif text-base text-stone sm:pt-1.5">{s.num}</span>
              <div>
                <h3 className="mb-2 font-serif text-h3 text-bone">{s.title}</h3>
                <p className="max-w-[48ch] text-bone/70">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

import { brand, closing, closingClips } from '../data/site'
import HeroVideo from './HeroVideo'
import { Button, Eyebrow, Reveal, WRAP } from './ui'

export default function Closing() {
  return (
    <section
      id="contact"
      aria-labelledby="closingTitle"
      className="relative isolate grid min-h-[88svh] items-center py-[clamp(4.5rem,12vw,11rem)] text-center text-white"
    >
      {/* The four static-* clips, crossfading 1 → 2 → 3 → 4 and looping. Lazy:
          this block sits at the foot of every page, so nothing loads until it
          is within 300px of the viewport. The poster is frame 0 of static-1. */}
      <HeroVideo
        clips={closingClips}
        poster={closing.poster}
        alt={closing.alt}
        objectPosition="center 55%"
        lazy
      />

      {/* Copy is centred over moving footage, so it needs a radial pool under
          it rather than a directional wash. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_72%_58%_at_50%_45%,rgba(8,12,14,0.74),rgba(8,12,14,0.48)_72%),linear-gradient(180deg,rgba(8,12,14,0.38),rgba(8,12,14,0.56))]"
      />

      <div className={`${WRAP} max-w-[56rem]`}>
        <Reveal>
          <Eyebrow light className="mb-5">
            {closing.eyebrow}
          </Eyebrow>
        </Reveal>

        <Reveal delay={90}>
          <h2
            id="closingTitle"
            className="on-photo mb-7 font-serif text-display leading-[1.08] tracking-[-0.022em]"
          >
            {closing.title.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mb-10 max-w-[46ch] text-lede text-white/85">{closing.lede}</p>
        </Reveal>

        <Reveal delay={230}>
          <div className="flex flex-col justify-center gap-3 xs:flex-row xs:flex-wrap">
            <Button variant="solid" href={`mailto:${brand.email}`}>
              {brand.primaryCta}
            </Button>
            <Button variant="line" href={brand.phoneHref}>
              {brand.phone}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

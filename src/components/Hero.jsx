import { brand, hero, heroClips } from '../data/site'
import HeroVideo from './HeroVideo'
import { Button, Eyebrow } from './ui'

export default function Hero() {
  return (
    <section
      aria-labelledby="heroTitle"
      className="relative isolate flex min-h-[100svh] flex-col justify-end px-5 pt-[4.375rem] pb-[clamp(3.5rem,9vh,7rem)] text-white xs:px-6 sm:px-8 lg:px-12 lg:pt-[5.25rem] xl:px-16"
    >
      {/* Full-bleed cinematic film — all eight clips, edge to edge */}
      <HeroVideo
        clips={heroClips}
        poster={hero.poster}
        alt={hero.alt}
        objectPosition="center 58%"
      />

      {/* Two-part scrim. The footage is bright daylight with light stone in the
          lower left, exactly where the copy sits, so a bottom lift alone is not
          enough — a left wash carries the text column as well. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(10,13,15,0.9)_0%,rgba(10,13,15,0.58)_28%,rgba(10,13,15,0.14)_58%,rgba(10,13,15,0.4)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(10,13,15,0.62)_0%,rgba(10,13,15,0.28)_38%,transparent_66%)]"
      />

      <div className="max-w-[62rem]">
        <Eyebrow light className="mb-5">
          {brand.serviceArea}
        </Eyebrow>

        <h1
          id="heroTitle"
          className="on-photo mb-5 font-serif text-hero leading-[1.03] tracking-[-0.025em]"
        >
          {hero.title.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mb-10 max-w-[44ch] text-lede text-white/90">{hero.lede}</p>

        <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap">
          <Button variant="solid" href="#contact">
            {brand.primaryCta}
          </Button>
          <Button variant="line" href="#work">
            View Our Work
          </Button>
        </div>
      </div>

      <a
        href="#studio"
        aria-label="Scroll to next section"
        className="absolute right-12 bottom-[clamp(3.5rem,9vh,7rem)] hidden flex-col items-center gap-4 text-[0.6875rem] tracking-[0.24em] uppercase text-white/80 lg:flex xl:right-16"
      >
        <span>Discover</span>
        <span
          aria-hidden="true"
          className="scroll-cue h-16 w-px bg-linear-to-b from-white/70 to-transparent"
        />
      </a>
    </section>
  )
}

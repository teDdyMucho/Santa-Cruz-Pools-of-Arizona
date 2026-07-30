import HeroVideo from './HeroVideo'
import { BleedMedia, Eyebrow } from './ui'

/**
 * Subpage hero. Takes either a still (`image`) or a looping clip (`clip` +
 * `poster`). Taller when it carries video, since a moving plate needs room to
 * read — but still short of the homepage's 100svh, so a subpage never pretends
 * to be the front door.
 */
export default function PageHero({ image, clip, poster, alt, eyebrow, title, lede }) {
  const isVideo = Boolean(clip)

  return (
    <section
      aria-labelledby="pageTitle"
      className={`relative isolate flex flex-col justify-end px-5 pt-[6rem] pb-[clamp(2.75rem,7vh,5rem)] text-white xs:px-6 sm:px-8 lg:px-12 lg:pt-[7rem] xl:px-16 ${
        isVideo ? 'min-h-[74svh] lg:min-h-[80svh]' : 'min-h-[62svh] lg:min-h-[68svh]'
      }`}
    >
      {isVideo ? (
        <>
          <HeroVideo clips={[clip]} poster={poster} alt={alt} objectPosition="center 58%" />
          {/* The two-part scrim the homepage hero uses: a bottom lift plus a
              left wash, because these plates are bright where the copy sits. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(10,13,15,0.9)_0%,rgba(10,13,15,0.6)_30%,rgba(10,13,15,0.18)_62%,rgba(10,13,15,0.42)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(10,13,15,0.58)_0%,rgba(10,13,15,0.24)_40%,transparent_68%)]"
          />
        </>
      ) : (
        <>
          {/* The lift reaches higher than the homepage hero's because a subpage
              title can run to four lines, which pushes the eyebrow well up the
              frame — measured at 3.76:1 against a shallower gradient. */}
          {/* Weighted to the lower-left, where the copy sits, so the rest of the
              frame stays bright — an even wash just makes the photograph muddy. */}
          <BleedMedia
            image={image}
            objectPosition="center 58%"
            scrim="bg-[linear-gradient(to_top,rgba(10,13,15,0.86)_0%,rgba(10,13,15,0.6)_40%,rgba(10,13,15,0.18)_72%,rgba(10,13,15,0.3)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(10,13,15,0.52)_0%,rgba(10,13,15,0.18)_44%,transparent_72%)]"
          />
          {/* Alt text belongs to the page, not to a decorative plate, so it is
              restated here for assistive tech — BleedMedia renders aria-hidden. */}
          <span className="sr-only">{alt}</span>
        </>
      )}

      <div className="max-w-[52rem]">
        <Eyebrow light className="mb-5">
          {eyebrow}
        </Eyebrow>
        <h1
          id="pageTitle"
          className="on-photo mb-5 font-serif text-[clamp(2.1rem,5.6vw,4.6rem)] leading-[1.06] tracking-[-0.024em]"
        >
          {(Array.isArray(title) ? title : [title]).map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>
        {lede && <p className="max-w-[46ch] text-lede text-white/90">{lede}</p>}
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { imageProps } from '../data/site'

const FADE_MS = 900

/**
 * Plays a list of clips back to back as one continuous film.
 *
 * Two stacked <video> elements leapfrog each other: while one plays, the other
 * has already buffered the next clip, so the handover is a crossfade rather
 * than the black flash you get from swapping `src` on a single element.
 * Only the first clip is fetched up front — the rest arrive just in time.
 *
 * The poster sits underneath permanently, so a blocked autoplay, a decode
 * failure, reduced-motion, or Data Saver all degrade to a still frame taken
 * from frame 0 of clip 1 — the same image, so nothing visibly "falls back".
 */
export default function HeroVideo({
  clips,
  poster,
  alt,
  objectPosition = 'center 58%',
  /* Below-the-fold placements pass this so several megabytes of video aren't
     fetched on page load for a block the visitor may never reach. */
  lazy = false,
}) {
  const wrapRef = useRef(null)
  const aRef = useRef(null)
  const bRef = useRef(null)
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = navigator.connection?.saveData === true
    if (reduced || saveData || !clips.length) return

    if (!lazy || !('IntersectionObserver' in window)) {
      setPlay(true)
      return
    }

    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPlay(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [clips.length, lazy])

  const single = clips.length === 1

  useEffect(() => {
    if (!play) return
    const a = aRef.current
    if (!a) return

    // One clip needs no handover — loop the single element rather than
    // buffering the same file into both and crossfading it with itself.
    if (single) {
      const reveal = () => {
        a.style.opacity = '1'
      }
      a.addEventListener('canplay', reveal, { once: true })
      a.src = clips[0]
      a.loop = true
      a.load()
      a.play().catch(() => {})
      return () => {
        a.removeEventListener('canplay', reveal)
        a.pause()
        a.removeAttribute('src')
        a.load()
      }
    }

    const b = bRef.current
    if (!b) return

    let cur = a
    let next = b
    let i = 0
    let dead = false
    let timer = 0

    const at = (n) => clips[((n % clips.length) + clips.length) % clips.length]

    const load = (el, n) => {
      el.src = at(n)
      el.load()
    }

    const revealFirst = () => {
      if (!dead) cur.style.opacity = '1'
    }

    const onEnded = () => {
      if (dead) return
      i += 1

      const outgoing = cur
      const incoming = next

      incoming.currentTime = 0
      incoming.play().catch(() => {})
      incoming.style.opacity = '1'
      outgoing.style.opacity = '0'

      // Once the fade has finished, recycle the outgoing element for clip i+1
      timer = window.setTimeout(() => {
        if (dead) return
        outgoing.pause()
        load(outgoing, i + 1)
      }, FADE_MS)

      cur = incoming
      next = outgoing
    }

    a.addEventListener('ended', onEnded)
    b.addEventListener('ended', onEnded)
    a.addEventListener('canplay', revealFirst, { once: true })

    load(cur, 0)
    load(next, 1)
    cur.play().catch(() => {})

    return () => {
      dead = true
      window.clearTimeout(timer)
      a.removeEventListener('ended', onEnded)
      b.removeEventListener('ended', onEnded)
      a.removeEventListener('canplay', revealFirst)
      for (const el of [a, b]) {
        el.pause()
        el.removeAttribute('src')
        el.load()
      }
    }
  }, [play, clips, single])

  const layer =
    'absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity ' +
    'motion-reduce:transition-none'

  return (
    <div ref={wrapRef} className="absolute inset-0 -z-20 overflow-hidden bg-ink">
      <img
        {...imageProps(poster, '100vw')}
        alt={alt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
      />

      {play && (
        <>
          <video
            ref={aRef}
            className={layer}
            style={{ objectPosition, transitionDuration: `${FADE_MS}ms` }}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          />
          {!single && (
            <video
              ref={bRef}
              className={layer}
              style={{ objectPosition, transitionDuration: `${FADE_MS}ms` }}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
            />
          )}
        </>
      )}
    </div>
  )
}

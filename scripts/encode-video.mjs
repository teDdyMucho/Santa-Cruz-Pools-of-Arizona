/**
 * Re-encodes the background clips in public/image/ for web delivery.
 *
 *   npm i -D ffmpeg-static     # one-off; deliberately NOT a saved dependency,
 *   node scripts/encode-video.mjs   # it would add ~80MB to every Netlify build
 *
 * Writes alongside the sources as <name>.web.mp4 so nothing is overwritten
 * until you've looked at the result. Move them into place yourself.
 *
 * Two things matter here, and the second one is easy to miss:
 *
 *   1. Bitrate. The delivered clips came in at 4.2–7.2 Mbps, which is roughly
 *      4x what a muted 720p background loop needs. CRF 27 with a 1.6 Mbps cap
 *      lands around 1.1 Mbps and is visually indistinguishable at this size.
 *
 *   2. +faststart. The originals had their `moov` atom at the END of the file,
 *      so a browser had to issue extra range requests to the tail before it
 *      could decode a single frame. Moving it to the front is most of the
 *      difference in time-to-first-frame on a slow connection.
 */
import { execFileSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
let ffmpeg
try {
  ffmpeg = require('ffmpeg-static')
} catch {
  console.error('ffmpeg-static not installed. Run:  npm i -D ffmpeg-static')
  process.exit(1)
}

const DIR = 'public/image'
const clips = readdirSync(DIR).filter((f) => f.endsWith('.mp4') && !f.endsWith('.web.mp4')).sort()

let before = 0
let after = 0
console.log('clip              before     after    saved')
for (const c of clips) {
  const src = join(DIR, c)
  const dst = join(DIR, c.replace(/\.mp4$/, '.web.mp4'))
  execFileSync(
    ffmpeg,
    [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-i', src,
      '-c:v', 'libx264',
      '-profile:v', 'high',
      '-preset', 'slow',
      '-crf', '27',
      '-maxrate', '1600k',
      '-bufsize', '3200k',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-an', // muted backgrounds — drop the audio track entirely
      dst,
    ],
    { stdio: 'inherit' },
  )
  const a = statSync(src).size
  const b = statSync(dst).size
  before += a
  after += b
  console.log(
    `${c.padEnd(18)}${(a / 1048576).toFixed(1).padStart(6)}MB${(b / 1048576).toFixed(1).padStart(9)}MB${(100 - (b / a) * 100).toFixed(0).padStart(7)}%`,
  )
}
console.log(
  `\nTOTAL             ${(before / 1048576).toFixed(1).padStart(6)}MB${(after / 1048576).toFixed(1).padStart(9)}MB${(100 - (after / before) * 100).toFixed(0).padStart(7)}%`,
)

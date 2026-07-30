/**
 * Builds web-ready lockups from public/logo.png and merges them into the
 * media manifest. Run via `npm run media` (after optimize-images.mjs).
 *
 *   logo-dark   the supplied artwork, trimmed  → for light grounds
 *   logo-light  a bone knockout of the same    → for dark grounds / photography
 *
 * The knockout is needed because the wordmark is navy (#001f3e), which sits at
 * 1.05:1 against the charcoal footer — effectively invisible. Rather than
 * filter-inverting (which wrecks the blue and cream), we rebuild the mark from
 * its own alpha channel, excluding the cream keyline so the reverse version
 * keeps the original letterform weight instead of thickening it.
 */
import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'

const SRC = 'public/logo.png'
const OUT = 'public/media'
const MANIFEST = 'src/data/media-manifest.json'

const WIDTHS = [240, 400, 560, 760]
const BONE = { r: 247, g: 244, b: 239 }
const ALPHA_FLOOR = 60 // ignore near-transparent halo when trimming

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width: W, height: H, channels: C } = info

/* ---- 1. Trim to the artwork ---- */
let minX = W
let minY = H
let maxX = -1
let maxY = -1
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * C + 3] > ALPHA_FLOOR) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
}
const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
console.log(`trimmed to ${box.width}x${box.height} (${(box.width / box.height).toFixed(3)}:1)`)

/* ---- 2. Knockout mask: artwork minus the cream keyline ---- */
const isCream = (r, g, b) => r > 185 && g > 175 && b > 105 && b < 200 && r - b > 25

const mask = Buffer.alloc(box.width * box.height)
const fill = Buffer.alloc(box.width * box.height * 3)
for (let y = 0; y < box.height; y++) {
  for (let x = 0; x < box.width; x++) {
    const s = ((y + box.top) * W + (x + box.left)) * C
    const d = y * box.width + x
    const [r, g, b, a] = [data[s], data[s + 1], data[s + 2], data[s + 3]]
    mask[d] = isCream(r, g, b) ? 0 : a
    fill[d * 3] = BONE.r
    fill[d * 3 + 1] = BONE.g
    fill[d * 3 + 2] = BONE.b
  }
}

/* ---- 3. Emit both variants ----
   The knockout is composited at full size and flushed to a PNG buffer before
   any resizing. sharp applies joinChannel at a fixed point in its pipeline —
   after resize — so chaining `.joinChannel(mask).resize(w)` leaves the mask at
   the original height and yields a 560x415 image instead of 560x202.
   It also must NOT call ensureAlpha() first: joining the mask onto the
   3-channel fill is what makes it RGBA, and pre-adding alpha gives a
   5-channel image that decodes as garbage. */
const knockout = await sharp(fill, {
  raw: { width: box.width, height: box.height, channels: 3 },
})
  .joinChannel(mask, { raw: { width: box.width, height: box.height, channels: 1 } })
  .png()
  .toBuffer()

const sources = {
  'logo-dark': await sharp(SRC).extract(box).png().toBuffer(),
  'logo-light': knockout,
}

const widths = [...new Set([...WIDTHS.filter((w) => w < box.width), box.width])].sort((a, b) => a - b)
const aspect = box.width / box.height

for (const [name, buf] of Object.entries(sources)) {
  for (const w of widths) {
    const out = await sharp(buf)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 92, alphaQuality: 100 })
      .toFile(`${OUT}/${name}-${w}.webp`)
    const got = out.width / out.height
    if (Math.abs(got - aspect) > 0.02) {
      throw new Error(
        `${name}-${w}: aspect ${got.toFixed(3)} != ${aspect.toFixed(3)} (${out.width}x${out.height})`,
      )
    }
  }
  console.log(`${name.padEnd(11)} → ${widths.join(', ')}`)
}

/* ---- 4. Favicons, cut from the logo's own initial ----
   The ripple mark can't be the favicon: measured off the artwork it is 7.84:1,
   so on a square tile it collapses to a 1px sliver at 16px. The wordmark's
   oversized serif "S" is the only element in the lockup that survives that
   size, so it becomes the monogram — the real letterform, keyline dropped,
   in the logo's cream on the logo's navy.

   Both the wordmark band and the S's width are detected rather than hardcoded,
   so replacing logo.png doesn't silently produce a wrong crop. */
const ink = (x, y) => data[(y * W + x) * C + 3] > ALPHA_FLOOR

// 4a. Glyph WIDTH, from a shallow probe across the cap height. A full-height
// column profile can't be used: "POOLS" and its flanking rules sit under the
// wordmark, so ink never reaches zero between the two lines.
const probeH = Math.round(box.height * 0.3)
const colInk = []
for (let x = box.left; x < box.left + box.width; x++) {
  let n = 0
  for (let y = box.top; y < box.top + probeH; y++) if (ink(x, y)) n++
  colInk.push(n)
}
const peak = Math.max(...colInk)
let glyphEnd = colInk.length
for (let x = 8; x < colInk.length - 8; x++) {
  if (colInk[x] > peak * 0.3) continue
  if (colInk[x] === Math.min(...colInk.slice(x - 5, x + 6))) {
    glyphEnd = x
    break
  }
}

// 4b. Glyph HEIGHT, measured only inside the glyph's own columns, where the
// baseline gap before the next line IS clean.
let glyphBottom = box.height
let seen = false
for (let y = box.top; y < box.top + box.height; y++) {
  let n = 0
  for (let x = box.left; x < box.left + glyphEnd; x++) if (ink(x, y)) n++
  if (n > 0) seen = true
  else if (seen) {
    glyphBottom = y - box.top
    break
  }
}
console.log(`initial glyph ${glyphEnd}x${glyphBottom}`)

// 4c. Silhouette the glyph in cream.
// Unlike the logo-light knockout above, this KEEPS the keyline in the mask.
// There, dropping it matters because the reverse lockup has to match the
// original letterform weight. Here the glyph stands alone, and including the
// keyline gives a cleaner outline (excluding it nicks the curves, since the
// antialiased navy/cream boundary gets cut) plus a slightly bolder stem, which
// is exactly what a 16px tab icon wants.
const gW = glyphEnd
const gH = glyphBottom
const gMask = Buffer.alloc(gW * gH)
const gFill = Buffer.alloc(gW * gH * 3)
const CREAM = { r: 0xd7, g: 0xcd, b: 0x9e }
for (let y = 0; y < gH; y++) {
  for (let x = 0; x < gW; x++) {
    const s = ((y + box.top) * W + (x + box.left)) * C
    const d = y * gW + x
    gMask[d] = data[s + 3]
    gFill[d * 3] = CREAM.r
    gFill[d * 3 + 1] = CREAM.g
    gFill[d * 3 + 2] = CREAM.b
  }
}
const glyph = await sharp(gFill, { raw: { width: gW, height: gH, channels: 3 } })
  .joinChannel(gMask, { raw: { width: gW, height: gH, channels: 1 } })
  .png()
  .toBuffer()
const glyphTrimmed = await sharp(glyph).trim({ threshold: 1 }).png().toBuffer()

// 4d. Composite onto navy tiles
const ICONS = [
  ['favicon-16.png', 16],
  ['favicon-32.png', 32],
  ['favicon-48.png', 48],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]
const meta = await sharp(glyphTrimmed).metadata()
for (const [file, size] of ICONS) {
  const inner = Math.round(size * 0.68) // optical padding around the letter
  const scale = Math.min(inner / meta.width, inner / meta.height)
  const mark = await sharp(glyphTrimmed)
    .resize({
      width: Math.max(1, Math.round(meta.width * scale)),
      height: Math.max(1, Math.round(meta.height * scale)),
      fit: 'fill',
    })
    .png()
    .toBuffer()
  await sharp({
    create: { width: size, height: size, channels: 4, background: '#001f3e' },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toFile(`public/${file}`)
}
console.log(`favicons → ${ICONS.map(([f]) => f.replace('.png', '')).join(', ')}`)

/* ---- 5. Merge into the manifest ---- */
const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
for (const name of ['logo-dark', 'logo-light']) {
  manifest[name] = { widths, w: box.width, h: box.height }
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`manifest → ${MANIFEST}`)

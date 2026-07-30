/**
 * Turns the PNG originals in public/image/ into responsive WebP derivatives
 * in public/media/, and writes a manifest so the app only ever references
 * widths that actually exist (never upscales past the source).
 *
 *   npm run media
 *
 * Originals are read-only — nothing in public/image/ is modified.
 */
import sharp from 'sharp'
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'

const SRC = 'public/image'
const OUT = 'public/media'
const MANIFEST = 'src/data/media-manifest.json'

const WIDTHS = [480, 768, 1200, 1600, 2000]
const QUALITY = 80

await mkdir(OUT, { recursive: true })

const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort()
if (!files.length) {
  console.error(`No source images found in ${SRC}`)
  process.exit(1)
}

const manifest = {}
let srcBytes = 0
let outBytes = 0

for (const file of files) {
  const name = basename(file, extname(file))
  const path = join(SRC, file)
  srcBytes += (await stat(path)).size

  const img = sharp(path)
  const meta = await img.metadata()
  // Only emit widths at or below the source width, and always include the
  // source width itself so the largest derivative is a true 1:1 render.
  const widths = [...new Set([...WIDTHS.filter((w) => w < meta.width), meta.width])].sort(
    (a, b) => a - b,
  )

  for (const w of widths) {
    const dest = join(OUT, `${name}-${w}.webp`)
    await sharp(path)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(dest)
    outBytes += (await stat(dest)).size
  }

  manifest[name] = { widths, w: meta.width, h: meta.height }
  console.log(`${name.padEnd(16)} ${meta.width}x${meta.height} → ${widths.join(', ')}`)
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')

const mb = (b) => (b / 1048576).toFixed(1)
console.log(
  `\n${files.length} images · source ${mb(srcBytes)} MB → webp ${mb(outBytes)} MB ` +
    `(${(100 - (outBytes / srcBytes) * 100).toFixed(0)}% smaller)\nmanifest → ${MANIFEST}`,
)

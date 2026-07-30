# Santa Cruz Pools of Arizona

Marketing homepage for a luxury pool, landscape, and outdoor living design studio.
React 19 + Vite 8 + Tailwind CSS 4. No UI library, no CSS-in-JS.

```bash
npm install
npm run media    # PNG originals → responsive WebP + manifest (run after adding art)
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview
```

---

## ⚠️ Two things to action

### 1. Placeholders to confirm

Three values were never supplied. Working values are in use, all centralised in
[`src/data/site.js`](src/data/site.js).

| Item | Working value | Where |
| --- | --- | --- |
| Brand name | **Santa Cruz Pools of Arizona** (from the project folder) | `brand.name`, `brand.tagline` |
| Service area | **Scottsdale · Paradise Valley · Phoenix** | `brand.serviceArea` |
| Primary CTA | **Schedule a Consultation** | `brand.primaryCta` |

Phone, email, address, and the ROC licence number are invented placeholders too,
as is the "The Practice" block on `/studio` (founded 2009, twelve to fifteen
commissions a year) — confirm all four before launch.

### 2. `public/image/` ships 86 MB of unused PNG

The app only loads the WebP derivatives in `public/media/`. The PNG originals are
build **inputs**, but everything under `public/` is copied verbatim into `dist/`,
so they inflate the deploy from ~58 MB to ~142 MB.

Move them out of `public/` when you're ready — the derivatives and manifest are
already committed, so the site keeps working:

```bash
mkdir -p media-src && mv public/image/*.png media-src/
# then update SRC in scripts/optimize-images.mjs to 'media-src'
```

The **videos must stay** in `public/image/` — they're streamed at runtime.

---

## Routing

`react-router` **8.3** (not `react-router-dom`, which is the legacy shim since
v7). 8.3 is also the only version that clears both open advisories — `≤7.17.0`
and `7.12.0–8.2.0` overlap, so nothing in the 7.x line is clean. `npm audit`
reports 0 vulnerabilities.

| Route | Page |
| --- | --- |
| `/` | `pages/Home.jsx` — unchanged from the single-page build |
| `/studio` | `pages/Studio.jsx` |
| `/services` | `pages/Services.jsx` |
| `/work` | `pages/Work.jsx` |
| `/process` | `pages/Process.jsx` |
| `*` | falls back to Home; swap for a real 404 as the site grows |

`components/Layout.jsx` holds the header, footer, and scroll behaviour; pages
render into its `<Outlet/>`.

**Link conventions.** `nav` items in `site.js` use `to`, always a full
destination: `/studio` for a page, `/#work` for a homepage section. Anything
starting with `/` goes through the router via `SmartLink`; everything else
(`#contact`, `mailto:`, `tel:`) stays a native anchor. That distinction is
load-bearing — `#contact` must hit the CTA on the page you are already on, not
send you to the homepage's.

`useRouteScroll` in Layout handles anchors itself, because router `Link`s
preventDefault so the browser never scrolls. Cross-page jumps land instantly;
same-page jumps glide, matching how a plain anchor felt before.

**Deploying:** `netlify.toml` is committed and handles this — build `npm run
build`, publish `dist`, Node pinned to 22, and a `/* → /index.html` 200 rewrite
so deep links survive a hard refresh. Suggested site name: `santacruzpoolsaz`.
On any other host you need the same rewrite (Vercel `rewrites`, `try_files` on
nginx).

`npm run media` is deliberately NOT part of the build: the WebP derivatives and
manifest are committed, so production never installs sharp or touches the
originals. Re-run it locally whenever you add or replace artwork, then commit
`public/media/` and `src/data/media-manifest.json`.

**SEO caveat:** this is a client-rendered SPA, so crawlers get an empty shell.
For a marketing site that matters — prerender the routes at build time or move to
a framework with SSG before launch.

---

## Logo

`public/logo.png` is the supplied artwork. `scripts/build-logo.mjs` trims it to
its content box (1148×415, 2.766:1) and emits two lockups:

| Variant | What it is | Used on |
| --- | --- | --- |
| `logo-dark` | the artwork as supplied | light grounds — header once it locks to the solid plate |
| `logo-light` | a bone knockout of the same artwork | dark grounds — header over photography, footer, mobile drawer |

The reverse version is necessary, not stylistic: the navy wordmark measures
**1.05:1** against the charcoal footer, i.e. invisible. Rather than
filter-inverting (which would wreck the blue and the cream), the knockout is
rebuilt from the artwork's own alpha channel with the cream keyline excluded, so
the reverse mark keeps the original letterform weight instead of thickening by
the width of the outline.

`<Wordmark variant="auto">` stacks both and crossfades them off the header's
`data-stuck` attribute. Opening the mobile drawer forces `data-stuck="false"`,
because the drawer is charcoal — otherwise the navy logo would land on a
near-black panel.

### Favicon

Cut from the wordmark's own oversized serif **S** — the real letterform,
silhouetted in the logo's cream on the logo's navy.

The ripple mark was the obvious first choice and it does not work. Measured off
the artwork it is **7.84:1**, so centred on a square tile it occupies about 12%
of the height and collapses to a 1–2px squiggle at 16px. An `SC` monogram was
also tested; the C's counter closes up below ~24px. The single initial is the
only element in the lockup that survives a browser tab.

Generated by `build-logo.mjs`, which detects the glyph rather than hardcoding
crop offsets: the width comes from a shallow column probe across the cap height,
and the height from a row profile taken *only inside the glyph's own columns* —
a full-width profile can't find the baseline because "POOLS" and its flanking
rules sit directly beneath the wordmark with no clean gap between the lines.

Unlike `logo-light`, this silhouette **keeps** the cream keyline in its mask.
There, dropping it preserves the original letterform weight; here the glyph
stands alone, and including it avoids nicked curves and gives a slightly bolder
stem — which is what a 16px icon wants.

Emits `favicon-16/32/48.png`, `apple-touch-icon.png` (180), and
`icon-192/512.png`.

---

## Media pipeline

`npm run media` runs `optimize-images.mjs` then `build-logo.mjs`. The first reads
every PNG/JPG in `public/image/`, writes WebP at
480 / 768 / 1200 / 1600 / 2000 px (never upscaling past the source, and always
including the source width) into `public/media/`, and records what it produced in
`src/data/media-manifest.json`.

The app never hardcodes a width. `imageProps(name, sizes)` in `site.js` reads the
manifest and builds a `srcSet` containing only widths that exist, so adding or
replacing art is: drop the file in, `npm run media`, reference it by basename.

Current run: **33 images, 86.4 MB → 15.8 MB WebP (82% smaller)**, plus the two
logo lockups.

### Hero video

All eight clips (1280×720, 8.1 s each, 64.8 s total) play back to back as one
continuous film. `HeroVideo.jsx` leapfrogs two `<video>` elements — while one
plays, the other has already buffered the next clip — so each handover is a
900 ms crossfade rather than the black flash you get from swapping `src` on a
single element. The set loops.

They are **not** concatenated into one file on purpose: a single 42 MB MP4 would
have to download before the hero could move. This way only clip 1 is fetched up
front and the rest arrive just in time. (If you do want one file, it needs
ffmpeg — all eight share a codec and resolution, so it's a stream copy.)

**Subpage heroes.** `/services` and `/work` each loop a single clip; `/studio`
and `/process` use stills pulled from other clips. Posters are always frame 0 of
the clip they sit under, so there is no visible swap on load.

`/services` uses a **single** clip on a loop instead of the eight-clip film —
`HeroVideo` detects `clips.length === 1` and loops one element rather than
buffering the same file into both and crossfading it with itself. Clip
`201908` was chosen because one frame contains all four disciplines: pool and
spa, hardscape, the planting bed, and the ramada.

`public/image/hero-poster.png` is frame 0 of clip 1, extracted so the poster and
the first video frame are the same image — there's no visible swap on load. It
sits under the video permanently, so blocked autoplay, a decode failure,
`prefers-reduced-motion`, or Data Saver all degrade to that still.

---

## Extracted design system

Derived from the two reference sites. The accent colours are the actual values
in the primary reference's stylesheet; the type pairing is the one it ships.

### Colour — warm neutrals, never blue-grey

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#1b1a18` | Warm charcoal. Body text, dark bands, footer. |
| `ink-soft` | `#3a3733` | Pull-quotes. |
| `graphite` | `#635c52` | Secondary text. Tuned to clear 4.5:1 on `sand`. |
| `stone` | `#cbbfae` | Hairline rules, step numerals. |
| `sand` | `#e4dcd0` | Section tint (Services, Elements). |
| `bone` | `#f7f4ef` | Off-white page ground. |
| `navy` | `#001f3e` | **Logo** wordmark navy. |
| `brand` | `#1f7bb0` | **Logo** "POOLS" blue + ripple mark. |
| `cream` | `#d7cd9e` | **Logo** keyline. Sits naturally with `stone`/`sand`. |
| `pool` | `#175f8a` | Interactive accent — `brand` darkened to pass AA. |

`navy` / `brand` / `cream` are sampled directly from `public/logo.png`.

`pool` exists because the logo blue can't carry small text: `#1f7bb0` measures
4.24:1 on bone and 3.42:1 on sand, both under the 4.5:1 floor. Darkening it to
`#175f8a` (same hue) gives 6.30:1 and 5.08:1, so hovers and links are provably
on-brand *and* accessible.

The neutrals stay warm rather than shifting cool to match the navy — that warm
axis is what makes the photography read as continuous with the UI, and the logo's
own cream keyline already bridges to `stone`/`sand`.

### Type

- **Display:** Libre Baskerville — headlines, project names, step titles.
- **UI / body:** Work Sans — body at weight 300, eyebrows at 400.
- Eyebrows uppercase at `0.22em` tracking, tightened to `0.16em` under 640px so
  long strings don't orphan a word.
- Display sizes are fluid `clamp()` tokens (`text-hero`, `text-display`,
  `text-h2`, `text-h3`, `text-lede`) — no jumps between breakpoints.
- Heading measures are set in **rem, not `ch`** — `ch` resolves against the
  parent's body font-size and strangles the much larger display serif.

### Spacing

8px base. Section rhythm `py-[clamp(4.5rem,12vw,11rem)]`; gutters `px-5 → px-16`.
Two content widths: `77.5rem` (editorial text) and `100rem` (full-bleed grids).

### Image rules

- Everything goes through `<Frame>` or `<BleedMedia>` so crop, grade, `srcSet`,
  and hover behaviour are identical site-wide.
- Aspect ratios only, never fixed heights: `16/9`, `3/2`, `4/5`, `3/4`. Portrait
  crops relax to `3/2` under 640px, where a tall plate stops being readable.
- Hover: `scale(1.055)` over `1.1s`, plus a bottom-up gradient and a
  "View Project" rule that slides up. Nothing bounces or rotates.
- Hero and closing plates are edge-to-edge, never inset.

### Sections

Hero (video) → promise → dark pillar strip → services → portfolio grid →
elements band → dark process band → quotes → closing CTA → footer.

The portfolio is a 6-column bed: cinematic full-width plates bracket paired
portrait/landscape rows, driven by `span`/`ratio` per entry in `projects` —
magazine rhythm rather than a uniform card wall.

### Motion

One `IntersectionObserver` adds `.reveal--in` (fade + 26px rise, 1s) then
unobserves, so nothing re-animates on scroll-back; staggering is a per-element
`data-reveal-delay`. The header swaps transparent → solid via a `data-stuck`
attribute from a throttled scroll listener. `prefers-reduced-motion: reduce`
disables reveals, hover zoom, smooth scroll, and the hero video.

---

## Layout

```
scripts/optimize-images.mjs   PNG → WebP + manifest
scripts/build-logo.mjs        logo.png → dark + knockout lockups, touch icon
public/logo.png               client-supplied logo artwork
public/image/                 client-supplied originals (PNG inputs + MP4)
public/media/                 generated WebP — what the app actually loads
src/
  App.jsx                     section order, skip link, hooks
  index.css                   @theme tokens, base, .reveal/.photo/.on-photo
  data/site.js                ALL copy, media names, brand values
  data/media-manifest.json    generated — do not edit by hand
  hooks/useReveal.js          useReveal() + useScrolled()
  components/
    ui.jsx                    Wrap widths, Reveal, Eyebrow, Button, LinkArrow,
                              Frame, BleedMedia, SectionHead
    HeroVideo.jsx             crossfading multi-clip background
    Header.jsx                fixed nav + mobile drawer (exports Wordmark)
    Hero  Promise  Pillars  Services  Work  Elements
    Process  Testimonials  Closing  Footer
```

### A convention worth keeping

Shared components take **variant props, not overriding classNames**, for anything
in a contested CSS property group (`display`, `padding`, `color`, `border-color`,
`margin`). Tailwind resolves same-group conflicts by stylesheet order, not by the
order classes appear in the attribute — so `<Button className="hidden …">`
silently lost to the base `inline-flex` and put an overflowing CTA in the mobile
header. Hence `Button` variants own their display/padding, `Eyebrow` has `tone`,
`LinkArrow` has `tone`, `SectionHead` has `flush`.

---

## Photography

All imagery is client-supplied from `public/image/`. 23 of the 33 sources are
placed; assignments live in `src/data/site.js`.

All 33 sources are now placed: the homepage uses 24, and `/studio` picks up the
remaining eight — `sixteen` (page hero), `ten`, `nine`, `fifteen`, `one`
(palette), `seven`, `seventeen`, `twentyone` (in practice). `/studio` also reuses
`thirtyone`, the homepage studio plate, as a deliberate echo.

---

## Verification performed

- **Build:** clean production build, no warnings. No 4xx/5xx and no failed
  images on a full-page crawl.
- **Logo:** confirmed the knockout renders at the correct aspect at every width
  (an earlier pass silently produced 560x415 instead of 560x202 — sharp applies
  `joinChannel` *after* `resize`, so the mask has to be composited at full size
  and flushed to a buffer first). Verified all three header states plus the
  drawer-open-while-scrolled case.
- **Hero video:** confirmed advancing 195110 → 195539 → 200546 → 201908 with
  correct crossfade opacities and just-in-time preload of the following clip;
  autoplays on a mobile viewport too.
- **Horizontal overflow:** 320 / 360 / 390 / 430 / 540 / 768 / 834 / 1024 /
  1180 / 1280 / 1440 / 1600 / 1920 / 2560 px — `scrollWidth === innerWidth` at
  every width, no element past the viewport.
- **Contrast (WCAG AA):** measured against *rendered pixels* — each text box is
  screenshotted twice, text shown then hidden, and only the glyph pixels are
  compared. The only reliable method over photography. Everything set on
  photography passes with margin; tightest is the hero eyebrow at 5.34:1
  (needs 4.5). Solid-background pairs were also verified by exact token maths;
  `graphite` was darkened from `#6b6459`, which measured 4.30:1 on the sand tint.
- Semantic landmarks, one `h1`, labelled sections, alt text on all content
  imagery (decorative plates are `alt=""` + `aria-hidden`), visible focus ring,
  skip link, Escape/resize handling on the mobile drawer.

## Known limitations

- Every CTA links to `#contact`, `mailto:`, or `tel:` — no form endpoint, and no
  `/work` or `/services` detail routes exist yet.
- Contact is still a homepage section (`/#contact`), and each page's own CTA
  block is its contact target. No form endpoint exists yet.
- The hero streams ~4 MB per clip on mobile as well as desktop. To restrict video
  to larger screens, gate `setPlay(true)` in `HeroVideo.jsx` on a width query.
- Google Fonts loads from a third-party origin. Self-host before launch.

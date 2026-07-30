import { brand, footerCols } from '../data/site'
import { Wordmark } from './Header'
import { SmartLink, WRAP } from './ui'

export default function Footer() {
  return (
    <footer className="bg-ink pt-[clamp(3rem,7vw,6rem)] text-[0.9375rem] text-bone/74">
      <div
        className={`${WRAP} grid gap-y-10 gap-x-[clamp(2rem,4vw,4rem)] pb-[clamp(2.5rem,6vw,5rem)] sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]`}
      >
        <div>
          <Wordmark variant="light" className="mb-6 w-[11.5rem]" sizes="11.5rem" />
          <p className="max-w-[30ch]">
            Pool, landscape, and outdoor living design for the Sonoran desert. Design &middot; Build
            &middot; Maintain.
          </p>
        </div>

        {footerCols.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="mb-5 text-eyebrow font-normal tracking-[0.2em] uppercase text-bone">
              {col.heading}
            </h2>
            <ul className="grid gap-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <SmartLink
                    to={l.to}
                    className="transition-colors duration-350 ease-[var(--ease-out-soft)] hover:text-bone"
                  >
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="mb-5 text-eyebrow font-normal tracking-[0.2em] uppercase text-bone">
            Contact
          </h2>
          <ul className="grid gap-2.5">
            <li>
              <a
                href={brand.phoneHref}
                className="transition-colors duration-350 hover:text-bone"
              >
                {brand.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${brand.email}`}
                className="break-words transition-colors duration-350 hover:text-bone"
              >
                {brand.email}
              </a>
            </li>
            <li className="leading-relaxed text-bone/55">
              {brand.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`${WRAP} flex flex-wrap items-center justify-between gap-x-12 gap-y-3 border-t border-bone/14 py-8 text-eyebrow tracking-[0.04em] text-bone/62`}
      >
        <p>
          &copy; {new Date().getFullYear()} {brand.nameFull}. All rights reserved.
        </p>
        <p>{brand.serviceAreaLong}</p>
        <p>{brand.license}</p>
      </div>
    </footer>
  )
}

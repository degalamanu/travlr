import { Link } from 'react-router-dom'
import { FOOTER_LINKS } from '../data/content'
import { POPULAR_STAY_CITIES } from '../data/stays'
import { DESTINATIONS } from '../data/content'
import { POPULAR_ROUTES, AIRPORT_MAP } from '../data/places'

export default function Sitemap() {
  return (
    <div className="shell py-10">
      <h1 className="text-[30px] font-semibold text-navy">Sitemap</h1>
      <p className="mt-2 text-[15px] text-ink-muted">Every page on Travlr, in one list.</p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {FOOTER_LINKS.map((col) => (
          <nav key={col.title}>
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.07em] text-navy">{col.title}</h2>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[14px] text-ink-muted hover:text-indigo-700">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.07em] text-navy">Flight routes</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {POPULAR_ROUTES.map((r) => (
            <Link
              key={`${r.from}-${r.to}`}
              to={`/flights/results?from=${r.from}&to=${r.to}&trip=return`}
              className="text-[14px] text-ink-muted hover:text-indigo-700"
            >
              {AIRPORT_MAP[r.from]?.city} to {AIRPORT_MAP[r.to]?.city}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.07em] text-navy">Hotels by city</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {POPULAR_STAY_CITIES.map((c) => (
            <Link key={c} to={`/stays/results?place=${encodeURIComponent(c)}`} className="text-[14px] text-ink-muted hover:text-indigo-700">
              Hotels in {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.07em] text-navy">Car hire by city</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {POPULAR_STAY_CITIES.map((c) => (
            <Link key={c} to={`/cars/results?place=${encodeURIComponent(c)}`} className="text-[14px] text-ink-muted hover:text-indigo-700">
              Car hire in {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.07em] text-navy">Destination guides</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {DESTINATIONS.map((d) => (
            <Link key={d.id} to={`/explore/${d.id}`} className="text-[14px] text-ink-muted hover:text-indigo-700">
              {d.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

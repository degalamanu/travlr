import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'

const SUGGESTIONS = [
  { to: '/flights', label: 'Search flights', icon: 'plane' },
  { to: '/stays', label: 'Search hotels', icon: 'bed' },
  { to: '/cars', label: 'Car hire', icon: 'car' },
  { to: '/explore', label: 'Explore everywhere', icon: 'compass' },
  { to: '/ai', label: 'Search with AI', icon: 'sparkles' },
  { to: '/help', label: 'Help centre', icon: 'help' },
]

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Icon name="compass" size={26} />
      </span>
      <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Error 404</p>
      <h1 className="mt-2 text-[28px] font-semibold text-navy sm:text-[34px]">This page has gone off the map</h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-muted">
        The link may be old, or we may have moved the page. Everything Travlr does is one of these six things.
      </p>

      <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
        {SUGGESTIONS.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="card group flex flex-col items-center gap-2.5 p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Icon name={s.icon} size={19} />
            </span>
            <span className="text-[14px] font-medium text-navy">{s.label}</span>
          </Link>
        ))}
      </div>

      <Link to="/sitemap" className="mt-8 text-[13.5px] font-medium text-indigo-700 hover:underline">
        Or see every page on the sitemap
      </Link>
    </div>
  )
}

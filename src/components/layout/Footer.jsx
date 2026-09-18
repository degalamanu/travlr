import { Link } from 'react-router-dom'
import Logo from './Logo'
import Icon from '../ui/Icon'
import { FOOTER_LINKS, INTERNATIONAL_SITES } from '../../data/content'
import { useApp } from '../../store/AppContext'
import { CURRENCIES } from '../../lib/format'

export default function Footer() {
  const { currency, language } = useApp()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-line bg-white">
      <div className="shell-wide py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Logo tone="dark" />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-muted">
              Travlr compares flights, hotels and car hire across hundreds of providers, then hands you over to
              the one you pick. We never take your payment and we never add a fee.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {['chat', 'mail', 'globe'].map((n) => (
                <Link
                  key={n}
                  to="/help"
                  aria-label="Help centre"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-ink-muted
                             transition-colors hover:border-indigo-300 hover:text-indigo-700"
                >
                  <Icon name={n} size={17} />
                </Link>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-3.5 text-[13px] font-semibold uppercase tracking-[0.07em] text-navy">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[14px] text-ink-muted transition-colors hover:text-indigo-700">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.07em] text-navy">Travlr around the world</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {INTERNATIONAL_SITES.map((s) => (
              <Link
                key={s.code}
                to={`/international?site=${encodeURIComponent(s.code)}`}
                className="group flex items-baseline gap-2 text-[13.5px] text-ink-muted transition-colors hover:text-indigo-700"
              >
                <span className="font-medium text-navy group-hover:text-indigo-700">{s.label}</span>
                <span className="text-[12px] text-ink-soft">{s.code}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-canvas">
        <div className="shell-wide flex flex-wrap items-center justify-between gap-4 py-5 text-[13px] text-ink-muted">
          <p>© {year} Travlr Technologies Pvt. Ltd. Built as a demo — prices and availability are mock data.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="wallet" size={14} />
              {currency} · {CURRENCIES[currency]?.label}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="globe" size={14} />
              {language}
            </span>
            <Link to="/legal/privacy" className="transition-colors hover:text-indigo-700">Privacy</Link>
            <Link to="/legal/cookies" className="transition-colors hover:text-indigo-700">Cookies</Link>
            <Link to="/legal/terms" className="transition-colors hover:text-indigo-700">Terms</Link>
            <Link to="/sitemap" className="transition-colors hover:text-indigo-700">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

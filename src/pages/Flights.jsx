import { Link } from 'react-router-dom'
import FlightSearchForm from '../components/search/FlightSearchForm'
import Icon from '../components/ui/Icon'
import { SectionHead } from '../components/ui/Bits'
import DragCarousel from '../components/ui/DragCarousel'
import {
  DealsRail,
  DestinationRail,
  FaqSection,
  HowItWorks,
  InternationalStrip,
  QuickLinks,
  TrustStrip,
} from '../components/sections/Sections'
import { POPULAR_ROUTES, AIRPORT_MAP } from '../data/places'
import { FAQS } from '../data/content'
import { useApp, useMoney } from '../store/AppContext'

export default function Flights() {
  const money = useMoney()
  const { recentSearches } = useApp()

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-24 -top-32 h-80 w-80 rounded-full bg-indigo-600/25 blur-3xl" />
          <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="shell relative pb-28 pt-12 sm:pt-16">
          <h1 className="max-w-2xl text-[34px] font-bold leading-[1.1] text-white sm:text-[46px]">
            Every flight, every provider, one search.
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/70">
            Travlr compares fares across airlines and agents, adds the fees they hide, and sends you to whoever is
            actually cheapest. No booking fee, ever.
          </p>

          <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-2.5">
            {[
              { icon: 'shield', text: '1,200+ airlines and agents' },
              { icon: 'wallet', text: 'No fee added to any fare' },
              { icon: 'bell', text: 'Price alerts on any route' },
            ].map((t) => (
              <li key={t.text} className="flex items-center gap-2 text-[13.5px] text-white/65">
                <Icon name={t.icon} size={16} className="text-indigo-300" />
                {t.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="shell relative -mt-20 sm:-mt-24">
        <FlightSearchForm />
      </div>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <section className="shell pt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-navy">Pick up where you left off</h2>
            <Link to="/trips?tab=recent" className="text-[13.5px] font-medium text-indigo-700 hover:underline">
              All recent searches
            </Link>
          </div>
          <DragCarousel itemClass="w-[236px]" gap="gap-3" label="Recent searches" arrows={false}>
            {recentSearches.slice(0, 6).map((r) => (
              <Link
                key={r.at}
                to={r.to}
                className="card flex h-full items-center gap-3 p-3.5 transition-colors hover:border-indigo-300"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink-muted">
                  <Icon name={r.kind === 'flight' ? 'plane' : r.kind === 'stay' ? 'bed' : 'car'} size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-medium text-navy">{r.title}</span>
                  <span className="block truncate text-[12.5px] text-ink-soft">{r.sub}</span>
                </span>
              </Link>
            ))}
          </DragCarousel>
        </section>
      )}

      {/* Popular routes */}
      <section className="shell py-14">
        <SectionHead
          eyebrow="Routes from India"
          title="Popular routes, with this week’s lowest fare"
          sub="Return fares found by other travellers in the last 48 hours. Tap one to see today’s prices."
        />
        <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_ROUTES.map((r) => (
            <Link
              key={`${r.from}-${r.to}`}
              to={`/flights/results?from=${r.from}&to=${r.to}&trip=return`}
              className="card group flex items-center justify-between gap-4 px-4 py-3.5 transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-[14.5px] font-medium text-navy">
                  {AIRPORT_MAP[r.from]?.city}
                  <Icon name="arrowRight" size={14} className="text-ink-soft transition-transform duration-200 group-hover:translate-x-0.5" />
                  {AIRPORT_MAP[r.to]?.city}
                </span>
                <span className="mt-0.5 block text-[12.5px] text-ink-soft">
                  {r.from} – {r.to} · return
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-[11.5px] text-ink-soft">from</span>
                <span className="tnum block text-[16px] font-bold text-navy">{money(r.price)}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <QuickLinks exclude={[]} />
      <DealsRail kinds={['flight', 'stay', 'car']} />
      <DestinationRail
        title="Where Indian travellers are flying this season"
        sub="Cheapest return fares we have seen in the last week, per person."
      />
      <HowItWorks />
      <TrustStrip />
      <FaqSection
        items={FAQS.flights}
        title="Flight questions, answered plainly"
        sub="If something here doesn’t cover it, the help centre has the long version."
      />
      <InternationalStrip />
    </>
  )
}

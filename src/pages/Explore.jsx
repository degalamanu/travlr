import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SwipeDeck from '../components/cards/SwipeDeck'
import DestinationCard from '../components/cards/DestinationCard'
import Icon from '../components/ui/Icon'
import { SectionHead } from '../components/ui/Bits'
import { InternationalStrip } from '../components/sections/Sections'
import { DESTINATIONS } from '../data/content'
import { useApp, useMoney } from '../store/AppContext'

const TAGS = ['Beach', 'Mountains', 'City', 'Heritage', 'Food', 'Family', 'Value', 'Road trip', 'Wellness']
const BUDGETS = [
  { id: 'any', label: 'Any budget', max: Infinity },
  { id: 'low', label: 'Under ₹10,000', max: 10000 },
  { id: 'mid', label: 'Under ₹20,000', max: 20000 },
  { id: 'high', label: 'Under ₹40,000', max: 40000 },
]

export default function Explore() {
  const money = useMoney()
  const { wishlist } = useApp()
  const [tag, setTag] = useState(null)
  const [budget, setBudget] = useState('any')
  const [mode, setMode] = useState('swipe')

  const filtered = useMemo(() => {
    const max = BUDGETS.find((b) => b.id === budget)?.max ?? Infinity
    return DESTINATIONS.filter((d) => d.price <= max).filter((d) =>
      tag ? d.tags.some((t) => t.toLowerCase() === tag.toLowerCase()) : true
    )
  }, [tag, budget])

  return (
    <>
      <section className="bg-navy">
        <div className="shell py-12 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-[32px] font-bold leading-[1.12] text-white sm:text-[42px]">
                No destination in mind? Start swiping.
              </h1>
              <p className="mt-3 text-[16px] leading-relaxed text-white/70">
                Swipe right on a place and we keep it in your wishlist with live fares. Swipe left and you never see it
                again. Every card links to real flights and hotels.
              </p>
            </div>
            <Link to="/trips" className="btn-sm bg-white text-navy hover:bg-indigo-50">
              <Icon name="heart" size={15} />
              {wishlist.length} saved
            </Link>
          </div>
        </div>
      </section>

      <div className="shell py-8">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex overflow-hidden rounded-xl border border-line bg-white">
            {[
              { id: 'swipe', label: 'Swipe deck', icon: 'grid' },
              { id: 'grid', label: 'All places', icon: 'list' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13.5px] font-medium transition-colors ${
                  mode === m.id ? 'bg-indigo-600 text-white' : 'text-ink-muted hover:bg-canvas hover:text-navy'
                }`}
              >
                <Icon name={m.icon} size={15} />
                {m.label}
              </button>
            ))}
          </div>

          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            aria-label="Budget"
            className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] font-medium text-navy focus:border-indigo-500 focus:outline-none"
          >
            {BUDGETS.map((b) => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>

          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(tag === t ? null : t)}
                className={`pill ${tag === t ? 'pill-active' : 'hover:border-indigo-300'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <span className="ml-auto text-[13px] text-ink-muted">{filtered.length} destinations</span>
        </div>

        {mode === 'swipe' ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
            <div>
              <SwipeDeck destinations={filtered} />
            </div>
            <div>
              <SectionHead
                eyebrow="How this works"
                title="A wishlist that prices itself"
                sub="Everything you save lands in Trips with a live fare from your home airport, and we watch it for drops."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: 'heart', title: 'Swipe right to save', body: 'Saved places sit in Trips with the cheapest current fare next to them.' },
                  { icon: 'bell', title: 'We watch the price', body: 'Turn on an alert and we email you when the fare moves by more than 5%.' },
                  { icon: 'calendar', title: 'Best time to go', body: 'Each destination page shows the cheapest month and what the weather does.' },
                  { icon: 'compass', title: 'Straight to results', body: 'Every card links to real flights, hotels and cars for those dates.' },
                ].map((c) => (
                  <div key={c.title} className="card p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon name={c.icon} size={19} />
                    </span>
                    <h3 className="mt-3.5 text-[15.5px] font-semibold text-navy">{c.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{c.body}</p>
                  </div>
                ))}
              </div>

              <div className="card mt-4 flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <h3 className="text-[15.5px] font-semibold text-navy">Rather describe it in words?</h3>
                  <p className="mt-1 text-[13.5px] text-ink-muted">
                    “Somewhere warm in March, direct from Bengaluru, under ₹25,000.”
                  </p>
                </div>
                <Link to="/ai" className="btn-primary btn-sm shrink-0">
                  <Icon name="sparkles" size={15} /> Search with AI
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full rounded-2xl border border-dashed border-line-strong bg-white px-6 py-12 text-center text-[14px] text-ink-muted">
                Nothing under that budget with those tags. Try a higher budget or clear the tag.
              </p>
            )}
          </div>
        )}

        {/* Cheapest right now */}
        <section className="mt-14">
          <SectionHead
            eyebrow="Cheapest right now"
            title="Places you can reach for less than a weekend at home"
            sub="Return fares per person from India, found in the last seven days."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...DESTINATIONS]
              .sort((a, b) => a.price - b.price)
              .slice(0, 6)
              .map((d) => (
                <Link
                  key={d.id}
                  to={`/explore/${d.id}`}
                  className="card group flex items-center justify-between gap-4 px-4 py-3.5 transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
                >
                  <span>
                    <span className="block text-[15px] font-medium text-navy">{d.name}</span>
                    <span className="block text-[12.5px] text-ink-soft">{d.country} · best {d.months}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[11.5px] text-ink-soft">from</span>
                    <span className="tnum block text-[16px] font-bold text-navy">{money(d.price)}</span>
                  </span>
                </Link>
              ))}
          </div>
        </section>
      </div>

      <InternationalStrip />
    </>
  )
}

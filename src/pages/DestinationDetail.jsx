import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Photo from '../components/ui/Photo'
import Icon from '../components/ui/Icon'
import DragCarousel from '../components/ui/DragCarousel'
import { HotelCardGrid } from '../components/cards/HotelCard'
import DestinationCard from '../components/cards/DestinationCard'
import AlertButton from '../components/results/AlertButton'
import { EmptyState, SectionHead } from '../components/ui/Bits'
import { DESTINATIONS, DESTINATION_MAP, destinationPhoto } from '../data/content'
import { searchStays } from '../data/stays'
import { searchCars } from '../data/cars'
import { cheapestMonths } from '../data/flights'
import { AIRPORT_MAP } from '../data/places'
import { addDays, todayISO } from '../lib/format'
import { useApp, useMoney } from '../store/AppContext'

export default function DestinationDetail() {
  const { id } = useParams()
  const money = useMoney()
  const { wishlist, toggleWishlist, notify } = useApp()
  const d = DESTINATION_MAP[id]

  const hotels = useMemo(() => (d ? searchStays({ place: d.name, nights: d.nights }).slice(0, 8) : []), [d])
  const cars = useMemo(() => (d ? searchCars({ place: d.name, days: 3 }).slice(0, 3) : []), [d])
  const months = useMemo(() => (d ? cheapestMonths('BLR', d.airport) : []), [d])

  if (!d) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon="compass"
          title="We don’t have a guide for that place yet"
          body="Here is everywhere we do cover — new destinations go in every month."
          action={
            <Link to="/explore" className="btn-primary">
              <Icon name="arrowLeft" size={16} /> Back to Explore
            </Link>
          }
        />
      </div>
    )
  }

  const saved = wishlist.includes(d.id)
  const cheapestMonth = months.reduce((a, b) => (a.price <= b.price ? a : b), months[0])
  const depart = addDays(todayISO(), 21)
  const ret = addDays(todayISO(), 21 + d.nights)

  return (
    <>
      <section className="relative">
        <Photo
          src={destinationPhoto(d, 1600, 800)}
          alt={d.name}
          kind="city"
          seed={d.id}
          variant={d.variant}
          ratio="aspect-[16/9] sm:aspect-[21/7]"
          eager
        >
          <span className="absolute inset-0 bg-gradient-to-t from-navy-900/88 via-navy-900/35 to-navy-900/20" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="shell pb-8">
              <Link
                to="/explore"
                className="mb-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white/80 transition-colors hover:text-white"
              >
                <Icon name="arrowLeft" size={16} />
                Explore everywhere
              </Link>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {d.tags.map((t) => (
                      <span key={t} className="rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-medium text-white backdrop-blur-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-[34px] font-bold leading-tight text-white sm:text-[44px]">{d.name}</h1>
                  <p className="mt-1.5 max-w-xl text-[15px] text-white/75">{d.blurb}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleWishlist(d.id)
                    notify(saved ? `${d.name} removed from saved` : `${d.name} saved`)
                  }}
                  className={`btn ${saved ? 'bg-white text-navy' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  <Icon name="heart" size={16} filled={saved} />
                  {saved ? 'Saved' : 'Save this place'}
                </button>
              </div>
            </div>
          </div>
        </Photo>
      </section>

      <div className="shell py-10">
        {/* Facts */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Flights from', value: money(d.price), sub: 'return, per person' },
            { label: 'Best months', value: d.months, sub: 'weather and crowds' },
            { label: 'Cheapest month', value: cheapestMonth?.month || '—', sub: `from ${money(cheapestMonth?.price || d.price)}` },
            { label: 'Suggested length', value: `${d.nights} nights`, sub: 'for a first visit' },
          ].map((f) => (
            <div key={f.label} className="card p-4">
              <div className="text-[12px] font-semibold uppercase tracking-[0.07em] text-ink-soft">{f.label}</div>
              <div className="tnum mt-1.5 text-[20px] font-bold text-navy">{f.value}</div>
              <div className="text-[12.5px] text-ink-soft">{f.sub}</div>
            </div>
          ))}
        </div>

        {/* Book it */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            to={`/flights/results?from=BLR&to=${d.airport}&depart=${depart}&ret=${ret}&trip=return`}
            className="card group flex items-center gap-4 p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Icon name="plane" size={20} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-navy">Flights to {AIRPORT_MAP[d.airport]?.city || d.name}</span>
              <span className="block text-[13px] text-ink-muted">from {money(d.price)} return</span>
            </span>
          </Link>
          <Link
            to={`/stays/results?place=${encodeURIComponent(d.name)}`}
            className="card group flex items-center gap-4 p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Icon name="bed" size={20} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-navy">Stays in {d.name}</span>
              <span className="block text-[13px] text-ink-muted">
                from {money(Math.min(...hotels.map((h) => h.pricePerNight)))} a night
              </span>
            </span>
          </Link>
          <Link
            to={`/cars/results?place=${encodeURIComponent(d.name)}`}
            className="card group flex items-center gap-4 p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Icon name="car" size={20} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-navy">Car hire</span>
              <span className="block text-[13px] text-ink-muted">
                from {money(Math.min(...cars.map((c) => c.pricePerDay)))} a day
              </span>
            </span>
          </Link>
        </section>

        {/* Price by month */}
        <section className="mt-10 card p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-semibold text-navy">When to fly to {d.name}</h2>
              <p className="mt-1 text-[13.5px] text-ink-muted">
                Cheapest return fare per month from Bengaluru. {cheapestMonth?.month} is usually the bargain.
              </p>
            </div>
            <AlertButton
              alert={{ id: `dest:${d.id}`, kind: 'destination', title: `Flights to ${d.name}`, price: d.price, to: `/explore/${d.id}` }}
            />
          </div>
          <div className="mt-5 flex h-32 items-end gap-2">
            {months.map((m) => {
              const max = Math.max(...months.map((x) => x.price))
              const min = Math.min(...months.map((x) => x.price))
              const h = 20 + ((m.price - min) / Math.max(1, max - min)) * 78
              const isMin = m.price === min
              return (
                <div key={m.month} className="group flex flex-1 flex-col items-center gap-2">
                  <span className={`tnum text-[10.5px] ${isMin ? 'font-bold text-indigo-700' : 'text-ink-soft opacity-0 transition-opacity group-hover:opacity-100'}`}>
                    {Math.round(m.price / 1000)}k
                  </span>
                  <div
                    style={{ height: `${h}%` }}
                    className={`w-full rounded-t-md transition-colors ${isMin ? 'bg-indigo-600' : 'bg-indigo-100 group-hover:bg-indigo-300'}`}
                  />
                  <span className={`text-[11px] ${isMin ? 'font-semibold text-indigo-700' : 'text-ink-soft'}`}>{m.month}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Stays */}
        <section className="mt-12">
          <SectionHead
            eyebrow="Where to stay"
            title={`Top-rated stays in ${d.name}`}
            action={
              <Link to={`/stays/results?place=${encodeURIComponent(d.name)}`} className="btn-outline btn-sm">
                See all <Icon name="arrowRight" size={15} />
              </Link>
            }
          />
          <DragCarousel itemClass="w-[268px]" label={`Stays in ${d.name}`}>
            {hotels.map((h) => (
              <HotelCardGrid key={h.id} hotel={h} to={`/stays/hotel/${h.id}?place=${encodeURIComponent(d.name)}`} />
            ))}
          </DragCarousel>
        </section>

        {/* Similar */}
        <section className="mt-12">
          <SectionHead eyebrow="If you like this" title="You might also like" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.filter((x) => x.id !== d.id && x.tags.some((t) => d.tags.includes(t)))
              .slice(0, 4)
              .map((x) => (
                <DestinationCard key={x.id} destination={x} />
              ))}
          </div>
        </section>
      </div>
    </>
  )
}

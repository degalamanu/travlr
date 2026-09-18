import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import FlightSearchForm from '../components/search/FlightSearchForm'
import FlightRow from '../components/results/FlightRow'
import { FilterPanel, DEPART_WINDOWS } from '../components/results/FlightFilters'
import ProviderDrawer from '../components/results/ProviderDrawer'
import PriceCalendar from '../components/results/PriceCalendar'
import AlertButton from '../components/results/AlertButton'
import Icon from '../components/ui/Icon'
import Drawer from '../components/ui/Drawer'
import { Badge, EmptyState, SkeletonRow } from '../components/ui/Bits'
import PhotoGallery from '../components/ui/PhotoGallery'
import { searchFlights, AIRLINE_MAP } from '../data/flights'
import { searchStays } from '../data/stays'
import { AIRPORT_MAP } from '../data/places'
import { formatDate, duration, nightsBetween } from '../lib/format'
import { useMoney } from '../store/AppContext'

const SORTS = [
  { id: 'best', label: 'Best' },
  { id: 'cheapest', label: 'Cheapest' },
  { id: 'fastest', label: 'Fastest' },
  { id: 'earliest', label: 'Earliest' },
]

const EMPTY_FILTERS = {
  stops: [],
  windows: [],
  airlines: [],
  maxPrice: null,
  maxDuration: null,
  hideSelfTransfer: false,
  checkedBagOnly: false,
}

export default function FlightResults() {
  const [params, setParams] = useSearchParams()
  const money = useMoney()

  const trip = params.get('trip') || 'return'
  const mode = params.get('mode') || 'flights'
  const legsParam = params.get('legs')
  const legs = useMemo(() => {
    if (!legsParam) return null
    return legsParam.split(',').map((seg) => {
      const [from, to, ...rest] = seg.split('-')
      return { from, to, date: rest.join('-') }
    })
  }, [legsParam])

  const [activeLeg, setActiveLeg] = useState(0)
  const leg = legs?.[activeLeg]

  const query = useMemo(
    () => ({
      from: leg?.from || params.get('from') || 'BLR',
      to: leg?.to || params.get('to') || 'DEL',
      depart: leg?.date || params.get('depart') || '',
      ret: trip === 'return' ? params.get('ret') || '' : '',
      cabin: params.get('cabin') || 'economy',
      adults: Number(params.get('adults') || 1),
      children: Number(params.get('children') || 0),
      infants: Number(params.get('infants') || 0),
      directOnly: params.get('direct') === '1',
      bags: Number(params.get('bags') || 0),
    }),
    [params, leg, trip]
  )

  const allOffers = useMemo(() => searchFlights(query), [query])

  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('best')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [drawerOffer, setDrawerOffer] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    setLoading(true)
    setFilters(EMPTY_FILTERS)
    const t = setTimeout(() => setLoading(false), 620)
    return () => clearTimeout(t)
  }, [query])

  const bounds = useMemo(() => {
    const prices = allOffers.map((o) => o.price)
    const durations = allOffers.map((o) => o.durationMins)
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
    }
  }, [allOffers])

  const airlineFacets = useMemo(() => {
    const counts = {}
    allOffers.forEach((o) => {
      counts[o.airline.code] = (counts[o.airline.code] || 0) + 1
    })
    return Object.entries(counts)
      .map(([code, count]) => ({ code, count, name: AIRLINE_MAP[code]?.name || code }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [allOffers])

  const results = useMemo(() => {
    let list = allOffers.filter((o) => {
      if (filters.stops.length) {
        const bucket = o.stops >= 2 ? 2 : o.stops
        if (!filters.stops.includes(bucket)) return false
      }
      if (filters.windows.length) {
        const inWindow = filters.windows.some((id) => {
          const w = DEPART_WINDOWS.find((x) => x.id === id)
          return o.depart >= w.from && o.depart < w.to
        })
        if (!inWindow) return false
      }
      if (filters.airlines.length && !filters.airlines.includes(o.airline.code)) return false
      if (filters.maxPrice != null && o.price > filters.maxPrice) return false
      if (filters.maxDuration != null && o.durationMins > filters.maxDuration) return false
      if (filters.hideSelfTransfer && o.selfTransfer) return false
      if (filters.checkedBagOnly && o.baggage.checked === 'Not included') return false
      return true
    })

    list = [...list].sort((a, b) => {
      if (sort === 'cheapest') return a.price - b.price
      if (sort === 'fastest') return a.durationMins - b.durationMins
      if (sort === 'earliest') return a.depart - b.depart
      return a.price / 1000 + a.durationMins / 60 - (b.price / 1000 + b.durationMins / 60)
    })
    return list
  }, [allOffers, filters, sort])

  const searchQS = params.toString()
  const fromCity = AIRPORT_MAP[query.from]?.city || query.from
  const toCity = AIRPORT_MAP[query.to]?.city || query.to
  const activeFilterCount =
    filters.stops.length +
    filters.windows.length +
    filters.airlines.length +
    (filters.maxPrice != null ? 1 : 0) +
    (filters.maxDuration != null ? 1 : 0) +
    (filters.hideSelfTransfer ? 1 : 0) +
    (filters.checkedBagOnly ? 1 : 0)

  const pickDate = (date) => {
    const next = new URLSearchParams(params)
    next.set('depart', date)
    setParams(next)
  }

  return (
    <>
      {/* Search summary bar */}
      <div className="border-b border-line bg-navy">
        <div className="shell-wide py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="flex flex-wrap items-center gap-2 text-[19px] font-semibold text-white sm:text-[22px]">
                {fromCity}
                <Icon name="arrowRight" size={17} className="text-indigo-300" />
                {toCity}
              </h1>
              <p className="mt-1 text-[13px] text-white/60">
                {formatDate(query.depart) || 'Any date'}
                {query.ret && ` – ${formatDate(query.ret)}`} · {query.adults + query.children} traveller
                {query.adults + query.children > 1 ? 's' : ''} · {query.cabin}
                {query.bags ? ` · ${query.bags} checked bag${query.bags > 1 ? 's' : ''}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AlertButton
                alert={{
                  id: `flight:${query.from}-${query.to}`,
                  kind: 'flight',
                  title: `${fromCity} → ${toCity}`,
                  price: bounds.minPrice,
                  to: `/flights/results?${searchQS}`,
                }}
              />
              <button type="button" onClick={() => setEditing((v) => !v)} className="btn-sm bg-white text-navy hover:bg-indigo-50">
                <Icon name={editing ? 'close' : 'search'} size={15} />
                {editing ? 'Close' : 'Edit search'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <FlightSearchForm
                    compact
                    initial={{
                      from: query.from,
                      to: query.to,
                      depart: query.depart,
                      ret: query.ret,
                      trip,
                      mode,
                      cabin: query.cabin,
                      adults: query.adults,
                      children: query.children,
                      infants: query.infants,
                      direct: query.directOnly,
                      bags: query.bags,
                      nearby: params.get('nearby') === '1',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Multi-city leg switcher */}
      {legs && (
        <div className="border-b border-line bg-white">
          <div className="shell-wide flex gap-2 overflow-x-auto py-3">
            {legs.map((l, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveLeg(i)}
                className={`shrink-0 rounded-xl px-4 py-2 text-[13.5px] font-medium transition-colors ${
                  activeLeg === i ? 'bg-indigo-600 text-white' : 'bg-canvas text-ink-muted hover:text-navy'
                }`}
              >
                Leg {i + 1}: {l.from} → {l.to}
                <span className={`ml-2 ${activeLeg === i ? 'text-white/70' : 'text-ink-soft'}`}>
                  {l.date ? formatDate(l.date, { day: 'numeric', month: 'short' }) : 'any date'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="shell-wide grid gap-6 py-6 lg:grid-cols-[264px_1fr]">
        {/* Filters (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl border border-line bg-white p-5">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              bounds={bounds}
              airlines={airlineFacets}
              onReset={() => setFilters(EMPTY_FILTERS)}
            />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Sort + tools */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex overflow-hidden rounded-xl border border-line bg-white">
              {SORTS.map((s) => {
                const cheapest = results.length
                  ? s.id === 'cheapest'
                    ? money(Math.min(...results.map((r) => r.price)))
                    : s.id === 'fastest'
                      ? duration(Math.min(...results.map((r) => r.durationMins)))
                      : null
                  : null
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSort(s.id)}
                    className={`px-3.5 py-2.5 text-left text-[13.5px] transition-colors ${
                      sort === s.id ? 'bg-indigo-600 text-white' : 'text-ink-muted hover:bg-canvas hover:text-navy'
                    }`}
                  >
                    <span className="block font-semibold">{s.label}</span>
                    {cheapest && (
                      <span className={`tnum block text-[11.5px] ${sort === s.id ? 'text-white/75' : 'text-ink-soft'}`}>
                        {cheapest}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowCalendar((v) => !v)}
              className={`pill ${showCalendar ? 'pill-active' : 'hover:border-indigo-300'}`}
            >
              <Icon name="calendar" size={14} />
              Flexible dates
            </button>

            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="pill hover:border-indigo-300 lg:hidden"
            >
              <Icon name="sliders" size={14} />
              Filters{activeFilterCount ? ` · ${activeFilterCount}` : ''}
            </button>

            <span className="ml-auto text-[13px] text-ink-muted">
              {loading ? 'Searching…' : `${results.length} of ${allOffers.length} results`}
            </span>
          </div>

          <AnimatePresence>
            {showCalendar && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mb-4">
                  <PriceCalendar
                    from={query.from}
                    to={query.to}
                    cabin={query.cabin}
                    selected={query.depart}
                    onPick={pickDate}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {mode === 'package' && !loading && results.length > 0 && (
            <PackageBundles offers={results.slice(0, 4)} query={query} city={toCity} />
          )}

          {/* Results */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} className="h-[148px]" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              icon="filter"
              title="No flights match these filters"
              body="Loosen a filter or two — usually it's the journey-length slider or airline picks that go too far."
              action={
                <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="btn-primary">
                  <Icon name="refresh" size={16} /> Reset filters
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {results.map((offer, i) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.24) }}
                >
                  <FlightRow offer={offer} onSelect={setDrawerOffer} searchQS={searchQS} />
                </motion.div>
              ))}

              <div className="card mt-6 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-[15.5px] font-semibold text-navy">That’s every fare we found on this route</h3>
                  <p className="mt-1 text-[13.5px] text-ink-muted">
                    Not quite right? Track the price and we’ll email you when it drops, or look at nearby dates.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowCalendar(true)} className="btn-outline btn-sm">
                    <Icon name="calendar" size={15} /> Nearby dates
                  </button>
                  <Link to={`/stays/results?place=${encodeURIComponent(toCity)}`} className="btn-primary btn-sm">
                    <Icon name="bed" size={15} /> Hotels in {toCity}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters */}
      <Drawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filters"
        subtitle={`${results.length} of ${allOffers.length} flights match`}
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="btn-outline flex-1">
              Reset
            </button>
            <button type="button" onClick={() => setShowFilters(false)} className="btn-primary flex-1">
              Show {results.length} flights
            </button>
          </div>
        }
      >
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          bounds={bounds}
          airlines={airlineFacets}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />
      </Drawer>

      <ProviderDrawer
        open={Boolean(drawerOffer)}
        onClose={() => setDrawerOffer(null)}
        title={drawerOffer ? `${drawerOffer.airline.name} · ${fromCity} → ${toCity}` : ''}
        subtitle={
          drawerOffer
            ? `${duration(drawerOffer.durationMins)} · ${drawerOffer.stops === 0 ? 'direct' : `${drawerOffer.stops} stop`} · ${formatDate(query.depart)}`
            : ''
        }
        providers={drawerOffer?.providers || []}
        unit={query.adults + query.children > 1 ? 'total' : 'per traveller'}
        detailTo={drawerOffer ? `/flights/offer/${drawerOffer.id}?${searchQS}` : null}
      />
    </>
  )
}

/* ------------------------------------------------------- package mode */

function PackageBundles({ offers, query, city }) {
  const money = useMoney()
  const nights = query.ret ? nightsBetween(query.depart, query.ret) : 3
  const hotels = useMemo(() => searchStays({ place: city, nights }).slice(0, 4), [city, nights])

  return (
    <section className="mb-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-[17px] font-semibold text-navy">
            <Icon name="tag" size={17} className="text-indigo-600" />
            Flight + hotel packages
          </h2>
          <p className="mt-0.5 text-[13.5px] text-ink-muted">
            Same flight, bundled with {nights} {nights === 1 ? 'night' : 'nights'} in {city}. Providers discount these when booked together.
          </p>
        </div>
        <Link to={`/stays/results?place=${encodeURIComponent(city)}`} className="text-[13.5px] font-semibold text-indigo-700 hover:underline">
          Browse hotels separately
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {offers.map((offer, i) => {
          const hotel = hotels[i % hotels.length]
          const separate = offer.price + hotel.pricePerNight * nights
          const bundle = Math.round((separate * 0.88) / 10) * 10
          return (
            <article key={offer.id} className="card overflow-hidden">
              <div className="flex">
                <div className="w-[116px] shrink-0">
                  <PhotoGallery
                    photos={hotel.photos.slice(0, 2)}
                    alt={hotel.name}
                    seed={hotel.id}
                    kind="hotel"
                    ratio="aspect-square"
                  />
                </div>
                <div className="min-w-0 flex-1 p-3.5">
                  <div className="flex items-center gap-1.5 text-[12.5px] text-ink-muted">
                    <Icon name="plane" size={13} />
                    {offer.airline.name} · {offer.stops === 0 ? 'direct' : `${offer.stops} stop`}
                  </div>
                  <h3 className="mt-1 line-clamp-1 text-[15px] font-semibold text-navy">{hotel.name}</h3>
                  <p className="text-[12.5px] text-ink-soft">
                    {hotel.stars}★ · {hotel.area}
                  </p>
                  <div className="mt-2.5 flex items-end justify-between gap-2">
                    <div>
                      <Badge tone="green">Save {money(separate - bundle)}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="tnum text-[12px] text-ink-soft line-through">{money(separate)}</div>
                      <div className="tnum text-[18px] font-bold leading-none text-navy">{money(bundle)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                to={`/stays/hotel/${hotel.id}?place=${encodeURIComponent(city)}`}
                className="block border-t border-line px-3.5 py-2.5 text-center text-[13.5px] font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
              >
                See package details
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}

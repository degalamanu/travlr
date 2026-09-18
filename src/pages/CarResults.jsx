import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import CarSearchForm from '../components/search/CarSearchForm'
import CarCard from '../components/cards/CarCard'
import ProviderDrawer from '../components/results/ProviderDrawer'
import Icon from '../components/ui/Icon'
import Drawer from '../components/ui/Drawer'
import { Checkbox, EmptyState, SkeletonRow } from '../components/ui/Bits'
import { CAR_CATEGORIES, searchCars } from '../data/cars'
import { CAR_PROVIDERS } from '../data/providers'
import { formatDate, nightsBetween } from '../lib/format'
import { useMoney } from '../store/AppContext'

const SORTS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'cheapest', label: 'Price' },
  { id: 'rating', label: 'Supplier rating' },
  { id: 'size', label: 'Largest' },
]

const EMPTY = {
  categories: [],
  transmission: [],
  seats: 0,
  suppliers: [],
  freeCancellation: false,
  unlimitedKm: false,
  maxPrice: null,
  electric: false,
}

export default function CarResults() {
  const [params] = useSearchParams()
  const money = useMoney()

  const place = params.get('place') || 'Goa'
  const pickupDate = params.get('pickupDate') || ''
  const dropDate = params.get('dropDate') || ''
  const pickupTime = params.get('pickupTime') || '10:00'
  const dropTime = params.get('dropTime') || '10:00'
  const driverAge = Number(params.get('age') || 30)
  const differentDropoff = params.get('diff') === '1'
  const dropPlace = params.get('dropPlace') || ''
  const days = pickupDate && dropDate ? nightsBetween(pickupDate, dropDate) : 3

  const all = useMemo(
    () => searchCars({ place, pickupDate, dropDate, days, driverAge, differentDropoff, dropPlace }),
    [place, pickupDate, dropDate, days, driverAge, differentDropoff, dropPlace]
  )

  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('recommended')
  const [filters, setFilters] = useState(() => ({
    ...EMPTY,
    categories: params.get('category') ? [params.get('category')] : [],
  }))
  const [showFilters, setShowFilters] = useState(false)
  const [editing, setEditing] = useState(false)
  const [drawerCar, setDrawerCar] = useState(null)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [place, pickupDate, dropDate, driverAge, differentDropoff])

  const bounds = useMemo(() => {
    const prices = all.map((c) => c.pricePerDay)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [all])

  const results = useMemo(() => {
    let list = all.filter((c) => {
      if (filters.categories.length && !filters.categories.includes(c.category)) return false
      if (filters.transmission.length && !filters.transmission.includes(c.transmission)) return false
      if (filters.seats && c.seats < filters.seats) return false
      if (filters.suppliers.length && !filters.suppliers.includes(c.supplier)) return false
      if (filters.freeCancellation && !c.freeCancellation) return false
      if (filters.unlimitedKm && c.mileage !== 'Unlimited km') return false
      if (filters.electric && c.fuel !== 'Electric') return false
      if (filters.maxPrice != null && c.pricePerDay > filters.maxPrice) return false
      if (driverAge < c.driverAgeMin) return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'cheapest') return a.total - b.total
      if (sort === 'rating') return b.supplierRating - a.supplierRating
      if (sort === 'size') return b.seats - a.seats || b.bags - a.bags
      return b.supplierRating * 900 - b.pricePerDay - (a.supplierRating * 900 - a.pricePerDay)
    })
    return list
  }, [all, filters, sort, driverAge])

  const activeCount =
    filters.categories.length +
    filters.transmission.length +
    filters.suppliers.length +
    (filters.seats ? 1 : 0) +
    (filters.freeCancellation ? 1 : 0) +
    (filters.unlimitedKm ? 1 : 0) +
    (filters.electric ? 1 : 0) +
    (filters.maxPrice != null ? 1 : 0)

  const panel = (
    <FilterPanel filters={filters} setFilters={setFilters} bounds={bounds} all={all} onReset={() => setFilters(EMPTY)} money={money} />
  )

  return (
    <>
      <div className="border-b border-line bg-navy">
        <div className="shell-wide py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[19px] font-semibold text-white sm:text-[22px]">Car hire in {place}</h1>
              <p className="mt-1 text-[13px] text-white/60">
                {pickupDate && dropDate
                  ? `${formatDate(pickupDate)} ${pickupTime} – ${formatDate(dropDate)} ${dropTime}`
                  : 'Flexible dates'}{' '}
                · {days} {days === 1 ? 'day' : 'days'} · driver {driverAge}
                {differentDropoff && dropPlace ? ` · returning to ${dropPlace}` : ''}
              </p>
            </div>
            <button type="button" onClick={() => setEditing((v) => !v)} className="btn-sm bg-white text-navy hover:bg-indigo-50">
              <Icon name={editing ? 'close' : 'search'} size={15} />
              {editing ? 'Close' : 'Edit search'}
            </button>
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
                  <CarSearchForm
                    initial={{ place, pickupDate, dropDate, pickupTime, dropTime, age: driverAge, diff: differentDropoff, dropPlace }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="shell-wide grid gap-6 py-6 lg:grid-cols-[264px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl border border-line bg-white p-5">
            {panel}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex overflow-hidden rounded-xl border border-line bg-white">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSort(s.id)}
                  className={`px-3.5 py-2.5 text-[13.5px] font-medium transition-colors ${
                    sort === s.id ? 'bg-indigo-600 text-white' : 'text-ink-muted hover:bg-canvas hover:text-navy'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button type="button" onClick={() => setShowFilters(true)} className="pill hover:border-indigo-300 lg:hidden">
              <Icon name="sliders" size={14} />
              Filters{activeCount ? ` · ${activeCount}` : ''}
            </button>

            <span className="ml-auto text-[13px] text-ink-muted">
              {loading ? 'Searching…' : `${results.length} of ${all.length} cars`}
            </span>
          </div>

          {driverAge < 25 && (
            <p className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
              <Icon name="info" size={15} className="mt-0.5 shrink-0" />
              You are hiring as a driver under 25, so a young-driver fee is included in every price below. Cars with a
              higher minimum age have been hidden rather than shown at a price you cannot book.
            </p>
          )}

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} className="h-[220px]" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              icon="car"
              title="No cars match these filters"
              body="Suppliers in smaller towns carry fewer categories. Clearing the category or supplier filter usually helps."
              action={
                <button type="button" onClick={() => setFilters(EMPTY)} className="btn-primary">
                  <Icon name="refresh" size={16} /> Reset filters
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {results.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.24) }}
                >
                  <CarCard
                    car={car}
                    layout="row"
                    to={`/cars/car/${car.id}?place=${encodeURIComponent(place)}&days=${days}&age=${driverAge}`}
                    onSelect={setDrawerCar}
                  />
                </motion.div>
              ))}

              <div className="card mt-6 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-[15.5px] font-semibold text-navy">Driving somewhere in particular?</h3>
                  <p className="mt-1 text-[13.5px] text-ink-muted">
                    Let the route planner lay out the stops, then come back and price the car for those exact dates.
                  </p>
                </div>
                <Link to={`/road-trip?start=${encodeURIComponent(place)}`} className="btn-primary btn-sm shrink-0">
                  <Icon name="sparkles" size={15} /> Plan a road trip
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filters"
        subtitle={`${results.length} of ${all.length} cars match`}
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={() => setFilters(EMPTY)} className="btn-outline flex-1">
              Reset
            </button>
            <button type="button" onClick={() => setShowFilters(false)} className="btn-primary flex-1">
              Show {results.length} cars
            </button>
          </div>
        }
      >
        {panel}
      </Drawer>

      <ProviderDrawer
        open={Boolean(drawerCar)}
        onClose={() => setDrawerCar(null)}
        title={drawerCar ? `${drawerCar.model} · ${drawerCar.supplier}` : ''}
        subtitle={drawerCar ? `${days} ${days === 1 ? 'day' : 'days'} · ${drawerCar.pickup.label} · ${drawerCar.mileage}` : ''}
        providers={drawerCar?.providers || []}
        unit={`total for ${days} ${days === 1 ? 'day' : 'days'}`}
        detailTo={drawerCar ? `/cars/car/${drawerCar.id}?place=${encodeURIComponent(place)}&days=${days}&age=${driverAge}` : null}
      />
    </>
  )
}

function FilterPanel({ filters, setFilters, bounds, all, onReset, money }) {
  const toggleIn = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }))

  const suppliers = [...new Set(all.map((c) => c.supplier))].sort()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-navy">Filters</h2>
        <button type="button" onClick={onReset} className="text-[13px] font-medium text-indigo-700 hover:underline">
          Reset all
        </button>
      </div>

      <Group title="Price per day">
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={50}
          value={filters.maxPrice ?? bounds.max}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="w-full accent-indigo-600"
          aria-label="Maximum price per day"
        />
        <div className="flex justify-between text-[12.5px] text-ink-muted">
          <span>{money(bounds.min)}</span>
          <span className="font-semibold text-navy">Up to {money(filters.maxPrice ?? bounds.max)}</span>
        </div>
      </Group>

      <Group title="Car type">
        {CAR_CATEGORIES.map((c) => (
          <Checkbox
            key={c}
            checked={filters.categories.includes(c)}
            onChange={() => toggleIn('categories', c)}
            label={c}
            count={all.filter((x) => x.category === c).length}
          />
        ))}
      </Group>

      <Group title="Gearbox">
        {['Automatic', 'Manual'].map((t) => (
          <Checkbox key={t} checked={filters.transmission.includes(t)} onChange={() => toggleIn('transmission', t)} label={t} />
        ))}
      </Group>

      <Group title="Seats">
        <div className="flex gap-1.5">
          {[0, 4, 5, 7].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, seats: n }))}
              className={`flex-1 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors ${
                filters.seats === n ? 'bg-indigo-600 text-white' : 'bg-canvas text-ink-muted hover:text-navy'
              }`}
            >
              {n === 0 ? 'Any' : `${n}+`}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Terms">
        <Checkbox
          checked={filters.freeCancellation}
          onChange={(v) => setFilters((f) => ({ ...f, freeCancellation: v }))}
          label="Free cancellation"
        />
        <Checkbox
          checked={filters.unlimitedKm}
          onChange={(v) => setFilters((f) => ({ ...f, unlimitedKm: v }))}
          label="Unlimited kilometres"
        />
        <Checkbox
          checked={filters.electric}
          onChange={(v) => setFilters((f) => ({ ...f, electric: v }))}
          label="Electric only"
        />
      </Group>

      <Group title="Supplier">
        {suppliers.map((s) => (
          <Checkbox
            key={s}
            checked={filters.suppliers.includes(s)}
            onChange={() => toggleIn('suppliers', s)}
            label={s}
            count={CAR_PROVIDERS.find((p) => p.name === s)?.rating.toFixed(1)}
          />
        ))}
      </Group>
    </div>
  )
}

function Group({ title, children }) {
  return (
    <div className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-ink-soft">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import StaySearchForm from '../components/search/StaySearchForm'
import { HotelCardRow } from '../components/cards/HotelCard'
import { StayFilterPanel, EMPTY_STAY_FILTERS } from '../components/results/StayFilters'
import MapPanel from '../components/results/MapPanel'
import ProviderDrawer from '../components/results/ProviderDrawer'
import Icon from '../components/ui/Icon'
import Drawer from '../components/ui/Drawer'
import { EmptyState, SkeletonRow } from '../components/ui/Bits'
import { searchStays } from '../data/stays'
import { formatDate, nightsBetween } from '../lib/format'

const SORTS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'cheapest', label: 'Price' },
  { id: 'rating', label: 'Guest rating' },
  { id: 'distance', label: 'Distance' },
]

export default function StayResults() {
  const [params] = useSearchParams()
  const place = params.get('place') || 'Goa'
  const checkIn = params.get('checkIn') || ''
  const checkOut = params.get('checkOut') || ''
  const adults = Number(params.get('adults') || 2)
  const children = Number(params.get('children') || 0)
  const rooms = Number(params.get('rooms') || 1)
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 3

  const all = useMemo(
    () => searchStays({ place, checkIn, checkOut, rooms, adults, children, nights }),
    [place, checkIn, checkOut, rooms, adults, children, nights]
  )

  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('recommended')
  const [view, setView] = useState('list')
  const [filters, setFilters] = useState(() => ({
    ...EMPTY_STAY_FILTERS,
    freeCancellation: params.get('freeCancel') === '1',
    breakfast: params.get('breakfast') === '1',
    stars: params.get('stars') ? params.get('stars').split(',').map(Number) : [],
  }))
  const [showFilters, setShowFilters] = useState(false)
  const [editing, setEditing] = useState(false)
  const [drawerHotel, setDrawerHotel] = useState(null)
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [place, checkIn, checkOut, adults, rooms])

  const bounds = useMemo(() => {
    const prices = all.map((h) => h.pricePerNight)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [all])

  const results = useMemo(() => {
    let list = all.filter((h) => {
      if (filters.maxPrice != null && h.pricePerNight > filters.maxPrice) return false
      if (filters.stars.length && !filters.stars.includes(h.stars)) return false
      if (filters.minScore && h.reviewScore < filters.minScore) return false
      if (filters.freeCancellation && !h.freeCancellation) return false
      if (filters.breakfast && !h.breakfast) return false
      if (filters.types.length && !filters.types.includes(h.type)) return false
      if (filters.maxDistance != null && h.distanceKm > filters.maxDistance) return false
      if (filters.amenities.length && !filters.amenities.every((a) => h.amenities.includes(a))) return false
      return true
    })

    list = [...list].sort((a, b) => {
      if (sort === 'cheapest') return a.pricePerNight - b.pricePerNight
      if (sort === 'rating') return b.reviewScore - a.reviewScore
      if (sort === 'distance') return a.distanceKm - b.distanceKm
      return b.reviewScore * 120 - b.pricePerNight / 60 - (a.reviewScore * 120 - a.pricePerNight / 60)
    })
    return list
  }, [all, filters, sort])

  const linkFor = (h) => `/stays/hotel/${h.id}?place=${encodeURIComponent(place)}&nights=${nights}`
  const activeFilterCount =
    filters.stars.length +
    filters.types.length +
    filters.amenities.length +
    (filters.maxPrice != null ? 1 : 0) +
    (filters.minScore ? 1 : 0) +
    (filters.freeCancellation ? 1 : 0) +
    (filters.breakfast ? 1 : 0) +
    (filters.maxDistance != null ? 1 : 0)

  return (
    <>
      <div className="border-b border-line bg-navy">
        <div className="shell-wide py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[19px] font-semibold text-white sm:text-[22px]">Stays in {place}</h1>
              <p className="mt-1 text-[13px] text-white/60">
                {checkIn ? `${formatDate(checkIn)} – ${formatDate(checkOut)}` : 'Flexible dates'} · {nights}{' '}
                {nights === 1 ? 'night' : 'nights'} · {adults + children} guests · {rooms}{' '}
                {rooms === 1 ? 'room' : 'rooms'}
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
                  <StaySearchForm initial={{ place, checkIn, checkOut, adults, children, rooms }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="shell-wide grid gap-6 py-6 lg:grid-cols-[264px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl border border-line bg-white p-5">
            <StayFilterPanel
              filters={filters}
              setFilters={setFilters}
              bounds={bounds}
              onReset={() => setFilters(EMPTY_STAY_FILTERS)}
            />
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

            <div className="flex overflow-hidden rounded-xl border border-line bg-white">
              {[
                { id: 'list', icon: 'list', label: 'List' },
                { id: 'map', icon: 'map', label: 'Map' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setView(v.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13.5px] font-medium transition-colors ${
                    view === v.id ? 'bg-navy text-white' : 'text-ink-muted hover:bg-canvas hover:text-navy'
                  }`}
                >
                  <Icon name={v.icon} size={15} />
                  {v.label}
                </button>
              ))}
            </div>

            <button type="button" onClick={() => setShowFilters(true)} className="pill hover:border-indigo-300 lg:hidden">
              <Icon name="sliders" size={14} />
              Filters{activeFilterCount ? ` · ${activeFilterCount}` : ''}
            </button>

            <span className="ml-auto text-[13px] text-ink-muted">
              {loading ? 'Searching…' : `${results.length} of ${all.length} properties`}
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} className="h-[200px]" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              icon="bed"
              title={`No properties in ${place} match these filters`}
              body="Try widening the price range or dropping a facility or two — these usually cut the most options."
              action={
                <button type="button" onClick={() => setFilters(EMPTY_STAY_FILTERS)} className="btn-primary">
                  <Icon name="refresh" size={16} /> Reset filters
                </button>
              }
            />
          ) : view === 'map' ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
              <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                {results.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onMouseEnter={() => setActiveId(h.id)}
                    onClick={() => setActiveId(h.id)}
                    className={`block w-full rounded-2xl border p-3 text-left transition-colors ${
                      activeId === h.id ? 'border-indigo-400 bg-indigo-50/40' : 'border-line bg-white hover:border-line-strong'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block truncate text-[14.5px] font-semibold text-navy">{h.name}</span>
                        <span className="block text-[12.5px] text-ink-soft">
                          {h.stars}★ · {h.area} · {h.distanceKm} km
                        </span>
                      </div>
                      <span className="tnum shrink-0 text-[15px] font-bold text-navy">
                        {h.pricePerNight.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Link to={linkFor(h)} className="mt-2 inline-block text-[12.5px] font-semibold text-indigo-700 hover:underline">
                      View property
                    </Link>
                  </button>
                ))}
              </div>
              <div className="h-[70vh] min-h-[420px]">
                <MapPanel hotels={results} activeId={activeId} setActiveId={setActiveId} place={place} linkFor={linkFor} />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.24) }}
                >
                  <HotelCardRow hotel={h} to={linkFor(h)} onSelect={setDrawerHotel} onHover={setActiveId} />
                </motion.div>
              ))}

              <div className="card mt-6 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-[15.5px] font-semibold text-navy">Seen every property in {place}</h3>
                  <p className="mt-1 text-[13.5px] text-ink-muted">
                    Add the flight and the car and we’ll keep the dates in sync.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/flights?to=${encodeURIComponent(place)}`} className="btn-outline btn-sm">
                    <Icon name="plane" size={15} /> Flights
                  </Link>
                  <Link to={`/cars/results?place=${encodeURIComponent(place)}`} className="btn-primary btn-sm">
                    <Icon name="car" size={15} /> Car hire
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filters"
        subtitle={`${results.length} of ${all.length} properties match`}
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={() => setFilters(EMPTY_STAY_FILTERS)} className="btn-outline flex-1">
              Reset
            </button>
            <button type="button" onClick={() => setShowFilters(false)} className="btn-primary flex-1">
              Show {results.length} stays
            </button>
          </div>
        }
      >
        <StayFilterPanel
          filters={filters}
          setFilters={setFilters}
          bounds={bounds}
          onReset={() => setFilters(EMPTY_STAY_FILTERS)}
        />
      </Drawer>

      <ProviderDrawer
        open={Boolean(drawerHotel)}
        onClose={() => setDrawerHotel(null)}
        title={drawerHotel?.name || ''}
        subtitle={drawerHotel ? `${drawerHotel.stars}★ · ${drawerHotel.area} · ${nights} ${nights === 1 ? 'night' : 'nights'}` : ''}
        providers={drawerHotel?.providers || []}
        unit="per night"
        detailTo={drawerHotel ? linkFor(drawerHotel) : null}
      />
    </>
  )
}

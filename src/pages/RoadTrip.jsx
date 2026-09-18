import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import CarSearchForm from '../components/search/CarSearchForm'
import Icon from '../components/ui/Icon'
import Photo from '../components/ui/Photo'
import { SectionHead } from '../components/ui/Bits'
import { ROAD_TRIP_ROUTES, searchCars } from '../data/cars'
import { useMoney } from '../store/AppContext'

export default function RoadTrip() {
  const [params] = useSearchParams()
  const money = useMoney()
  const routeId = params.get('route')
  const start = params.get('start')
  const days = Number(params.get('days') || 0)
  const vibe = params.get('vibe')

  const picked = useMemo(() => {
    if (routeId) return ROAD_TRIP_ROUTES.find((r) => r.id === routeId) || ROAD_TRIP_ROUTES[0]
    if (start) {
      const byStart = ROAD_TRIP_ROUTES.find((r) => r.from.toLowerCase() === start.toLowerCase())
      if (byStart) return byStart
      if (vibe === 'mountain') return ROAD_TRIP_ROUTES[1]
      if (vibe === 'heritage') return ROAD_TRIP_ROUTES[2]
      return ROAD_TRIP_ROUTES[0]
    }
    return null
  }, [routeId, start, vibe])

  return (
    <>
      <section className="bg-navy">
        <div className="shell py-10 sm:py-12">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-indigo-300">
            <Icon name="route" size={15} />
            Plan a road trip with AI
          </div>
          <h1 className="mt-3 max-w-2xl text-[30px] font-bold leading-tight text-white sm:text-[38px]">
            Tell us where you start. We’ll plan the driving.
          </h1>
          <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-white/70">
            Day-by-day stops, honest driving times, the right car for the roads, and a price for the hire on those
            exact dates.
          </p>
        </div>
      </section>

      <div className="shell relative -mt-6 pb-4">
        <CarSearchForm defaultTab="trip" initial={{ place: start || 'Mumbai' }} />
      </div>

      {picked ? (
        <RoutePlan route={picked} requestedDays={days} money={money} />
      ) : (
        <section className="shell py-12">
          <SectionHead
            eyebrow="Ready-made routes"
            title="Or start from a route we already know well"
            sub="Each one has been driven, timed and costed. Pick one and we’ll price the car for your dates."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {ROAD_TRIP_ROUTES.map((r) => (
              <Link
                key={r.id}
                to={`/road-trip?route=${r.id}`}
                className="card group overflow-hidden transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
              >
                <Photo src={null} alt={r.title} kind="city" seed={r.id} variant={r.id === 'spiti' ? 'mountain' : 'coast'} ratio="aspect-[16/9]" />
                <div className="p-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.07em] text-indigo-600">
                    {r.days} days · {r.distanceKm} km
                  </div>
                  <h3 className="mt-2 text-[17px] font-semibold text-navy group-hover:text-indigo-700">{r.title}</h3>
                  <p className="mt-1.5 text-[13.5px] text-ink-muted">
                    {r.from} → {r.to} · best {r.season}
                  </p>
                  <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
                    <span className="text-[13px] text-ink-muted">{r.car}</span>
                    <span className="tnum text-[16px] font-bold text-navy">{money(r.est)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function RoutePlan({ route, requestedDays, money }) {
  const [activeStop, setActiveStop] = useState(0)
  const days = requestedDays || route.days
  const cars = useMemo(() => searchCars({ place: route.from, days }), [route.from, days])
  const suggested = cars.find((c) => c.model === route.car) || cars[0]
  const fuel = Math.round((route.distanceKm / 14) * 105)

  return (
    <div className="shell py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-indigo-600">
            <Icon name="sparkles" size={14} />
            Your route
          </div>
          <h2 className="mt-2 text-[26px] font-semibold text-navy">{route.title}</h2>
          <p className="mt-1.5 text-[14.5px] text-ink-muted">
            {route.from} → {route.to} · {route.distanceKm} km · about {route.driveHours} hours behind the wheel ·
            best {route.season}
          </p>
        </div>
        <Link to={`/cars/results?place=${encodeURIComponent(route.from)}`} className="btn-primary btn-sm">
          <Icon name="car" size={15} /> Price the car
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
        <div className="space-y-4">
          {/* Route strip */}
          <div className="card p-5">
            <div className="relative flex items-center justify-between gap-1 overflow-x-auto pb-2">
              <span className="absolute left-4 right-4 top-[15px] h-0.5 bg-line" />
              {[{ name: route.from, km: 0, note: 'Collect the car' }, ...route.stops].map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setActiveStop(i)}
                  className="relative z-10 flex min-w-[88px] flex-1 flex-col items-center gap-2"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-[12px] font-bold transition-colors ${
                      activeStop === i ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-line-strong bg-white text-ink-muted'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-center text-[12.5px] ${activeStop === i ? 'font-semibold text-navy' : 'text-ink-muted'}`}>
                    {s.name}
                  </span>
                  <span className="tnum text-[11px] text-ink-soft">{s.km} km</span>
                </button>
              ))}
            </div>

            <motion.div
              key={activeStop}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl bg-canvas p-4"
            >
              <h3 className="text-[15px] font-semibold text-navy">
                Stop {activeStop + 1}: {[{ name: route.from, note: 'Collect the car and get out of the city before the traffic builds.' }, ...route.stops][activeStop].name}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">
                {[{ note: 'Collect the car and get out of the city before the traffic builds.' }, ...route.stops][activeStop].note}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to={`/stays/results?place=${encodeURIComponent([{ name: route.from }, ...route.stops][activeStop].name)}`}
                  className="btn-quiet btn-sm"
                >
                  <Icon name="bed" size={14} /> Stays here
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Day by day */}
          <div className="card p-5">
            <h3 className="text-[16px] font-semibold text-navy">Day by day</h3>
            <ol className="mt-4 space-y-4">
              {route.stops.map((s, i) => {
                const prev = i === 0 ? 0 : route.stops[i - 1].km
                const leg = s.km - prev
                return (
                  <li key={s.name} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy text-[12px] font-bold text-white">
                      D{i + 1}
                    </span>
                    <div>
                      <h4 className="text-[15px] font-medium text-navy">
                        {i === 0 ? route.from : route.stops[i - 1].name} → {s.name}
                      </h4>
                      <p className="mt-0.5 text-[13px] text-ink-muted">
                        {leg} km · roughly {Math.max(1, Math.round((leg / 45) * 10) / 10)} hours driving
                      </p>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{s.note}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="card p-5">
            <h3 className="text-[16px] font-semibold text-navy">What it costs</h3>
            <dl className="mt-3 space-y-2.5 text-[14px]">
              <Line label={`Car hire · ${days} days`} value={money(suggested ? suggested.total : route.est * 0.6)} />
              <Line label={`Fuel · ${route.distanceKm} km at about 14 km/l`} value={money(fuel)} />
              <Line label="Tolls and parking (estimate)" value={money(Math.round(route.distanceKm * 1.4))} />
              <div className="border-t border-line pt-2.5">
                <Line
                  bold
                  label="Driving costs, total"
                  value={money((suggested ? suggested.total : route.est * 0.6) + fuel + Math.round(route.distanceKm * 1.4))}
                />
              </div>
            </dl>
            <p className="mt-3 text-[12.5px] text-ink-soft">
              Hotels and food are on top — the stops above link to live rates for each night.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-[120px] lg:h-fit">
          {suggested && (
            <div className="card overflow-hidden">
              <Photo
                src={suggested.photoUrl}
                alt={suggested.model}
                kind="car"
                seed={suggested.id}
                shape={suggested.shape}
                body={suggested.body}
                art="square"
              ratio="aspect-square"
              />
              <div className="p-5">
                <div className="text-[12px] font-semibold uppercase tracking-[0.07em] text-indigo-600">
                  Recommended car
                </div>
                <h3 className="mt-1.5 text-[17px] font-semibold text-navy">{suggested.model}</h3>
                <p className="mt-1 text-[13.5px] text-ink-muted">
                  {suggested.category} · {suggested.transmission} · {suggested.seats} seats. Enough ground clearance
                  for this route without drinking fuel.
                </p>
                <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
                  <span className="text-[13px] text-ink-muted">{days} days from {suggested.supplier}</span>
                  <span className="tnum text-[19px] font-bold text-navy">{money(suggested.total)}</span>
                </div>
                <Link
                  to={`/cars/car/${suggested.id}?place=${encodeURIComponent(route.from)}&days=${days}`}
                  className="btn-primary mt-3 w-full"
                >
                  See prices for this car
                </Link>
              </div>
            </div>
          )}

          <div className="card mt-4 p-5">
            <h3 className="text-[14.5px] font-semibold text-navy">Before you set off</h3>
            <ul className="mt-3 space-y-2.5 text-[13.5px] text-ink-muted">
              {[
                'Check the fuel policy — full to full is the only one worth having.',
                'Photograph the car from every angle at pick-up, including the roof.',
                'Carry the licence, an ID and a credit card in the main driver’s name.',
                `Best window for this route: ${route.season}.`,
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="card mt-4 p-5">
            <h3 className="text-[14.5px] font-semibold text-navy">Other routes</h3>
            <div className="mt-3 space-y-2">
              {ROAD_TRIP_ROUTES.filter((r) => r.id !== route.id).map((r) => (
                <Link
                  key={r.id}
                  to={`/road-trip?route=${r.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line px-3.5 py-2.5 text-[13.5px] transition-colors hover:border-indigo-300"
                >
                  <span className="font-medium text-navy">{r.title}</span>
                  <Icon name="chevronRight" size={15} className="shrink-0 text-ink-soft" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Line({ label, value, bold }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={bold ? 'font-semibold text-navy' : 'text-ink-muted'}>{label}</dt>
      <dd className={`tnum ${bold ? 'text-[18px] font-bold text-navy' : 'font-medium text-navy'}`}>{value}</dd>
    </div>
  )
}

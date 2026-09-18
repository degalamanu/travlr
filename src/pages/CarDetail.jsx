import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Photo from '../components/ui/Photo'
import Icon from '../components/ui/Icon'
import DragCarousel from '../components/ui/DragCarousel'
import CarCard from '../components/cards/CarCard'
import ProviderDrawer from '../components/results/ProviderDrawer'
import { Badge, EmptyState } from '../components/ui/Bits'
import { searchCars } from '../data/cars'
import { useMoney } from '../store/AppContext'

export default function CarDetail() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const place = params.get('place') || 'Goa'
  const days = Number(params.get('days') || 3)
  const driverAge = Number(params.get('age') || 30)
  const money = useMoney()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const all = useMemo(() => searchCars({ place, days, driverAge }), [place, days, driverAge])
  const car = all.find((c) => c.id === id)
  const similar = car ? all.filter((c) => c.id !== car.id && c.category === car.category).slice(0, 8) : []

  if (!car) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon="car"
          title="That car is no longer available"
          body="Fleet availability changes through the day. Here is everything we can hire in this city right now."
          action={
            <Link to={`/cars/results?place=${encodeURIComponent(place)}`} className="btn-primary">
              <Icon name="arrowLeft" size={16} /> Back to {place} cars
            </Link>
          }
        />
      </div>
    )
  }

  const included = [
    { ok: true, label: 'Third-party liability insurance' },
    { ok: car.mileage === 'Unlimited km', label: car.mileage },
    { ok: car.freeCancellation, label: car.freeCancellation ? 'Free cancellation up to 48 h before' : 'Cancellation fee applies' },
    { ok: true, label: `Fuel policy: ${car.fuelPolicy}` },
    { ok: car.instantConfirm, label: car.instantConfirm ? 'Instant confirmation' : 'Confirmed within 2 hours' },
    { ok: false, label: `Refundable deposit of ${money(car.deposit)} held at pick-up` },
  ]

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="shell py-4">
          <Link
            to={`/cars/results?place=${encodeURIComponent(place)}`}
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-muted transition-colors hover:text-indigo-700"
          >
            <Icon name="arrowLeft" size={16} />
            All cars in {place}
          </Link>
        </div>
      </div>

      <div className="shell grid gap-6 py-8 lg:grid-cols-[1fr_336px]">
        <div className="min-w-0 space-y-4">
          <div className="card overflow-hidden">
            <div className="grid sm:grid-cols-[1.2fr_1fr]">
              <Photo
                src={car.photoUrl}
                alt={car.model}
                kind="car"
                seed={car.id}
                shape={car.shape}
                body={car.body}
                ratio="aspect-square sm:aspect-[4/3]"
                eager
              />
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[24px] font-semibold text-navy">{car.model}</h1>
                  <span className="rounded-lg bg-canvas px-2 py-0.5 text-[12.5px] font-medium text-ink-muted">
                    {car.category}
                  </span>
                </div>
                <p className="mt-1 text-[13.5px] text-ink-soft">or a similar car from {car.supplier}</p>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                  {[
                    { icon: 'users', label: `${car.seats} seats` },
                    { icon: 'luggage', label: `${car.bags} bags` },
                    { icon: 'door', label: `${car.doors} doors` },
                    { icon: 'transmission', label: car.transmission },
                    { icon: 'fuel', label: car.fuel },
                    { icon: 'snow', label: 'Air conditioning' },
                  ].map((s) => (
                    <span key={s.label} className="flex items-center gap-2 text-[13.5px] text-ink-muted">
                      <Icon name={s.icon} size={16} className="text-ink-soft" />
                      {s.label}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {car.badge && <Badge tone="indigo">{car.badge}</Badge>}
                  {car.freeCancellation && <Badge tone="green" icon="check">Free cancellation</Badge>}
                  {car.fuel === 'Electric' && <Badge tone="green" icon="leaf">Zero tailpipe emissions</Badge>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="card p-5">
              <h2 className="text-[16px] font-semibold text-navy">What’s included</h2>
              <ul className="mt-3 space-y-2.5 text-[13.5px]">
                {included.map((i) => (
                  <li key={i.label} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                        i.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-canvas text-ink-soft'
                      }`}
                    >
                      <Icon name={i.ok ? 'check' : 'info'} size={14} />
                    </span>
                    <span className={i.ok ? 'text-navy' : 'text-ink-muted'}>{i.label}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card p-5">
              <h2 className="text-[16px] font-semibold text-navy">Pick-up and drop-off</h2>
              <dl className="mt-3 space-y-3 text-[13.5px]">
                <div>
                  <dt className="text-ink-soft">Collection</dt>
                  <dd className="font-medium text-navy">{car.pickup.label}</dd>
                  <dd className="text-ink-muted">{car.pickup.detail} · {car.place}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Return</dt>
                  <dd className="font-medium text-navy">{car.dropPlace}</dd>
                  {car.dropPlace !== car.place && (
                    <dd className="text-ink-muted">One-way fee already included in the price</dd>
                  )}
                </div>
                <div>
                  <dt className="text-ink-soft">Minimum driver age</dt>
                  <dd className="font-medium text-navy">{car.driverAgeMin} years</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Distance from the centre</dt>
                  <dd className="font-medium text-navy">{car.distanceFromCentre} km</dd>
                </div>
              </dl>
            </section>
          </div>

          <section className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-semibold text-navy">{car.supplier}</h2>
                <p className="mt-1 flex items-center gap-2 text-[13.5px] text-ink-muted">
                  <Icon name="star" size={14} filled className="text-gold" />
                  {car.supplierRating.toFixed(1)} from {car.supplierReviews.toLocaleString('en-IN')} hires ·{' '}
                  {car.pickup.label}
                </p>
              </div>
              <Link to="/help/trust" className="btn-outline btn-sm">
                How we vet suppliers
              </Link>
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">
              Bring your licence, a photo ID and a credit card in the main driver’s name. The deposit is released when
              the car comes back in the same condition, usually within 5–7 working days.
            </p>
          </section>

          <section className="card p-5">
            <h2 className="text-[16px] font-semibold text-navy">All {car.providers.length} prices for this car</h2>
            <ul className="mt-3 divide-y divide-line">
              {car.providers.map((p, i) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14.5px] font-medium text-navy">{p.name}</span>
                      {i === 0 && <Badge tone="indigo">Cheapest</Badge>}
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-ink-soft">{p.note}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tnum text-[17px] font-bold text-navy">{money(p.price)}</span>
                    <button type="button" onClick={() => setDrawerOpen(true)} className="btn-outline btn-sm">
                      Continue
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-[120px] lg:h-fit">
          <div className="card p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[13.5px] text-ink-muted">
                {money(car.pricePerDay)} × {days} {days === 1 ? 'day' : 'days'}
              </span>
              <span className="tnum text-[15px] font-semibold text-navy">{money(car.total)}</span>
            </div>
            {driverAge < 25 && (
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[13.5px] text-ink-muted">Young-driver fee</span>
                <span className="text-[13px] font-medium text-emerald-700">already included</span>
              </div>
            )}
            <div className="mt-3 border-t border-line pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] font-semibold text-navy">Total hire</span>
                <span className="tnum text-[24px] font-bold text-navy">{money(car.total)}</span>
              </div>
              <p className="mt-1 text-[12px] text-ink-soft">
                Plus a refundable {money(car.deposit)} deposit at the desk.
              </p>
            </div>
            <button type="button" onClick={() => setDrawerOpen(true)} className="btn-primary btn-lg mt-4 w-full">
              Compare {car.providers.length} prices
              <Icon name="arrowRight" size={16} />
            </button>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-canvas px-3 py-2.5 text-[12px] leading-relaxed text-ink-muted">
              <Icon name="shield" size={14} className="mt-0.5 shrink-0 text-indigo-600" />
              Travlr takes no payment. You pay the hire company, on their terms, with their cancellation policy.
            </p>
          </div>

          <div className="card mt-4 p-5">
            <h3 className="text-[14.5px] font-semibold text-navy">Going further afield?</h3>
            <p className="mt-1.5 text-[13px] text-ink-muted">
              Plan the route first and we’ll tell you whether this car is right for those roads.
            </p>
            <Link to={`/road-trip?start=${encodeURIComponent(place)}`} className="btn-outline mt-3 w-full">
              <Icon name="sparkles" size={16} /> Plan a road trip
            </Link>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="shell pb-12">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-semibold text-navy">Similar {car.category.toLowerCase()} cars</h2>
              <p className="mt-1 text-[13.5px] text-ink-muted">Same dates, same pick-up point.</p>
            </div>
            <Link to={`/cars/results?place=${encodeURIComponent(place)}`} className="btn-outline btn-sm">
              See all <Icon name="arrowRight" size={15} />
            </Link>
          </div>
          <DragCarousel itemClass="w-[252px]" label="Similar cars">
            {similar.map((c) => (
              <CarCard key={c.id} car={c} to={`/cars/car/${c.id}?place=${encodeURIComponent(place)}&days=${days}&age=${driverAge}`} />
            ))}
          </DragCarousel>
        </section>
      )}

      <ProviderDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`${car.model} · ${car.supplier}`}
        subtitle={`${days} ${days === 1 ? 'day' : 'days'} · ${car.pickup.label} · ${car.mileage}`}
        providers={car.providers}
        unit={`total for ${days} ${days === 1 ? 'day' : 'days'}`}
      />
    </>
  )
}

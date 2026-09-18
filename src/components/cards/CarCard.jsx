import { Link } from 'react-router-dom'
import Photo from '../ui/Photo'
import Icon from '../ui/Icon'
import { Badge } from '../ui/Bits'
import { useMoney } from '../../store/AppContext'

function Spec({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted">
      <Icon name={icon} size={14} className="text-ink-soft" />
      {children}
    </span>
  )
}

/** Square photo card, as the brief asks for. */
export default function CarCard({ car, to, onSelect, layout = 'grid' }) {
  const money = useMoney()

  if (layout === 'row') {
    return (
      <article className="card overflow-hidden transition-colors hover:border-line-strong">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-[240px] sm:shrink-0">
            <Photo
              src={car.photoUrl}
              alt={car.model}
              kind="car"
              seed={car.id}
              shape={car.shape}
              body={car.body}
              art="square"
        ratio="aspect-square"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:flex-row">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link to={to} className="text-[17px] font-semibold text-navy transition-colors hover:text-indigo-700">
                  {car.model}
                </Link>
                <span className="rounded-lg bg-canvas px-2 py-0.5 text-[12px] font-medium text-ink-muted">{car.category}</span>
                {car.badge && <Badge tone="indigo" icon={car.badge === 'Cheapest' ? 'tag' : 'star'}>{car.badge}</Badge>}
              </div>
              <p className="mt-0.5 text-[13px] text-ink-soft">or similar</p>

              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:max-w-sm">
                <Spec icon="users">{car.seats} seats</Spec>
                <Spec icon="luggage">{car.bags} bags</Spec>
                <Spec icon="transmission">{car.transmission}</Spec>
                <Spec icon="door">{car.doors} doors</Spec>
                <Spec icon="fuel">{car.fuel}</Spec>
                <Spec icon="snow">Air conditioning</Spec>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {car.freeCancellation && <Badge tone="green" icon="check">Free cancellation</Badge>}
                <Badge tone="plain" icon="route">{car.mileage}</Badge>
                <Badge tone="plain" icon="fuel">{car.fuelPolicy}</Badge>
              </div>
            </div>

            <div className="flex shrink-0 items-end justify-between gap-3 border-t border-line pt-3 sm:w-[190px] sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 text-[12.5px] text-ink-muted">
                  <span className="font-medium text-navy">{car.supplier}</span>
                  <Icon name="star" size={12} filled className="text-gold" />
                  {car.supplierRating.toFixed(1)}
                </div>
                <div className="mt-0.5 text-[12px] text-ink-soft">{car.pickup.label}</div>
                <div className="tnum mt-2 text-[21px] font-bold leading-none text-navy">{money(car.pricePerDay)}</div>
                <div className="mt-1 text-[12px] text-ink-soft">per day · {money(car.total)} total</div>
              </div>
              <div className="flex w-full flex-col gap-2">
                <button type="button" onClick={() => onSelect?.(car)} className="btn-primary w-full">
                  See {car.providers.length} prices
                </button>
                <Link
                  to={to}
                  className="text-right text-[12.5px] text-ink-muted underline decoration-line-strong underline-offset-2 transition-colors hover:text-indigo-700"
                >
                  What’s included
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <Link to={to} className="card group block overflow-hidden transition-all duration-200 hover:border-indigo-300 hover:shadow-lift">
      <Photo
        src={car.photoUrl}
        alt={car.model}
        kind="car"
        seed={car.id}
        shape={car.shape}
        body={car.body}
        art="square"
        ratio="aspect-square"
      >
        {car.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-navy px-2.5 py-1 text-[11.5px] font-semibold text-white">
            {car.badge}
          </span>
        )}
      </Photo>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-[15.5px] font-semibold text-navy transition-colors group-hover:text-indigo-700">
            {car.model}
          </h3>
          <span className="shrink-0 rounded-lg bg-canvas px-2 py-0.5 text-[11.5px] font-medium text-ink-muted">
            {car.category}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          <Spec icon="users">{car.seats}</Spec>
          <Spec icon="luggage">{car.bags}</Spec>
          <Spec icon="transmission">{car.transmission}</Spec>
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
          <span className="text-[12.5px] text-ink-muted">{car.supplier}</span>
          <span className="text-right">
            <span className="tnum block text-[17px] font-bold leading-none text-navy">{money(car.pricePerDay)}</span>
            <span className="text-[11.5px] text-ink-soft">per day</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

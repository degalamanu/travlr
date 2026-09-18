import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import PhotoGallery from '../ui/PhotoGallery'
import { Badge, ReviewScore, Stars } from '../ui/Bits'
import { useMoney } from '../../store/AppContext'
import { reviewWord } from '../../lib/format'

export function HotelCardGrid({ hotel, to }) {
  const money = useMoney()
  return (
    <Link to={to} className="card group block overflow-hidden transition-all duration-200 hover:border-indigo-300 hover:shadow-lift">
      <PhotoGallery photos={hotel.photos} alt={hotel.name} seed={hotel.id} kind="hotel" ratio="aspect-[4/3]">
        {hotel.deal && (
          <span className="absolute left-3 top-3 rounded-full bg-navy px-2.5 py-1 text-[11.5px] font-semibold text-white">
            {hotel.deal}
          </span>
        )}
      </PhotoGallery>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-[15.5px] font-semibold text-navy transition-colors group-hover:text-indigo-700">
            {hotel.name}
          </h3>
          <Stars count={hotel.stars} />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-muted">
          <Icon name="pin" size={13} />
          {hotel.area} · {hotel.distanceKm} km from centre
        </p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="flex items-center gap-2">
            <ReviewScore score={hotel.reviewScore} size="sm" />
            <span className="text-[12.5px] leading-tight text-ink-muted">
              <span className="block font-medium text-navy">{reviewWord(hotel.reviewScore)}</span>
              {hotel.reviewCount.toLocaleString('en-IN')} reviews
            </span>
          </div>
          <div className="text-right">
            {hotel.strikePrice && (
              <div className="tnum text-[12px] text-ink-soft line-through">{money(hotel.strikePrice)}</div>
            )}
            <div className="tnum text-[18px] font-bold leading-none text-navy">{money(hotel.pricePerNight)}</div>
            <div className="text-[11.5px] text-ink-soft">per night</div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function HotelCardRow({ hotel, to, onSelect, onHover }) {
  const money = useMoney()
  const total = hotel.pricePerNight * hotel.nights
  return (
    <article
      onMouseEnter={() => onHover?.(hotel.id)}
      onMouseLeave={() => onHover?.(null)}
      className="card overflow-hidden transition-colors hover:border-line-strong"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-[248px] sm:shrink-0">
          <PhotoGallery photos={hotel.photos} alt={hotel.name} seed={hotel.id} kind="hotel" ratio="aspect-[16/10] sm:aspect-auto sm:h-full" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:flex-row">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link to={to} className="text-[17px] font-semibold text-navy transition-colors hover:text-indigo-700">
                {hotel.name}
              </Link>
              <Stars count={hotel.stars} />
              <span className="text-[12.5px] text-ink-soft">· {hotel.type}</span>
            </div>

            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[13px] text-ink-muted">
              <Icon name="pin" size={13} />
              {hotel.area}, {hotel.city}
              <span className="text-ink-soft">· {hotel.distanceKm} km from centre</span>
            </p>

            <p className="mt-2.5 text-[13.5px] text-ink-muted">{hotel.highlight}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {hotel.amenities.slice(0, 4).map((a) => (
                <span key={a} className="rounded-lg bg-canvas px-2 py-1 text-[12px] text-ink-muted">{a}</span>
              ))}
              {hotel.amenities.length > 4 && (
                <span className="rounded-lg px-2 py-1 text-[12px] text-ink-soft">+{hotel.amenities.length - 4} more</span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {hotel.freeCancellation && <Badge tone="green" icon="check">Free cancellation</Badge>}
              {hotel.breakfast && <Badge tone="indigo" icon="coffee">Breakfast included</Badge>}
              {hotel.payAtStay && <Badge tone="plain" icon="wallet">Pay at the property</Badge>}
            </div>
          </div>

          <div className="flex shrink-0 items-end justify-between gap-3 border-t border-line pt-3 sm:w-[184px] sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
            <div className="flex items-center gap-2 sm:flex-row-reverse">
              <ReviewScore score={hotel.reviewScore} />
              <span className="text-[12.5px] leading-tight text-ink-muted sm:text-right">
                <span className="block font-medium text-navy">{reviewWord(hotel.reviewScore)}</span>
                {hotel.reviewCount.toLocaleString('en-IN')} reviews
              </span>
            </div>

            <div className="text-right">
              {hotel.strikePrice && (
                <div className="tnum text-[12.5px] text-ink-soft line-through">{money(hotel.strikePrice)}</div>
              )}
              <div className="tnum text-[21px] font-bold leading-none text-navy">{money(hotel.pricePerNight)}</div>
              <div className="mt-1 text-[12px] text-ink-soft">
                per night · {money(total)} total
              </div>
              <button type="button" onClick={() => onSelect?.(hotel)} className="btn-primary mt-2.5 w-full">
                See {hotel.providers.length} prices
              </button>
              <Link
                to={to}
                className="mt-2 block text-[12.5px] text-ink-muted underline decoration-line-strong underline-offset-2 transition-colors hover:text-indigo-700"
              >
                Rooms & photos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

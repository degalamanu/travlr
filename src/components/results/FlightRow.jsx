import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import { Badge } from '../ui/Bits'
import AlertButton from './AlertButton'
import DragCarousel from '../ui/DragCarousel'
import { useMoney } from '../../store/AppContext'
import { duration, minsToTime } from '../../lib/format'

export function AirlineMark({ airline, size = 38 }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl text-[12px] font-bold text-white"
      style={{ background: airline.tint, width: size, height: size }}
      aria-hidden="true"
    >
      {airline.code}
    </span>
  )
}

export function StopLine({ stops, durationMins, stopAt }) {
  return (
    <div className="flex flex-1 flex-col items-center px-2">
      <span className="tnum text-[12px] text-ink-muted">{duration(durationMins)}</span>
      <div className="relative my-1.5 h-px w-full bg-line-strong">
        {stops > 0 &&
          Array.from({ length: stops }).map((_, i) => (
            <span
              key={i}
              className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-indigo-600"
              style={{ left: `${((i + 1) / (stops + 1)) * 100}%` }}
            />
          ))}
        <span className="absolute -right-0.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-line-strong bg-white" />
      </div>
      <span className={`text-[12px] ${stops === 0 ? 'font-medium text-emerald-700' : 'text-ink-muted'}`}>
        {stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}${stopAt?.length ? ` · ${stopAt.join(', ')}` : ''}`}
      </span>
    </div>
  )
}

export default function FlightRow({ offer, onSelect, searchQS }) {
  const money = useMoney()
  const detailTo = `/flights/offer/${offer.id}?${searchQS}`

  return (
    <article className="card overflow-hidden transition-colors hover:border-line-strong">
      {offer.badge && (
        <div className="flex items-center gap-2 border-b border-line bg-indigo-50/60 px-4 py-1.5 text-[12px] font-semibold text-indigo-800">
          <Icon name={offer.badge === 'Fastest' ? 'clock' : offer.badge === 'Cheapest' ? 'tag' : 'sparkles'} size={13} />
          {offer.badge}
          {offer.badge === 'Best' && <span className="font-normal text-indigo-700/80">— our pick on price and time</span>}
        </div>
      )}

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <AirlineMark airline={offer.airline} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[14px] font-medium text-navy">{offer.airline.name}</span>
                <span className="text-[12.5px] text-ink-soft">{offer.flightNo}</span>
                {offer.selfTransfer && (
                  <span className="text-[12px] font-medium text-amber-700">Self-transfer</span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-1">
                <div className="text-left">
                  <div className="tnum text-[19px] font-semibold leading-none text-navy">{minsToTime(offer.depart)}</div>
                  <div className="mt-1 text-[12.5px] text-ink-muted">{offer.from}</div>
                </div>
                <StopLine stops={offer.stops} durationMins={offer.durationMins} stopAt={offer.stopAt} />
                <div className="text-right">
                  <div className="tnum text-[19px] font-semibold leading-none text-navy">
                    {minsToTime(offer.arrive)}
                    {offer.dayOffset > 0 && <sup className="ml-0.5 text-[11px] font-medium text-coral">+{offer.dayOffset}</sup>}
                  </div>
                  <div className="mt-1 text-[12.5px] text-ink-muted">{offer.to}</div>
                </div>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-soft">
                <span className="inline-flex items-center gap-1">
                  <Icon name="luggage" size={13} /> {offer.baggage.checked === 'Not included' ? 'Cabin bag only' : `${offer.baggage.checked} checked`}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="leaf" size={13} />
                  {offer.co2} kg CO₂
                  {offer.co2Delta < -8 && <span className="text-emerald-700">{offer.co2Delta}% vs typical</span>}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="clock" size={13} /> {offer.onTime}% on time
                </span>
              </div>
            </div>
          </div>

          {/* Mobile: swipeable provider stack */}
          <div className="mt-3.5 sm:hidden">
            <DragCarousel itemClass="w-[168px]" gap="gap-2" arrows={false} label="Provider prices">
              {offer.providers.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelect(offer)}
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-left transition-colors hover:border-indigo-300"
                >
                  <div className="truncate text-[12.5px] text-ink-muted">{p.name}</div>
                  <div className="tnum mt-0.5 text-[16px] font-bold text-navy">{money(p.price)}</div>
                </button>
              ))}
            </DragCarousel>
          </div>
        </div>

        <div className="flex shrink-0 items-end justify-between gap-3 border-t border-line pt-3 sm:w-[190px] sm:flex-col sm:items-stretch sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <div className="text-left sm:text-right">
            <div className="tnum text-[22px] font-bold leading-none text-navy">{money(offer.price)}</div>
            <div className="mt-1 text-[12px] text-ink-soft">
              {offer.passengers > 1 ? `total for ${offer.passengers}` : 'per traveller'} · {offer.providers[0].name}
            </div>
            {offer.seatsLeft && (
              <div className="mt-1.5 text-[12px] font-medium text-coral">Only {offer.seatsLeft} seats left</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <AlertButton
              compact
              alert={{
                id: `flight:${offer.from}-${offer.to}`,
                kind: 'flight',
                title: `${offer.from} → ${offer.to}`,
                price: offer.price,
                to: `/flights/results?${searchQS}`,
              }}
            />
            <button type="button" onClick={() => onSelect(offer)} className="btn-primary flex-1 sm:w-full">
              Select
            </button>
          </div>
          <Link
            to={detailTo}
            className="hidden text-right text-[12.5px] text-ink-muted underline decoration-line-strong underline-offset-2 transition-colors hover:text-indigo-700 sm:block"
          >
            Flight details & fare rules
          </Link>
        </div>
      </div>
    </article>
  )
}

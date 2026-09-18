import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AirlineMark } from '../components/results/FlightRow'
import ProviderDrawer from '../components/results/ProviderDrawer'
import AlertButton from '../components/results/AlertButton'
import Icon from '../components/ui/Icon'
import { Badge, EmptyState } from '../components/ui/Bits'
import { searchFlights } from '../data/flights'
import { AIRPORT_MAP } from '../data/places'
import { duration, formatDateLong, minsToTime } from '../lib/format'
import { useMoney } from '../store/AppContext'

export default function FlightDetail() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const money = useMoney()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const query = useMemo(
    () => ({
      from: params.get('from') || 'BLR',
      to: params.get('to') || 'DEL',
      depart: params.get('depart') || '',
      ret: params.get('ret') || '',
      cabin: params.get('cabin') || 'economy',
      adults: Number(params.get('adults') || 1),
      children: Number(params.get('children') || 0),
      infants: Number(params.get('infants') || 0),
      directOnly: params.get('direct') === '1',
      bags: Number(params.get('bags') || 0),
    }),
    [params]
  )

  const offer = useMemo(() => searchFlights(query).find((o) => o.id === id), [query, id])
  const backTo = `/flights/results?${params.toString()}`

  if (!offer) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon="plane"
          title="This fare is no longer on sale"
          body="Fares expire quickly. Run the search again and we’ll show you what is available right now."
          action={
            <Link to={backTo} className="btn-primary">
              <Icon name="refresh" size={16} /> Back to results
            </Link>
          }
        />
      </div>
    )
  }

  const passengers = query.adults + query.children
  const perTraveller = offer.price
  const taxes = Math.round(perTraveller * 0.18)
  const bagFee = query.bags ? query.bags * 1500 : 0

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="shell py-4">
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-muted transition-colors hover:text-indigo-700"
          >
            <Icon name="arrowLeft" size={16} />
            Back to all {AIRPORT_MAP[offer.from]?.city} → {AIRPORT_MAP[offer.to]?.city} flights
          </button>
        </div>
      </div>

      <div className="shell grid gap-6 py-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-4">
          <div className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AirlineMark airline={offer.airline} size={44} />
                <div>
                  <h1 className="text-[22px] font-semibold text-navy">
                    {AIRPORT_MAP[offer.from]?.city} → {AIRPORT_MAP[offer.to]?.city}
                  </h1>
                  <p className="mt-1 text-[13.5px] text-ink-muted">
                    {offer.airline.name} · {offer.cabinLabel} · {formatDateLong(query.depart)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {offer.badge && <Badge tone="indigo">{offer.badge}</Badge>}
                {offer.stops === 0 && <Badge tone="green">Direct</Badge>}
                {offer.selfTransfer && <Badge tone="coral">Self-transfer</Badge>}
              </div>
            </div>

            {/* Timeline */}
            <ol className="mt-6 space-y-0">
              {offer.legs.map((l, i) => (
                <li key={i}>
                  <div className="flex gap-4">
                    <div className="flex w-14 shrink-0 flex-col items-end pt-0.5">
                      <span className="tnum text-[15px] font-semibold text-navy">{minsToTime(l.depart)}</span>
                    </div>
                    <div className="relative flex w-4 shrink-0 justify-center">
                      <span className="absolute top-2 h-2.5 w-2.5 rounded-full border-2 border-indigo-600 bg-white" />
                      <span className="mt-4 w-px flex-1 bg-line-strong" />
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="text-[15px] font-medium text-navy">
                        {AIRPORT_MAP[l.from]?.city} <span className="text-ink-soft">({l.from})</span>
                      </div>
                      <div className="text-[13px] text-ink-muted">{AIRPORT_MAP[l.from]?.name}</div>
                      <div className="mt-3 rounded-xl bg-canvas px-3.5 py-2.5 text-[13px] text-ink-muted">
                        <span className="font-medium text-navy">{l.flightNo}</span> · {duration(l.durationMins)} ·{' '}
                        {l.aircraft}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex w-14 shrink-0 flex-col items-end">
                      <span className="tnum text-[15px] font-semibold text-navy">{minsToTime(l.arrive)}</span>
                    </div>
                    <div className="relative flex w-4 shrink-0 justify-center">
                      <span className="absolute top-2 h-2.5 w-2.5 rounded-full border-2 border-navy bg-navy" />
                      {i < offer.legs.length - 1 && <span className="mt-4 w-px flex-1 bg-line-strong" />}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="text-[15px] font-medium text-navy">
                        {AIRPORT_MAP[l.to]?.city} <span className="text-ink-soft">({l.to})</span>
                      </div>
                      <div className="text-[13px] text-ink-muted">{AIRPORT_MAP[l.to]?.name}</div>
                      {i < offer.legs.length - 1 && (
                        <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-line-strong px-3.5 py-2.5 text-[13px] text-ink-muted">
                          <Icon name="clock" size={14} />
                          Change planes in {AIRPORT_MAP[l.to]?.city}
                          {offer.selfTransfer && <span className="text-amber-700">· collect bags and check in again</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <h2 className="text-[15.5px] font-semibold text-navy">What’s included</h2>
              <ul className="mt-3 space-y-2.5 text-[13.5px]">
                <Included ok icon="luggage">Cabin bag {offer.baggage.cabin}</Included>
                <Included ok={offer.baggage.checked !== 'Not included'} icon="bag">
                  Checked bag {offer.baggage.checked === 'Not included' ? 'not included' : offer.baggage.checked}
                </Included>
                <Included ok={offer.providers[0].refundable} icon="refresh">
                  {offer.providers[0].refundable ? 'Refundable fare' : 'Non-refundable fare'}
                </Included>
                <Included ok={offer.providers[0].freeChanges} icon="calendar">
                  {offer.providers[0].freeChanges ? 'Free date changes' : 'Date changes carry a fee'}
                </Included>
                <Included ok icon="ticket">Seat assigned at check-in</Included>
              </ul>
            </div>

            <div className="card p-5">
              <h2 className="text-[15.5px] font-semibold text-navy">Good to know</h2>
              <dl className="mt-3 space-y-2.5 text-[13.5px]">
                <Row label="On-time record">{offer.onTime}% of flights in the last 60 days</Row>
                <Row label="Carbon">
                  {offer.co2} kg per traveller
                  {offer.co2Delta < 0 && <span className="text-emerald-700"> · {Math.abs(offer.co2Delta)}% below average</span>}
                </Row>
                <Row label="Aircraft">{offer.legs[0].aircraft}</Row>
                <Row label="Cabin">{offer.cabinLabel}</Row>
                {offer.seatsLeft && <Row label="Availability">Only {offer.seatsLeft} seats left at this price</Row>}
              </dl>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-[15.5px] font-semibold text-navy">All {offer.providers.length} prices for this flight</h2>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              Same seats, different sellers. Prices include taxes; extras are listed per provider.
            </p>
            <ul className="mt-4 divide-y divide-line">
              {offer.providers.map((p, i) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                  <div className="min-w-0">
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
          </div>
        </div>

        {/* Sticky summary */}
        <aside className="lg:sticky lg:top-[120px] lg:h-fit">
          <div className="card p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[13.5px] text-ink-muted">Fare per traveller</span>
              <span className="tnum text-[15px] font-semibold text-navy">{money(perTraveller - taxes)}</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-[13.5px] text-ink-muted">Taxes and charges</span>
              <span className="tnum text-[15px] text-navy">{money(taxes)}</span>
            </div>
            {bagFee > 0 && (
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[13.5px] text-ink-muted">{query.bags} checked bag{query.bags > 1 ? 's' : ''}</span>
                <span className="tnum text-[15px] text-navy">{money(bagFee)}</span>
              </div>
            )}
            <div className="mt-3 border-t border-line pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] font-semibold text-navy">
                  Total{passengers > 1 ? ` for ${passengers}` : ''}
                </span>
                <span className="tnum text-[24px] font-bold text-navy">{money(perTraveller * passengers + bagFee)}</span>
              </div>
              <p className="mt-1 text-[12px] text-ink-soft">Charged by {offer.providers[0].name}, not by Travlr.</p>
            </div>

            <button type="button" onClick={() => setDrawerOpen(true)} className="btn-primary btn-lg mt-4 w-full">
              Compare {offer.providers.length} providers
              <Icon name="arrowRight" size={16} />
            </button>

            <div className="mt-3">
              <AlertButton
                alert={{
                  id: `flight:${offer.from}-${offer.to}`,
                  kind: 'flight',
                  title: `${AIRPORT_MAP[offer.from]?.city} → ${AIRPORT_MAP[offer.to]?.city}`,
                  price: offer.price,
                  to: backTo,
                }}
              />
            </div>

            <p className="mt-4 flex items-start gap-2 rounded-xl bg-canvas px-3 py-2.5 text-[12px] leading-relaxed text-ink-muted">
              <Icon name="shield" size={14} className="mt-0.5 shrink-0 text-indigo-600" />
              Travlr takes no payment and adds no fee. Your booking and your ticket sit with the provider you choose.
            </p>
          </div>

          <div className="card mt-4 p-5">
            <h3 className="text-[14.5px] font-semibold text-navy">Complete the trip</h3>
            <div className="mt-3 space-y-2">
              <Link to={`/stays/results?place=${encodeURIComponent(AIRPORT_MAP[offer.to]?.city || '')}`} className="btn-outline w-full justify-start">
                <Icon name="bed" size={16} /> Hotels in {AIRPORT_MAP[offer.to]?.city}
              </Link>
              <Link to={`/cars/results?place=${encodeURIComponent(AIRPORT_MAP[offer.to]?.city || '')}`} className="btn-outline w-full justify-start">
                <Icon name="car" size={16} /> Car hire at {offer.to}
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <ProviderDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`${offer.airline.name} · ${offer.from} → ${offer.to}`}
        subtitle={`${duration(offer.durationMins)} · ${formatDateLong(query.depart)}`}
        providers={offer.providers}
        unit={passengers > 1 ? 'total' : 'per traveller'}
      />
    </>
  )
}

function Included({ ok, icon, children }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-canvas text-ink-soft'}`}>
        <Icon name={ok ? 'check' : icon} size={14} />
      </span>
      <span className={ok ? 'text-navy' : 'text-ink-muted'}>{children}</span>
    </li>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-medium text-navy">{children}</dd>
    </div>
  )
}

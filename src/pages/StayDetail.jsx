import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Photo from '../components/ui/Photo'
import PhotoGallery from '../components/ui/PhotoGallery'
import DragCarousel from '../components/ui/DragCarousel'
import ProviderDrawer from '../components/results/ProviderDrawer'
import { HotelCardGrid } from '../components/cards/HotelCard'
import { Badge, EmptyState, ReviewScore, Stars } from '../components/ui/Bits'
import { searchStays } from '../data/stays'
import { reviewWord } from '../lib/format'
import { useMoney } from '../store/AppContext'

const AMENITY_ICONS = {
  'Free Wi-Fi': 'wifi',
  'Swimming pool': 'pool',
  'Airport shuttle': 'car',
  Restaurant: 'coffee',
  'Fitness centre': 'gym',
  Spa: 'spa',
  'Free parking': 'parking',
  'Rooftop bar': 'coffee',
  'Room service': 'bell',
  'Pet friendly': 'heart',
  'Business centre': 'bag',
  Laundry: 'refresh',
  'Air conditioning': 'snow',
  'Breakfast buffet': 'coffee',
  'EV charging': 'fuel',
}

export default function StayDetail() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const place = params.get('place') || 'Goa'
  const nights = Number(params.get('nights') || 3)
  const money = useMoney()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const all = useMemo(() => searchStays({ place, nights }), [place, nights])
  const hotel = all.find((h) => h.id === id)
  const others = all.filter((h) => h.id !== id).slice(0, 8)

  if (!hotel) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon="bed"
          title="We can’t find that property"
          body="It may have been removed by the provider. Here is everything else we compare in this destination."
          action={
            <Link to={`/stays/results?place=${encodeURIComponent(place)}`} className="btn-primary">
              <Icon name="arrowLeft" size={16} /> Back to {place} stays
            </Link>
          }
        />
      </div>
    )
  }

  const total = hotel.pricePerNight * nights
  const taxes = Math.round(total * 0.12)

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="shell py-4">
          <Link
            to={`/stays/results?place=${encodeURIComponent(place)}`}
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-muted transition-colors hover:text-indigo-700"
          >
            <Icon name="arrowLeft" size={16} />
            All stays in {place}
          </Link>
        </div>
      </div>

      <div className="shell py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[27px] font-semibold text-navy">{hotel.name}</h1>
              <Stars count={hotel.stars} size={15} />
            </div>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[14px] text-ink-muted">
              <Icon name="pin" size={15} />
              {hotel.address}
              <span className="text-ink-soft">· {hotel.distanceKm} km from the centre</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ReviewScore score={hotel.reviewScore} />
            <span className="text-[13px] leading-tight text-ink-muted">
              <span className="block font-semibold text-navy">{reviewWord(hotel.reviewScore)}</span>
              {hotel.reviewCount.toLocaleString('en-IN')} reviews
            </span>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-5 grid gap-2 sm:grid-cols-[2fr_1fr]">
          <div className="overflow-hidden rounded-2xl">
            <PhotoGallery photos={hotel.photos} alt={hotel.name} seed={hotel.id} kind="hotel" ratio="aspect-[16/10]" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            {hotel.photos.slice(1, 3).map((p, i) => (
              <div key={p.id + i} className="overflow-hidden rounded-2xl">
                <Photo src={p.url} alt={`${hotel.name} photo`} kind="hotel" seed={`${hotel.id}-x${i}`} ratio="aspect-[16/10] sm:aspect-[16/9.4]" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_336px]">
          <div className="min-w-0 space-y-4">
            <section className="card p-5">
              <h2 className="text-[17px] font-semibold text-navy">About this {hotel.type.toLowerCase()}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-muted">
                {hotel.highlight}. A {hotel.stars}-star {hotel.type.toLowerCase()} in {hotel.area}, about{' '}
                {hotel.distanceKm} km from the centre of {hotel.city}. Guests rate it {hotel.reviewScore} out of 10,
                with {hotel.reviewCount.toLocaleString('en-IN')} reviews across the providers we compare.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {hotel.freeCancellation && <Badge tone="green" icon="check">Free cancellation</Badge>}
                {hotel.breakfast && <Badge tone="indigo" icon="coffee">Breakfast included</Badge>}
                {hotel.payAtStay && <Badge tone="plain" icon="wallet">Pay at the property</Badge>}
                {hotel.deal && <Badge tone="gold" icon="tag">{hotel.deal}</Badge>}
              </div>
            </section>

            <section className="card p-5">
              <h2 className="text-[17px] font-semibold text-navy">Facilities</h2>
              <div className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {hotel.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-2.5 text-[14px] text-ink-muted">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Icon name={AMENITY_ICONS[a] || 'check'} size={15} />
                    </span>
                    {a}
                  </span>
                ))}
              </div>
            </section>

            <section className="card overflow-hidden">
              <div className="border-b border-line p-5">
                <h2 className="text-[17px] font-semibold text-navy">Rooms for your dates</h2>
                <p className="mt-1 text-[13.5px] text-ink-muted">
                  Prices are per night for {nights} {nights === 1 ? 'night' : 'nights'}, including taxes where the
                  provider supplies them.
                </p>
              </div>
              <ul className="divide-y divide-line">
                {hotel.rooms.map((r) => (
                  <li key={r.name} className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-medium text-navy">{r.name}</h3>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[13px] text-ink-muted">
                        <span className="inline-flex items-center gap-1.5"><Icon name="bed" size={14} /> {r.bed}</span>
                        <span className="inline-flex items-center gap-1.5"><Icon name="grid" size={14} /> {r.size}</span>
                        <span className={r.refundable ? 'text-emerald-700' : 'text-ink-soft'}>
                          {r.refundable ? 'Free cancellation' : 'Non-refundable'}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-right">
                        <span className="tnum block text-[18px] font-bold leading-none text-navy">{money(r.price)}</span>
                        <span className="text-[11.5px] text-ink-soft">per night</span>
                      </span>
                      <button type="button" onClick={() => setDrawerOpen(true)} className="btn-primary btn-sm">
                        See prices
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[17px] font-semibold text-navy">What guests say</h2>
                <span className="flex items-center gap-2">
                  <ReviewScore score={hotel.reviewScore} size="sm" />
                  <span className="text-[13px] text-ink-muted">{reviewWord(hotel.reviewScore)}</span>
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {hotel.reviewsSample.map((r, i) => (
                  <li key={i} className="rounded-xl bg-canvas p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-[13px] font-bold text-white">
                        {r.name.slice(0, 1)}
                      </span>
                      <span className="text-[14px] font-medium text-navy">{r.name}</span>
                      <span className="tnum ml-auto rounded-lg bg-white px-2 py-0.5 text-[13px] font-bold text-navy">
                        {r.score.toFixed(1)}
                      </span>
                    </div>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-ink-muted">“{r.text}”</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12.5px] text-ink-soft">
                Reviews are aggregated from the providers we compare and shown as a weighted average.
              </p>
            </section>

            <section className="card overflow-hidden">
              <div className="p-5 pb-0">
                <h2 className="text-[17px] font-semibold text-navy">Where it is</h2>
                <p className="mt-1 text-[13.5px] text-ink-muted">
                  {hotel.area}, {hotel.city} · {hotel.distanceKm} km from the centre
                </p>
              </div>
              <div className="map-canvas relative mt-4 h-56 border-t border-line">
                <span
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600 px-3 py-1.5 text-[12.5px] font-bold text-white shadow-lift"
                  style={{ left: `${hotel.mapX}%`, top: `${hotel.mapY}%` }}
                >
                  {hotel.name.split(' ')[0]}
                </span>
              </div>
            </section>
          </div>

          {/* Sticky price card */}
          <aside className="lg:sticky lg:top-[120px] lg:h-fit">
            <div className="card p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[13.5px] text-ink-muted">
                  {money(hotel.pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}
                </span>
                <span className="tnum text-[15px] font-semibold text-navy">{money(total)}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[13.5px] text-ink-muted">Taxes and fees</span>
                <span className="tnum text-[15px] text-navy">{money(taxes)}</span>
              </div>
              <div className="mt-3 border-t border-line pt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[14px] font-semibold text-navy">Total stay</span>
                  <span className="tnum text-[24px] font-bold text-navy">{money(total + taxes)}</span>
                </div>
                <p className="mt-1 text-[12px] text-ink-soft">
                  Cheapest with {hotel.providers[0].name} · {hotel.providers.length} providers compared
                </p>
              </div>
              <button type="button" onClick={() => setDrawerOpen(true)} className="btn-primary btn-lg mt-4 w-full">
                Compare {hotel.providers.length} prices
                <Icon name="arrowRight" size={16} />
              </button>
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-canvas px-3 py-2.5 text-[12px] leading-relaxed text-ink-muted">
                <Icon name="shield" size={14} className="mt-0.5 shrink-0 text-indigo-600" />
                You book on the provider’s site. Travlr adds no fee and never holds your card details.
              </p>
            </div>

            <div className="card mt-4 p-5">
              <h3 className="text-[14.5px] font-semibold text-navy">Complete the trip</h3>
              <div className="mt-3 space-y-2">
                <Link to={`/flights?to=${encodeURIComponent(hotel.city)}`} className="btn-outline w-full justify-start">
                  <Icon name="plane" size={16} /> Flights to {hotel.city}
                </Link>
                <Link to={`/cars/results?place=${encodeURIComponent(hotel.city)}`} className="btn-outline w-full justify-start">
                  <Icon name="car" size={16} /> Car hire in {hotel.city}
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Other properties */}
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-semibold text-navy">Other stays in {place}</h2>
              <p className="mt-1 text-[13.5px] text-ink-muted">Similar price, same dates.</p>
            </div>
            <Link to={`/stays/results?place=${encodeURIComponent(place)}`} className="btn-outline btn-sm">
              See all <Icon name="arrowRight" size={15} />
            </Link>
          </div>
          <DragCarousel itemClass="w-[268px]" label={`Other stays in ${place}`}>
            {others.map((h) => (
              <HotelCardGrid key={h.id} hotel={h} to={`/stays/hotel/${h.id}?place=${encodeURIComponent(place)}&nights=${nights}`} />
            ))}
          </DragCarousel>
        </section>
      </div>

      <ProviderDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={hotel.name}
        subtitle={`${hotel.stars}★ · ${hotel.area} · ${nights} ${nights === 1 ? 'night' : 'nights'}`}
        providers={hotel.providers}
        unit="per night"
      />
    </>
  )
}

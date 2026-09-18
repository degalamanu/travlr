import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StaySearchForm from '../components/search/StaySearchForm'
import Icon from '../components/ui/Icon'
import Photo from '../components/ui/Photo'
import DragCarousel from '../components/ui/DragCarousel'
import { HotelCardGrid } from '../components/cards/HotelCard'
import { SectionHead } from '../components/ui/Bits'
import { DealsRail, FaqSection, InternationalStrip } from '../components/sections/Sections'
import { POPULAR_STAY_CITIES, searchStays } from '../data/stays'
import { FAQS, TRAVELLER_TYPES, DESTINATIONS, destinationPhoto } from '../data/content'
import { useMoney } from '../store/AppContext'

const NEARBY_CITIES = ['Bengaluru', 'Mumbai', 'New Delhi', 'Hyderabad', 'Chennai']

export default function Stays() {
  const money = useMoney()
  const [city, setCity] = useState('Bengaluru')
  const [pickerOpen, setPickerOpen] = useState(false)

  const nearby = useMemo(() => searchStays({ place: city, nights: 1 }).slice(0, 8), [city])
  const exploreCities = ['Goa', 'Jaipur', 'Udaipur', 'Manali', 'Dubai', 'Bangkok']

  return (
    <>
      <section className="relative bg-navy">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
          <div className="absolute right-0 -top-20 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
        </div>
        <div className="shell relative pb-28 pt-12 sm:pt-16">
          <h1 className="max-w-2xl text-[34px] font-bold leading-[1.1] text-white sm:text-[46px]">
            Hotels, apartments and guest houses — compared in one go.
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/70">
            We check Booking.com, Agoda, Expedia and the property’s own site at the same time, so you can see who
            actually has the better rate for your dates.
          </p>
        </div>
      </section>

      <div className="shell relative -mt-20 sm:-mt-24">
        <StaySearchForm />
      </div>

      {/* Near you */}
      <section className="shell py-14">
        <SectionHead
          eyebrow="Near you"
          title={
            <span className="flex flex-wrap items-center gap-2">
              Stays in {city} tonight
              <button
                type="button"
                onClick={() => setPickerOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[13px] font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
              >
                <Icon name="pin" size={13} />
                Change
              </button>
            </span>
          }
          sub="Based on your last search. Prices are for one night, two adults, and include taxes where the provider gives them to us."
          action={
            <Link to={`/stays/results?place=${encodeURIComponent(city)}`} className="btn-outline btn-sm">
              See all {city} stays <Icon name="arrowRight" size={15} />
            </Link>
          }
        />

        {pickerOpen && (
          <div className="mb-5 flex flex-wrap gap-2">
            {NEARBY_CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCity(c)
                  setPickerOpen(false)
                }}
                className={`pill ${c === city ? 'pill-active' : 'hover:border-indigo-300'}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <DragCarousel itemClass="w-[272px]" label={`Hotels in ${city}`}>
          {nearby.map((h) => (
            <HotelCardGrid key={h.id} hotel={h} to={`/stays/hotel/${h.id}?place=${encodeURIComponent(city)}`} />
          ))}
        </DragCarousel>
      </section>

      <DealsRail
        title="Great deals in the cities you keep looking at"
        sub="Rates that dropped in the last 24 hours, with free cancellation unless we say otherwise."
        kinds={['stay', 'flight']}
      />

      {/* Explore more — stays in other cities */}
      <section className="shell py-14">
        <SectionHead
          eyebrow="Explore more"
          title="Stays in other cities worth a weekend"
          sub="Tap a city to see every property we can compare there."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exploreCities.map((c) => {
            const dest = DESTINATIONS.find((d) => d.name === c)
            const sample = searchStays({ place: c, nights: 1 })
            const min = Math.min(...sample.map((s) => s.pricePerNight))
            return (
              <Link
                key={c}
                to={`/stays/results?place=${encodeURIComponent(c)}`}
                className="group relative overflow-hidden rounded-2xl border border-line"
              >
                <Photo
                  src={dest ? destinationPhoto(dest) : null}
                  alt={c}
                  kind="city"
                  seed={c}
                  variant={dest?.variant}
                  ratio="aspect-[16/9]"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.05]"
                >
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-900/78 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                    <span>
                      <span className="block text-[17px] font-semibold">{c}</span>
                      <span className="block text-[12.5px] text-white/75">{sample.length} properties compared</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-[11px] text-white/70">from</span>
                      <span className="tnum block text-[16px] font-bold">{money(min)}</span>
                    </span>
                  </span>
                </Photo>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Popular hotel destinations — plain links, no buttons */}
      <section className="border-y border-line bg-white">
        <div className="shell py-12">
          <h2 className="text-[20px] font-semibold text-navy">Popular hotel destinations</h2>
          <p className="mt-1.5 text-[14px] text-ink-muted">
            Straight to the packages and rates travellers from India book most.
          </p>
          <div className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_STAY_CITIES.map((c) => (
              <Link
                key={c}
                to={`/stays/results?place=${encodeURIComponent(c)}`}
                className="group flex items-baseline justify-between gap-3 border-b border-line py-2 text-[14px] text-ink-muted transition-colors hover:text-indigo-700"
              >
                <span className="font-medium text-navy group-hover:text-indigo-700">Hotels in {c}</span>
                <Icon name="chevronRight" size={14} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        items={FAQS.stays}
        title="How our hotel comparison works"
        sub="The short version: same property, every seller, one list."
      />

      {/* Plan smart */}
      <section className="shell pb-14">
        <SectionHead
          eyebrow="Plan smart"
          title="Packages built around the kind of traveller you are"
          sub="Same properties, filtered by what actually matters for the trip you are taking."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRAVELLER_TYPES.map((t) => (
            <article key={t.id} className="card group overflow-hidden transition-all duration-200 hover:border-indigo-300 hover:shadow-lift">
              <Photo src={null} alt={t.title} kind={t.id === 'business' ? 'hotel' : 'city'} seed={t.id} variant={t.variant} ratio="aspect-[16/9]" />
              <div className="p-5">
                <h3 className="text-[16.5px] font-semibold text-navy">{t.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{t.body}</p>
                <p className="mt-3 text-[12.5px] font-medium text-indigo-700">{t.budget}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.picks.map((p) => (
                    <Link
                      key={p}
                      to={`/stays/results?place=${encodeURIComponent(p)}`}
                      className="rounded-lg bg-canvas px-2.5 py-1 text-[12.5px] text-ink-muted transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <InternationalStrip />
    </>
  )
}

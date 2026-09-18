import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CarSearchForm from '../components/search/CarSearchForm'
import CarCard from '../components/cards/CarCard'
import Icon from '../components/ui/Icon'
import DragCarousel from '../components/ui/DragCarousel'
import { SectionHead } from '../components/ui/Bits'
import { FaqSection, InternationalStrip } from '../components/sections/Sections'
import { CAR_FEATURES, ROAD_TRIP_ROUTES, searchCars, CAR_CATEGORIES } from '../data/cars'
import { FAQS } from '../data/content'
import { useMoney } from '../store/AppContext'

const PICKUP_CITIES = ['Goa', 'Bengaluru', 'New Delhi', 'Mumbai', 'Jaipur', 'Kochi', 'Hyderabad', 'Chennai', 'Udaipur', 'Manali', 'Dubai', 'Colombo']

export default function Cars() {
  const money = useMoney()
  const [city, setCity] = useState('Goa')
  const cars = useMemo(() => searchCars({ place: city, days: 3 }).slice(0, 10), [city])

  return (
    <>
      <section className="relative bg-navy">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-16 top-4 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
          <div className="absolute right-10 -top-24 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
        </div>
        <div className="shell relative pb-28 pt-12 sm:pt-16">
          <h1 className="max-w-2xl text-[34px] font-bold leading-[1.1] text-white sm:text-[46px]">
            Car hire without the counter surprises.
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/70">
            One-way fees, young-driver surcharges and fuel policies are priced in before you compare — so the cheapest
            car on the list is still the cheapest when you pick up the keys.
          </p>
        </div>
      </section>

      <div className="shell relative -mt-20 sm:-mt-24">
        <CarSearchForm />
      </div>

      {/* Cars near you */}
      <section className="shell py-14">
        <SectionHead
          eyebrow="Available near you"
          title={`Cars you can hire in ${city}`}
          sub="Three-day hire, driver aged 30, collected at the airport. Photos are of the exact model or its closest twin."
          action={
            <Link to={`/cars/results?place=${encodeURIComponent(city)}`} className="btn-outline btn-sm">
              See all cars <Icon name="arrowRight" size={15} />
            </Link>
          }
        />

        <div className="mb-5 flex flex-wrap gap-2">
          {['Goa', 'Bengaluru', 'New Delhi', 'Mumbai', 'Jaipur'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              className={`pill ${c === city ? 'pill-active' : 'hover:border-indigo-300'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <DragCarousel itemClass="w-[252px]" label={`Cars in ${city}`}>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} to={`/cars/car/${car.id}?place=${encodeURIComponent(city)}`} />
          ))}
        </DragCarousel>
      </section>

      {/* Category shortcuts */}
      <section className="shell pb-4">
        <div className="flex flex-wrap gap-2">
          {CAR_CATEGORIES.map((c) => (
            <Link
              key={c}
              to={`/cars/results?place=${encodeURIComponent(city)}&category=${encodeURIComponent(c)}`}
              className="pill hover:border-indigo-300 hover:text-navy"
            >
              <Icon name="car" size={14} />
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Why hire with us */}
      <section className="shell py-14">
        <SectionHead
          eyebrow="What you get"
          title="What hiring through Travlr actually gets you"
          sub="We are not a hire company. We are the shortest route to the one with the right car at the right price."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {CAR_FEATURES.map((f) => (
            <article key={f.title} className="card flex gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon name={f.icon} size={21} />
              </span>
              <div>
                <h3 className="text-[16px] font-semibold text-navy">{f.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Road trips */}
      <section className="shell py-14">
        <SectionHead
          eyebrow="Powered by AI"
          title="Or let us plan the whole drive"
          sub="Tell us where you are starting and how long you have. We build the route, the overnight stops and the car that suits the roads."
          action={
            <Link to="/road-trip" className="btn-primary btn-sm">
              <Icon name="sparkles" size={15} /> Plan a road trip
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {ROAD_TRIP_ROUTES.map((r) => (
            <Link
              key={r.id}
              to={`/road-trip?route=${r.id}`}
              className="card group flex flex-col p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
            >
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.07em] text-indigo-600">
                <Icon name="route" size={15} />
                {r.days} days · {r.distanceKm} km
              </div>
              <h3 className="mt-3 text-[17px] font-semibold text-navy transition-colors group-hover:text-indigo-700">
                {r.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] text-ink-muted">
                {r.from} → {r.to} · {r.stops.length} stops · best {r.season}
              </p>
              <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
                <span className="text-[13px] text-ink-muted">{r.car}</span>
                <span className="text-right">
                  <span className="block text-[11.5px] text-ink-soft">car + fuel from</span>
                  <span className="tnum block text-[17px] font-bold leading-none text-navy">{money(r.est)}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pick-up locations */}
      <section className="border-y border-line bg-white">
        <div className="shell py-12">
          <h2 className="text-[20px] font-semibold text-navy">Popular pick-up locations</h2>
          <p className="mt-1.5 text-[14px] text-ink-muted">Airport desks, city counters and meet-and-greet options.</p>
          <div className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {PICKUP_CITIES.map((c) => (
              <Link
                key={c}
                to={`/cars/results?place=${encodeURIComponent(c)}`}
                className="group flex items-baseline justify-between gap-3 border-b border-line py-2 text-[14px] transition-colors hover:text-indigo-700"
              >
                <span className="font-medium text-navy group-hover:text-indigo-700">Car hire in {c}</span>
                <Icon name="chevronRight" size={14} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        items={FAQS.cars}
        title="Car hire questions we get every day"
        sub="Mostly about deposits, age limits and what happens if the flight lands late."
      />
      <InternationalStrip />
    </>
  )
}

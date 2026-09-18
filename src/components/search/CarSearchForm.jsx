import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DateField, PlaceField } from './Fields'
import Icon from '../ui/Icon'
import { Switch } from '../ui/Bits'
import { useApp } from '../../store/AppContext'
import { addDays, nightsBetween, todayISO } from '../../lib/format'

const TIMES = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

export function buildCarSearch(state) {
  const params = new URLSearchParams()
  params.set('place', state.place)
  if (state.differentDropoff) {
    params.set('diff', '1')
    params.set('dropPlace', state.dropPlace)
  }
  params.set('pickupDate', state.pickupDate)
  params.set('pickupTime', state.pickupTime)
  params.set('dropDate', state.dropDate)
  params.set('dropTime', state.dropTime)
  params.set('age', String(state.driverAge))
  return `/cars/results?${params.toString()}`
}

export default function CarSearchForm({ initial = {}, defaultTab = 'hire' }) {
  const navigate = useNavigate()
  const { addRecentSearch } = useApp()
  const [tab, setTab] = useState(defaultTab)

  const [place, setPlace] = useState(initial.place || 'Goa')
  const [dropPlace, setDropPlace] = useState(initial.dropPlace || 'Panjim')
  const [differentDropoff, setDifferentDropoff] = useState(Boolean(initial.diff))
  const [pickupDate, setPickupDate] = useState(initial.pickupDate || addDays(todayISO(), 10))
  const [dropDate, setDropDate] = useState(initial.dropDate || addDays(todayISO(), 13))
  const [pickupTime, setPickupTime] = useState(initial.pickupTime || '10:00')
  const [dropTime, setDropTime] = useState(initial.dropTime || '10:00')
  const [driverAge, setDriverAge] = useState(Number(initial.age) || 30)

  // Road-trip planner
  const [tripStart, setTripStart] = useState('Mumbai')
  const [tripDays, setTripDays] = useState(4)
  const [tripVibe, setTripVibe] = useState('coast')

  const days = nightsBetween(pickupDate, dropDate)

  const submitHire = (e) => {
    e.preventDefault()
    const url = buildCarSearch({
      place, dropPlace, differentDropoff, pickupDate, pickupTime, dropDate, dropTime, driverAge,
    })
    addRecentSearch({
      kind: 'car',
      title: `Car hire in ${place}`,
      sub: `${days} ${days === 1 ? 'day' : 'days'} · driver ${driverAge}`,
      to: url,
      query: { place, pickupDate, dropDate },
    })
    navigate(url)
  }

  const submitTrip = (e) => {
    e.preventDefault()
    navigate(`/road-trip?start=${encodeURIComponent(tripStart)}&days=${tripDays}&vibe=${tripVibe}`)
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-lift sm:p-5">
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { id: 'hire', label: 'Car hire', icon: 'car' },
          { id: 'trip', label: 'Plan a road trip with AI', icon: 'sparkles' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[14px] font-medium transition-colors ${
              tab === t.id ? 'text-white' : 'bg-canvas text-ink-muted hover:text-navy'
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="car-tab"
                className="absolute inset-0 rounded-xl bg-indigo-600"
                transition={{ type: 'spring', stiffness: 460, damping: 36 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Icon name={t.icon} size={16} />
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {tab === 'hire' ? (
        <form onSubmit={submitHire}>
          <div className={`grid gap-2.5 ${differentDropoff ? 'lg:grid-cols-[1fr_1fr_1.4fr_auto]' : 'lg:grid-cols-[1.3fr_1.6fr_auto_auto]'}`}>
            <PlaceField label="Pick-up location" icon="pin" value={place} onChange={setPlace} placeholder="City, airport or area" />
            {differentDropoff && (
              <PlaceField label="Drop-off location" icon="pin" value={dropPlace} onChange={setDropPlace} />
            )}

            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="grid grid-cols-[1fr_auto] gap-1.5">
                <DateField label="Pick-up" value={pickupDate} min={todayISO()} onChange={setPickupDate} />
                <TimeSelect value={pickupTime} onChange={setPickupTime} label="Time" />
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-1.5">
                <DateField label="Drop-off" value={dropDate} min={pickupDate} onChange={setDropDate} />
                <TimeSelect value={dropTime} onChange={setDropTime} label="Time" />
              </div>
            </div>

            <div className="flex min-w-[118px] flex-col justify-center rounded-xl border border-line bg-white px-3.5 py-2.5">
              <label htmlFor="driver-age" className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-soft">
                <Icon name="user" size={13} /> Driver age
              </label>
              <input
                id="driver-age"
                type="number"
                min={18}
                max={85}
                value={driverAge}
                onChange={(e) => setDriverAge(Number(e.target.value))}
                className="w-full bg-transparent text-[15px] font-medium text-navy focus:outline-none"
              />
            </div>

            <button type="submit" className="btn-primary btn-lg w-full lg:w-auto">
              <Icon name="search" size={17} />
              Search
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-3.5">
            <div className="w-full max-w-xs">
              <Switch
                id="diff-dropoff"
                checked={differentDropoff}
                onChange={setDifferentDropoff}
                label="Return to a different location"
                hint="One-way fees are added to every price"
              />
            </div>
            {driverAge < 25 && (
              <p className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[12.5px] text-amber-800">
                <Icon name="info" size={14} />
                Drivers under 25 pay a young-driver fee. We have already added it below.
              </p>
            )}
            <span className="ml-auto text-[13px] text-ink-soft">
              {days} {days === 1 ? 'day' : 'days'} hire
            </span>
          </div>
        </form>
      ) : (
        <form onSubmit={submitTrip}>
          <div className="grid gap-2.5 lg:grid-cols-[1.3fr_1fr_1.2fr_auto]">
            <PlaceField label="Starting from" icon="pin" value={tripStart} onChange={setTripStart} placeholder="Where do you set off?" />

            <div className="flex flex-col justify-center rounded-xl border border-line bg-white px-3.5 py-2.5">
              <label htmlFor="trip-days" className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-soft">
                <Icon name="calendar" size={13} /> Days on the road
              </label>
              <input
                id="trip-days"
                type="number"
                min={2}
                max={21}
                value={tripDays}
                onChange={(e) => setTripDays(Number(e.target.value))}
                className="w-full bg-transparent text-[15px] font-medium text-navy focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-center rounded-xl border border-line bg-white px-3.5 py-2">
              <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-soft">
                <Icon name="compass" size={13} /> What are you after?
              </span>
              <div className="flex gap-1.5">
                {[
                  { id: 'coast', label: 'Coast' },
                  { id: 'mountain', label: 'Mountains' },
                  { id: 'heritage', label: 'Heritage' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setTripVibe(v.id)}
                    className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                      tripVibe === v.id ? 'bg-indigo-600 text-white' : 'bg-canvas text-ink-muted hover:text-navy'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary btn-lg w-full lg:w-auto">
              <Icon name="sparkles" size={17} />
              Plan my route
            </button>
          </div>
          <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-ink-muted">
            <Icon name="info" size={15} className="mt-0.5 shrink-0 text-indigo-600" />
            We build a day-by-day route with driving times, overnight stops and the car that suits the roads — then
            price the hire for those exact dates.
          </p>
        </form>
      )}
    </div>
  )
}

function TimeSelect({ value, onChange, label }) {
  return (
    <div className="flex flex-col justify-center rounded-xl border border-line bg-white px-2.5 py-2.5">
      <span className="mb-0.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-soft">
        <Icon name="clock" size={12} /> {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="tnum cursor-pointer appearance-none bg-transparent pr-1 text-[15px] font-medium text-navy focus:outline-none"
      >
        {TIMES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  )
}

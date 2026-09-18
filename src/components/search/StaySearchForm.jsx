import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DateField, PaxField, PlaceField, TogglePill } from './Fields'
import Icon from '../ui/Icon'
import { Checkbox, Popover } from '../ui/Bits'
import { useApp } from '../../store/AppContext'
import { addDays, nightsBetween, todayISO } from '../../lib/format'

export function buildStaySearch(state) {
  const params = new URLSearchParams()
  params.set('place', state.place)
  if (state.checkIn) params.set('checkIn', state.checkIn)
  if (state.checkOut) params.set('checkOut', state.checkOut)
  params.set('rooms', String(state.rooms))
  params.set('adults', String(state.pax.adults))
  if (state.pax.children) params.set('children', String(state.pax.children))
  if (state.freeCancellation) params.set('freeCancel', '1')
  if (state.breakfast) params.set('breakfast', '1')
  if (state.stars?.length) params.set('stars', state.stars.join(','))
  return `/stays/results?${params.toString()}`
}

export default function StaySearchForm({ initial = {} }) {
  const navigate = useNavigate()
  const { addRecentSearch } = useApp()

  const [place, setPlace] = useState(initial.place || 'Goa')
  const [checkIn, setCheckIn] = useState(initial.checkIn || addDays(todayISO(), 14))
  const [checkOut, setCheckOut] = useState(initial.checkOut || addDays(todayISO(), 17))
  const [rooms, setRooms] = useState(initial.rooms || 1)
  const [pax, setPax] = useState({
    adults: initial.adults || 2,
    children: initial.children || 0,
    infants: 0,
    cabin: 'economy',
    age: 30,
  })
  const [freeCancellation, setFreeCancellation] = useState(Boolean(initial.freeCancel))
  const [breakfast, setBreakfast] = useState(Boolean(initial.breakfast))
  const [stars, setStars] = useState(initial.stars || [])

  const nights = nightsBetween(checkIn, checkOut)

  const toggleStar = (n) => setStars((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n].sort()))

  const submit = (e) => {
    e.preventDefault()
    const url = buildStaySearch({ place, checkIn, checkOut, rooms, pax, freeCancellation, breakfast, stars })
    addRecentSearch({
      kind: 'stay',
      title: `Hotels in ${place}`,
      sub: `${nights} ${nights === 1 ? 'night' : 'nights'} · ${pax.adults + pax.children} guests`,
      to: url,
      query: { place, checkIn, checkOut },
    })
    navigate(url)
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-4 shadow-lift sm:p-5">
      <div className="grid gap-2.5 lg:grid-cols-[1.4fr_1.6fr_1.1fr_auto]">
        <PlaceField label="Destination" value={place} onChange={setPlace} placeholder="City, area or hotel name" />

        <div className="grid gap-2.5 sm:grid-cols-2">
          <DateField label="Check in" value={checkIn} min={todayISO()} onChange={setCheckIn} />
          <DateField label="Check out" value={checkOut} min={addDays(checkIn, 1)} onChange={setCheckOut} />
        </div>

        <div className="grid gap-2.5 sm:grid-cols-[1fr_auto]">
          <PaxField value={pax} onChange={setPax} showCabin={false} showAge={false} />
          <Popover
            label="Rooms"
            align="right"
            width="w-56"
            trigger={
              <span className="flex h-full min-w-[104px] flex-col justify-center rounded-xl border border-line bg-white px-3.5 py-2.5 text-left transition-colors hover:border-indigo-300">
                <span className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-soft">
                  <Icon name="bed" size={13} /> Rooms
                </span>
                <span className="text-[15px] font-medium text-navy">{rooms}</span>
              </span>
            }
          >
            {() => (
              <div className="p-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRooms(n)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${
                      rooms === n ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-navy hover:bg-canvas'
                    }`}
                  >
                    {n} {n === 1 ? 'room' : 'rooms'}
                    {rooms === n && <Icon name="check" size={15} />}
                  </button>
                ))}
              </div>
            )}
          </Popover>
        </div>

        <button type="submit" className="btn-primary btn-lg w-full lg:w-auto">
          <Icon name="search" size={17} />
          Search
        </button>
      </div>

      {/* Checkbox filters, as on the brief */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line pt-3.5">
        <div className="flex flex-wrap items-center gap-x-5">
          <span className="w-auto">
            <Checkbox checked={freeCancellation} onChange={setFreeCancellation} label="Free cancellation" />
          </span>
          <span className="w-auto">
            <Checkbox checked={breakfast} onChange={setBreakfast} label="Breakfast included" />
          </span>
        </div>
        <span className="hidden h-5 w-px bg-line sm:block" />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-ink-muted">Rating</span>
          {[5, 4, 3].map((n) => (
            <TogglePill key={n} active={stars.includes(n)} onClick={() => toggleStar(n)} icon="star">
              {n}★ {n === 3 ? '& up' : ''}
            </TogglePill>
          ))}
        </div>
        <span className="ml-auto text-[13px] text-ink-soft">
          {nights} {nights === 1 ? 'night' : 'nights'} · {pax.adults + pax.children} guests · {rooms} {rooms === 1 ? 'room' : 'rooms'}
        </span>
      </div>
    </form>
  )
}

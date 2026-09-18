import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AirportField, DateField, PaxField, TogglePill } from './Fields'
import Icon from '../ui/Icon'
import { Popover } from '../ui/Bits'
import { useApp } from '../../store/AppContext'
import { addDays, todayISO } from '../../lib/format'
import { AIRPORT_MAP } from '../../data/places'

const TRIP_TYPES = [
  { id: 'return', label: 'Return' },
  { id: 'oneway', label: 'One way' },
  { id: 'multi', label: 'Multi-city' },
]

export function buildFlightSearch(state) {
  const params = new URLSearchParams()
  params.set('from', state.from)
  params.set('to', state.to)
  if (state.depart) params.set('depart', state.depart)
  if (state.trip === 'return' && state.ret) params.set('ret', state.ret)
  params.set('trip', state.trip)
  params.set('cabin', state.pax.cabin)
  params.set('adults', String(state.pax.adults))
  if (state.pax.children) params.set('children', String(state.pax.children))
  if (state.pax.infants) params.set('infants', String(state.pax.infants))
  if (state.pax.age) params.set('age', String(state.pax.age))
  if (state.directOnly) params.set('direct', '1')
  if (state.nearby) params.set('nearby', '1')
  if (state.bags) params.set('bags', String(state.bags))
  if (state.mode !== 'flights') params.set('mode', state.mode)
  if (state.trip === 'multi' && state.legs?.length) {
    params.set('legs', state.legs.map((l) => `${l.from}-${l.to}-${l.date || ''}`).join(','))
  }
  return `/flights/results?${params.toString()}`
}

export default function FlightSearchForm({ initial = {}, compact = false }) {
  const navigate = useNavigate()
  const { addRecentSearch } = useApp()

  const [trip, setTrip] = useState(initial.trip || 'return')
  const [mode, setMode] = useState(initial.mode || 'flights')
  const [from, setFrom] = useState(initial.from || 'BLR')
  const [to, setTo] = useState(initial.to || 'DEL')
  const [depart, setDepart] = useState(initial.depart || addDays(todayISO(), 12))
  const [ret, setRet] = useState(initial.ret || addDays(todayISO(), 17))
  const [pax, setPax] = useState({
    adults: initial.adults || 1,
    children: initial.children || 0,
    infants: initial.infants || 0,
    cabin: initial.cabin || 'economy',
    age: initial.age || 30,
  })
  const [directOnly, setDirectOnly] = useState(Boolean(initial.direct))
  const [nearby, setNearby] = useState(Boolean(initial.nearby))
  const [bags, setBags] = useState(initial.bags || 0)
  const [legs, setLegs] = useState(
    initial.legs || [
      { from: 'BLR', to: 'DEL', date: addDays(todayISO(), 12) },
      { from: 'DEL', to: 'BOM', date: addDays(todayISO(), 16) },
    ]
  )
  const [swapping, setSwapping] = useState(false)

  const swap = () => {
    setSwapping(true)
    setFrom(to)
    setTo(from)
    setTimeout(() => setSwapping(false), 320)
  }

  const submit = (e) => {
    e?.preventDefault()
    const state = { trip, mode, from, to, depart, ret, pax, directOnly, nearby, bags, legs }
    const url = buildFlightSearch(state)
    addRecentSearch({
      kind: 'flight',
      title: `${AIRPORT_MAP[from]?.city || from} → ${AIRPORT_MAP[to]?.city || to}`,
      sub: trip === 'return' ? `Return · ${depart} – ${ret}` : trip === 'multi' ? 'Multi-city' : `One way · ${depart}`,
      to: url,
      query: { from, to, depart, ret, trip },
    })
    navigate(url)
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-4 shadow-lift sm:p-5">
      {/* Trip type + package selector */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl bg-canvas p-1">
          {TRIP_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTrip(t.id)}
              className={`relative rounded-lg px-3.5 py-1.5 text-[13.5px] font-medium transition-colors ${
                trip === t.id ? 'text-white' : 'text-ink-muted hover:text-navy'
              }`}
            >
              {trip === t.id && (
                <motion.span
                  layoutId="trip-type"
                  className="absolute inset-0 rounded-lg bg-indigo-600"
                  transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex rounded-xl bg-canvas p-1">
          {[
            { id: 'flights', label: 'Flights only', icon: 'plane' },
            { id: 'package', label: 'Flight + hotel', icon: 'bed' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`relative inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13.5px] font-medium transition-colors ${
                mode === m.id ? 'text-white' : 'text-ink-muted hover:text-navy'
              }`}
            >
              {mode === m.id && (
                <motion.span
                  layoutId="flight-mode"
                  className="absolute inset-0 rounded-lg bg-navy"
                  transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <Icon name={m.icon} size={14} />
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {trip === 'multi' ? (
        <MultiCityLegs legs={legs} setLegs={setLegs} />
      ) : (
        <div className="grid gap-2.5 md:grid-cols-[1fr_1fr_auto] lg:grid-cols-[1.1fr_1.1fr_1.5fr_1fr]">
          <div className="relative grid gap-2.5 sm:grid-cols-2 lg:col-span-2">
            <AirportField label="From" icon="takeoff" value={from} onChange={setFrom} exclude={to} />
            <AirportField label="To" icon="landing" value={to} onChange={setTo} exclude={from} />
            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className="absolute left-1/2 top-1/2 z-20 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center
                         rounded-full border border-line bg-white text-navy transition-colors hover:border-indigo-400
                         hover:text-indigo-700 sm:flex"
            >
              <motion.span animate={{ rotate: swapping ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <Icon name="swap" size={16} />
              </motion.span>
            </button>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <DateField label="Depart" value={depart} min={todayISO()} onChange={setDepart} />
            <DateField
              label="Return"
              value={trip === 'return' ? ret : ''}
              min={depart || todayISO()}
              disabled={trip !== 'return'}
              placeholder={trip === 'return' ? 'Add date' : 'One way'}
              onChange={setRet}
            />
          </div>

          <PaxField value={pax} onChange={setPax} />
        </div>
      )}

      {/* Filters row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <TogglePill active={directOnly} onClick={() => setDirectOnly((v) => !v)} icon="plane">
          Direct flights only
        </TogglePill>
        <TogglePill active={nearby} onClick={() => setNearby((v) => !v)} icon="pin">
          Add nearby airports
        </TogglePill>

        <Popover
          label="Cabin bags and check-in bags"
          align="left"
          width="w-72"
          trigger={
            <span className={`pill ${bags ? 'pill-active' : 'hover:border-indigo-300'}`}>
              <Icon name="luggage" size={14} />
              {bags ? `${bags} checked ${bags === 1 ? 'bag' : 'bags'}` : 'Bags'}
              <Icon name="chevronDown" size={13} />
            </span>
          }
        >
          {() => (
            <div className="p-4">
              <p className="mb-2 text-[13px] text-ink-muted">
                Every fare includes one 7 kg cabin bag. Tell us how many checked bags you need and we add the fee to
                each price.
              </p>
              <div className="flex items-center justify-between py-2">
                <span className="text-[14px] font-medium text-navy">Checked bags</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBags(Math.max(0, bags - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-line hover:border-indigo-400"
                    aria-label="Fewer bags"
                  >
                    <Icon name="minus" size={15} />
                  </button>
                  <span className="tnum w-7 text-center font-semibold">{bags}</span>
                  <button
                    type="button"
                    onClick={() => setBags(Math.min(5, bags + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-line hover:border-indigo-400"
                    aria-label="More bags"
                  >
                    <Icon name="plus" size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Popover>

        {nearby && (
          <AnimatePresence>
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted"
            >
              <Icon name="info" size={13} />
              Including {[...(AIRPORT_MAP[from]?.nearby || []), ...(AIRPORT_MAP[to]?.nearby || [])].join(', ') || 'no extra airports on this route'}
            </motion.span>
          </AnimatePresence>
        )}

        <button type="submit" className="btn-primary btn-lg ml-auto w-full sm:w-auto">
          <Icon name="search" size={17} />
          {mode === 'package' ? 'Search flight + hotel' : 'Search flights'}
        </button>
      </div>

      {!compact && mode === 'package' && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-indigo-50 px-3.5 py-3 text-[13px] leading-relaxed text-indigo-900">
          <Icon name="info" size={15} className="mt-0.5 shrink-0" />
          Packages bundle the flight with a hotel for the same dates. Providers price these together, which is usually
          8–20% below booking them apart.
        </p>
      )}
    </form>
  )
}

function MultiCityLegs({ legs, setLegs }) {
  const update = (i, patch) => setLegs(legs.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))
  return (
    <div className="space-y-2.5">
      {legs.map((leg, i) => (
        <div key={i} className="grid gap-2.5 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <AirportField label={`Leg ${i + 1} from`} icon="takeoff" value={leg.from} onChange={(v) => update(i, { from: v })} />
          <AirportField label="To" icon="landing" value={leg.to} onChange={(v) => update(i, { to: v })} />
          <DateField label="Date" value={leg.date} min={todayISO()} onChange={(v) => update(i, { date: v })} />
          <button
            type="button"
            onClick={() => setLegs(legs.filter((_, idx) => idx !== i))}
            disabled={legs.length <= 2}
            aria-label={`Remove leg ${i + 1}`}
            className="flex items-center justify-center rounded-xl border border-line px-3 text-ink-muted transition-colors
                       hover:border-indigo-300 hover:text-navy disabled:opacity-35"
          >
            <Icon name="trash" size={17} />
          </button>
        </div>
      ))}
      {legs.length < 4 && (
        <button
          type="button"
          onClick={() => setLegs([...legs, { from: legs[legs.length - 1].to, to: 'GOX', date: '' }])}
          className="btn-quiet btn-sm"
        >
          <Icon name="plus" size={15} /> Add another flight
        </button>
      )}
    </div>
  )
}

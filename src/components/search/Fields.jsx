import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../ui/Icon'
import { Stepper } from '../ui/Bits'
import { AIRPORT_MAP, searchAirports } from '../../data/places'
import { POPULAR_STAY_CITIES } from '../../data/stays'
import { CABINS } from '../../data/flights'
import { formatDate } from '../../lib/format'

/* ---------------------------------------------------------------- shell */

export function FieldShell({ label, icon, children, className = '', onClick, as = 'div' }) {
  const Tag = as
  return (
    <Tag
      onClick={onClick}
      className={`group relative flex min-w-0 flex-col justify-center rounded-xl border border-line bg-white px-3.5 py-2.5
                  text-left transition-colors focus-within:border-indigo-500 hover:border-indigo-300 ${className}`}
    >
      <span className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-soft">
        {icon && <Icon name={icon} size={13} />}
        {label}
      </span>
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------- airport picker */

export function AirportField({ label, icon, value, onChange, placeholder = 'City or airport', exclude }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const ref = useRef(null)
  const inputRef = useRef(null)

  const results = searchAirports(query).filter((a) => a.code !== exclude)
  const selected = AIRPORT_MAP[value]

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const choose = (code) => {
    onChange(code)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={ref} className="relative min-w-0">
      <FieldShell label={label} icon={icon} className="cursor-text">
        <input
          ref={inputRef}
          value={open ? query : selected ? `${selected.city} (${selected.code})` : ''}
          onChange={(e) => {
            setQuery(e.target.value)
            setCursor(0)
            setOpen(true)
          }}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setCursor((c) => Math.min(results.length - 1, c + 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setCursor((c) => Math.max(0, c - 1))
            } else if (e.key === 'Enter' && open && results[cursor]) {
              e.preventDefault()
              choose(results[cursor].code)
              inputRef.current?.blur()
            } else if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          placeholder={placeholder}
          className="w-full truncate bg-transparent text-[15px] font-medium text-navy placeholder:font-normal placeholder:text-ink-soft focus:outline-none"
          aria-label={label}
          autoComplete="off"
        />
      </FieldShell>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 right-0 z-40 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border border-line bg-white py-1.5 shadow-pop"
          >
            {results.length === 0 && (
              <li className="px-4 py-3 text-[14px] text-ink-muted">No airports match “{query}”.</li>
            )}
            {results.map((a, i) => (
              <li key={a.code}>
                <button
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => choose(a.code)}
                  className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                    i === cursor ? 'bg-indigo-50' : ''
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink-muted">
                    <Icon name="plane" size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium text-navy">
                      {a.city} <span className="text-ink-soft">· {a.country}</span>
                    </span>
                    <span className="block truncate text-[12.5px] text-ink-soft">{a.name}</span>
                  </span>
                  <span className="shrink-0 rounded-md bg-canvas px-1.5 py-0.5 text-[12px] font-semibold text-ink-muted">
                    {a.code}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ----------------------------------------------------------- place field */

export function PlaceField({ label, icon = 'pin', value, onChange, placeholder = 'Where are you going?' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const q = query.trim().toLowerCase()
  const results = POPULAR_STAY_CITIES.filter((c) => !q || c.toLowerCase().includes(q))

  return (
    <div ref={ref} className="relative min-w-0">
      <FieldShell label={label} icon={icon} className="cursor-text">
        <input
          value={open ? query : value}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (query.trim()) onChange(query.trim())
              setOpen(false)
            } else if (e.key === 'Escape') setOpen(false)
          }}
          placeholder={placeholder}
          className="w-full truncate bg-transparent text-[15px] font-medium text-navy placeholder:font-normal placeholder:text-ink-soft focus:outline-none"
          aria-label={label}
          autoComplete="off"
        />
      </FieldShell>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 right-0 z-40 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border border-line bg-white py-1.5 shadow-pop"
          >
            {query.trim() && !results.includes(query.trim()) && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange(query.trim())
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-indigo-50"
                >
                  <Icon name="search" size={15} className="text-ink-muted" />
                  <span className="text-[14.5px] text-navy">
                    Search “<span className="font-medium">{query.trim()}</span>”
                  </span>
                </button>
              </li>
            )}
            {results.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-indigo-50"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink-muted">
                    <Icon name="pin" size={15} />
                  </span>
                  <span className="text-[14.5px] font-medium text-navy">{c}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------ date field */

export function DateField({ label, icon = 'calendar', value, onChange, min, disabled, placeholder = 'Add date' }) {
  const id = `date-${label.replace(/\s+/g, '-').toLowerCase()}`
  return (
    <FieldShell label={label} icon={icon} className={disabled ? 'opacity-55' : ''}>
      <div className="relative">
        <span className="pointer-events-none block truncate text-[15px] font-medium text-navy">
          {value ? formatDate(value) : <span className="font-normal text-ink-soft">{placeholder}</span>}
        </span>
        <input
          id={id}
          type="date"
          value={value || ''}
          min={min}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </FieldShell>
  )
}

/* ------------------------------------------------- passengers and cabin */

export function PaxField({ value, onChange, showCabin = true, showAge = true }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const total = value.adults + value.children + value.infants

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const cabinLabel = CABINS.find((c) => c.id === value.cabin)?.label || 'Economy'

  return (
    <div ref={ref} className="relative min-w-0">
      <FieldShell
        as="button"
        label={showCabin ? 'Travellers & cabin' : 'Travellers'}
        icon="users"
        className="w-full"
        onClick={(e) => {
          e.preventDefault()
          setOpen((v) => !v)
        }}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-[15px] font-medium text-navy">
            {total} {total === 1 ? 'traveller' : 'travellers'}
            {showCabin && <span className="text-ink-muted"> · {cabinLabel}</span>}
          </span>
          <Icon name="chevronDown" size={15} className="shrink-0 text-ink-soft" />
        </span>
      </FieldShell>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 z-40 mt-1.5 w-[300px] rounded-2xl border border-line bg-white p-4 shadow-pop"
          >
            <Stepper
              label="Adults"
              hint="12 and over"
              value={value.adults}
              min={1}
              onChange={(v) => onChange({ ...value, adults: v })}
            />
            <Stepper
              label="Children"
              hint="2 – 11 years"
              value={value.children}
              onChange={(v) => onChange({ ...value, children: v })}
            />
            <Stepper
              label="Infants"
              hint="Under 2, on lap"
              value={value.infants}
              max={value.adults}
              onChange={(v) => onChange({ ...value, infants: v })}
            />

            {showAge && (
              <div className="mt-3 border-t border-line pt-3">
                <label className="label" htmlFor="lead-age">Lead traveller age</label>
                <input
                  id="lead-age"
                  type="number"
                  min={12}
                  max={99}
                  value={value.age}
                  onChange={(e) => onChange({ ...value, age: Number(e.target.value) })}
                  className="field py-2"
                />
                <p className="mt-1.5 text-[12px] text-ink-soft">
                  Some fares and car hire rules depend on age, so we use this to keep prices honest.
                </p>
              </div>
            )}

            {showCabin && (
              <div className="mt-3 border-t border-line pt-3">
                <span className="label">Cabin class</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {CABINS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onChange({ ...value, cabin: c.id })}
                      className={`rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors ${
                        value.cabin === c.id ? 'bg-indigo-600 text-white' : 'bg-canvas text-navy hover:bg-indigo-50'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="button" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------------------------------------------------------- pills */

export function TogglePill({ active, onClick, icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`pill ${active ? 'pill-active' : 'hover:border-indigo-300 hover:text-navy'}`}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  )
}

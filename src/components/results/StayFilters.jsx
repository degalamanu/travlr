import Icon from '../ui/Icon'
import { Checkbox } from '../ui/Bits'
import { useMoney } from '../../store/AppContext'

export const PROPERTY_TYPES = ['Hotel', 'Resort', 'Apartment', 'Guest house', 'Villa', 'Homestay']
export const AMENITY_FILTERS = ['Free Wi-Fi', 'Swimming pool', 'Airport shuttle', 'Free parking', 'Breakfast buffet', 'Spa', 'Pet friendly', 'EV charging']

export const EMPTY_STAY_FILTERS = {
  maxPrice: null,
  stars: [],
  minScore: 0,
  freeCancellation: false,
  breakfast: false,
  types: [],
  amenities: [],
  maxDistance: null,
}

export function StayFilterPanel({ filters, setFilters, bounds, onReset }) {
  const money = useMoney()
  const toggleIn = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-navy">Filters</h2>
        <button type="button" onClick={onReset} className="text-[13px] font-medium text-indigo-700 hover:underline">
          Reset all
        </button>
      </div>

      <Group title="Price per night">
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={100}
          value={filters.maxPrice ?? bounds.max}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="w-full accent-indigo-600"
          aria-label="Maximum price per night"
        />
        <div className="flex justify-between text-[12.5px] text-ink-muted">
          <span>{money(bounds.min)}</span>
          <span className="font-semibold text-navy">Up to {money(filters.maxPrice ?? bounds.max)}</span>
        </div>
      </Group>

      <Group title="Your must-haves">
        <Checkbox
          checked={filters.freeCancellation}
          onChange={(v) => setFilters((f) => ({ ...f, freeCancellation: v }))}
          label="Free cancellation"
          hint="Cancel at no cost before the deadline"
        />
        <Checkbox
          checked={filters.breakfast}
          onChange={(v) => setFilters((f) => ({ ...f, breakfast: v }))}
          label="Breakfast included"
        />
      </Group>

      <Group title="Star rating">
        <div className="flex flex-wrap gap-1.5">
          {[5, 4, 3, 2].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => toggleIn('stars', n)}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                filters.stars.includes(n) ? 'bg-indigo-600 text-white' : 'bg-canvas text-ink-muted hover:text-navy'
              }`}
            >
              {n}
              <Icon name="star" size={12} filled />
            </button>
          ))}
        </div>
      </Group>

      <Group title="Guest review score">
        <div className="space-y-1">
          {[
            { v: 9, label: 'Exceptional · 9+' },
            { v: 8, label: 'Very good · 8+' },
            { v: 7, label: 'Good · 7+' },
            { v: 0, label: 'Any score' },
          ].map((s) => (
            <button
              key={s.v}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, minScore: s.v }))}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors ${
                filters.minScore === s.v ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-ink-muted hover:bg-canvas'
              }`}
            >
              {s.label}
              {filters.minScore === s.v && <Icon name="check" size={15} />}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Property type">
        {PROPERTY_TYPES.map((t) => (
          <Checkbox key={t} checked={filters.types.includes(t)} onChange={() => toggleIn('types', t)} label={t} />
        ))}
      </Group>

      <Group title="Distance from centre">
        <input
          type="range"
          min={1}
          max={10}
          step={0.5}
          value={filters.maxDistance ?? 10}
          onChange={(e) => setFilters((f) => ({ ...f, maxDistance: Number(e.target.value) }))}
          className="w-full accent-indigo-600"
          aria-label="Maximum distance from centre"
        />
        <div className="text-[12.5px] text-ink-muted">
          Within <span className="font-semibold text-navy">{filters.maxDistance ?? 10} km</span> of the centre
        </div>
      </Group>

      <Group title="Facilities">
        {AMENITY_FILTERS.map((a) => (
          <Checkbox key={a} checked={filters.amenities.includes(a)} onChange={() => toggleIn('amenities', a)} label={a} />
        ))}
      </Group>
    </div>
  )
}

function Group({ title, children }) {
  return (
    <div className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-ink-soft">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

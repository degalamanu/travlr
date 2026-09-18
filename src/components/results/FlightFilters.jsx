import Icon from '../ui/Icon'
import { Checkbox, Switch } from '../ui/Bits'
import { useMoney } from '../../store/AppContext'
import { duration } from '../../lib/format'

export const DEPART_WINDOWS = [
  { id: 'early', label: 'Before 06:00', from: 0, to: 360 },
  { id: 'morning', label: '06:00 – 12:00', from: 360, to: 720 },
  { id: 'afternoon', label: '12:00 – 18:00', from: 720, to: 1080 },
  { id: 'evening', label: 'After 18:00', from: 1080, to: 1440 },
]

export function FilterPanel({ filters, setFilters, bounds, airlines, onReset }) {
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

      <Group title="Stops">
        {[
          { v: 0, label: 'Direct only' },
          { v: 1, label: 'Up to 1 stop' },
          { v: 2, label: '2 stops or more' },
        ].map((s) => (
          <Checkbox
            key={s.v}
            checked={filters.stops.includes(s.v)}
            onChange={() => toggleIn('stops', s.v)}
            label={s.label}
          />
        ))}
        <Switch
          id="self-transfer"
          checked={!filters.hideSelfTransfer}
          onChange={(v) => setFilters((f) => ({ ...f, hideSelfTransfer: !v }))}
          label="Allow self-transfer"
          hint="Separate tickets — you re-check bags"
        />
      </Group>

      <Group title="Departure time">
        <div className="grid grid-cols-2 gap-1.5">
          {DEPART_WINDOWS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => toggleIn('windows', w.id)}
              className={`rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                filters.windows.includes(w.id) ? 'bg-indigo-600 text-white' : 'bg-canvas text-ink-muted hover:text-navy'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Maximum price">
        <input
          type="range"
          min={bounds.minPrice}
          max={bounds.maxPrice}
          step={100}
          value={filters.maxPrice ?? bounds.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="w-full accent-indigo-600"
          aria-label="Maximum price"
        />
        <div className="flex justify-between text-[12.5px] text-ink-muted">
          <span>{money(bounds.minPrice)}</span>
          <span className="font-semibold text-navy">Up to {money(filters.maxPrice ?? bounds.maxPrice)}</span>
        </div>
      </Group>

      <Group title="Journey length">
        <input
          type="range"
          min={bounds.minDuration}
          max={bounds.maxDuration}
          step={15}
          value={filters.maxDuration ?? bounds.maxDuration}
          onChange={(e) => setFilters((f) => ({ ...f, maxDuration: Number(e.target.value) }))}
          className="w-full accent-indigo-600"
          aria-label="Maximum journey length"
        />
        <div className="flex justify-between text-[12.5px] text-ink-muted">
          <span>{duration(bounds.minDuration)}</span>
          <span className="font-semibold text-navy">Up to {duration(filters.maxDuration ?? bounds.maxDuration)}</span>
        </div>
      </Group>

      <Group title="Airlines">
        <div className="max-h-56 overflow-y-auto pr-1">
          {airlines.map((a) => (
            <Checkbox
              key={a.code}
              checked={filters.airlines.includes(a.code)}
              onChange={() => toggleIn('airlines', a.code)}
              label={a.name}
              count={a.count}
            />
          ))}
        </div>
      </Group>

      <Group title="Baggage">
        <Checkbox
          checked={filters.checkedBagOnly}
          onChange={(v) => setFilters((f) => ({ ...f, checkedBagOnly: v }))}
          label="Checked bag included"
        />
      </Group>

      <p className="flex items-start gap-2 rounded-xl bg-canvas px-3 py-2.5 text-[12px] leading-relaxed text-ink-muted">
        <Icon name="info" size={14} className="mt-0.5 shrink-0 text-indigo-600" />
        Filters apply to every provider at once, so the cheapest row stays the cheapest row.
      </p>
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

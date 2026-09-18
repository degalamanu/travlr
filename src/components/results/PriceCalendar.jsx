import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Icon from '../ui/Icon'
import { useApp, useMoney } from '../../store/AppContext'
import { cheapestMonths, priceCalendar } from '../../data/flights'
import { formatDate, parseISO, shortMoney } from '../../lib/format'

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function PriceCalendar({ from, to, cabin, selected, onPick }) {
  const money = useMoney()
  const { currency } = useApp()
  const base = parseISO(selected) || new Date()
  const [offset, setOffset] = useState(0)

  const monthDate = new Date(base.getFullYear(), base.getMonth() + offset, 1)
  const monthISO = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`

  const days = useMemo(() => priceCalendar(from, to, monthISO, cabin), [from, to, monthISO, cabin])
  const months = useMemo(() => cheapestMonths(from, to, cabin), [from, to, cabin])
  const cheapestMonth = months.reduce((a, b) => (a.price <= b.price ? a : b))

  const firstDow = (new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay() + 6) % 7
  const label = monthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-semibold text-navy">Cheapest days to fly</h3>
          <p className="mt-0.5 text-[13px] text-ink-muted">
            Lowest one-way fare per day. Pick a greener day and we re-run the search.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-navy transition-colors hover:border-indigo-300 disabled:opacity-35"
          >
            <Icon name="chevronLeft" size={16} />
          </button>
          <span className="w-36 text-center text-[14px] font-medium text-navy">{label}</span>
          <button
            type="button"
            onClick={() => setOffset((o) => Math.min(10, o + 1))}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-navy transition-colors hover:border-indigo-300"
          >
            <Icon name="chevronRight" size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {DOW.map((d) => (
          <div key={d} className="pb-1 text-center text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft">
            {d.slice(0, 1)}
          </div>
        ))}
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((d) => {
          const isPast = d.date < today
          const isSelected = d.date === selected
          const tone =
            d.band < 0.25 ? 'bg-emerald-50 text-emerald-800' : d.band < 0.6 ? 'bg-canvas text-navy' : 'bg-orange-50 text-orange-800'
          return (
            <button
              key={d.date}
              type="button"
              disabled={isPast}
              onClick={() => onPick(d.date)}
              className={`flex flex-col items-center rounded-lg px-1 py-1.5 transition-colors disabled:opacity-30 ${
                isSelected ? 'bg-indigo-600 text-white' : tone
              } ${isPast ? '' : 'hover:ring-1 hover:ring-indigo-300'}`}
            >
              <span className="tnum text-[12.5px] font-semibold leading-none">{Number(d.date.slice(-2))}</span>
              <span className={`tnum mt-1 text-[10.5px] leading-none ${isSelected ? 'text-white/85' : 'opacity-75'}`}>
                {shortMoney(d.price, currency)}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <div className="flex items-baseline justify-between">
          <h4 className="text-[14px] font-semibold text-navy">Cheapest month to fly</h4>
          <span className="text-[13px] text-ink-muted">
            {cheapestMonth.month} · from <span className="tnum font-semibold text-navy">{money(cheapestMonth.price)}</span>
          </span>
        </div>
        <div className="mt-3 flex h-24 items-end gap-1.5">
          {months.map((m) => {
            const max = Math.max(...months.map((x) => x.price))
            const min = Math.min(...months.map((x) => x.price))
            const h = 22 + ((m.price - min) / Math.max(1, max - min)) * 70
            const isMin = m.price === min
            return (
              <div key={m.month} className="group flex flex-1 flex-col items-center gap-1.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: 0.03 * months.indexOf(m), ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full rounded-t-md ${isMin ? 'bg-indigo-600' : 'bg-indigo-100 group-hover:bg-indigo-300'}`}
                  title={`${m.month}: ${money(m.price)}`}
                />
                <span className={`text-[10.5px] ${isMin ? 'font-semibold text-indigo-700' : 'text-ink-soft'}`}>
                  {m.month.slice(0, 1)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {selected && (
        <p className="mt-4 flex items-center gap-2 text-[12.5px] text-ink-muted">
          <Icon name="calendar" size={14} />
          Showing fares around {formatDate(selected, { day: 'numeric', month: 'long' })}
        </p>
      )}
    </div>
  )
}

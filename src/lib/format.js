export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1, locale: 'en-IN', label: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, locale: 'en-US', label: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, locale: 'en-IE', label: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0094, locale: 'en-GB', label: 'British Pound' },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044, locale: 'en-AE', label: 'UAE Dirham' },
  SGD: { code: 'SGD', symbol: 'S$', rate: 0.016, locale: 'en-SG', label: 'Singapore Dollar' },
}

// All mock prices are authored in INR and converted on the fly.
export function money(amountInr, currency = 'INR', opts = {}) {
  const c = CURRENCIES[currency] || CURRENCIES.INR
  const value = amountInr * c.rate
  const decimals = opts.decimals ?? (c.code === 'INR' ? 0 : value < 100 ? 2 : 0)
  const formatted = new Intl.NumberFormat(c.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
  return `${c.symbol}${formatted}`
}

/** Compact form for dense UI like the price calendar: ₹4.3T? no — ₹4.3K. */
export function shortMoney(amountInr, currency = 'INR') {
  const c = CURRENCIES[currency] || CURRENCIES.INR
  const value = amountInr * c.rate
  const formatted = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: value < 10 ? 1 : value < 10000 ? 1 : 0,
  }).format(value)
  return `${c.symbol}${formatted}`
}

export function duration(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h` : `${h}h ${m.toString().padStart(2, '0')}m`
}

export function minsToTime(mins) {
  const h = Math.floor((mins % 1440) / 60)
  const m = mins % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export function todayISO(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

export function parseISO(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function formatDate(iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) {
  const d = parseISO(iso)
  if (!d) return ''
  return new Intl.DateTimeFormat('en-IN', opts).format(d)
}

export function formatDateLong(iso) {
  return formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function nightsBetween(a, b) {
  const d1 = parseISO(a)
  const d2 = parseISO(b)
  if (!d1 || !d2) return 1
  return Math.max(1, Math.round((d2 - d1) / 86400000))
}

export function addDays(iso, n) {
  const d = parseISO(iso) || new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function pluralise(n, one, many) {
  return `${n} ${n === 1 ? one : many || one + 's'}`
}

export function classNames(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function reviewWord(score) {
  if (score >= 9) return 'Exceptional'
  if (score >= 8.5) return 'Excellent'
  if (score >= 8) return 'Very good'
  if (score >= 7) return 'Good'
  return 'Pleasant'
}

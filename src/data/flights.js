import { makeRng } from '../lib/rand'
import { AIRPORT_MAP, distanceKm } from './places'
import { FLIGHT_PROVIDERS } from './providers'

export const AIRLINES = [
  { code: '6E', name: 'IndiGo', domestic: true, tint: '#1B2C7A' },
  { code: 'AI', name: 'Air India', domestic: true, tint: '#B3273A' },
  { code: 'IX', name: 'Air India Express', domestic: true, tint: '#E2621B' },
  { code: 'QP', name: 'Akasa Air', domestic: true, tint: '#E0552E' },
  { code: 'SG', name: 'SpiceJet', domestic: true, tint: '#8B1C34' },
  { code: 'EK', name: 'Emirates', domestic: false, tint: '#C8102E' },
  { code: 'QR', name: 'Qatar Airways', domestic: false, tint: '#5C0632' },
  { code: 'EY', name: 'Etihad Airways', domestic: false, tint: '#BB9A5E' },
  { code: 'SQ', name: 'Singapore Airlines', domestic: false, tint: '#1B3C6E' },
  { code: 'TG', name: 'Thai Airways', domestic: false, tint: '#4B1E73' },
  { code: 'MH', name: 'Malaysia Airlines', domestic: false, tint: '#12447A' },
  { code: 'BA', name: 'British Airways', domestic: false, tint: '#1B3A6B' },
  { code: 'LH', name: 'Lufthansa', domestic: false, tint: '#12314E' },
  { code: 'UL', name: 'SriLankan Airlines', domestic: false, tint: '#1D5B78' },
  { code: 'AK', name: 'AirAsia', domestic: false, tint: '#C21D2B' },
]

export const AIRLINE_MAP = Object.fromEntries(AIRLINES.map((a) => [a.code, a]))

export const CABINS = [
  { id: 'economy', label: 'Economy', multiplier: 1 },
  { id: 'premium', label: 'Premium economy', multiplier: 1.7 },
  { id: 'business', label: 'Business', multiplier: 3.1 },
  { id: 'first', label: 'First', multiplier: 5.4 },
]

const AIRCRAFT_NARROW = ['Airbus A320neo', 'Airbus A321neo', 'Boeing 737 MAX 8', 'Airbus A320']
const AIRCRAFT_WIDE = ['Boeing 787-9', 'Airbus A350-900', 'Boeing 777-300ER', 'Airbus A330-300']

const HUBS = ['DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'DXB', 'DOH', 'AUH', 'SIN', 'BKK', 'KUL']

function isDomestic(from, to) {
  return AIRPORT_MAP[from]?.country === 'India' && AIRPORT_MAP[to]?.country === 'India'
}

function baseFare(km, domestic) {
  // Rough but believable: high per-km rate on short hops, tapering with distance.
  const perKm = domestic ? 6.4 : 5.1
  const taper = Math.pow(km, 0.86)
  return Math.round((1250 + taper * perKm) / 10) * 10
}

/**
 * Generates a stable set of itineraries for a search.
 * The same query always produces the same offers.
 */
export function searchFlights(query) {
  const {
    from = 'BLR',
    to = 'DEL',
    depart = '',
    ret = '',
    cabin = 'economy',
    adults = 1,
    children = 0,
    infants = 0,
    directOnly = false,
    bags = 0,
  } = query || {}

  const domestic = isDomestic(from, to)
  const km = distanceKm(from, to)
  const seed = `${from}-${to}-${depart}-${ret}-${cabin}`
  const rng = makeRng(seed)
  const cabinDef = CABINS.find((c) => c.id === cabin) || CABINS[0]

  const pool = AIRLINES.filter((a) => (domestic ? a.domestic : true))
  const count = domestic ? 14 : 16
  const offers = []

  for (let i = 0; i < count; i++) {
    const airline = rng.pick(pool)
    const canBeDirect = domestic || km < 5200 || rng.chance(0.4)
    const stops = directOnly ? 0 : canBeDirect ? (rng.chance(0.58) ? 0 : rng.chance(0.85) ? 1 : 2) : rng.chance(0.75) ? 1 : 2
    // Cruise speed, taxi time and routing all vary a little by aircraft and
    // airline, so two "direct" flights on the same route are rarely identical.
    const cruiseMins = Math.round((km / (730 + rng.int(0, 105))) * 60) + rng.int(22, 46)
    const layoverMins = stops === 0 ? 0 : stops === 1 ? rng.int(65, 260) : rng.int(180, 420)
    const durationMins = cruiseMins + layoverMins + (stops > 0 ? rng.int(25, 70) : 0)
    const departMins = rng.int(0, 47) * 30
    const arriveMins = (departMins + durationMins) % 1440
    const dayOffset = Math.floor((departMins + durationMins) / 1440)

    const stopFactor = stops === 0 ? 1.13 : stops === 1 ? 0.95 : 0.86
    const timeFactor = departMins < 360 || departMins > 1290 ? 0.92 : departMins > 480 && departMins < 720 ? 1.06 : 1
    const carrierFactor = ['EK', 'SQ', 'QR', 'BA', 'LH'].includes(airline.code) ? 1.16 : airline.code === 'SG' ? 0.9 : 1
    const noise = 0.88 + rng.next() * 0.3

    const perAdult = Math.round(
      (baseFare(km, domestic) * cabinDef.multiplier * stopFactor * timeFactor * carrierFactor * noise) / 10
    ) * 10
    const bagFee = bags > 0 ? bags * (domestic ? 1500 : 3200) : 0

    const stopAt = stops === 0 ? [] : rng.pickMany(HUBS.filter((h) => h !== from && h !== to), stops)

    const providerSet = rng.pickMany(FLIGHT_PROVIDERS, rng.int(3, 6)).map((p, idx) => {
      const spread = 1 + (idx === 0 ? 0 : rng.next() * 0.17)
      const price = Math.round((perAdult * spread + bagFee) / 5) * 5
      return {
        ...p,
        price,
        refundable: rng.chance(0.35),
        freeChanges: rng.chance(0.25),
        note: rng.pick([
          'Includes 7 kg cabin bag',
          'Fare excludes seat selection',
          'Instant e-ticket',
          'Pay in 3 instalments available',
          'Self-transfer at stopover',
          'Includes 15 kg check-in bag',
        ]),
      }
    })
    providerSet.sort((a, b) => a.price - b.price)

    const legCount = stops + 1
    const legs = []
    let cursor = departMins
    for (let l = 0; l < legCount; l++) {
      const legFrom = l === 0 ? from : stopAt[l - 1]
      const legTo = l === legCount - 1 ? to : stopAt[l]
      const legMins = Math.round(((distanceKm(legFrom, legTo) || 900) / 780) * 60) + 30
      legs.push({
        from: legFrom,
        to: legTo,
        depart: cursor % 1440,
        arrive: (cursor + legMins) % 1440,
        durationMins: legMins,
        flightNo: `${airline.code} ${rng.int(101, 989)}`,
        aircraft: legMins > 300 ? rng.pick(AIRCRAFT_WIDE) : rng.pick(AIRCRAFT_NARROW),
      })
      cursor += legMins + (l < legCount - 1 ? Math.round(layoverMins / stops) : 0)
    }

    offers.push({
      id: `${seed}-${i}`.replace(/[^a-zA-Z0-9-]/g, ''),
      airline,
      flightNo: legs[0].flightNo,
      from,
      to,
      depart: departMins,
      arrive: arriveMins,
      dayOffset,
      durationMins,
      stops,
      stopAt,
      legs,
      cabin: cabinDef.id,
      cabinLabel: cabinDef.label,
      price: providerSet[0].price,
      providers: providerSet,
      passengers: adults + children + infants,
      baggage: {
        cabin: '7 kg',
        checked: domestic ? (rng.chance(0.5) ? '15 kg' : 'Not included') : rng.chance(0.8) ? '25 kg' : '20 kg',
      },
      co2: Math.round((km * 0.115 * (cabinDef.multiplier > 2 ? 2.6 : 1) * (0.88 + rng.next() * 0.26)) / 5) * 5,
      co2Delta: rng.int(-28, 22),
      onTime: rng.int(62, 94),
      seatsLeft: rng.chance(0.28) ? rng.int(2, 8) : null,
      selfTransfer: stops > 0 && rng.chance(0.2),
      returnLeg: ret
        ? {
            depart: rng.int(0, 47) * 30,
            durationMins: durationMins + rng.int(-35, 45),
            stops,
            flightNo: `${airline.code} ${rng.int(101, 989)}`,
          }
        : null,
    })
  }

  offers.sort((a, b) => a.price - b.price)
  const cheapest = offers[0]
  const fastest = [...offers].sort((a, b) => a.durationMins - b.durationMins)[0]
  if (cheapest) cheapest.badge = 'Cheapest'
  if (fastest && fastest.id !== cheapest?.id) fastest.badge = 'Fastest'
  const best = [...offers].sort(
    (a, b) => a.price / 1000 + a.durationMins / 60 - (b.price / 1000 + b.durationMins / 60)
  )[0]
  if (best && !best.badge) best.badge = 'Best'

  return offers
}

export function getFlightById(query, id) {
  return searchFlights(query).find((f) => f.id === id) || null
}

/** Cheapest fare per day for the flexible-dates calendar. */
export function priceCalendar(from, to, monthISO, cabin = 'economy') {
  const [y, m] = monthISO.split('-').map(Number)
  const days = new Date(y, m, 0).getDate()
  const km = distanceKm(from, to)
  const domestic = isDomestic(from, to)
  const base = baseFare(km, domestic) * (CABINS.find((c) => c.id === cabin)?.multiplier || 1)
  const rng = makeRng(`${from}${to}${monthISO}${cabin}`)
  const out = []
  for (let d = 1; d <= days; d++) {
    const date = new Date(y, m - 1, d)
    const dow = date.getDay()
    const weekendPush = dow === 5 || dow === 0 ? 1.18 : dow === 2 || dow === 3 ? 0.88 : 1
    const price = Math.round((base * weekendPush * (0.85 + rng.next() * 0.42)) / 10) * 10
    out.push({ date: `${monthISO}-${String(d).padStart(2, '0')}`, price, dow })
  }
  const min = Math.min(...out.map((o) => o.price))
  const max = Math.max(...out.map((o) => o.price))
  return out.map((o) => ({ ...o, cheapest: o.price === min, band: (o.price - min) / Math.max(1, max - min) }))
}

export function cheapestMonths(from, to, cabin = 'economy') {
  const km = distanceKm(from, to)
  const domestic = isDomestic(from, to)
  const base = baseFare(km, domestic) * (CABINS.find((c) => c.id === cabin)?.multiplier || 1)
  const rng = makeRng(`months${from}${to}${cabin}`)
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const seasonal = [0.92, 0.88, 0.95, 1.02, 1.12, 1.05, 0.96, 0.94, 0.9, 1.08, 1.16, 1.28]
  return names.map((n, i) => ({
    month: n,
    price: Math.round((base * seasonal[i] * (0.94 + rng.next() * 0.14)) / 10) * 10,
  }))
}

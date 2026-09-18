import { makeRng } from '../lib/rand'
import { unsplash } from '../lib/photo'
import { CAR_PROVIDERS } from './providers'

// Model catalogue. `shape` drives the vector fallback silhouette,
// `photo` is the Unsplash photograph shown when the CDN is reachable.
export const CAR_MODELS = [
  { model: 'Maruti Suzuki Swift', category: 'Economy', shape: 'hatchback', seats: 5, bags: 2, doors: 4, transmission: 'Manual', fuel: 'Petrol', base: 1690, photo: '1533473359331-0135ef1b58bf', body: '#4F5FD6' },
  { model: 'Hyundai i20', category: 'Economy', shape: 'hatchback', seats: 5, bags: 2, doors: 4, transmission: 'Manual', fuel: 'Petrol', base: 1780, photo: '1541899481282-d8bfffdcd0b9', body: '#2F3E7A' },
  { model: 'Tata Tiago', category: 'Mini', shape: 'hatchback', seats: 4, bags: 1, doors: 4, transmission: 'Manual', fuel: 'Petrol', base: 1420, photo: '1502877338535-766e1452684a', body: '#6E7DE0' },
  { model: 'Maruti Suzuki Dzire', category: 'Compact', shape: 'sedan', seats: 5, bags: 2, doors: 4, transmission: 'Automatic', fuel: 'Petrol', base: 2140, photo: '1494976388531-d1058494cdd8', body: '#3A31AC' },
  { model: 'Honda City', category: 'Intermediate', shape: 'sedan', seats: 5, bags: 3, doors: 4, transmission: 'Automatic', fuel: 'Petrol', base: 2680, photo: '1493238792000-8113da705763', body: '#1E2C6E' },
  { model: 'Hyundai Verna', category: 'Intermediate', shape: 'sedan', seats: 5, bags: 3, doors: 4, transmission: 'Automatic', fuel: 'Diesel', base: 2840, photo: '1550355291-bbee04a92027', body: '#26236E' },
  { model: 'Hyundai Creta', category: 'SUV', shape: 'suv', seats: 5, bags: 3, doors: 5, transmission: 'Automatic', fuel: 'Petrol', base: 3260, photo: '1605559424843-9e4c228bf1c2', body: '#4338CA' },
  { model: 'Mahindra Scorpio-N', category: 'SUV', shape: 'suv', seats: 7, bags: 4, doors: 5, transmission: 'Manual', fuel: 'Diesel', base: 3890, photo: '1583121274602-3e2820c69888', body: '#152052' },
  { model: 'Toyota Innova Crysta', category: 'MPV', shape: 'mpv', seats: 7, bags: 4, doors: 5, transmission: 'Manual', fuel: 'Diesel', base: 4120, photo: '1519641471654-76ce0107ad1b', body: '#2A3A82' },
  { model: 'Kia Carens', category: 'MPV', shape: 'mpv', seats: 6, bags: 3, doors: 5, transmission: 'Automatic', fuel: 'Petrol', base: 3480, photo: '1552519507-da3b142c6e3d', body: '#4F5FD6' },
  { model: 'Tata Nexon EV', category: 'Electric', shape: 'suv', seats: 5, bags: 2, doors: 5, transmission: 'Automatic', fuel: 'Electric', base: 3040, photo: '1593941707882-a5bba14938c7', body: '#0E9F6E' },
  { model: 'MG ZS EV', category: 'Electric', shape: 'suv', seats: 5, bags: 3, doors: 5, transmission: 'Automatic', fuel: 'Electric', base: 3520, photo: '1560958089-b8a1929cea89', body: '#1B6E8A' },
  { model: 'BMW 3 Series', category: 'Luxury', shape: 'luxury', seats: 5, bags: 3, doors: 4, transmission: 'Automatic', fuel: 'Petrol', base: 8900, photo: '1503376780353-7e6692767b70', body: '#0B1437' },
  { model: 'Mercedes-Benz C-Class', category: 'Luxury', shape: 'luxury', seats: 5, bags: 3, doors: 4, transmission: 'Automatic', fuel: 'Petrol', base: 9600, photo: '1618843479313-40f8afb4b4d8', body: '#1B2140' },
]

export const CAR_CATEGORIES = ['Mini', 'Economy', 'Compact', 'Intermediate', 'SUV', 'MPV', 'Electric', 'Luxury']

const PICKUP_TYPES = [
  { label: 'In terminal', detail: 'Desk inside the arrivals hall' },
  { label: 'Shuttle bus', detail: 'Free shuttle, about 6 minutes' },
  { label: 'Meet & greet', detail: 'Agent meets you at arrivals' },
  { label: 'City counter', detail: 'Pick up from the downtown office' },
]

const FUEL_POLICIES = ['Full to full', 'Full to full', 'Same to same', 'Full to empty']

export function searchCars(query) {
  const {
    place = 'Goa',
    pickupDate = '',
    dropDate = '',
    days = 3,
    driverAge = 30,
    differentDropoff = false,
    dropPlace = '',
  } = query || {}

  const rng = makeRng(`car:${place}:${pickupDate}:${dropDate}:${driverAge}:${differentDropoff}`)
  const youngDriverFee = driverAge < 25 ? 650 : 0
  const out = []

  CAR_MODELS.forEach((m, i) => {
    const copies = m.category === 'Luxury' ? 1 : 2
    for (let c = 0; c < copies; c++) {
      const supplier = rng.pick(CAR_PROVIDERS)
      const seasonal = 0.92 + rng.next() * 0.3
      const perDay = Math.round((m.base * seasonal + youngDriverFee + (differentDropoff ? 420 : 0)) / 10) * 10
      const providerSet = rng.pickMany(CAR_PROVIDERS, rng.int(2, 4)).map((p, idx) => ({
        ...p,
        price: Math.round((perDay * days * (1 + (idx === 0 ? 0 : rng.next() * 0.16))) / 10) * 10,
        note: rng.pick([
          'Free cancellation up to 48 h before',
          'Unlimited kilometres',
          'Includes third-party insurance',
          'Deposit ₹5,000 refundable',
          'Additional driver free',
        ]),
      }))
      providerSet.sort((a, b) => a.price - b.price)

      out.push({
        id: `${place}-${i}-${c}`.replace(/[^a-zA-Z0-9-]/g, ''),
        ...m,
        photoUrl: unsplash(m.photo, 800, 560),
        supplier: supplier.name,
        supplierId: supplier.id,
        supplierRating: supplier.rating,
        supplierReviews: rng.int(120, 2600),
        place,
        dropPlace: differentDropoff ? dropPlace || 'Panjim city centre' : place,
        pickup: rng.pick(PICKUP_TYPES),
        fuelPolicy: rng.pick(FUEL_POLICIES),
        mileage: rng.chance(0.7) ? 'Unlimited km' : `${rng.int(120, 300)} km/day included`,
        aircon: true,
        days,
        pricePerDay: perDay,
        total: perDay * days,
        deposit: m.category === 'Luxury' ? 25000 : rng.int(3, 10) * 1000,
        freeCancellation: rng.chance(0.75),
        instantConfirm: rng.chance(0.8),
        driverAgeMin: m.category === 'Luxury' ? 25 : 21,
        providers: providerSet,
        distanceFromCentre: Number((rng.next() * 12 + 0.4).toFixed(1)),
      })
    }
  })

  out.sort((a, b) => a.total - b.total)
  if (out[0]) out[0].badge = 'Cheapest'
  const bestRated = [...out].sort((a, b) => b.supplierRating - a.supplierRating)[0]
  if (bestRated && !bestRated.badge) bestRated.badge = 'Best rated'
  return out
}

export function getCarById(place, id) {
  return searchCars({ place }).find((c) => c.id === id) || null
}

export const CAR_FEATURES = [
  {
    title: 'One search, every supplier',
    body: 'We check international names and local independents in the same search, so the small operator with the better price is never hidden from you.',
    icon: 'search',
  },
  {
    title: 'Free cancellation on most cars',
    body: 'Filter to cars you can cancel up to 48 hours before pick-up at no cost. Plans change — your booking should be able to keep up.',
    icon: 'shield',
  },
  {
    title: 'The price you see is the price you pay',
    body: 'Mandatory fees, one-way charges and young-driver surcharges are folded into the headline total before you click through.',
    icon: 'tag',
  },
  {
    title: 'No Travlr booking fee',
    body: 'We earn a referral fee from the supplier, not a mark-up from you. Your card is only ever charged by the company you book with.',
    icon: 'wallet',
  },
]

export const ROAD_TRIP_ROUTES = [
  {
    id: 'konkan',
    title: 'The Konkan coast run',
    from: 'Mumbai',
    to: 'Goa',
    days: 4,
    distanceKm: 590,
    driveHours: 12.5,
    car: 'Hyundai Creta',
    est: 18400,
    stops: [
      { name: 'Alibaug', km: 95, note: 'Breakfast by the water, Kolaba fort at low tide' },
      { name: 'Ganpatipule', km: 330, note: 'Overnight; beach temple at sunrise' },
      { name: 'Malvan', km: 480, note: 'Scuba at Tarkarli, Sindhudurg fort' },
      { name: 'Goa', km: 590, note: 'Drop the car at Mopa or keep it for the beaches' },
    ],
    season: 'November to February',
  },
  {
    id: 'spiti',
    title: 'Manali to Spiti loop',
    from: 'Manali',
    to: 'Shimla',
    days: 7,
    distanceKm: 780,
    driveHours: 26,
    car: 'Mahindra Scorpio-N',
    est: 44600,
    stops: [
      { name: 'Kaza', km: 200, note: 'Acclimatise for a night before going higher' },
      { name: 'Key Monastery', km: 215, note: 'Sunrise over the Spiti valley' },
      { name: 'Tabo', km: 260, note: 'Thousand-year-old murals' },
      { name: 'Kalpa', km: 520, note: 'Kinnaur Kailash from your balcony' },
      { name: 'Shimla', km: 780, note: 'Return the car; overnight train back' },
    ],
    season: 'June to September only',
  },
  {
    id: 'deccan',
    title: 'Bengaluru heritage triangle',
    from: 'Bengaluru',
    to: 'Bengaluru',
    days: 3,
    distanceKm: 690,
    driveHours: 11,
    car: 'Honda City',
    est: 12900,
    stops: [
      { name: 'Hampi', km: 340, note: 'Two nights; hire bicycles for the boulder fields' },
      { name: 'Badami', km: 480, note: 'Cave temples cut into red sandstone' },
      { name: 'Chitradurga', km: 590, note: 'Break the drive at the seven-walled fort' },
    ],
    season: 'October to March',
  },
]

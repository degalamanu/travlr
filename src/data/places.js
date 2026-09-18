// Airports, cities and the "nearby airport" relationships used by the
// flight search form's "Add nearby airports" option.

export const AIRPORTS = [
  { code: 'BLR', name: 'Kempegowda International', city: 'Bengaluru', country: 'India', tz: 'IST', nearby: ['MYQ'] },
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India', tz: 'IST', nearby: ['HDO', 'IXC'] },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl', city: 'Mumbai', country: 'India', tz: 'IST', nearby: ['PNQ', 'NMI'] },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India', tz: 'IST', nearby: ['TRZ'] },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India', tz: 'IST', nearby: [] },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose Intl', city: 'Kolkata', country: 'India', tz: 'IST', nearby: [] },
  { code: 'GOX', name: 'Manohar International (Mopa)', city: 'Goa', country: 'India', tz: 'IST', nearby: ['GOI'] },
  { code: 'GOI', name: 'Dabolim', city: 'Goa', country: 'India', tz: 'IST', nearby: ['GOX'] },
  { code: 'COK', name: 'Cochin International', city: 'Kochi', country: 'India', tz: 'IST', nearby: ['TRV'] },
  { code: 'PNQ', name: 'Pune International', city: 'Pune', country: 'India', tz: 'IST', nearby: ['BOM'] },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel Intl', city: 'Ahmedabad', country: 'India', tz: 'IST', nearby: [] },
  { code: 'JAI', name: 'Jaipur International', city: 'Jaipur', country: 'India', tz: 'IST', nearby: [] },
  { code: 'UDR', name: 'Maharana Pratap', city: 'Udaipur', country: 'India', tz: 'IST', nearby: [] },
  { code: 'IXC', name: 'Shaheed Bhagat Singh Intl', city: 'Chandigarh', country: 'India', tz: 'IST', nearby: ['DEL'] },
  { code: 'TRV', name: 'Thiruvananthapuram International', city: 'Thiruvananthapuram', country: 'India', tz: 'IST', nearby: ['COK'] },
  { code: 'SXR', name: 'Sheikh ul-Alam International', city: 'Srinagar', country: 'India', tz: 'IST', nearby: [] },
  { code: 'IXB', name: 'Bagdogra', city: 'Siliguri', country: 'India', tz: 'IST', nearby: [] },
  { code: 'IXL', name: 'Kushok Bakula Rimpochee', city: 'Leh', country: 'India', tz: 'IST', nearby: [] },
  { code: 'IXZ', name: 'Veer Savarkar International', city: 'Port Blair', country: 'India', tz: 'IST', nearby: [] },
  { code: 'VNS', name: 'Lal Bahadur Shastri', city: 'Varanasi', country: 'India', tz: 'IST', nearby: [] },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', tz: 'GST', nearby: ['SHJ', 'AUH'] },
  { code: 'AUH', name: 'Zayed International', city: 'Abu Dhabi', country: 'UAE', tz: 'GST', nearby: ['DXB'] },
  { code: 'SIN', name: 'Changi', city: 'Singapore', country: 'Singapore', tz: 'SGT', nearby: [] },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', tz: 'ICT', nearby: ['DMK'] },
  { code: 'DMK', name: 'Don Mueang', city: 'Bangkok', country: 'Thailand', tz: 'ICT', nearby: ['BKK'] },
  { code: 'HKT', name: 'Phuket International', city: 'Phuket', country: 'Thailand', tz: 'ICT', nearby: [] },
  { code: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia', tz: 'MYT', nearby: [] },
  { code: 'DPS', name: 'I Gusti Ngurah Rai', city: 'Bali', country: 'Indonesia', tz: 'WITA', nearby: [] },
  { code: 'MLE', name: 'Velana International', city: 'Malé', country: 'Maldives', tz: 'MVT', nearby: [] },
  { code: 'CMB', name: 'Bandaranaike International', city: 'Colombo', country: 'Sri Lanka', tz: 'IST', nearby: [] },
  { code: 'KTM', name: 'Tribhuvan International', city: 'Kathmandu', country: 'Nepal', tz: 'NPT', nearby: [] },
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', tz: 'AST', nearby: [] },
  { code: 'LHR', name: 'Heathrow', city: 'London', country: 'United Kingdom', tz: 'GMT', nearby: ['LGW', 'STN'] },
  { code: 'LGW', name: 'Gatwick', city: 'London', country: 'United Kingdom', tz: 'GMT', nearby: ['LHR'] },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', tz: 'CET', nearby: ['ORY'] },
  { code: 'FRA', name: 'Frankfurt am Main', city: 'Frankfurt', country: 'Germany', tz: 'CET', nearby: [] },
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States', tz: 'EST', nearby: ['EWR'] },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States', tz: 'PST', nearby: [] },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', tz: 'JST', nearby: ['HND'] },
  { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Australia', tz: 'AEST', nearby: [] },
  { code: 'TBS', name: 'Shota Rustaveli Tbilisi Intl', city: 'Tbilisi', country: 'Georgia', tz: 'GET', nearby: [] },
  { code: 'GYD', name: 'Heydar Aliyev International', city: 'Baku', country: 'Azerbaijan', tz: 'AZT', nearby: [] },
  { code: 'SGN', name: 'Tan Son Nhat International', city: 'Ho Chi Minh City', country: 'Vietnam', tz: 'ICT', nearby: [] },
  { code: 'ZRH', name: 'Zurich', city: 'Zurich', country: 'Switzerland', tz: 'CET', nearby: [] },
]

export const AIRPORT_MAP = Object.fromEntries(AIRPORTS.map((a) => [a.code, a]))

export function airportLabel(code) {
  const a = AIRPORT_MAP[code]
  return a ? `${a.city} (${a.code})` : code
}

export function searchAirports(query, limit = 7) {
  const q = query.trim().toLowerCase()
  if (!q) return AIRPORTS.slice(0, limit)
  const score = (a) => {
    const code = a.code.toLowerCase()
    const city = a.city.toLowerCase()
    if (code === q) return 0
    if (city.startsWith(q)) return 1
    if (code.startsWith(q)) return 2
    if (city.includes(q)) return 3
    if (a.name.toLowerCase().includes(q)) return 4
    if (a.country.toLowerCase().includes(q)) return 5
    return 99
  }
  return AIRPORTS.map((a) => ({ a, s: score(a) }))
    .filter((x) => x.s < 99)
    .sort((x, y) => x.s - y.s)
    .slice(0, limit)
    .map((x) => x.a)
}

// Great-circle-ish distances used to keep durations and fares believable.
const COORDS = {
  BLR: [12.97, 77.59], DEL: [28.61, 77.21], BOM: [19.08, 72.88], MAA: [13.08, 80.27],
  HYD: [17.38, 78.48], CCU: [22.57, 88.36], GOX: [15.73, 73.86], GOI: [15.38, 73.83],
  COK: [9.94, 76.26], PNQ: [18.52, 73.86], AMD: [23.02, 72.57], JAI: [26.91, 75.79],
  UDR: [24.58, 73.68], IXC: [30.73, 76.78], TRV: [8.52, 76.94], SXR: [34.08, 74.8],
  IXB: [26.68, 88.32], IXL: [34.14, 77.55], IXZ: [11.64, 92.73], VNS: [25.32, 82.97],
  DXB: [25.25, 55.36], AUH: [24.43, 54.65], SIN: [1.35, 103.99], BKK: [13.69, 100.75],
  DMK: [13.91, 100.61], HKT: [8.11, 98.31], KUL: [2.75, 101.71], DPS: [-8.75, 115.17],
  MLE: [4.19, 73.53], CMB: [7.18, 79.88], KTM: [27.7, 85.36], DOH: [25.27, 51.61],
  LHR: [51.47, -0.45], LGW: [51.15, -0.18], CDG: [49.01, 2.55], FRA: [50.04, 8.56],
  JFK: [40.64, -73.78], SFO: [37.62, -122.38], NRT: [35.77, 140.39], SYD: [-33.94, 151.18],
  TBS: [41.67, 44.95], GYD: [40.47, 50.05], SGN: [10.82, 106.66], ZRH: [47.46, 8.55],
}

export function distanceKm(a, b) {
  const p = COORDS[a]
  const q = COORDS[b]
  if (!p || !q) return 1200
  const toRad = (d) => (d * Math.PI) / 180
  const [lat1, lon1] = p
  const [lat2, lon2] = q
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const x =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)))
}

export const POPULAR_ROUTES = [
  { from: 'BLR', to: 'DEL', price: 4319 },
  { from: 'BOM', to: 'GOX', price: 2874 },
  { from: 'DEL', to: 'BOM', price: 3980 },
  { from: 'BLR', to: 'BOM', price: 3145 },
  { from: 'MAA', to: 'CMB', price: 8460 },
  { from: 'DEL', to: 'DXB', price: 14320 },
  { from: 'BOM', to: 'SIN', price: 17890 },
  { from: 'BLR', to: 'BKK', price: 15240 },
  { from: 'DEL', to: 'LHR', price: 41560 },
  { from: 'HYD', to: 'MLE', price: 19870 },
]

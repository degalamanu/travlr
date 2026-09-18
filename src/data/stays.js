import { makeRng } from '../lib/rand'
import { unsplash } from '../lib/photo'
import { STAY_PROVIDERS } from './providers'

const HOTEL_PHOTOS = [
  '1566073771259-6a8506099945', '1582719478250-c89cae4dc85b', '1611892440504-42a792e24d32',
  '1590490360182-c33d57733427', '1618773928121-c32242e63f39', '1551882547-ff40c63fe5fa',
  '1571003123894-1f0594d2b5d9', '1445019980597-93fa8acb246c', '1540541338287-41700207dee6',
  '1596394516093-501ba68a0ba6', '1445991842772-097fea258e7b', '1520250497591-112f2f40a3f4',
  '1517840901100-8179e982acb7', '1578683010236-d716f9a3f461', '1455587734955-081b22074882',
]

const NAME_A = ['The Rosewood', 'Bluewater', 'Ivy Court', 'Sundara', 'Cinnamon', 'The Regalia',
  'Mango Tree', 'Amara', 'The Sandalwood', 'Marigold', 'Highstreet', 'The Verandah',
  'Coral Bay', 'Ashoka', 'Solstice', 'The Meridian', 'Palmgrove', 'Nilaya', 'Harbourline', 'Copperleaf']

const NAME_B = ['Residency', 'Suites', 'House', 'Grand', 'Boutique Stay', 'Hotel & Spa',
  'Serviced Apartments', 'Retreat', 'Inn', 'Courtyard', 'Collection', 'Lodge']

export const AREAS = {
  Bengaluru: ['Indiranagar', 'Koramangala', 'MG Road', 'Whitefield', 'Jayanagar', 'Domlur', 'Hebbal'],
  'New Delhi': ['Connaught Place', 'Aerocity', 'Karol Bagh', 'Hauz Khas', 'Paharganj', 'Saket'],
  Mumbai: ['Colaba', 'Bandra West', 'Andheri East', 'Juhu', 'Lower Parel', 'Powai'],
  Goa: ['Calangute', 'Anjuna', 'Candolim', 'Palolem', 'Panjim', 'Morjim', 'Vagator'],
  Chennai: ['T. Nagar', 'Nungambakkam', 'ECR', 'Mylapore', 'Egmore'],
  Hyderabad: ['Banjara Hills', 'Gachibowli', 'HITEC City', 'Secunderabad'],
  Jaipur: ['C-Scheme', 'Amer Road', 'Civil Lines', 'Bani Park'],
  Udaipur: ['Lake Pichola', 'Fateh Sagar', 'Old City'],
  Manali: ['Old Manali', 'Hadimba Road', 'Solang Valley'],
  Dubai: ['Downtown', 'Marina', 'Deira', 'Jumeirah Beach', 'Business Bay'],
  Singapore: ['Marina Bay', 'Orchard', 'Clarke Quay', 'Bugis'],
  Bangkok: ['Sukhumvit', 'Silom', 'Riverside', 'Khao San'],
  Bali: ['Seminyak', 'Ubud', 'Canggu', 'Uluwatu'],
  Malé: ['Hulhumalé', 'North Malé Atoll', 'Maafushi'],
  default: ['City Centre', 'Old Town', 'Riverside', 'Airport Road', 'Beachfront'],
}

const AMENITIES = [
  'Free Wi-Fi', 'Swimming pool', 'Airport shuttle', 'Restaurant', 'Fitness centre', 'Spa',
  'Free parking', 'Rooftop bar', 'Room service', 'Pet friendly', 'Business centre',
  'Laundry', 'Air conditioning', 'Breakfast buffet', 'EV charging',
]

const PROPERTY_TYPES = ['Hotel', 'Hotel', 'Hotel', 'Resort', 'Apartment', 'Guest house', 'Villa', 'Homestay']

const HIGHLIGHTS = [
  'Walk to the metro station', 'Popular with couples', 'Great breakfast reviews',
  'Rooftop pool with city views', 'Steps from the beach', 'Quiet residential street',
  'Newly refurbished rooms', 'Family rooms available', 'Excellent value for the area',
]

function areaFor(city) {
  return AREAS[city] || AREAS.default
}

/** Stable list of properties for a destination. */
export function searchStays(query) {
  const {
    place = 'Goa',
    checkIn = '',
    checkOut = '',
    rooms = 1,
    adults = 2,
    children = 0,
    nights = 3,
  } = query || {}

  const rng = makeRng(`stay:${place}:${checkIn}:${checkOut}:${rooms}:${adults}`)
  const areas = areaFor(place)
  const out = []

  for (let i = 0; i < 22; i++) {
    const name = `${rng.pick(NAME_A)} ${rng.pick(NAME_B)}`
    const area = rng.pick(areas)
    const stars = rng.chance(0.18) ? 5 : rng.chance(0.45) ? 4 : rng.chance(0.7) ? 3 : 2
    const reviewScore = Math.min(9.7, Math.max(6.4, 6.6 + stars * 0.42 + rng.next() * 0.9)).toFixed(1)
    const base = 1650 + stars * stars * 620 + rng.int(-400, 2600)
    const perNight = Math.round(base / 10) * 10
    const strike = rng.chance(0.4) ? Math.round((perNight * (1.14 + rng.next() * 0.28)) / 10) * 10 : null

    const providerSet = rng.pickMany(STAY_PROVIDERS, rng.int(3, 6)).map((p, idx) => ({
      ...p,
      price: Math.round((perNight * (1 + (idx === 0 ? 0 : rng.next() * 0.19))) / 10) * 10,
      note: rng.pick([
        'Free cancellation until 24 h before',
        'Breakfast included',
        'Pay at the property',
        'Non-refundable rate',
        'Members save 10%',
        'Includes taxes and fees',
      ]),
    }))
    providerSet.sort((a, b) => a.price - b.price)

    out.push({
      id: `${place}-${i}`.replace(/[^a-zA-Z0-9-]/g, ''),
      name,
      type: rng.pick(PROPERTY_TYPES),
      city: place,
      area,
      address: `${rng.int(3, 180)} ${area} Main Road, ${place}`,
      stars,
      reviewScore: Number(reviewScore),
      reviewCount: rng.int(84, 3480),
      distanceKm: Number((rng.next() * 9 + 0.3).toFixed(1)),
      pricePerNight: perNight,
      strikePrice: strike,
      nights,
      freeCancellation: rng.chance(0.62),
      breakfast: rng.chance(0.5),
      payAtStay: rng.chance(0.45),
      amenities: rng.pickMany(AMENITIES, rng.int(5, 9)),
      highlight: rng.pick(HIGHLIGHTS),
      photos: rng.pickMany(HOTEL_PHOTOS, 4).map((id) => ({ id, url: unsplash(id, 900, 620) })),
      deal: rng.chance(0.22) ? rng.pick(['Deal of the day', 'Mobile-only rate', 'Save 18% tonight', 'Last-minute rate']) : null,
      providers: providerSet,
      lat: 18 + rng.next() * 10,
      lng: 72 + rng.next() * 10,
      // Position on the stylised map panel, in percentages.
      mapX: 8 + rng.next() * 84,
      mapY: 10 + rng.next() * 76,
      rooms: [
        { name: 'Superior Queen Room', size: `${rng.int(22, 30)} m²`, bed: '1 queen bed', price: perNight, refundable: true },
        { name: 'Deluxe Twin Room', size: `${rng.int(24, 34)} m²`, bed: '2 single beds', price: Math.round((perNight * 1.12) / 10) * 10, refundable: true },
        { name: 'Executive Suite', size: `${rng.int(38, 58)} m²`, bed: '1 king bed + sofa', price: Math.round((perNight * 1.65) / 10) * 10, refundable: rng.chance(0.6) },
      ],
      reviewsSample: [
        { name: rng.pick(['Aditya', 'Meera', 'Rohit', 'Sana', 'Karthik', 'Priya']), score: Number(reviewScore), text: rng.pick([
          'Spotless rooms and the staff went out of their way with an early check-in.',
          'Great location — everything we wanted to see was a short walk away.',
          'Breakfast was the highlight. Rooms are a little compact but very clean.',
          'Quiet at night despite being central. Would happily stay again.',
        ]) },
        { name: rng.pick(['Nikhil', 'Fatima', 'Deepa', 'Arjun', 'Ravi']), score: Number((reviewScore - 0.6).toFixed(1)), text: rng.pick([
          'Good value. The lift was slow at peak hours but nothing major.',
          'Comfortable beds, strong Wi-Fi, friendly reception team.',
          'Pool was smaller than the pictures suggest, otherwise a solid stay.',
        ]) },
      ],
    })
  }

  return out
}

export function getStayById(place, id) {
  return searchStays({ place }).find((s) => s.id === id) || null
}

export const POPULAR_STAY_CITIES = [
  'Goa', 'New Delhi', 'Mumbai', 'Bengaluru', 'Jaipur', 'Udaipur', 'Manali',
  'Chennai', 'Hyderabad', 'Dubai', 'Singapore', 'Bangkok', 'Bali', 'Malé',
]

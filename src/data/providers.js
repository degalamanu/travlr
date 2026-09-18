// Travlr never takes a payment — it compares prices and hands the traveller
// over to the provider. These are the partners a result can be booked with.

export const FLIGHT_PROVIDERS = [
  { id: 'mmt', name: 'MakeMyTrip', rating: 4.2, kind: 'Travel agent' },
  { id: 'cleartrip', name: 'Cleartrip', rating: 4.3, kind: 'Travel agent' },
  { id: 'goibibo', name: 'Goibibo', rating: 4.1, kind: 'Travel agent' },
  { id: 'easemytrip', name: 'EaseMyTrip', rating: 3.9, kind: 'Travel agent' },
  { id: 'ixigo', name: 'ixigo', rating: 4.0, kind: 'Travel agent' },
  { id: 'yatra', name: 'Yatra', rating: 3.8, kind: 'Travel agent' },
  { id: 'gotogate', name: 'Gotogate', rating: 3.4, kind: 'Travel agent' },
  { id: 'kiwi', name: 'Kiwi.com', rating: 3.6, kind: 'Travel agent' },
]

export const STAY_PROVIDERS = [
  { id: 'booking', name: 'Booking.com', rating: 4.4, kind: 'Travel agent' },
  { id: 'agoda', name: 'Agoda', rating: 4.2, kind: 'Travel agent' },
  { id: 'expedia', name: 'Expedia', rating: 4.1, kind: 'Travel agent' },
  { id: 'hotels', name: 'Hotels.com', rating: 4.0, kind: 'Travel agent' },
  { id: 'trip', name: 'Trip.com', rating: 4.2, kind: 'Travel agent' },
  { id: 'mmt', name: 'MakeMyTrip', rating: 4.2, kind: 'Travel agent' },
  { id: 'goibibo', name: 'Goibibo', rating: 4.1, kind: 'Travel agent' },
]

export const CAR_PROVIDERS = [
  { id: 'zoomcar', name: 'Zoomcar', rating: 4.0, kind: 'Car hire' },
  { id: 'avis', name: 'Avis', rating: 4.5, kind: 'Car hire' },
  { id: 'hertz', name: 'Hertz', rating: 4.4, kind: 'Car hire' },
  { id: 'europcar', name: 'Europcar', rating: 4.2, kind: 'Car hire' },
  { id: 'eco', name: 'Eco Rent a Car', rating: 4.1, kind: 'Car hire' },
  { id: 'mychoize', name: 'MyChoize', rating: 3.9, kind: 'Car hire' },
  { id: 'revv', name: 'Revv', rating: 3.8, kind: 'Car hire' },
  { id: 'savaari', name: 'Savaari', rating: 4.3, kind: 'Chauffeur hire' },
]

export const PROVIDER_BY_ID = Object.fromEntries(
  [...FLIGHT_PROVIDERS, ...STAY_PROVIDERS, ...CAR_PROVIDERS].map((p) => [p.id, p])
)

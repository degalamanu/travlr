import { unsplash } from '../lib/photo'

export const DESTINATIONS = [
  { id: 'goa', name: 'Goa', country: 'India', airport: 'GOX', price: 2874, nights: 3, tags: ['Beach', 'Nightlife', 'Short break'], months: 'Nov – Feb', photo: '1512343879784-a960bf40e7f2', variant: 'coast',
    blurb: 'Two coasts in one state: the north for shacks and late nights, the south for empty sand and long lunches.' },
  { id: 'jaipur', name: 'Jaipur', country: 'India', airport: 'JAI', price: 3410, nights: 2, tags: ['Heritage', 'Food', 'Weekend'], months: 'Oct – Mar', photo: '1477587458883-47145ed94245', variant: 'skyline',
    blurb: 'Forts on the ridge, a pink old city you can walk end to end, and the best laal maas of your life.' },
  { id: 'udaipur', name: 'Udaipur', country: 'India', airport: 'UDR', price: 4190, nights: 3, tags: ['Romantic', 'Heritage', 'Lakes'], months: 'Sep – Mar', photo: '1600100397608-f010cb0e3f07', variant: 'skyline',
    blurb: 'Lake palaces, rooftop dinners and the kind of sunsets that empty a phone battery.' },
  { id: 'manali', name: 'Manali', country: 'India', airport: 'IXC', price: 5260, nights: 4, tags: ['Mountains', 'Adventure', 'Snow'], months: 'Mar – Jun', photo: '1506905925346-21bda4d32df4', variant: 'mountain',
    blurb: 'Base camp for Solang, Sissu and the Atal Tunnel — and the start of every Spiti loop.' },
  { id: 'leh', name: 'Leh & Ladakh', country: 'India', airport: 'IXL', price: 9870, nights: 6, tags: ['Mountains', 'Road trip', 'Adventure'], months: 'Jun – Sep', photo: '1464822759023-fed622ff2c3b', variant: 'mountain',
    blurb: 'High-altitude desert, monasteries on cliffs, and roads that are the whole reason you came.' },
  { id: 'andaman', name: 'Andaman Islands', country: 'India', airport: 'IXZ', price: 8420, nights: 5, tags: ['Beach', 'Diving', 'Islands'], months: 'Oct – May', photo: '1552465011-b4e21bf6e79a', variant: 'coast',
    blurb: 'Radhanagar at sunset, Neil Island at dawn, and some of the clearest diving in the country.' },
  { id: 'varanasi', name: 'Varanasi', country: 'India', airport: 'VNS', price: 4780, nights: 2, tags: ['Culture', 'Spiritual', 'Food'], months: 'Nov – Mar', photo: '1561361058-c24cecae35ca', variant: 'skyline',
    blurb: 'The ghats at first light, then a boat back through the smoke and bells of the evening aarti.' },
  { id: 'munnar', name: 'Munnar', country: 'India', airport: 'COK', price: 4960, nights: 3, tags: ['Hills', 'Nature', 'Tea'], months: 'Sep – Mar', photo: '1598324789736-4861f89564a0', variant: 'mountain',
    blurb: 'Tea terraces to the horizon, cool nights, and Eravikulam if you want the Nilgiri tahr.' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', airport: 'DXB', price: 14320, nights: 4, tags: ['City', 'Shopping', 'Family'], months: 'Nov – Mar', photo: '1512453979798-5ea266f8880c', variant: 'skyline',
    blurb: 'A four-hour flight to skyline views, desert nights and a visa on arrival for most Indian passports.' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', airport: 'BKK', price: 15240, nights: 4, tags: ['City', 'Food', 'Nightlife'], months: 'Nov – Feb', photo: '1525625293386-3f8f99389edd', variant: 'skyline',
    blurb: 'Street food that ruins you for everywhere else, plus the cheapest long weekend abroad on this list.' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', airport: 'SIN', price: 17890, nights: 4, tags: ['City', 'Family', 'Food'], months: 'Year round', photo: '1525625293386-3f8f99389edd', variant: 'skyline',
    blurb: 'Compact, spotless and endlessly walkable — the easiest first trip abroad with kids.' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', airport: 'DPS', price: 19680, nights: 6, tags: ['Beach', 'Wellness', 'Surf'], months: 'Apr – Oct', photo: '1537996194471-e657df975ab4', variant: 'coast',
    blurb: 'Ubud for the rice terraces, Canggu for the surf, Uluwatu for the cliffs. Visa on arrival.' },
  { id: 'maldives', name: 'Maldives', country: 'Maldives', airport: 'MLE', price: 19870, nights: 5, tags: ['Beach', 'Luxury', 'Honeymoon'], months: 'Nov – Apr', photo: '1514282401047-d79a71a590e8', variant: 'coast',
    blurb: 'Guesthouse islands have made this far cheaper than its reputation. Fly in under four hours.' },
  { id: 'kathmandu', name: 'Kathmandu', country: 'Nepal', airport: 'KTM', price: 11450, nights: 4, tags: ['Mountains', 'Culture', 'Trekking'], months: 'Oct – Nov', photo: '1544735716-392fe2489ffa', variant: 'mountain',
    blurb: 'Durbar squares, momos, and the trailhead for everything in the Annapurna and Everest regions.' },
  { id: 'colombo', name: 'Sri Lanka', country: 'Sri Lanka', airport: 'CMB', price: 8460, nights: 6, tags: ['Beach', 'Wildlife', 'Trains'], months: 'Dec – Mar', photo: '1566296314736-6eaac1ca0cb9', variant: 'coast',
    blurb: 'Hill-country trains, Yala leopards and south-coast surf in a country the size of a long drive.' },
  { id: 'tbilisi', name: 'Tbilisi', country: 'Georgia', airport: 'TBS', price: 21400, nights: 5, tags: ['City', 'Wine', 'Mountains'], months: 'Apr – Jun', photo: '1565008447742-97f6f38c985c', variant: 'skyline',
    blurb: 'Sulphur baths, natural wine and the Caucasus two hours away. Still one of the cheapest visas going.' },
  { id: 'baku', name: 'Baku', country: 'Azerbaijan', airport: 'GYD', price: 22650, nights: 4, tags: ['City', 'Architecture', 'Value'], months: 'Apr – Oct', photo: '1601999009300-2b0c29b6a2bd', variant: 'skyline',
    blurb: 'A walled old city next to flame-shaped towers, and a Caspian promenade made for evenings.' },
  { id: 'vietnam', name: 'Vietnam', country: 'Vietnam', airport: 'SGN', price: 18320, nights: 7, tags: ['Food', 'Beach', 'Value'], months: 'Nov – Apr', photo: '1528127269322-539801943592', variant: 'coast',
    blurb: 'Ha Long, Hoi An and Saigon in one loop — and the best value-for-money food anywhere in Asia.' },
]

export const DESTINATION_MAP = Object.fromEntries(DESTINATIONS.map((d) => [d.id, d]))

export function destinationPhoto(d, w = 800, h = 560) {
  return unsplash(d.photo, w, h)
}

export const DEALS = [
  { id: 'd1', kind: 'flight', title: 'Bengaluru → Goa', sub: 'Direct · IndiGo · 1 h 10 m', price: 2140, was: 3290, from: 'BLR', to: 'GOX', note: 'Weekday departures in October' },
  { id: 'd2', kind: 'flight', title: 'Delhi → Dubai', sub: '1 stop · Air India Express', price: 12980, was: 16400, from: 'DEL', to: 'DXB', note: 'Return in the same calendar month' },
  { id: 'd3', kind: 'stay', title: 'Anjuna, Goa', sub: '4★ resort · Breakfast included', price: 4290, was: 5980, place: 'Goa', note: 'Per night, 2 adults' },
  { id: 'd4', kind: 'car', title: 'Compact car in Goa', sub: 'Automatic · Unlimited km', price: 1690, was: 2240, place: 'Goa', note: 'Per day, 3-day hire' },
  { id: 'd5', kind: 'flight', title: 'Mumbai → Bangkok', sub: 'Direct · 4 h 25 m', price: 14120, was: 18600, from: 'BOM', to: 'BKK', note: 'Mid-week departures' },
  { id: 'd6', kind: 'stay', title: 'Marina, Dubai', sub: '5★ hotel · Free cancellation', price: 9860, was: 13400, place: 'Dubai', note: 'Per night, 2 adults' },
]

export const TRAVELLER_TYPES = [
  {
    id: 'weekender',
    title: 'The two-day weekender',
    body: 'Leave Friday night, back Sunday. Short hops with the last flight out and the first one back.',
    picks: ['Goa', 'Jaipur', 'Pondicherry'],
    budget: 'Under ₹12,000 all in',
    photo: '1533105079780-92b9be482077',
    variant: 'coast',
  },
  {
    id: 'family',
    title: 'Travelling with kids',
    body: 'Direct flights, family rooms, pools that are actually open, and somewhere to eat after 9 pm.',
    picks: ['Singapore', 'Dubai', 'Munnar'],
    budget: '₹60,000 – ₹1,20,000 for four',
    photo: '1596394516093-501ba68a0ba6',
    variant: 'skyline',
  },
  {
    id: 'solo',
    title: 'Going solo',
    body: 'Hostels and guest houses with good reviews from solo travellers, in places that are easy to move around alone.',
    picks: ['Rishikesh', 'Sri Lanka', 'Vietnam'],
    budget: '₹2,500 a day on the ground',
    photo: '1544735716-392fe2489ffa',
    variant: 'mountain',
  },
  {
    id: 'slow',
    title: 'The slow traveller',
    body: 'A month in one place. Serviced apartments, weekly rates and a kitchen you will actually use.',
    picks: ['Tbilisi', 'Bali', 'Kochi'],
    budget: 'From ₹1,400 a night on monthly rates',
    photo: '1540541338287-41700207dee6',
    variant: 'coast',
  },
  {
    id: 'business',
    title: 'In and out for work',
    body: 'Airport-adjacent hotels, late check-out, a desk that fits a laptop and reliable Wi-Fi.',
    picks: ['Bengaluru', 'Mumbai', 'Hyderabad'],
    budget: 'Within most ₹8,000 night caps',
    photo: '1445019980597-93fa8acb246c',
    variant: 'skyline',
  },
  {
    id: 'honeymoon',
    title: 'First trip as two',
    body: 'Private pools, quiet beaches and the kind of dinner you book a month ahead.',
    picks: ['Maldives', 'Udaipur', 'Bali'],
    budget: '₹1,80,000 for a week',
    photo: '1514282401047-d79a71a590e8',
    variant: 'coast',
  },
]

export const FAQS = {
  flights: [
    { q: 'Does Travlr charge a booking fee?', a: 'No. Travlr is free to use and we never add a fee to the fare. We show you the price the provider is offering and send you to them to book. Providers pay us a referral fee, which is how the site stays free.' },
    { q: 'Why is the price different when I click through?', a: 'Airlines and agents change fares constantly, and some show a price before optional extras like bags or seats. If what you land on differs from what we showed, come back and tell us with the "Report a price" link on the result — we re-check that provider within the hour.' },
    { q: 'Can I book directly on Travlr?', a: 'No, and that is deliberate. We are a comparison site. Your card details, your booking and your ticket all sit with the airline or agent you choose, so there is no middle party between you and your ticket.' },
    { q: 'What does "self-transfer" mean?', a: 'It means two separate tickets stitched together. You collect your bags and check in again at the stopover, and a delay on the first leg is not the second airline\'s problem. We label these clearly and you can filter them out.' },
    { q: 'How do price alerts work?', a: 'Track any route and we watch it for you. If the cheapest fare moves by more than 5%, you get one email — we do not send daily nudges.' },
    { q: 'Do you show every airline?', a: 'Nearly. A handful of carriers do not distribute fares to comparison sites; where we know a route is served by one of them, we say so at the top of the results.' },
  ],
  stays: [
    { q: 'Are the prices per night or for the whole stay?', a: 'Cards show the price per night for your dates and party size. Open a property and you get the full stay total, including taxes and fees, before you click through.' },
    { q: 'What counts as free cancellation?', a: 'A rate you can cancel at no cost up to the deadline the provider sets, usually 24 to 48 hours before check-in. Filter to these rates with the checkbox in the filters panel.' },
    { q: 'Why does the same hotel show several prices?', a: 'Different agents hold different rates and room types for the same property. We list them side by side so you can see who is actually cheapest for your dates.' },
    { q: 'Can I see hotels on a map?', a: 'Yes — switch to the map view on any results page. Pins show the nightly price, and hovering a card highlights its pin.' },
    { q: 'Do you add taxes and fees?', a: 'We show the provider\'s total including taxes where the provider gives us that figure, and we label the price when it excludes local charges payable at the property.' },
  ],
  cars: [
    { q: 'What do I need at the counter?', a: 'A driving licence held for at least a year, a passport or Aadhaar, and a credit card in the main driver\'s name for the deposit. International licences need an IDP alongside them.' },
    { q: 'I am under 25. Can I still hire?', a: 'Usually yes, from 21, with a young-driver surcharge. Set your age in the search form and we fold that surcharge into every price you see, so the comparison stays honest.' },
    { q: 'Can I return the car somewhere else?', a: 'On most suppliers, yes. Tick "Return to a different location" and we add the one-way fee to the totals rather than springing it on you at the desk.' },
    { q: 'What does "full to full" mean?', a: 'You collect the car with a full tank and bring it back full. It is the fairest policy — anything else usually means paying the supplier\'s fuel rate.' },
    { q: 'Is insurance included?', a: 'Third-party cover is included by law. Collision damage waivers vary by supplier and are listed on each car\'s page under what\'s included.' },
  ],
  general: [
    { q: 'How does Travlr make money?', a: 'When you click through and book, the provider pays us a small referral fee. It does not change your price, and it does not change the order of results — we sort on price, duration and rating, never on commission.' },
    { q: 'Do I need an account?', a: 'Not to search. An account saves your recent searches, wishlists and price alerts across devices.' },
    { q: 'Which countries do you cover?', a: 'Flights and hotels worldwide; car hire in 140 countries. Prices default to your local currency and can be switched from the header.' },
    { q: 'Is my data sold to advertisers?', a: 'No. We share only what a provider needs to complete a booking you chose to start. Full detail is in the privacy policy.' },
  ],
}

export const INTERNATIONAL_SITES = [
  { label: 'India', code: 'travlr.in', lang: 'English' },
  { label: 'United States', code: 'travlr.com', lang: 'English' },
  { label: 'United Kingdom', code: 'travlr.co.uk', lang: 'English' },
  { label: 'United Arab Emirates', code: 'travlr.ae', lang: 'English / العربية' },
  { label: 'Singapore', code: 'travlr.sg', lang: 'English' },
  { label: 'Australia', code: 'travlr.com.au', lang: 'English' },
  { label: 'Deutschland', code: 'travlr.de', lang: 'Deutsch' },
  { label: 'France', code: 'travlr.fr', lang: 'Français' },
  { label: 'España', code: 'travlr.es', lang: 'Español' },
  { label: '日本', code: 'travlr.jp', lang: '日本語' },
  { label: 'Brasil', code: 'travlr.com.br', lang: 'Português' },
  { label: 'ไทย', code: 'travlr.co.th', lang: 'ไทย' },
]

export const LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ar', label: 'العربية' },
]

export const HELP_TOPICS = [
  {
    id: 'booking',
    title: 'Bookings and tickets',
    blurb: 'Where your booking lives and who to contact when it changes.',
    articles: [
      { q: 'I booked through a provider — where is my confirmation?', a: 'Your ticket is issued by the provider you clicked through to, not by Travlr, so the confirmation email comes from them. It usually lands within 15 minutes. If it has not arrived in an hour, check your spam folder and then contact the provider directly with the card you paid on.' },
      { q: 'I need to change or cancel a booking', a: 'Travlr cannot change a booking we did not take payment for. Go to the provider named in your confirmation email — their change and cancellation policy is the one that applies. If you are not sure who you booked with, your card statement will name them.' },
      { q: 'My flight was cancelled by the airline', a: 'Contact the airline first: they owe you a rebooking or refund under the rules of the country you departed from. If you booked through an agent, the agent processes the refund and may take longer than the airline would.' },
    ],
  },
  {
    id: 'prices',
    title: 'Prices and payments',
    blurb: 'Why a price moved, and what we do about it.',
    articles: [
      { q: 'The price changed when I clicked through', a: 'Fares and room rates move in real time and providers do not always publish extras in the headline price. Report it on the result card and we re-check that provider within the hour — repeated offenders are removed from results.' },
      { q: 'Do you charge in my currency?', a: 'We display in the currency you pick in the header. The provider charges in their own currency, so your bank may apply a conversion fee. Cards with no foreign transaction fee avoid this.' },
      { q: 'Travlr never takes your payment', a: 'There is no checkout on this site. If a page asks you to enter card details while claiming to be Travlr, it is not us — close it and report it to us.' },
    ],
  },
  {
    id: 'account',
    title: 'Your account',
    blurb: 'Sign-in, saved trips and alerts.',
    articles: [
      { q: 'Do I need an account to search?', a: 'No. Everything on Travlr works signed out. An account keeps your saved destinations, recent searches and price alerts in one place across devices.' },
      { q: 'How do I turn off price alerts?', a: 'Open Trips → Price alerts and switch off any route you no longer want watched. You can also unsubscribe from any alert email.' },
      { q: 'Delete my account', a: 'Ask from Trips → Settings and we remove your profile and saved data within 30 days.' },
    ],
  },
  {
    id: 'trust',
    title: 'Trust and safety',
    blurb: 'How we pick providers and what to do if one lets you down.',
    articles: [
      { q: 'How do you choose which providers to list?', a: 'Providers must be a licensed seller of travel in the market they serve, settle disputes within a set window, and keep customer ratings above our threshold. We review the list quarterly.' },
      { q: 'A provider is not responding', a: 'Tell us with the booking reference and dates. We escalate through our partner contact, which is usually faster than a public support queue, though the contract remains between you and them.' },
      { q: 'Spotting a fake travel site', a: 'Check the domain letter by letter, never pay by bank transfer, and be suspicious of a deal that only exists on a messaging app. Travlr will never ask you to pay us directly.' },
    ],
  },
]

export const AI_SUGGESTIONS = [
  'Cheap beach weekend from Bengaluru in November',
  'Where can I fly direct from Delhi under ₹15,000?',
  'Five days in Vietnam with a ₹60,000 budget',
  'Somewhere cool in June for a family with a toddler',
  'Is it cheaper to fly Tuesday or Friday to Goa?',
  'Plan a 4-day road trip from Mumbai',
]

export const TRUST_STATS = [
  { value: '1,200+', label: 'airlines, hotel chains and hire companies compared' },
  { value: '₹0', label: 'booking fee, on every search, forever' },
  { value: '52 M', label: 'travellers used Travlr in the last 12 months' },
  { value: '140', label: 'countries with car hire coverage' },
]

export const FOOTER_LINKS = [
  {
    title: 'Plan your trip',
    links: [
      { label: 'Search flights', to: '/flights' },
      { label: 'Search hotels', to: '/stays' },
      { label: 'Car hire', to: '/cars' },
      { label: 'Explore everywhere', to: '/explore' },
      { label: 'Search with AI', to: '/ai' },
      { label: 'Plan a road trip', to: '/road-trip' },
      { label: 'Price alerts', to: '/trips?tab=alerts' },
    ],
  },
  {
    title: 'Popular routes',
    links: [
      { label: 'Bengaluru to Delhi', to: '/flights/results?from=BLR&to=DEL' },
      { label: 'Mumbai to Goa', to: '/flights/results?from=BOM&to=GOX' },
      { label: 'Delhi to Dubai', to: '/flights/results?from=DEL&to=DXB' },
      { label: 'Chennai to Colombo', to: '/flights/results?from=MAA&to=CMB' },
      { label: 'Hotels in Goa', to: '/stays/results?place=Goa' },
      { label: 'Hotels in Dubai', to: '/stays/results?place=Dubai' },
      { label: 'Car hire in Goa', to: '/cars/results?place=Goa' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Travlr', to: '/about' },
      { label: 'How we make money', to: '/about#money' },
      { label: 'Partner with us', to: '/partners' },
      { label: 'Press', to: '/about#press' },
      { label: 'Careers', to: '/about#careers' },
      { label: 'Help centre', to: '/help' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', to: '/legal/privacy' },
      { label: 'Cookie policy', to: '/legal/cookies' },
      { label: 'Terms of use', to: '/legal/terms' },
      { label: 'Accessibility', to: '/legal/accessibility' },
      { label: 'Security', to: '/legal/security' },
      { label: 'Sitemap', to: '/sitemap' },
    ],
  },
]

# Travlr

A travel meta-search front end — flights, stays and car hire compared across providers,
with no checkout: every result hands off to the provider. Built for the Team Alpha
Epitome hackathon from the project brief.

Light mode only, indigo-navy theme (`#0B1437` navy / `#4338CA` indigo), flat rounded
controls throughout, all data mocked.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```

Node 18+ is required. Nothing else to configure — there is no backend and no API key.

## What's in here

```
src/
  data/          mock data: airports, airlines, hotels, cars, providers, destinations, copy
  lib/           formatting, seeded randomness, photo + vector-fallback helpers
  store/         AppContext — auth, currency, language, wishlist, alerts, recent searches
  components/
    ui/          Icon set, Photo, Modal, Drawer, DragCarousel, PhotoGallery, small bits
    layout/      Header, Footer, AuthModal, Toast, CookieBar
    search/      FlightSearchForm, StaySearchForm, CarSearchForm, shared fields
    cards/       HotelCard, CarCard, DestinationCard, SwipeDeck
    results/     FlightRow, filters, ProviderDrawer, PriceCalendar, MapPanel, AlertButton
    sections/    reusable landing-page sections
  pages/         one file per route
```

## Routes

| Route | Page |
| --- | --- |
| `/flights` | Flight search landing (default route) |
| `/flights/results` | Flight results — filters, sorts, flexible-date calendar, packages |
| `/flights/offer/:id` | Itinerary detail, fare rules, all provider prices |
| `/stays` | Hotel search landing |
| `/stays/results` | Hotel results — list and map views |
| `/stays/hotel/:id` | Property detail, rooms, reviews |
| `/cars` | Car hire landing |
| `/cars/results` | Car results with full filter rail |
| `/cars/car/:id` | Car detail, what's included, supplier terms |
| `/explore` | Explore everywhere — swipe deck and grid |
| `/explore/:id` | Destination guide with price-by-month chart |
| `/ai` | Search with AI (scripted assistant) |
| `/road-trip` | AI road-trip planner |
| `/trips` | Saved places, price alerts, recent searches, settings |
| `/help`, `/help/:topic` | Help centre |
| `/about`, `/partners` | Company pages |
| `/legal/:doc` | Privacy, cookies, terms, accessibility, security |
| `/international`, `/sitemap` | Country sites, full sitemap |
| `/go` | Provider hand-off interstitial |
| `*` | 404 with routes back into the site |

Routing uses `HashRouter`, so the build also works when opened from a file path or
static host with no server-side rewrites.

## How the mock data works

`src/lib/rand.js` provides a seeded PRNG. Every generator (`searchFlights`,
`searchStays`, `searchCars`) is seeded from the query itself, so the same search always
returns the same results — a results page and its detail page agree without passing
state around, and a refresh doesn't reshuffle prices.

Swapping in a real backend means replacing those three functions (plus `respond()` in
`src/pages/AiSearch.jsx`) with API calls. The component layer takes the same shapes.

## Images

Photography is hot-linked from the Unsplash CDN. Every `<Photo>` also carries a
deterministic vector fallback drawn in `src/lib/photo.js` (skylines, coastlines,
mountains, hotel facades, car silhouettes), so the site still looks designed offline or
if a photo ID retires. Swap the IDs in `src/data/stays.js`, `src/data/cars.js` and
`src/data/content.js` for your own assets when you have them.

## Notes for the next pass

- Auth is mocked in `localStorage` (any email, 6+ character password).
- Price alerts and cookie preferences persist to `localStorage`; no email is sent.
- The provider hand-off at `/go` stops at an interstitial rather than opening a partner
  site, since the providers are fictional.

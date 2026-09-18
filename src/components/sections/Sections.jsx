import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import { Accordion, SectionHead } from '../ui/Bits'
import DragCarousel from '../ui/DragCarousel'
import DestinationCard from '../cards/DestinationCard'
import { DEALS, DESTINATIONS, INTERNATIONAL_SITES, TRUST_STATS } from '../../data/content'
import { useMoney } from '../../store/AppContext'

/* ------------------------------------------------- middle quick links */

const QUICK_LINKS = [
  {
    to: '/ai',
    icon: 'sparkles',
    title: 'Search with AI',
    body: 'Describe the trip in your own words and get answers, not a form. “Somewhere warm in March under ₹30,000.”',
  },
  {
    to: '/stays',
    icon: 'bed',
    title: 'Stays',
    body: 'Hotels, apartments and guest houses compared across every major booking site at once.',
  },
  {
    to: '/cars',
    icon: 'car',
    title: 'Car hire',
    body: 'International names and local independents, with one-way fees and driver age already priced in.',
  },
  {
    to: '/explore',
    icon: 'compass',
    title: 'Explore everywhere',
    body: 'No fixed destination? Swipe through places you can reach for less than you think.',
  },
]

export function QuickLinks({ exclude = [] }) {
  const links = QUICK_LINKS.filter((l) => !exclude.includes(l.to))
  return (
    <section className="shell py-14">
      <SectionHead
        eyebrow="Where next"
        title="Not sure yet? Start from here"
        sub="Four ways into the same 1,200 providers — pick whichever suits how you plan."
      />
      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="card group flex flex-col p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Icon name={l.icon} size={21} />
            </span>
            <h3 className="text-[16px] font-semibold text-navy">{l.title}</h3>
            <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-ink-muted">{l.body}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-indigo-700">
              Open
              <Icon name="arrowRight" size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- deals */

export function DealsRail({ title = 'Deals our travellers are booking now', sub, kinds }) {
  const money = useMoney()
  const deals = kinds ? DEALS.filter((d) => kinds.includes(d.kind)) : DEALS

  const linkFor = (d) =>
    d.kind === 'flight'
      ? `/flights/results?from=${d.from}&to=${d.to}&trip=return`
      : d.kind === 'stay'
        ? `/stays/results?place=${encodeURIComponent(d.place)}`
        : `/cars/results?place=${encodeURIComponent(d.place)}`

  return (
    <section className="shell py-14">
      <SectionHead
        eyebrow="Live prices"
        title={title}
        sub={sub || 'Prices refresh as providers update them. Nothing here is a landing-page-only rate.'}
        action={
          <Link to="/explore" className="btn-outline btn-sm">
            Explore everywhere <Icon name="arrowRight" size={15} />
          </Link>
        }
      />
      <DragCarousel itemClass="w-[290px]" label="Current deals">
        {deals.map((d) => (
          <Link
            key={d.id}
            to={linkFor(d)}
            className="card group flex h-full flex-col p-4 transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon name={d.kind === 'flight' ? 'plane' : d.kind === 'stay' ? 'bed' : 'car'} size={16} />
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.07em] text-ink-soft">
                {d.kind === 'flight' ? 'Flight' : d.kind === 'stay' ? 'Stay' : 'Car hire'}
              </span>
            </div>
            <h3 className="mt-3 text-[16px] font-semibold text-navy transition-colors group-hover:text-indigo-700">
              {d.title}
            </h3>
            <p className="mt-1 text-[13px] text-ink-muted">{d.sub}</p>
            <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
              <span className="text-[12px] text-ink-soft">{d.note}</span>
              <span className="text-right">
                <span className="tnum block text-[12px] text-ink-soft line-through">{money(d.was)}</span>
                <span className="tnum block text-[19px] font-bold leading-none text-navy">{money(d.price)}</span>
              </span>
            </div>
          </Link>
        ))}
      </DragCarousel>
    </section>
  )
}

/* -------------------------------------------------------- destinations */

export function DestinationRail({ title = 'Popular right now', sub, ids }) {
  const list = ids ? DESTINATIONS.filter((d) => ids.includes(d.id)) : DESTINATIONS.slice(0, 10)
  return (
    <section className="shell py-14">
      <SectionHead
        eyebrow="Inspiration"
        title={title}
        sub={sub}
        action={
          <Link to="/explore" className="btn-outline btn-sm">
            See all destinations <Icon name="arrowRight" size={15} />
          </Link>
        }
      />
      <DragCarousel itemClass="w-[236px]" label="Popular destinations">
        {list.map((d) => (
          <DestinationCard key={d.id} destination={d} size="tall" />
        ))}
      </DragCarousel>
    </section>
  )
}

/* ----------------------------------------------------------------- faq */

export function FaqSection({ items, title = 'Questions people ask us', sub, contextLabel }) {
  return (
    <section className="shell py-14">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHead eyebrow="Good to know" title={title} sub={sub} />
          <Link to="/help" className="btn-outline btn-sm">
            <Icon name="help" size={15} />
            {contextLabel || 'Visit the help centre'}
          </Link>
        </div>
        <Accordion items={items} />
      </div>
    </section>
  )
}

/* ------------------------------------------------- international sites */

export function InternationalStrip() {
  return (
    <section className="border-y border-line bg-white">
      <div className="shell py-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-semibold text-navy">Travlr in other countries</h2>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              Same search, local currencies, local providers and local support hours.
            </p>
          </div>
          <Link to="/international" className="text-[13.5px] font-semibold text-indigo-700 hover:underline">
            All Travlr sites
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {INTERNATIONAL_SITES.map((s) => (
            <Link
              key={s.code}
              to={`/international?site=${encodeURIComponent(s.code)}`}
              className="pill hover:border-indigo-300 hover:text-navy"
            >
              <Icon name="globe" size={13} />
              {s.label}
              <span className="text-ink-soft">{s.code}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- trust */

export function TrustStrip() {
  return (
    <section className="bg-navy py-10 text-white">
      <div className="shell grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_STATS.map((s) => (
          <div key={s.label}>
            <div className="tnum text-[30px] font-bold leading-none text-white">{s.value}</div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/65">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------ how it works */

export function HowItWorks() {
  const steps = [
    { icon: 'search', title: 'Search once', body: 'We ask every provider we work with for live prices on your exact dates.' },
    { icon: 'sliders', title: 'Compare honestly', body: 'Bags, fees and surcharges are folded in, so the cheapest row really is cheapest.' },
    { icon: 'external', title: 'Book with them', body: 'You finish on the provider’s own site. Travlr never handles your payment.' },
  ]
  return (
    <section className="shell py-14">
      <SectionHead eyebrow="How Travlr works" title="A comparison site, not a middleman" />
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white">
                <Icon name={s.icon} size={18} />
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-soft">Step {i + 1}</span>
            </div>
            <h3 className="mt-4 text-[16px] font-semibold text-navy">{s.title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

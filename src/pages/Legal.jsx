import { Link, useParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { EmptyState } from '../components/ui/Bits'

const DOCS = {
  privacy: {
    title: 'Privacy policy',
    updated: '12 August 2026',
    intro:
      'This policy explains what Travlr collects when you search, what we pass to a provider when you click through, and what we never do with any of it.',
    sections: [
      { h: 'What we collect', p: 'Your searches (route, dates, party size), the currency and language you pick, and the pages you open. If you create an account we also hold your name and email address. We do not ask for a passport number, a date of birth or a payment card, because we never take a booking.' },
      { h: 'What we share with providers', p: 'When you click through to a provider we pass the search itself — route, dates, cabin or room type — so their page opens on the right result. We do not pass your email address, your account or your search history. From that point their privacy policy applies to whatever you enter on their site.' },
      { h: 'Cookies and similar technologies', p: 'Essential cookies keep you signed in and remember your currency. Analytics cookies tell us which results people find useful and which filters go unused. You can choose essential-only from the banner or from your settings at any time, and the site works fully either way.' },
      { h: 'How long we keep things', p: 'Search history is kept for 18 months so we can show you recent searches and price trends. Account data is kept until you delete the account, then removed within 30 days. Aggregated, anonymised fare data is kept indefinitely — it cannot be traced back to a person.' },
      { h: 'Your rights', p: 'You can ask for a copy of everything we hold about you, correct anything wrong, or have it deleted. Write to privacy@travlr.example and we respond within 30 days. If you are in the EU or UK, the usual statutory rights apply in full.' },
      { h: 'Advertising', p: 'We do not sell your data to advertisers and we do not run behavioural advertising on this site. Providers pay us a referral fee on completed bookings — that is the entire commercial relationship.' },
    ],
  },
  cookies: {
    title: 'Cookie policy',
    updated: '12 August 2026',
    intro: 'Cookies are small files a site stores in your browser. Here is precisely what Travlr uses them for.',
    sections: [
      { h: 'Strictly necessary', p: 'Keep you signed in, remember your currency and language, hold your consent choice, and protect the site from automated abuse. These cannot be switched off without breaking the site.' },
      { h: 'Performance and analytics', p: 'Count page views, measure how long a search takes to return, and record which filters and sorts get used. Aggregated and never tied to a name.' },
      { h: 'Functional', p: 'Remember your recent searches, your saved destinations and any price alerts, so they survive a refresh and a new tab.' },
      { h: 'No advertising cookies', p: 'We do not set advertising or cross-site tracking cookies, and no advertising network runs on this site.' },
      { h: 'Managing cookies', p: 'Use the banner when you arrive, or change your mind any time from Trips → Settings → Privacy. Your browser settings can also clear or block cookies per site.' },
    ],
  },
  terms: {
    title: 'Terms of use',
    updated: '12 August 2026',
    intro: 'The short version: Travlr shows you prices, the provider sells you the travel, and your contract is with them.',
    sections: [
      { h: 'What Travlr is', p: 'A comparison service. We collect prices from airlines, agents, hotels and car hire companies and display them together. We are not a travel agent and we do not sell, issue or hold any booking.' },
      { h: 'Prices and availability', p: 'Prices come from providers and change constantly. We show the most recent price we have and re-check often, but the price on the provider’s own page at the moment of booking is the one that counts.' },
      { h: 'Your contract', p: 'When you click through and book, your contract is with that provider, under their terms. Changes, cancellations, refunds and complaints go to them. We will help you reach the right contact, but we cannot act on the booking.' },
      { h: 'Acceptable use', p: 'Search all you like as a human being. Scraping, automated querying at volume, and reselling our data are not permitted, and we rate-limit and block where we see them.' },
      { h: 'Liability', p: 'We take care to display prices accurately but cannot be liable for a provider’s error, a cancelled service or a price that changes between our page and theirs. Nothing here limits liability that cannot lawfully be limited.' },
      { h: 'This is a demo', p: 'Travlr is a hackathon prototype. All prices, properties, cars and providers shown are generated mock data, and no real booking can be made.' },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    updated: '12 August 2026',
    intro: 'We build to WCAG 2.2 AA and test with keyboard and screen reader on every release.',
    sections: [
      { h: 'What we do', p: 'Every control is reachable and operable by keyboard, focus is always visible, colour contrast meets AA across the indigo and navy palette, and every image carries a text alternative or is marked decorative.' },
      { h: 'Motion', p: 'Animations are short and purposeful. If your system asks for reduced motion, we honour it and turn transitions off.' },
      { h: 'Known gaps', p: 'The stylised map on hotel results is a visual aid; every property on it is also in the list view with full detail, which is the accessible equivalent.' },
      { h: 'Tell us', p: 'If something on Travlr blocks you, write to access@travlr.example. Accessibility bugs are treated as release blockers, not backlog items.' },
    ],
  },
  security: {
    title: 'Security',
    updated: '12 August 2026',
    intro: 'We hold less than most travel sites, because we never take a payment. Here is how we protect what we do hold.',
    sections: [
      { h: 'No card data, ever', p: 'Travlr has no checkout. No payment card ever touches our systems, so there is nothing of that kind to lose.' },
      { h: 'In transit and at rest', p: 'Everything is served over TLS 1.3. Account data is encrypted at rest and access is limited to staff who need it, with every access logged.' },
      { h: 'Reporting a vulnerability', p: 'Write to security@travlr.example with steps to reproduce. We acknowledge within one working day and will not pursue researchers acting in good faith.' },
      { h: 'Spotting a fake Travlr', p: 'We will never ask you to pay us directly, never ask for your card details over email or chat, and never ask for a bank transfer. If a page does, it is not us.' },
    ],
  },
}

export default function Legal() {
  const { doc } = useParams()
  const d = DOCS[doc]

  if (!d) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon="info"
          title="No such document"
          body="Our policies are all listed below."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(DOCS).map(([k, v]) => (
                <Link key={k} to={`/legal/${k}`} className="btn-outline btn-sm">
                  {v.title}
                </Link>
              ))}
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[1fr_260px]">
      <article className="max-w-2xl">
        <h1 className="text-[30px] font-semibold text-navy">{d.title}</h1>
        <p className="mt-2 text-[13px] text-ink-soft">Last updated {d.updated}</p>
        <p className="mt-5 text-[15.5px] leading-relaxed text-ink-muted">{d.intro}</p>

        <div className="mt-8 space-y-7">
          {d.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-[18px] font-semibold text-navy">{s.h}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-muted">{s.p}</p>
            </section>
          ))}
        </div>

        <div className="card mt-10 flex flex-wrap items-center justify-between gap-3 p-5">
          <p className="text-[14px] text-ink-muted">Questions about this policy?</p>
          <Link to="/help" className="btn-outline btn-sm">
            <Icon name="help" size={15} /> Help centre
          </Link>
        </div>
      </article>

      <aside className="lg:sticky lg:top-[120px] lg:h-fit">
        <div className="card p-5">
          <h2 className="text-[14.5px] font-semibold text-navy">All policies</h2>
          <div className="mt-3 space-y-1.5">
            {Object.entries(DOCS).map(([k, v]) => (
              <Link
                key={k}
                to={`/legal/${k}`}
                className={`block rounded-lg px-3 py-2 text-[13.5px] transition-colors ${
                  k === doc ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-ink-muted hover:bg-canvas hover:text-navy'
                }`}
              >
                {v.title}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

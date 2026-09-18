import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { Accordion, EmptyState } from '../components/ui/Bits'
import { FAQS, HELP_TOPICS } from '../data/content'

export default function Help() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const allArticles = HELP_TOPICS.flatMap((t) => t.articles.map((a) => ({ ...a, topic: t })))
    .concat(Object.values(FAQS).flat().map((a) => ({ ...a, topic: null })))

  const matches = q ? allArticles.filter((a) => `${a.q} ${a.a}`.toLowerCase().includes(q)) : []

  return (
    <>
      <section className="bg-navy">
        <div className="shell py-12">
          <h1 className="text-[30px] font-bold text-white sm:text-[38px]">How can we help?</h1>
          <p className="mt-2.5 max-w-xl text-[15.5px] text-white/70">
            Travlr is a comparison site, so most questions about a booking belong with the provider you booked through.
            We’ll tell you which is which.
          </p>
          <div className="relative mt-6 max-w-xl">
            <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles…"
              aria-label="Search help"
              className="field py-3.5 pl-11 text-[15px]"
            />
          </div>
        </div>
      </section>

      <div className="shell py-10">
        {q ? (
          matches.length ? (
            <>
              <p className="mb-4 text-[14px] text-ink-muted">
                {matches.length} {matches.length === 1 ? 'article' : 'articles'} matching “{query}”
              </p>
              <Accordion items={matches} idPrefix="search" />
            </>
          ) : (
            <EmptyState
              icon="help"
              title={`Nothing matches “${query}”`}
              body="Try a shorter phrase, or browse the topics below — most answers live in bookings or prices."
              action={
                <button type="button" onClick={() => setQuery('')} className="btn-primary">
                  Clear search
                </button>
              }
            />
          )
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {HELP_TOPICS.map((t) => (
                <Link
                  key={t.id}
                  to={`/help/${t.id}`}
                  className="card group flex items-start gap-4 p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon name={t.id === 'booking' ? 'ticket' : t.id === 'prices' ? 'tag' : t.id === 'account' ? 'user' : 'shield'} size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[16px] font-semibold text-navy group-hover:text-indigo-700">{t.title}</span>
                    <span className="mt-1 block text-[13.5px] text-ink-muted">{t.blurb}</span>
                    <span className="mt-2 block text-[12.5px] text-ink-soft">{t.articles.length} articles</span>
                  </span>
                </Link>
              ))}
            </div>

            <section className="mt-12">
              <h2 className="text-[20px] font-semibold text-navy">The questions we get most</h2>
              <div className="mt-4">
                <Accordion items={FAQS.general} idPrefix="general" />
              </div>
            </section>

            <section className="card mt-8 flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <h2 className="text-[17px] font-semibold text-navy">Still stuck?</h2>
                <p className="mt-1 max-w-xl text-[14px] text-ink-muted">
                  If your question is about a booking, contact the provider named in your confirmation email — they
                  hold the reservation. For anything about Travlr itself, we answer within one working day.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/help/booking" className="btn-outline btn-sm">
                  <Icon name="ticket" size={15} /> Booking help
                </Link>
                <a href="mailto:help@travlr.example" className="btn-primary btn-sm">
                  <Icon name="mail" size={15} /> Email us
                </a>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { SectionHead } from '../components/ui/Bits'
import { useApp } from '../store/AppContext'

export default function Partners() {
  const { notify } = useApp()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ company: '', email: '', type: 'Airline', volume: '' })

  const submit = (e) => {
    e.preventDefault()
    if (!form.company.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      notify('Add a company name and a work email so we can reply.')
      return
    }
    setSent(true)
    notify('Thanks — our partnerships team will be in touch.')
  }

  return (
    <>
      <section className="bg-navy">
        <div className="shell py-12 sm:py-16">
          <h1 className="max-w-3xl text-[32px] font-bold leading-tight text-white sm:text-[40px]">
            Get your fares in front of 52 million travellers
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/70">
            Airlines, hotel groups, OTAs and car hire companies list with Travlr on the same terms: live prices in,
            qualified traffic out, a fee only when a booking completes.
          </p>
        </div>
      </section>

      <div className="shell py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHead eyebrow="Why list with us" title="What partners get" />
            <div className="space-y-4">
              {[
                { icon: 'users', title: 'Intent, not impressions', body: 'Everyone arriving on your site has already picked dates, seen your price and chosen you over the alternatives on the same screen.' },
                { icon: 'tag', title: 'Cost per booking, not per click', body: 'You pay when a booking completes. No minimum spend, no bidding against yourself for placement.' },
                { icon: 'gear', title: 'A two-week integration', body: 'Standard feeds or a REST endpoint. Most partners are live inside a fortnight, with a sandbox from day one.' },
                { icon: 'eye', title: 'Straight reporting', body: 'Look-to-book, click-through and cancellation rates by route and market, refreshed hourly.' },
              ].map((c) => (
                <div key={c.title} className="card flex gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon name={c.icon} size={20} />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold text-navy">{c.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-[120px] lg:h-fit">
            <div className="card p-6">
              {sent ? (
                <div className="py-6 text-center">
                  <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <Icon name="checkCircle" size={24} />
                  </span>
                  <h2 className="text-[18px] font-semibold text-navy">Request received</h2>
                  <p className="mt-2 text-[14px] text-ink-muted">
                    Our partnerships team replies within two working days with sandbox credentials and the commercial
                    terms for your market.
                  </p>
                  <div className="mt-5 flex justify-center gap-2">
                    <button type="button" onClick={() => setSent(false)} className="btn-outline btn-sm">
                      Send another
                    </button>
                    <Link to="/help" className="btn-primary btn-sm">
                      Help centre
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <h2 className="text-[18px] font-semibold text-navy">Talk to partnerships</h2>
                    <p className="mt-1 text-[13.5px] text-ink-muted">
                      Tell us who you are and we’ll send the integration docs and commercials.
                    </p>
                  </div>
                  <div>
                    <label className="label" htmlFor="p-company">Company</label>
                    <input
                      id="p-company"
                      className="field"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="p-email">Work email</label>
                    <input
                      id="p-email"
                      type="email"
                      className="field"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="p-type">What do you sell?</label>
                    <select
                      id="p-type"
                      className="field"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                      {['Airline', 'Online travel agent', 'Hotel or hotel group', 'Car hire company', 'Something else'].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="p-volume">Monthly bookings (roughly)</label>
                    <input
                      id="p-volume"
                      className="field"
                      value={form.volume}
                      onChange={(e) => setForm({ ...form, volume: e.target.value })}
                      placeholder="e.g. 15,000"
                    />
                  </div>
                  <button type="submit" className="btn-primary btn-lg w-full">
                    Request the integration pack
                  </button>
                  <p className="text-center text-[12px] text-ink-soft">
                    Demo form — nothing is sent anywhere.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

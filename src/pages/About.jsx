import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { SectionHead } from '../components/ui/Bits'
import { TrustStrip } from '../components/sections/Sections'

export default function About() {
  return (
    <>
      <section className="bg-navy">
        <div className="shell py-12 sm:py-16">
          <h1 className="max-w-3xl text-[32px] font-bold leading-tight text-white sm:text-[42px]">
            We don’t sell travel. We tell you who’s cheapest.
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/70">
            Travlr compares flights, hotels and car hire across more than 1,200 providers and hands you over to the one
            you choose. There is no checkout here, no service fee, and no way for a provider to buy its way to the top
            of the list.
          </p>
        </div>
      </section>

      <div className="shell py-12">
        <section id="money" className="scroll-mt-28">
          <SectionHead
            eyebrow="How we make money"
            title="A referral fee from the provider, and nothing from you"
            sub="It matters that you know this, because it explains what we will and won’t do."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: 'wallet',
                title: 'What we earn',
                body: 'When you click through and book, the provider pays us a small fee. It is a fixed arrangement, agreed in advance, and it does not change your price.',
              },
              {
                icon: 'sort',
                title: 'What it does not buy',
                body: 'Ranking. Results are sorted on price, duration and rating. A provider paying us more does not move up, and paying us nothing does not keep them out.',
              },
              {
                icon: 'eye',
                title: 'What we show you',
                body: 'Every provider we have a live price from, including ones we earn nothing on. Where a major airline refuses to share fares, we say so at the top of the results.',
              },
            ].map((c) => (
              <div key={c.title} className="card p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon name={c.icon} size={20} />
                </span>
                <h3 className="mt-4 text-[16px] font-semibold text-navy">{c.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <TrustStrip />

      <div className="shell py-12">
        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Our rules" title="Four things we hold ourselves to" />
            <ul className="space-y-3">
              {[
                'The headline price includes the fees we know about. If a provider hides one, we add it and label it.',
                'No fake scarcity. “Only 3 seats left” appears when the provider reports three seats left, and not otherwise.',
                'No dark patterns at checkout, because there is no checkout. You leave us to book.',
                'If a provider repeatedly shows a price they will not honour, they come off the site.',
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-muted">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div id="press" className="card scroll-mt-28 p-5">
              <h2 className="text-[17px] font-semibold text-navy">Press</h2>
              <p className="mt-1.5 text-[14px] text-ink-muted">
                For data on fare trends, seasonal demand or comment on a story, write to{' '}
                <a href="mailto:press@travlr.example" className="link">press@travlr.example</a>. We usually reply the
                same day and can share anonymised search data on request.
              </p>
            </div>
            <div id="careers" className="card scroll-mt-28 p-5">
              <h2 className="text-[17px] font-semibold text-navy">Careers</h2>
              <p className="mt-1.5 text-[14px] text-ink-muted">
                We are a small team in Bengaluru and Edinburgh working on search quality, provider integrations and
                making prices honest. Open roles go up here first.
              </p>
              <Link to="/partners" className="btn-outline btn-sm mt-3">
                Partner with us instead
              </Link>
            </div>
            <div className="card p-5">
              <h2 className="text-[17px] font-semibold text-navy">This is a demo</h2>
              <p className="mt-1.5 text-[14px] text-ink-muted">
                Travlr is a hackathon build. Every fare, hotel and car on this site is generated mock data, and no
                booking, payment or email is real. The interface, however, is the real proposal.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

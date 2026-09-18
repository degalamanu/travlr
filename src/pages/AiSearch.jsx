import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../components/ui/Icon'
import Photo from '../components/ui/Photo'
import { AI_SUGGESTIONS, DESTINATION_MAP, destinationPhoto } from '../data/content'
import { addDays, todayISO } from '../lib/format'
import { useMoney } from '../store/AppContext'

/* --------------------------------------------------------------------------
   A scripted assistant. It matches on keywords and answers from the same mock
   data the rest of the site uses, so every card it shows links somewhere real.
   Swapping this for a real model later means replacing `respond()` only.
-------------------------------------------------------------------------- */

const D = (id) => DESTINATION_MAP[id]
const depart = addDays(todayISO(), 24)
const ret = (n) => addDays(todayISO(), 24 + n)

const INTENTS = [
  {
    match: /(beach|sea|coast|sand|island)/i,
    reply: {
      text: 'For a beach weekend out of Bengaluru in November, three come up again and again. Goa is the cheapest and the easiest — one hour ten minutes, direct, several times a day. Sri Lanka works out slightly more but feels like a proper trip abroad. The Andamans are the quietest of the three, though you lose the better part of a day getting there.',
      destinations: ['goa', 'colombo', 'andaman'],
      actions: [
        { label: 'Goa flights from Bengaluru', to: `/flights/results?from=BLR&to=GOX&depart=${depart}&ret=${ret(3)}&trip=return` },
        { label: 'Beach stays in Goa', to: '/stays/results?place=Goa' },
      ],
      follow: ['Which of those has the best weather in November?', 'What about a week instead of a weekend?'],
    },
  },
  {
    match: /(direct|non[- ]?stop).*(delhi|del)|(delhi|del).*(direct|non[- ]?stop)/i,
    reply: {
      text: 'Under ₹15,000 return, direct from Delhi, the honest list is short: Dubai and Kathmandu almost always; Colombo and Bangkok when you catch a sale or fly midweek. Anything further and you are into one-stop fares. Tuesday and Wednesday departures run roughly 12% below Friday ones on all four.',
      destinations: ['dubai', 'kathmandu', 'bangkok'],
      actions: [
        { label: 'Delhi → Dubai, direct only', to: `/flights/results?from=DEL&to=DXB&depart=${depart}&ret=${ret(4)}&trip=return&direct=1` },
        { label: 'Delhi → Bangkok', to: `/flights/results?from=DEL&to=BKK&depart=${depart}&ret=${ret(5)}&trip=return` },
      ],
      follow: ['Show me the cheapest week to fly to Dubai', 'What can I do in Kathmandu in four days?'],
    },
  },
  {
    match: /(vietnam|sgn|hanoi|ho chi minh)/i,
    reply: {
      text: 'Five days in Vietnam on ₹60,000 is comfortable if the flight stays near ₹18,000. Rough split: ₹18,000 flights, ₹12,000 for four nights in mid-range hotels, ₹9,000 for the Hanoi–Da Nang internal hop, and the rest on food and a Ha Long day trip — where ₹2,000 a day covers eating very well. Book the internal flight the same day as the international one; it moves fastest.',
      destinations: ['vietnam'],
      actions: [
        { label: 'Flights to Ho Chi Minh City', to: `/flights/results?from=BLR&to=SGN&depart=${depart}&ret=${ret(6)}&trip=return` },
        { label: 'Build it as a flight + hotel package', to: `/flights/results?from=BLR&to=SGN&depart=${depart}&ret=${ret(6)}&trip=return&mode=package` },
      ],
      follow: ['Is seven days better than five?', 'What is the weather like in December?'],
    },
  },
  {
    match: /(cool|cold|hill|mountain|snow|june|summer).*(family|toddler|kid|child)|(family|toddler|kid|child).*(cool|hill|mountain)/i,
    reply: {
      text: 'In June you want altitude, not distance. Munnar is the gentlest with a toddler — short drives, no altitude sickness, and the tea estates keep everyone occupied. Manali is cooler and has more to do but the drive up from Bhuntar takes a toll on small children. Leh I would skip until they are older; 3,500 m is a lot for a toddler.',
      destinations: ['munnar', 'manali'],
      actions: [
        { label: 'Family stays in Munnar', to: '/stays/results?place=Munnar' },
        { label: 'Flights to Kochi', to: `/flights/results?from=BLR&to=COK&depart=${depart}&ret=${ret(4)}&trip=return` },
      ],
      follow: ['Do I need a car in Munnar?', 'Somewhere cool abroad in June?'],
    },
  },
  {
    match: /(tuesday|friday|which day|cheaper day|weekday|weekend)/i,
    reply: {
      text: 'Tuesday, usually — and by more than people expect. On Bengaluru to Goa, Tuesday and Wednesday departures average about 18% below Friday evening, which is the single most expensive slot of the week. Sunday evening returns carry a similar premium. If you can shift the return to Monday morning, that is normally the bigger saving of the two.',
      actions: [
        { label: 'Open the flexible-date calendar', to: `/flights/results?from=BLR&to=GOX&depart=${depart}&trip=oneway` },
        { label: 'Track this route for price drops', to: '/trips?tab=alerts' },
      ],
      follow: ['What about international routes?', 'How far ahead should I book?'],
    },
  },
  {
    match: /(road trip|drive|driving|self drive)/i,
    reply: {
      text: 'Four days out of Mumbai points one way: down the Konkan coast. Roughly 590 km over four days, so about three hours of driving a day with plenty left for stopping — Alibaug, then Ganpatipule, Malvan and into Goa. A compact SUV handles the ghat sections better than a hatchback and costs about ₹3,300 a day.',
      actions: [
        { label: 'See the full Konkan route', to: '/road-trip?route=konkan' },
        { label: 'Price a car in Mumbai', to: '/cars/results?place=Mumbai' },
      ],
      follow: ['What about a mountain drive instead?', 'Is a one-way drop-off expensive?'],
    },
  },
  {
    match: /(cheap|budget|under|affordable).*(abroad|international|foreign)|(abroad|international).*(cheap|budget)/i,
    reply: {
      text: 'Cheapest useful trips abroad from India right now, all in under ₹20,000 return: Colombo, Kathmandu, Dubai and Bangkok. Sri Lanka gives you the most for the money — beaches, hill trains and wildlife in a country you can cross in a day. Bangkok is the best value once you land, but the flight costs more than Colombo.',
      destinations: ['colombo', 'kathmandu', 'bangkok'],
      actions: [{ label: 'Explore everywhere under ₹20,000', to: '/explore' }],
      follow: ['Do I need a visa for Sri Lanka?', 'Which is best in December?'],
    },
  },
]

const FALLBACK = {
  text: 'I can work with that, but a couple of details will make the answer useful rather than generic: where you are flying from, roughly when, and what the budget looks like. Or start from one of these.',
  actions: [
    { label: 'Search flights', to: '/flights' },
    { label: 'Explore everywhere', to: '/explore' },
  ],
  follow: ['Cheap beach weekend from Bengaluru in November', 'Five days in Vietnam with a ₹60,000 budget'],
}

function respond(text) {
  const hit = INTENTS.find((i) => i.match.test(text))
  return hit ? hit.reply : FALLBACK
}

export default function AiSearch() {
  const money = useMoney()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      reply: {
        text: 'Tell me about the trip in your own words — where from, roughly when, and what you want out of it. I will compare the same 1,200 providers the search forms use, and every suggestion links straight to live prices.',
        follow: AI_SUGGESTIONS.slice(0, 3),
      },
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  const send = (text) => {
    const clean = text.trim()
    if (!clean || thinking) return
    setMessages((m) => [...m, { role: 'user', text: clean }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', reply: respond(clean) }])
      setThinking(false)
    }, 900)
  }

  return (
    <>
      <section className="bg-navy">
        <div className="shell py-10 sm:py-12">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-indigo-300">
            <Icon name="sparkles" size={15} />
            Search with AI
          </div>
          <h1 className="mt-3 max-w-2xl text-[30px] font-bold leading-tight text-white sm:text-[38px]">
            Describe the trip. We’ll do the comparing.
          </h1>
          <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-white/70">
            No forms, no drop-downs. Ask the way you would ask a friend who books a lot of flights.
          </p>
        </div>
      </section>

      <div className="shell grid gap-6 py-8 lg:grid-cols-[1fr_300px]">
        <div className="card flex min-h-[620px] flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {messages.map((m, i) =>
              m.role === 'user' ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <p className="max-w-[80%] rounded-2xl rounded-br-md bg-indigo-600 px-4 py-2.5 text-[14.5px] leading-relaxed text-white">
                    {m.text}
                  </p>
                </motion.div>
              ) : (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                    <Icon name="sparkles" size={16} />
                  </span>
                  <div className="min-w-0 flex-1 space-y-3">
                    <p className="max-w-[92%] rounded-2xl rounded-tl-md bg-canvas px-4 py-3 text-[14.5px] leading-relaxed text-navy">
                      {m.reply.text}
                    </p>

                    {m.reply.destinations && (
                      <div className="grid gap-2.5 sm:grid-cols-3">
                        {m.reply.destinations.map((id) => {
                          const d = D(id)
                          if (!d) return null
                          return (
                            <Link
                              key={id}
                              to={`/explore/${id}`}
                              className="group overflow-hidden rounded-xl border border-line transition-colors hover:border-indigo-300"
                            >
                              <Photo
                                src={destinationPhoto(d, 500, 320)}
                                alt={d.name}
                                kind="city"
                                seed={d.id}
                                variant={d.variant}
                                ratio="aspect-[16/10]"
                              />
                              <div className="p-3">
                                <div className="text-[14px] font-semibold text-navy group-hover:text-indigo-700">{d.name}</div>
                                <div className="mt-0.5 text-[12px] text-ink-soft">
                                  from <span className="tnum font-semibold text-navy">{money(d.price)}</span> return
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}

                    {m.reply.actions && (
                      <div className="flex flex-wrap gap-2">
                        {m.reply.actions.map((a) => (
                          <Link key={a.label} to={a.to} className="btn-quiet btn-sm">
                            {a.label}
                            <Icon name="arrowRight" size={14} />
                          </Link>
                        ))}
                      </div>
                    )}

                    {m.reply.follow && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {m.reply.follow.map((f) => (
                          <button key={f} type="button" onClick={() => send(f)} className="pill hover:border-indigo-300 hover:text-navy">
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            )}

            <AnimatePresence>
              {thinking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                    <Icon name="sparkles" size={16} />
                  </span>
                  <span className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-canvas px-4 py-3.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-ink-soft"
                        style={{ animation: `pulse-dot 1.2s ${i * 0.15}s infinite` }}
                      />
                    ))}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="border-t border-line bg-white p-4"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send(input)
                  }
                }}
                rows={1}
                placeholder="Where do you fancy? Ask anything about flights, stays or cars…"
                aria-label="Ask Travlr AI"
                className="field max-h-32 flex-1 resize-none py-3"
              />
              <button type="submit" disabled={!input.trim() || thinking} className="btn-primary h-[46px] px-4">
                <Icon name="send" size={18} />
                <span className="sr-only">Send</span>
              </button>
            </div>
            <p className="mt-2 text-[12px] text-ink-soft">
              Demo assistant — answers come from Travlr’s mock data set, not a live model.
            </p>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-[15px] font-semibold text-navy">Try asking</h2>
            <div className="mt-3 space-y-2">
              {AI_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="w-full rounded-xl border border-line px-3.5 py-2.5 text-left text-[13.5px] text-ink-muted transition-colors hover:border-indigo-300 hover:text-navy"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-[15px] font-semibold text-navy">What it can do</h2>
            <ul className="mt-3 space-y-3 text-[13.5px] text-ink-muted">
              {[
                { icon: 'search', text: 'Turn a vague idea into an actual search with dates and airports' },
                { icon: 'tag', text: 'Compare destinations on real fares rather than vibes' },
                { icon: 'calendar', text: 'Tell you which day and month is cheapest on a route' },
                { icon: 'route', text: 'Sketch an itinerary and price the car for it' },
              ].map((i) => (
                <li key={i.text} className="flex gap-2.5">
                  <Icon name={i.icon} size={16} className="mt-0.5 shrink-0 text-indigo-600" />
                  {i.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <h2 className="text-[15px] font-semibold text-navy">Rather use a form?</h2>
            <div className="mt-3 space-y-2">
              <Link to="/flights" className="btn-outline w-full justify-start">
                <Icon name="plane" size={16} /> Flight search
              </Link>
              <Link to="/stays" className="btn-outline w-full justify-start">
                <Icon name="bed" size={16} /> Hotel search
              </Link>
              <Link to="/cars" className="btn-outline w-full justify-start">
                <Icon name="car" size={16} /> Car hire
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

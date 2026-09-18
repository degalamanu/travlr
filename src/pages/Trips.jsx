import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import DestinationCard from '../components/cards/DestinationCard'
import { EmptyState, Switch } from '../components/ui/Bits'
import { DESTINATION_MAP } from '../data/content'
import { CURRENCIES } from '../lib/format'
import { LANGUAGES } from '../data/content'
import { useApp, useMoney } from '../store/AppContext'

const TABS = [
  { id: 'saved', label: 'Saved places', icon: 'heart' },
  { id: 'alerts', label: 'Price alerts', icon: 'bell' },
  { id: 'recent', label: 'Recent searches', icon: 'clock' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
]

export default function Trips() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'saved'
  const money = useMoney()
  const {
    user, openAuth, signOut, wishlist, toggleWishlist, alerts, removeAlert,
    recentSearches, clearRecentSearches, currency, setCurrency, language, setLanguage,
    cookieChoice, setCookieChoice, notify,
  } = useApp()

  const setTab = (id) => {
    const next = new URLSearchParams(params)
    next.set('tab', id)
    setParams(next)
  }

  const saved = wishlist.map((id) => DESTINATION_MAP[id]).filter(Boolean)

  return (
    <>
      <section className="bg-navy">
        <div className="shell py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-white sm:text-[34px]">
                {user ? `${user.name.split(' ')[0]}’s trips` : 'Your trips'}
              </h1>
              <p className="mt-2 text-[15px] text-white/70">
                {user
                  ? 'Saved places, tracked prices and everything you’ve searched for.'
                  : 'Everything here lives in this browser. Sign in to keep it across devices.'}
              </p>
            </div>
            {user ? (
              <button type="button" onClick={signOut} className="btn-sm bg-white/10 text-white hover:bg-white/20">
                Sign out
              </button>
            ) : (
              <button type="button" onClick={openAuth} className="btn-sm bg-white text-navy hover:bg-indigo-50">
                <Icon name="user" size={15} /> Sign in
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="border-b border-line bg-white">
        <div className="shell flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative inline-flex shrink-0 items-center gap-2 px-4 py-3.5 text-[14px] font-medium transition-colors ${
                tab === t.id ? 'text-indigo-700' : 'text-ink-muted hover:text-navy'
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
              {t.id === 'saved' && wishlist.length > 0 && (
                <span className="tnum rounded-full bg-indigo-50 px-1.5 py-0.5 text-[11.5px] font-bold text-indigo-700">
                  {wishlist.length}
                </span>
              )}
              {t.id === 'alerts' && alerts.length > 0 && (
                <span className="tnum rounded-full bg-indigo-50 px-1.5 py-0.5 text-[11.5px] font-bold text-indigo-700">
                  {alerts.length}
                </span>
              )}
              {tab === t.id && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-indigo-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="shell py-8">
        {tab === 'saved' && (
          saved.length === 0 ? (
            <EmptyState
              icon="heart"
              title="Nothing saved yet"
              body="Swipe through the Explore deck and everywhere you like lands here with a live fare next to it."
              action={
                <Link to="/explore" className="btn-primary">
                  <Icon name="compass" size={16} /> Start exploring
                </Link>
              }
            />
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[14px] text-ink-muted">
                  {saved.length} {saved.length === 1 ? 'place' : 'places'} saved · cheapest fares from Bengaluru
                </p>
                <Link to="/explore" className="btn-outline btn-sm">
                  <Icon name="plus" size={15} /> Add more
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {saved.map((d) => (
                  <DestinationCard key={d.id} destination={d} />
                ))}
              </div>

              <div className="card mt-6 divide-y divide-line">
                {saved.map((d) => (
                  <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <Link to={`/explore/${d.id}`} className="text-[15px] font-medium text-navy hover:text-indigo-700">
                        {d.name}
                      </Link>
                      <p className="text-[12.5px] text-ink-soft">
                        {d.country} · best {d.months} · {d.nights} nights suggested
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tnum text-[15px] font-bold text-navy">{money(d.price)}</span>
                      <Link
                        to={`/flights/results?from=BLR&to=${d.airport}&trip=return`}
                        className="btn-outline btn-sm"
                      >
                        See flights
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          toggleWishlist(d.id)
                          notify(`${d.name} removed from saved`)
                        }}
                        aria-label={`Remove ${d.name}`}
                        className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-canvas hover:text-coral"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        )}

        {tab === 'alerts' && (
          alerts.length === 0 ? (
            <EmptyState
              icon="bell"
              title="No price alerts yet"
              body="Track a route or a hotel and we email you when the price moves by more than 5%. One email, not a daily drip."
              action={
                <Link to="/flights" className="btn-primary">
                  <Icon name="plane" size={16} /> Search a route
                </Link>
              }
            />
          ) : (
            <>
              <p className="mb-5 text-[14px] text-ink-muted">
                {alerts.length} {alerts.length === 1 ? 'alert' : 'alerts'} running. We check prices four times a day.
              </p>
              <div className="card divide-y divide-line">
                {alerts.map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Icon name={a.kind === 'flight' ? 'plane' : a.kind === 'stay' ? 'bed' : 'compass'} size={18} />
                      </span>
                      <div>
                        <div className="text-[15px] font-medium text-navy">{a.title}</div>
                        <div className="text-[12.5px] text-ink-soft">
                          Tracking since {new Date(a.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          {a.price ? ` · was ${money(a.price)}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.to && (
                        <Link to={a.to} className="btn-outline btn-sm">
                          Check now
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          removeAlert(a.id)
                          notify('Alert removed')
                        }}
                        aria-label={`Stop tracking ${a.title}`}
                        className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-canvas hover:text-coral"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-canvas px-4 py-3 text-[13px] text-ink-muted">
                <Icon name="info" size={15} className="mt-0.5 shrink-0 text-indigo-600" />
                Demo note: alerts are stored in this browser and no email is actually sent.
              </p>
            </>
          )
        )}

        {tab === 'recent' && (
          recentSearches.length === 0 ? (
            <EmptyState
              icon="clock"
              title="No searches yet"
              body="Once you search for a flight, stay or car, it lands here so you can pick it back up."
              action={
                <Link to="/flights" className="btn-primary">
                  <Icon name="search" size={16} /> Start searching
                </Link>
              }
            />
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[14px] text-ink-muted">{recentSearches.length} recent searches</p>
                <button type="button" onClick={clearRecentSearches} className="btn-outline btn-sm">
                  <Icon name="trash" size={15} /> Clear all
                </button>
              </div>
              <div className="card divide-y divide-line">
                {recentSearches.map((r) => (
                  <Link key={r.at} to={r.to} className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-canvas">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas text-ink-muted">
                        <Icon name={r.kind === 'flight' ? 'plane' : r.kind === 'stay' ? 'bed' : 'car'} size={18} />
                      </span>
                      <div>
                        <div className="text-[15px] font-medium text-navy">{r.title}</div>
                        <div className="text-[12.5px] text-ink-soft">{r.sub}</div>
                      </div>
                    </div>
                    <Icon name="chevronRight" size={16} className="text-ink-soft" />
                  </Link>
                ))}
              </div>
            </>
          )
        )}

        {tab === 'settings' && (
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card p-5">
              <h2 className="text-[16px] font-semibold text-navy">Account</h2>
              {user ? (
                <div className="mt-3 space-y-3 text-[14px]">
                  <Field label="Name" value={user.name} />
                  <Field label="Email" value={user.email} />
                  <Field label="Member since" value={new Date(user.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
                  <button type="button" onClick={signOut} className="btn-outline btn-sm mt-1">
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-[14px] text-ink-muted">
                    You are browsing signed out. Everything still works — an account just keeps it in sync.
                  </p>
                  <button type="button" onClick={openAuth} className="btn-primary btn-sm mt-3">
                    Sign in or create an account
                  </button>
                </div>
              )}
            </section>

            <section className="card p-5">
              <h2 className="text-[16px] font-semibold text-navy">Region</h2>
              <div className="mt-3 space-y-4">
                <div>
                  <label className="label" htmlFor="set-currency">Currency</label>
                  <select
                    id="set-currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="field"
                  >
                    {Object.values(CURRENCIES).map((c) => (
                      <option key={c.code} value={c.code}>{c.code} · {c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="set-language">Language</label>
                  <select
                    id="set-language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="field"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="card p-5">
              <h2 className="text-[16px] font-semibold text-navy">Notifications</h2>
              <div className="mt-2 space-y-1">
                <Switch id="n1" checked label="Price-drop alerts" hint="One email when a tracked price moves 5%" onChange={() => notify('Demo setting — not persisted')} />
                <Switch id="n2" checked={false} label="Weekly deals digest" hint="Fares from your home airport" onChange={() => notify('Demo setting — not persisted')} />
                <Switch id="n3" checked label="Booking reminders" hint="A nudge before a tracked date sells out" onChange={() => notify('Demo setting — not persisted')} />
              </div>
            </section>

            <section className="card p-5">
              <h2 className="text-[16px] font-semibold text-navy">Privacy</h2>
              <p className="mt-2 text-[14px] text-ink-muted">
                Cookie preference: <span className="font-medium text-navy">{cookieChoice === 'all' ? 'All cookies' : cookieChoice === 'essential' ? 'Essential only' : 'Not set'}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setCookieChoice('essential')} className="btn-outline btn-sm">
                  Essential only
                </button>
                <button type="button" onClick={() => setCookieChoice('all')} className="btn-outline btn-sm">
                  Accept all
                </button>
                <Link to="/legal/privacy" className="btn-ghost btn-sm">
                  Privacy policy
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  )
}

function Field({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2.5">
      <span className="text-ink-muted">{label}</span>
      <span className="font-medium text-navy">{value}</span>
    </div>
  )
}

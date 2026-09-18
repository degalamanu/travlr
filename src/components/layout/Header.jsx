import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import Icon from '../ui/Icon'
import { Popover } from '../ui/Bits'
import { useApp } from '../../store/AppContext'
import { CURRENCIES } from '../../lib/format'
import { LANGUAGES } from '../../data/content'

const TABS = [
  { to: '/flights', label: 'Flights', icon: 'plane' },
  { to: '/stays', label: 'Stays', icon: 'bed' },
  { to: '/cars', label: 'Car hire', icon: 'car' },
]

const EXTRA = [
  { to: '/explore', label: 'Explore everywhere', icon: 'compass' },
  { to: '/ai', label: 'Search with AI', icon: 'sparkles' },
]

export default function Header() {
  const { user, currency, setCurrency, language, setLanguage, openAuth, signOut, wishlist, alerts } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location.pathname])

  const langLabel = LANGUAGES.find((l) => l.code === language)?.label || 'English'

  return (
    <header className="sticky top-0 z-50 bg-navy text-white">
      <div className="shell-wide">
        {/* Row 1 — identity and account */}
        <div className="flex h-[60px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="-ml-2 rounded-lg p-2 text-white/85 transition-colors hover:bg-white/10 md:hidden"
            >
              <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
            </button>
            <Logo />
          </div>

          <nav className="flex items-center gap-1" aria-label="Account and preferences">
            <Link
              to="/help"
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-[13.5px] font-medium text-white/85
                         transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              <Icon name="help" size={16} />
              Help
            </Link>

            <Popover
              label="Change language"
              align="right"
              width="w-60"
              trigger={
                <span className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-[13.5px] font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex">
                  <Icon name="globe" size={16} />
                  {language.split('-')[0].toUpperCase()}
                </span>
              }
            >
              {(close) => (
                <div className="max-h-80 overflow-y-auto py-1.5">
                  <div className="px-4 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
                    Language
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code)
                        close()
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-[14px] transition-colors hover:bg-canvas ${
                        l.code === language ? 'font-semibold text-indigo-700' : 'text-navy'
                      }`}
                    >
                      {l.label}
                      {l.code === language && <Icon name="check" size={15} />}
                    </button>
                  ))}
                </div>
              )}
            </Popover>

            <Popover
              label="Change currency"
              align="right"
              width="w-64"
              trigger={
                <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13.5px] font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white">
                  <Icon name="wallet" size={16} />
                  {currency}
                </span>
              }
            >
              {(close) => (
                <div className="py-1.5">
                  <div className="px-4 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
                    Currency
                  </div>
                  {Object.values(CURRENCIES).map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCurrency(c.code)
                        close()
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-[14px] transition-colors hover:bg-canvas ${
                        c.code === currency ? 'font-semibold text-indigo-700' : 'text-navy'
                      }`}
                    >
                      <span>
                        {c.code} <span className="text-ink-soft">· {c.label}</span>
                      </span>
                      {c.code === currency && <Icon name="check" size={15} />}
                    </button>
                  ))}
                </div>
              )}
            </Popover>

            {user ? (
              <Popover
                label="Your account"
                align="right"
                width="w-64"
                trigger={
                  <span className="ml-1 inline-flex items-center gap-2 rounded-xl py-1 pl-1 pr-2.5 transition-colors hover:bg-white/10">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-[13px] font-bold text-white">
                      {user.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="hidden text-[13.5px] font-medium text-white/90 sm:block">
                      {user.name.split(' ')[0]}
                    </span>
                    <Icon name="chevronDown" size={14} className="hidden text-white/60 sm:block" />
                  </span>
                }
              >
                {(close) => (
                  <div className="py-1.5">
                    <div className="border-b border-line px-4 pb-3 pt-2">
                      <div className="text-[14px] font-semibold text-navy">{user.name}</div>
                      <div className="truncate text-[12.5px] text-ink-soft">{user.email}</div>
                    </div>
                    {[
                      { to: '/trips', label: 'Trips & saved', icon: 'heart', count: wishlist.length },
                      { to: '/trips?tab=alerts', label: 'Price alerts', icon: 'bell', count: alerts.length },
                      { to: '/trips?tab=recent', label: 'Recent searches', icon: 'clock' },
                      { to: '/trips?tab=settings', label: 'Settings', icon: 'gear' },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={close}
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-navy transition-colors hover:bg-canvas"
                      >
                        <Icon name={item.icon} size={16} className="text-ink-muted" />
                        <span className="flex-1">{item.label}</span>
                        {item.count ? <span className="tnum text-[12px] text-ink-soft">{item.count}</span> : null}
                      </Link>
                    ))}
                    <div className="mt-1 border-t border-line pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          signOut()
                          close()
                        }}
                        className="w-full px-4 py-2.5 text-left text-[14px] text-ink-muted transition-colors hover:bg-canvas hover:text-navy"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </Popover>
            ) : (
              <button type="button" onClick={openAuth} className="btn btn-sm ml-1 bg-white text-navy hover:bg-indigo-50">
                Sign in
              </button>
            )}
          </nav>
        </div>

        {/* Row 2 — section switcher */}
        <div className="hidden h-[46px] items-center gap-1 md:flex">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `relative inline-flex items-center gap-2 rounded-t-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={t.icon} size={17} />
                  {t.label}
                  {isActive && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-indigo-400"
                      transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <span className="mx-2 h-5 w-px bg-white/15" />
          {EXTRA.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13.5px] transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </NavLink>
          ))}
          <div className="ml-auto flex items-center gap-2 text-[12.5px] text-white/55">
            <Icon name="shield" size={14} />
            Free to use · no booking fee
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-navy md:hidden"
          >
            <div className="shell space-y-1 py-3">
              {[...TABS, ...EXTRA, { to: '/trips', label: 'Trips & saved', icon: 'heart' }, { to: '/help', label: 'Help centre', icon: 'help' }].map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] transition-colors ${
                      isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10'
                    }`
                  }
                >
                  <Icon name={t.icon} size={18} />
                  {t.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

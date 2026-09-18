import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { money } from '../lib/format'

const KEY = 'travlr.state.v1'

const DEFAULT_STATE = {
  user: null,
  currency: 'INR',
  language: 'en-IN',
  wishlist: [],
  skipped: [],
  recentSearches: [],
  alerts: [],
  compare: [],
  cookieChoice: null,
}

function readState() {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(readState)
  const [authOpen, setAuthOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage can be unavailable in private windows — the app still works */
    }
  }, [state])

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const notify = useCallback((message, action) => setToast({ message, action, id: Date.now() }), [])

  const value = useMemo(() => {
    const patch = (p) => setState((s) => ({ ...s, ...p }))

    return {
      ...state,
      toast,
      notify,
      dismissToast: () => setToast(null),

      authOpen,
      openAuth: () => setAuthOpen(true),
      closeAuth: () => setAuthOpen(false),

      signIn: (email, name) => {
        const clean = String(email || '').trim()
        const derived = name || clean.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
        patch({ user: { email: clean, name: derived || 'Traveller', joined: new Date().toISOString() } })
        setAuthOpen(false)
        notify(`Signed in as ${clean}`)
      },
      signOut: () => {
        patch({ user: null })
        notify('Signed out')
      },

      setCurrency: (currency) => patch({ currency }),
      setLanguage: (language) => patch({ language }),
      setCookieChoice: (cookieChoice) => patch({ cookieChoice }),

      toggleWishlist: (id) =>
        setState((s) => {
          const has = s.wishlist.includes(id)
          return { ...s, wishlist: has ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] }
        }),
      saveDestination: (id) =>
        setState((s) => (s.wishlist.includes(id) ? s : { ...s, wishlist: [...s.wishlist, id] })),
      skipDestination: (id) =>
        setState((s) => (s.skipped.includes(id) ? s : { ...s, skipped: [...s.skipped, id] })),
      resetDeck: () => setState((s) => ({ ...s, skipped: [] })),

      addRecentSearch: (search) =>
        setState((s) => {
          const key = JSON.stringify(search.query)
          const rest = s.recentSearches.filter((r) => JSON.stringify(r.query) !== key)
          return { ...s, recentSearches: [{ ...search, at: Date.now() }, ...rest].slice(0, 8) }
        }),
      clearRecentSearches: () => patch({ recentSearches: [] }),

      toggleAlert: (alert) =>
        setState((s) => {
          const exists = s.alerts.some((a) => a.id === alert.id)
          return {
            ...s,
            alerts: exists ? s.alerts.filter((a) => a.id !== alert.id) : [{ ...alert, at: Date.now() }, ...s.alerts],
          }
        }),
      removeAlert: (id) => setState((s) => ({ ...s, alerts: s.alerts.filter((a) => a.id !== id) })),

      toggleCompare: (item) =>
        setState((s) => {
          const exists = s.compare.some((c) => c.id === item.id)
          if (exists) return { ...s, compare: s.compare.filter((c) => c.id !== item.id) }
          return { ...s, compare: [...s.compare, item].slice(-3) }
        }),
      clearCompare: () => patch({ compare: [] }),
    }
  }, [state, authOpen, toast, notify])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

/** Convenience hook: formats an INR amount in the user's chosen currency. */
export function useMoney() {
  const { currency } = useApp()
  return useMemo(() => (amount, opts) => money(amount, currency, opts), [currency])
}

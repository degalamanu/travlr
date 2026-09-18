import { useState } from 'react'
import Modal from '../ui/Modal'
import Icon from '../ui/Icon'
import { useApp } from '../../store/AppContext'

export default function AuthModal() {
  const { authOpen, closeAuth, signIn } = useApp()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter an email address so we can save your trips.')
      return
    }
    if (password.length < 6) {
      setError('Passwords are at least 6 characters.')
      return
    }
    setError('')
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      signIn(email, mode === 'signup' ? name : undefined)
      setEmail('')
      setPassword('')
      setName('')
    }, 550)
  }

  return (
    <Modal
      open={authOpen}
      onClose={closeAuth}
      title={mode === 'signin' ? 'Sign in to Travlr' : 'Create your Travlr account'}
      subtitle={
        mode === 'signin'
          ? 'Save searches, track prices and keep your wishlist across devices.'
          : 'It takes a moment and everything on Travlr stays free.'
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="label" htmlFor="auth-name">Full name</label>
            <input
              id="auth-name"
              className="field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Priya Sharma"
              autoComplete="name"
            />
          </div>
        )}
        <div>
          <label className="label" htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            type="email"
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label" htmlFor="auth-pass">Password</label>
          <input
            id="auth-pass"
            type="password"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </div>

        {error && (
          <p className="flex items-start gap-2 rounded-xl bg-orange-50 px-3.5 py-2.5 text-[13.5px] text-orange-800">
            <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn-primary btn-lg w-full">
          {busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        <div className="flex items-center gap-3 py-1">
          <span className="divider flex-1" />
          <span className="text-[12px] uppercase tracking-[0.08em] text-ink-soft">or</span>
          <span className="divider flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => signIn('traveller@gmail.com', 'Demo Traveller')} className="btn-outline">
            <Icon name="mail" size={16} /> Google
          </button>
          <button type="button" onClick={() => signIn('traveller@icloud.com', 'Demo Traveller')} className="btn-outline">
            <Icon name="user" size={16} /> Apple
          </button>
        </div>

        <p className="pt-1 text-center text-[13.5px] text-ink-muted">
          {mode === 'signin' ? "Don't have an account?" : 'Already with us?'}{' '}
          <button
            type="button"
            className="link font-medium"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError('')
            }}
          >
            {mode === 'signin' ? 'Create one' : 'Sign in instead'}
          </button>
        </p>

        <p className="flex items-start gap-2 rounded-xl bg-canvas px-3.5 py-3 text-[12.5px] leading-relaxed text-ink-muted">
          <Icon name="lock" size={14} className="mt-0.5 shrink-0 text-indigo-600" />
          This is a demo. Any email and a 6-character password will sign you in, and nothing leaves your browser.
        </p>
      </form>
    </Modal>
  )
}

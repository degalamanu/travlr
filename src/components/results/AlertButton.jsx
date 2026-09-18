import Icon from '../ui/Icon'
import { useApp } from '../../store/AppContext'

/** Fare tracking toggle. Persists to the user's alert list. */
export default function AlertButton({ alert, compact = false }) {
  const { alerts, toggleAlert, notify } = useApp()
  const on = alerts.some((a) => a.id === alert.id)

  const click = () => {
    toggleAlert(alert)
    notify(
      on ? 'Price alert turned off' : `Tracking ${alert.title}. We’ll email you when the price moves.`,
      on ? undefined : { to: '/trips?tab=alerts', label: 'View alerts' }
    )
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={click}
        aria-pressed={on}
        aria-label={on ? 'Stop tracking this price' : 'Track this price'}
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
          on ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-line text-ink-muted hover:border-indigo-300 hover:text-indigo-700'
        }`}
      >
        <Icon name="bell" size={16} filled={on} />
      </button>
    )
  }

  return (
    <button type="button" onClick={click} aria-pressed={on} className={on ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}>
      <Icon name="bell" size={15} filled={on} />
      {on ? 'Tracking price' : 'Track price'}
    </button>
  )
}

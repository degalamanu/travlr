import { useNavigate, useLocation } from 'react-router-dom'
import Drawer from '../ui/Drawer'
import Icon from '../ui/Icon'
import { Badge } from '../ui/Bits'
import { useApp, useMoney } from '../../store/AppContext'

/**
 * The hand-off panel. Travlr takes no payment, so every result ends here:
 * a like-for-like price list and a click through to the provider.
 */
export default function ProviderDrawer({ open, onClose, title, subtitle, providers = [], unit = 'total', detailTo }) {
  const navigate = useNavigate()
  const location = useLocation()
  const money = useMoney()
  const { notify } = useApp()

  const cheapest = providers.length ? Math.min(...providers.map((p) => p.price)) : 0

  const go = (p) => {
    const back = `${location.pathname}${location.search}`
    navigate(`/go?provider=${encodeURIComponent(p.name)}&price=${p.price}&back=${encodeURIComponent(back)}`)
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12.5px] leading-snug text-ink-muted">
            Travlr never takes your payment. You book on the provider’s own site.
          </p>
          {detailTo && (
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate(detailTo)
              }}
              className="btn-outline btn-sm shrink-0"
            >
              Full details
            </button>
          )}
        </div>
      }
    >
      <ul className="space-y-2.5">
        {providers.map((p, i) => {
          const isCheapest = p.price === cheapest
          return (
            <li
              key={p.id + i}
              className={`rounded-2xl border p-3.5 transition-colors ${
                isCheapest ? 'border-indigo-300 bg-indigo-50/50' : 'border-line bg-white hover:border-line-strong'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-semibold text-navy">{p.name}</span>
                    {isCheapest && <Badge tone="indigo">Cheapest</Badge>}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-ink-muted">
                    <span className="inline-flex items-center gap-1">
                      <Icon name="star" size={12} filled className="text-gold" />
                      {p.rating.toFixed(1)}
                    </span>
                    <span>{p.kind}</span>
                    {p.refundable && <span className="text-emerald-700">Refundable</span>}
                    {p.freeChanges && <span className="text-emerald-700">Free changes</span>}
                  </div>
                  {p.note && <p className="mt-1.5 text-[12.5px] text-ink-soft">{p.note}</p>}
                </div>

                <div className="shrink-0 text-right">
                  <div className="tnum text-[19px] font-bold leading-none text-navy">{money(p.price)}</div>
                  <div className="mt-1 text-[11.5px] text-ink-soft">{unit}</div>
                </div>
              </div>

              <button type="button" onClick={() => go(p)} className={`mt-3 w-full ${isCheapest ? 'btn-primary' : 'btn-outline'}`}>
                Go to {p.name}
                <Icon name="external" size={15} />
              </button>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={() => notify('Thanks — we re-check reported prices within the hour.')}
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-ink-muted underline decoration-line-strong underline-offset-2 transition-colors hover:text-navy"
      >
        <Icon name="alert" size={14} />
        Report a price that doesn’t match
      </button>
    </Drawer>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from '../components/ui/Icon'
import { useMoney } from '../store/AppContext'

/**
 * The hand-off screen. In a live site this is where we would bounce to the
 * provider; in the demo it stops here and explains exactly what would happen.
 */
export default function Redirecting() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const money = useMoney()
  const provider = params.get('provider') || 'the provider'
  const price = Number(params.get('price') || 0)
  const back = params.get('back') || '/flights'
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id)
          setDone(true)
          return 100
        }
        return p + 4
      })
    }, 45)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-lg text-center">
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white"
        >
          <Icon name={done ? 'checkCircle' : 'external'} size={26} />
        </motion.span>

        <h1 className="text-[24px] font-semibold text-navy">
          {done ? `This is where ${provider} takes over` : `Taking you to ${provider}…`}
        </h1>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-muted">
          {done ? (
            <>
              On the live site you would now be on {provider}’s own booking page
              {price ? <> with the {money(price)} fare already selected</> : null}. Travlr takes no payment and adds no
              fee, so the price you saw is the price they charge.
            </>
          ) : (
            <>Handing over your search so the right result is already loaded when you arrive.</>
          )}
        </p>

        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <motion.div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
        </div>

        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-7">
            <div className="card p-5 text-left">
              <h2 className="text-[15px] font-semibold text-navy">What happens next, for real</h2>
              <ul className="mt-3 space-y-2.5 text-[13.5px] text-ink-muted">
                {[
                  `${provider} issues the ticket or confirmation and emails it to you directly.`,
                  'Changes, cancellations and refunds are handled by them, under their policy.',
                  'Your card is charged by them. Travlr never sees or stores card details.',
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => navigate(back)} className="btn-primary">
                <Icon name="arrowLeft" size={16} /> Back to results
              </button>
              <Link to="/trips?tab=alerts" className="btn-outline">
                <Icon name="bell" size={16} /> Track this price instead
              </Link>
            </div>
            <p className="mt-4 text-[12.5px] text-ink-soft">
              Demo build — no external site is opened and nothing is booked.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

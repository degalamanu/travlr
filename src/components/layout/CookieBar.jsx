import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useApp } from '../../store/AppContext'

export default function CookieBar() {
  const { cookieChoice, setCookieChoice } = useApp()
  return (
    <AnimatePresence>
      {!cookieChoice && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 34, delay: 0.6 }}
          className="fixed inset-x-0 bottom-0 z-[75] border-t border-line bg-white/98 backdrop-blur"
        >
          <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[13.5px] leading-relaxed text-ink-muted">
              We use cookies to remember your currency, keep you signed in and understand which results people find
              useful. Nothing is sold to advertisers. Read the{' '}
              <Link to="/legal/cookies" className="link">cookie policy</Link>.
            </p>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => setCookieChoice('essential')} className="btn-outline btn-sm">
                Essential only
              </button>
              <button type="button" onClick={() => setCookieChoice('all')} className="btn-primary btn-sm">
                Accept all
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

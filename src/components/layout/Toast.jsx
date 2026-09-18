import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useApp } from '../../store/AppContext'

export default function Toast() {
  const { toast, dismissToast } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-white shadow-pop"
          >
            <Icon name="checkCircle" size={18} className="shrink-0 text-indigo-300" />
            <span className="text-[14px]">{toast.message}</span>
            {toast.action && (
              <Link
                to={toast.action.to}
                onClick={dismissToast}
                className="shrink-0 rounded-lg bg-white/10 px-2.5 py-1.5 text-[13px] font-semibold transition-colors hover:bg-white/20"
              >
                {toast.action.label}
              </Link>
            )}
            <button
              type="button"
              onClick={dismissToast}
              aria-label="Dismiss"
              className="-mr-1 shrink-0 rounded-lg p-1 text-white/60 transition-colors hover:text-white"
            >
              <Icon name="close" size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

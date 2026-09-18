import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from '../ui/Icon'
import PhotoGallery from '../ui/PhotoGallery'
import { ReviewScore } from '../ui/Bits'
import { useMoney } from '../../store/AppContext'
import { shortMoney } from '../../lib/format'
import { useApp } from '../../store/AppContext'

/**
 * A stylised map. No third-party tiles — a drawn grid with roads, a park and
 * water, with price pins positioned from each property's coordinates.
 */
export default function MapPanel({ hotels, activeId, setActiveId, place, linkFor }) {
  const money = useMoney()
  const { currency } = useApp()
  const active = hotels.find((h) => h.id === activeId)

  return (
    <div className="map-canvas relative h-full w-full overflow-hidden rounded-2xl border border-line">
      {/* Drawn geography */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M0 62 Q 24 56 44 66 T 100 60 L100 100 L0 100 Z" fill="#CBDCEB" opacity="0.75" />
        <ellipse cx="74" cy="26" rx="16" ry="11" fill="#CDE4D2" opacity="0.8" />
        <path d="M-2 40 L102 34" stroke="#FFFFFF" strokeWidth="2.4" />
        <path d="M-2 78 L102 72" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M22 -2 L30 102" stroke="#FFFFFF" strokeWidth="2.2" />
        <path d="M63 -2 L58 102" stroke="#FFFFFF" strokeWidth="1.8" />
        <path d="M-2 14 L102 20" stroke="#FFFFFF" strokeWidth="1.4" />
      </svg>

      <div className="pointer-events-none absolute left-4 top-4 rounded-xl bg-white/92 px-3 py-2 text-[12.5px] font-medium text-navy shadow-card backdrop-blur">
        <span className="flex items-center gap-1.5">
          <Icon name="pin" size={14} className="text-indigo-600" />
          {hotels.length} properties in {place}
        </span>
      </div>

      {/* Pins */}
      {hotels.map((h) => {
        const isActive = h.id === activeId
        return (
          <button
            key={h.id}
            type="button"
            onMouseEnter={() => setActiveId(h.id)}
            onFocus={() => setActiveId(h.id)}
            onClick={() => setActiveId(h.id)}
            aria-label={`${h.name}, ${money(h.pricePerNight)} per night`}
            style={{ left: `${h.mapX}%`, top: `${h.mapY}%`, zIndex: isActive ? 30 : 10 }}
            className={`tnum absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-[12px] font-bold
                        shadow-card transition-all duration-150 ${
                          isActive
                            ? 'scale-110 border-indigo-600 bg-indigo-600 text-white'
                            : 'border-white bg-white text-navy hover:border-indigo-300'
                        }`}
          >
            {shortMoney(h.pricePerNight, currency)}
          </button>
        )
      })}

      {/* Active card */}
      {active && (
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="absolute inset-x-4 bottom-4 z-40 sm:left-4 sm:right-auto sm:w-[320px]"
        >
          <Link to={linkFor(active)} className="card block overflow-hidden shadow-pop transition-colors hover:border-indigo-300">
            <div className="flex">
              <div className="w-[108px] shrink-0">
                <PhotoGallery photos={active.photos.slice(0, 2)} alt={active.name} seed={active.id} kind="hotel" ratio="aspect-square" />
              </div>
              <div className="min-w-0 flex-1 p-3">
                <h3 className="line-clamp-1 text-[14.5px] font-semibold text-navy">{active.name}</h3>
                <p className="mt-0.5 text-[12px] text-ink-soft">
                  {active.area} · {active.distanceKm} km from centre
                </p>
                <div className="mt-2 flex items-end justify-between">
                  <ReviewScore score={active.reviewScore} size="sm" />
                  <span className="text-right">
                    <span className="tnum block text-[16px] font-bold leading-none text-navy">{money(active.pricePerNight)}</span>
                    <span className="text-[11px] text-ink-soft">per night</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      <div className="pointer-events-none absolute bottom-3 right-3 text-[10.5px] text-ink-soft">
        Illustrative map · positions are approximate
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import Photo from '../ui/Photo'
import Icon from '../ui/Icon'
import { useApp, useMoney } from '../../store/AppContext'
import { destinationPhoto } from '../../data/content'

const SWIPE_DISTANCE = 110

export default function SwipeDeck({ destinations }) {
  const { wishlist, skipped, saveDestination, skipDestination, resetDeck, notify } = useApp()
  const [history, setHistory] = useState([])

  const queue = useMemo(
    () => destinations.filter((d) => !wishlist.includes(d.id) && !skipped.includes(d.id)),
    [destinations, wishlist, skipped]
  )

  const decide = (destination, liked) => {
    setHistory((h) => [...h, destination.id])
    if (liked) {
      saveDestination(destination.id)
      notify(`${destination.name} saved to your wishlist`, { to: '/trips', label: 'View' })
    } else {
      skipDestination(destination.id)
    }
  }

  if (queue.length === 0) {
    return (
      <div className="flex h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-white px-6 text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Icon name="checkCircle" size={24} />
        </span>
        <h3 className="text-[18px] font-semibold text-navy">That’s everywhere, for now</h3>
        <p className="mt-1.5 max-w-xs text-[14px] text-ink-muted">
          You saved {wishlist.length} {wishlist.length === 1 ? 'place' : 'places'}. Open your wishlist to price them up,
          or shuffle the deck and start again.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link to="/trips" className="btn-primary">
            <Icon name="heart" size={16} /> See saved places
          </Link>
          <button
            type="button"
            onClick={() => {
              resetDeck()
              setHistory([])
            }}
            className="btn-outline"
          >
            <Icon name="refresh" size={16} /> Shuffle again
          </button>
        </div>
      </div>
    )
  }

  const visible = queue.slice(0, 3)

  return (
    <div>
      <div className="relative h-[460px] select-none">
        <AnimatePresence>
          {visible
            .map((d, i) => (
              <Card
                key={d.id}
                destination={d}
                index={i}
                total={visible.length}
                onDecide={decide}
              />
            ))
            .reverse()}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => decide(queue[0], false)}
          aria-label={`Skip ${queue[0].name}`}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-ink-muted
                     transition-colors hover:border-coral hover:text-coral"
        >
          <Icon name="close" size={22} />
        </button>
        <Link
          to={`/explore/${queue[0].id}`}
          aria-label={`More about ${queue[0].name}`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink-muted
                     transition-colors hover:border-indigo-300 hover:text-indigo-700"
        >
          <Icon name="info" size={19} />
        </Link>
        <button
          type="button"
          onClick={() => decide(queue[0], true)}
          aria-label={`Save ${queue[0].name}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-700"
        >
          <Icon name="heart" size={21} filled />
        </button>
      </div>

      <p className="mt-3 text-center text-[12.5px] text-ink-soft">
        Drag the card, or use the buttons. {queue.length} {queue.length === 1 ? 'place' : 'places'} left ·{' '}
        {history.length} decided
      </p>
    </div>
  )
}

function Card({ destination, index, onDecide }) {
  const money = useMoney()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-11, 11])
  const likeOpacity = useTransform(x, [30, 130], [0, 1])
  const nopeOpacity = useTransform(x, [-130, -30], [1, 0])
  const isTop = index === 0

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: 10 - index,
        scale: 1 - index * 0.04,
        y: index * 14,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      whileDrag={{ cursor: 'grabbing' }}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_DISTANCE) onDecide(destination, true)
        else if (info.offset.x < -SWIPE_DISTANCE) onDecide(destination, false)
      }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
    >
      <div className={`relative h-full overflow-hidden rounded-3xl border border-line bg-white ${isTop ? 'grab shadow-pop' : 'shadow-card'}`}>
        <Photo
          src={destinationPhoto(destination, 900, 1100)}
          alt={destination.name}
          kind="city"
          seed={destination.id}
          variant={destination.variant}
          art="tall"
          ratio="h-full"
          eager
        >
          <span className="absolute inset-0 bg-gradient-to-t from-navy-900/88 via-navy-900/25 to-navy-900/5" />
        </Photo>

        {isTop && (
          <>
            <motion.span
              style={{ opacity: likeOpacity }}
              className="absolute left-5 top-5 rounded-xl border-2 border-emerald-400 px-3 py-1.5 text-[15px] font-extrabold uppercase tracking-wide text-emerald-300"
            >
              Save
            </motion.span>
            <motion.span
              style={{ opacity: nopeOpacity }}
              className="absolute right-5 top-5 rounded-xl border-2 border-orange-400 px-3 py-1.5 text-[15px] font-extrabold uppercase tracking-wide text-orange-300"
            >
              Skip
            </motion.span>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {destination.tags.map((t) => (
              <span key={t} className="rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-medium backdrop-blur-sm">
                {t}
              </span>
            ))}
          </div>
          <h3 className="text-[26px] font-semibold leading-tight">{destination.name}</h3>
          <p className="mt-1 text-[13.5px] text-white/80">{destination.country} · best {destination.months}</p>
          <p className="mt-2.5 line-clamp-2 text-[13.5px] leading-relaxed text-white/85">{destination.blurb}</p>
          <div className="mt-3.5 flex items-end justify-between">
            <span className="text-[13px] text-white/75">
              Flights from <span className="tnum text-[17px] font-bold text-white">{money(destination.price)}</span>
            </span>
            <span className="text-[12.5px] text-white/65">{destination.nights} nights suggested</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

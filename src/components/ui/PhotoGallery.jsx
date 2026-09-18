import { useRef, useState } from 'react'
import Photo from './Photo'
import Icon from './Icon'

/** Swipeable photo strip with dots. Arrows appear on hover at desktop sizes. */
export default function PhotoGallery({ photos = [], alt, seed, kind = 'hotel', ratio = 'aspect-[4/3]', children, rounded = '' }) {
  const ref = useRef(null)
  const [index, setIndex] = useState(0)
  const items = photos.length ? photos : [{ id: seed, url: null }]

  const go = (next, e) => {
    e?.stopPropagation()
    e?.preventDefault()
    const el = ref.current
    if (!el) return
    const target = Math.max(0, Math.min(items.length - 1, next))
    el.scrollTo({ left: el.clientWidth * target, behavior: 'smooth' })
    setIndex(target)
  }

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)))
  }

  return (
    <div className={`group/gal relative overflow-hidden ${rounded}`}>
      <div
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
      >
        {items.map((p, i) => (
          <div key={p.id + i} className="w-full shrink-0 snap-center">
            <Photo src={p.url} alt={`${alt} — photo ${i + 1}`} kind={kind} seed={`${seed}-${i}`} ratio={ratio} />
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => go(index - 1, e)}
            className={`absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full
                        bg-white/92 text-navy opacity-0 transition-opacity group-hover/gal:opacity-100 md:flex
                        ${index === 0 ? 'pointer-events-none !opacity-0' : ''}`}
          >
            <Icon name="chevronLeft" size={16} />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => go(index + 1, e)}
            className={`absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full
                        bg-white/92 text-navy opacity-0 transition-opacity group-hover/gal:opacity-100 md:flex
                        ${index === items.length - 1 ? 'pointer-events-none !opacity-0' : ''}`}
          >
            <Icon name="chevronRight" size={16} />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex items-center justify-center gap-1.5">
            {items.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full bg-white transition-all duration-200 ${
                  i === index ? 'w-4 opacity-100' : 'w-1.5 opacity-55'
                }`}
              />
            ))}
          </div>
        </>
      )}
      {children}
    </div>
  )
}

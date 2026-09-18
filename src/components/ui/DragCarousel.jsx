import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon'

/**
 * Horizontal rail: native scroll-snap on touch, click-and-drag on desktop,
 * arrows when there is somewhere to go. Used for deals, destinations,
 * hotel rails and car rails so they all behave identically.
 */
export default function DragCarousel({ children, itemClass = 'w-[268px]', gap = 'gap-4', label, arrows = true }) {
  const railRef = useRef(null)
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 })
  const [edges, setEdges] = useState({ start: true, end: false })

  const measure = useCallback(() => {
    const el = railRef.current
    if (!el) return
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    })
  }, [])

  useEffect(() => {
    measure()
    const el = railRef.current
    if (!el) return undefined
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure, children])

  const page = (dir) => {
    const el = railRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.82), behavior: 'smooth' })
  }

  const onPointerDown = (e) => {
    if (e.pointerType === 'touch') return
    const el = railRef.current
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: 0 }
    el.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!drag.current.active) return
    const el = railRef.current
    const dx = e.clientX - drag.current.startX
    drag.current.moved = Math.abs(dx)
    el.scrollLeft = drag.current.startScroll - dx
  }

  const endDrag = (e) => {
    const el = railRef.current
    if (drag.current.active) el?.releasePointerCapture?.(e.pointerId)
    // Swallow the click that follows a real drag so cards don't navigate.
    const moved = drag.current.moved
    drag.current.active = false
    if (moved > 6) {
      const swallow = (ev) => {
        ev.stopPropagation()
        ev.preventDefault()
      }
      el?.addEventListener('click', swallow, { capture: true, once: true })
      setTimeout(() => el?.removeEventListener('click', swallow, { capture: true }), 60)
    }
  }

  return (
    <div className="relative">
      <div
        ref={railRef}
        aria-label={label}
        className={`no-scrollbar grab flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-1 ${gap}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {Array.isArray(children)
          ? children.map((child, i) => (
              <div key={i} className={`shrink-0 snap-start ${itemClass}`}>
                {child}
              </div>
            ))
          : children}
      </div>

      {arrows && (
        <>
          <RailButton side="left" hidden={edges.start} onClick={() => page(-1)} />
          <RailButton side="right" hidden={edges.end} onClick={() => page(1)} />
        </>
      )}
    </div>
  )
}

function RailButton({ side, hidden, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Scroll left' : 'Scroll right'}
      tabIndex={hidden ? -1 : 0}
      className={`absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full
                  border border-line bg-white text-navy shadow-lift transition-all duration-200
                  hover:border-indigo-300 hover:text-indigo-700 md:flex
                  ${side === 'left' ? '-left-4' : '-right-4'}
                  ${hidden ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <Icon name={side === 'left' ? 'chevronLeft' : 'chevronRight'} size={18} />
    </button>
  )
}

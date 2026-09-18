import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon'

/* ---------------------------------------------------------------- Popover */

export function Popover({ trigger, children, align = 'right', width = 'w-72', label }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="outline-none"
      >
        {typeof trigger === 'function' ? trigger(open) : trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-50 mt-2 ${width} ${align === 'right' ? 'right-0' : 'left-0'}
                        overflow-hidden rounded-2xl border border-line bg-white shadow-pop`}
          >
            {typeof children === 'function' ? children(() => setOpen(false)) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------------------------------------------------------- Stepper */

export function Stepper({ label, hint, value, onChange, min = 0, max = 9 }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <div className="text-[15px] font-medium text-navy">{label}</div>
        {hint && <div className="text-[13px] text-ink-soft">{hint}</div>}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={`Fewer ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-navy
                     transition-colors hover:border-indigo-400 hover:text-indigo-700 disabled:opacity-35 disabled:hover:border-line"
        >
          <Icon name="minus" size={16} />
        </button>
        <span className="tnum w-8 text-center text-[15px] font-semibold text-navy">{value}</span>
        <button
          type="button"
          aria-label={`More ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-navy
                     transition-colors hover:border-indigo-400 hover:text-indigo-700 disabled:opacity-35 disabled:hover:border-line"
        >
          <Icon name="plus" size={16} />
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- Checkbox */

export function Checkbox({ checked, onChange, label, hint, count }) {
  return (
    <label className="group flex cursor-pointer items-start gap-3 py-2">
      <span
        className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
          checked ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-line-strong bg-white group-hover:border-indigo-400'
        }`}
      >
        {checked && <Icon name="check" size={13} strokeWidth={2.6} />}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-[14px] text-navy">{label}</span>
          {count != null && <span className="tnum text-[12px] text-ink-soft">{count}</span>}
        </span>
        {hint && <span className="mt-0.5 block text-[12px] text-ink-soft">{hint}</span>}
      </span>
    </label>
  )
}

/* ---------------------------------------------------------------- Switch */

export function Switch({ checked, onChange, label, hint, id }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 py-1.5">
      <span>
        <span className="block text-[14px] font-medium text-navy">{label}</span>
        {hint && <span className="block text-[12.5px] text-ink-soft">{hint}</span>}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-indigo-600' : 'bg-line-strong'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 520, damping: 34 }}
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white"
          style={{ left: checked ? 22 : 2 }}
        />
      </button>
    </label>
  )
}

/* ----------------------------------------------------------------- Stars */

export function Stars({ count, size = 13 }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-gold" aria-label={`${count} star`}>
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} name="star" size={size} filled />
      ))}
    </span>
  )
}

/* ----------------------------------------------------------------- Badge */

export function Badge({ children, tone = 'indigo', icon }) {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-700',
    navy: 'bg-navy text-white',
    green: 'bg-emerald-50 text-emerald-700',
    gold: 'bg-amber-50 text-amber-700',
    coral: 'bg-orange-50 text-orange-700',
    plain: 'bg-canvas text-ink-muted',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${tones[tone]}`}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  )
}

/* --------------------------------------------------------------- Score */

export function ReviewScore({ score, size = 'md' }) {
  const cls = size === 'sm' ? 'h-7 w-9 text-[13px]' : 'h-9 w-11 text-[15px]'
  return (
    <span className={`tnum inline-flex items-center justify-center rounded-lg rounded-bl-sm bg-navy font-bold text-white ${cls}`}>
      {score.toFixed(1)}
    </span>
  )
}

/* -------------------------------------------------------------- Skeleton */

export function SkeletonRow({ className = 'h-24' }) {
  return <div className={`skeleton rounded-2xl ${className}`} />
}

/* ------------------------------------------------------------ Empty state */

export function EmptyState({ icon = 'search', title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-white px-6 py-14 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="text-[17px] font-semibold text-navy">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-[14px] text-ink-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/* -------------------------------------------------------------- Section */

export function SectionHead({ eyebrow, title, sub, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-indigo-600">{eyebrow}</div>
        )}
        <h2 className="text-[24px] leading-tight text-navy sm:text-[28px]">{title}</h2>
        {sub && <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

/* ------------------------------------------------------------- Accordion */

export function Accordion({ items, idPrefix = 'acc' }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={`${idPrefix}-${i}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-canvas"
            >
              <span className="text-[15px] font-medium text-navy">{item.q}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-ink-muted">
                <Icon name="chevronDown" size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-ink-muted">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

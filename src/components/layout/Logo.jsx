import { Link } from 'react-router-dom'

export default function Logo({ tone = 'light', to = '/', className = '' }) {
  const mark = tone === 'light' ? '#FFFFFF' : '#4338CA'
  const word = tone === 'light' ? 'text-white' : 'text-navy'
  return (
    <Link to={to} className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Travlr — home">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors ${
          tone === 'light' ? 'bg-indigo-600 group-hover:bg-indigo-500' : 'bg-indigo-600'
        }`}
      >
        <svg viewBox="0 0 24 24" width="17" height="17" fill={mark} aria-hidden="true">
          <path d="M4.2 14.1 20 4.6c.9-.55 1.95.5 1.4 1.4l-9.5 15.8c-.5.85-1.8.6-1.96-.37l-.85-5.1-5.1-.85c-.97-.16-1.22-1.46-.37-1.96Z" />
        </svg>
      </span>
      <span className={`text-[21px] font-extrabold tracking-[-0.035em] ${word}`}>travlr</span>
    </Link>
  )
}

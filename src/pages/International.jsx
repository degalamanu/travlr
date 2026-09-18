import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { INTERNATIONAL_SITES } from '../data/content'
import { useApp } from '../store/AppContext'

export default function International() {
  const [params] = useSearchParams()
  const site = params.get('site')
  const selected = INTERNATIONAL_SITES.find((s) => s.code === site)
  const { notify } = useApp()

  return (
    <div className="shell py-10">
      <h1 className="text-[30px] font-semibold text-navy">Travlr around the world</h1>
      <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-ink-muted">
        Each country site runs the same comparison engine with local currency, local providers and support in local
        hours. Prices and taxes are shown the way that market expects them.
      </p>

      {selected && (
        <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon name="globe" size={20} />
            </span>
            <div>
              <h2 className="text-[17px] font-semibold text-navy">{selected.label} · {selected.code}</h2>
              <p className="text-[13.5px] text-ink-muted">Language: {selected.lang}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => notify(`This demo runs one site only — ${selected.code} is not deployed.`)}
            className="btn-primary btn-sm"
          >
            Go to {selected.code}
            <Icon name="external" size={15} />
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INTERNATIONAL_SITES.map((s) => (
          <Link
            key={s.code}
            to={`/international?site=${encodeURIComponent(s.code)}`}
            className={`card flex items-center justify-between gap-3 px-4 py-3.5 transition-all duration-200 hover:border-indigo-300 hover:shadow-lift ${
              s.code === site ? 'border-indigo-400' : ''
            }`}
          >
            <span>
              <span className="block text-[15px] font-medium text-navy">{s.label}</span>
              <span className="block text-[12.5px] text-ink-soft">{s.lang}</span>
            </span>
            <span className="text-[13px] font-medium text-indigo-700">{s.code}</span>
          </Link>
        ))}
      </div>

      <div className="card mt-8 flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="max-w-xl text-[14px] text-ink-muted">
          Staying on the India site? Prices are shown in the currency you pick in the header, wherever you are.
        </p>
        <Link to="/flights" className="btn-outline btn-sm">
          <Icon name="arrowLeft" size={15} /> Back to search
        </Link>
      </div>
    </div>
  )
}

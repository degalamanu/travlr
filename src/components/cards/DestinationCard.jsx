import { Link } from 'react-router-dom'
import Photo from '../ui/Photo'
import Icon from '../ui/Icon'
import { useApp, useMoney } from '../../store/AppContext'
import { destinationPhoto } from '../../data/content'

export default function DestinationCard({ destination, size = 'md' }) {
  const money = useMoney()
  const { wishlist, toggleWishlist, notify } = useApp()
  const saved = wishlist.includes(destination.id)

  const ratio = size === 'tall' ? 'aspect-[3/4]' : 'aspect-[4/3]'

  return (
    <Link
      to={`/explore/${destination.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-line bg-white transition-all duration-200 hover:border-indigo-300 hover:shadow-lift"
    >
      <Photo
        src={destinationPhoto(destination)}
        alt={destination.name}
        kind="city"
        seed={destination.id}
        variant={destination.variant}
        art={size === 'tall' ? 'tall' : 'wide'}
        ratio={ratio}
        imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
      >
        <span className="absolute inset-0 bg-gradient-to-t from-navy-900/72 via-navy-900/12 to-transparent" />
        <button
          type="button"
          aria-label={saved ? `Remove ${destination.name} from saved` : `Save ${destination.name}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist(destination.id)
            notify(saved ? `${destination.name} removed from saved` : `${destination.name} saved`, saved ? undefined : { to: '/trips', label: 'View' })
          }}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-colors ${
            saved ? 'bg-indigo-600 text-white' : 'bg-white/88 text-navy hover:bg-white'
          }`}
        >
          <Icon name="heart" size={17} filled={saved} />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[17px] font-semibold">{destination.name}</h3>
              <p className="text-[12.5px] text-white/75">{destination.country} · {destination.months}</p>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[11px] text-white/70">from</div>
              <div className="tnum text-[16px] font-bold">{money(destination.price)}</div>
            </div>
          </div>
        </div>
      </Photo>
    </Link>
  )
}

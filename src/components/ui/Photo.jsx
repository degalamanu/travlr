import { useEffect, useState } from 'react'
import { vectorArt } from '../../lib/photo'

/**
 * Photograph with a deterministic vector fallback.
 * If the CDN image fails (offline, blocked, retired ID) we swap in artwork
 * generated from the same seed, so the layout never shows a broken image.
 */
// Artwork is generated at roughly the shape of the frame it fills, so a
// portrait card doesn't crop the sides off a wide illustration.
const ART_SIZES = {
  wide: { w: 640, h: 420 },
  square: { w: 620, h: 600 },
  tall: { w: 600, h: 820 },
}

export default function Photo({
  src,
  alt = '',
  kind = 'city',
  seed = 'travlr',
  shape,
  body,
  variant,
  art = 'wide',
  className = '',
  imgClassName = '',
  ratio = 'aspect-[4/3]',
  eager = false,
  children,
}) {
  const size = ART_SIZES[art] || ART_SIZES.wide
  const fallback = vectorArt(kind, seed, { shape, body, variant, ...size })
  const [current, setCurrent] = useState(src || fallback)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setCurrent(src || fallback)
    setLoaded(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  return (
    <div className={`relative overflow-hidden bg-indigo-50 ${ratio} ${className}`}>
      <img
        src={current}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== fallback) setCurrent(fallback)
          setLoaded(true)
        }}
        className={`h-full w-full select-none object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
      {children}
    </div>
  )
}

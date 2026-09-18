// Photo helpers.
//
// Real photography is hot-linked from the Unsplash CDN (no API key needed for
// these direct image URLs). Every <Photo> also carries a deterministic vector
// fallback, so an offline viewer, a blocked CDN or a retired photo ID still
// renders artwork rather than a broken-image icon. The fallbacks are drawn in
// the same indigo-navy palette as the rest of the site.

import { makeRng } from './rand'

export function unsplash(id, w = 900, h) {
  const box = h ? `&h=${h}&fit=crop` : '&fit=max'
  return `https://images.unsplash.com/photo-${id}?auto=format&q=72&w=${w}${box}`
}

const PALETTES = [
  { sky: ['#F2F4FE', '#C7D0F4'], far: '#96A1DF', mid: '#5C6BD6', near: '#3A31AC', deep: '#231F5F', sun: '#F6B45A' },
  { sky: ['#EEF2FD', '#BCC8F0'], far: '#8590D6', mid: '#4F5FD6', near: '#2F2A8A', deep: '#1A1748', sun: '#F09B4B' },
  { sky: ['#F4F5FE', '#D3D9F8'], far: '#A3ADE6', mid: '#6E7DE0', near: '#4338CA', deep: '#26236E', sun: '#FFC978' },
  { sky: ['#EAEFFB', '#B7C6EC'], far: '#7C8BCB', mid: '#43509F', near: '#262A6B', deep: '#14173F', sun: '#E98B4E' },
]

const enc = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s{2,}/g, ' '))}`

/* ------------------------------------------------------------ landscapes */

// One smooth silhouette band across the frame.
function band(rng, w, h, baseY, amp, fill, opacity = 1) {
  const pts = 5
  let d = `M0 ${(baseY + rng.int(-amp * 0.2, amp * 0.2)).toFixed(0)}`
  for (let i = 1; i <= pts; i++) {
    const x = (w / pts) * i
    const cx = x - w / pts / 2
    const cy = baseY - rng.int(amp * 0.25, amp)
    d += ` Q${cx.toFixed(0)} ${cy.toFixed(0)} ${x.toFixed(0)} ${(baseY - rng.int(0, amp * 0.35)).toFixed(0)}`
  }
  d += ` L${w} ${h} L0 ${h} Z`
  return `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`
}

function peaks(rng, w, h, baseY, amp, fill, opacity = 1) {
  const n = rng.int(3, 4)
  let d = `M0 ${baseY}`
  for (let i = 1; i <= n; i++) {
    const x = (w / n) * i
    const px = x - w / n / 2
    const py = baseY - rng.int(amp * 0.55, amp)
    d += ` L${px.toFixed(0)} ${py.toFixed(0)} L${x.toFixed(0)} ${(baseY - rng.int(0, amp * 0.22)).toFixed(0)}`
  }
  d += ` L${w} ${h} L0 ${h} Z`
  return `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`
}

function mountainScene(rng, p, w, h) {
  const base = h * 0.74
  const snow = `<path d="M${w * 0.42} ${base - h * 0.34} l ${w * 0.05} ${h * 0.09} l -${w * 0.1} 0 Z" fill="#FFFFFF" opacity=".55"/>`
  return [
    band(rng, w, h, base - h * 0.1, h * 0.2, p.far, 0.55),
    peaks(rng, w, h, base, h * 0.42, p.mid, 0.95),
    snow,
    band(rng, w, h, base + h * 0.12, h * 0.12, p.near, 1),
    `<rect x="0" y="${h * 0.95}" width="${w}" height="${h * 0.05}" fill="${p.deep}" opacity=".85"/>`,
  ].join('')
}

function coastScene(rng, p, w, h) {
  const sea = h * 0.52
  const shore = h * 0.82
  const headland = band(rng, w, sea + 6, sea - h * 0.04, h * 0.13, p.mid, 0.9)

  let surf = ''
  for (let i = 0; i < 4; i++) {
    const y = sea + (shore - sea) * (0.2 + i * 0.2)
    surf += `<path d="M${-w * 0.05} ${y.toFixed(0)} Q ${w * 0.3} ${(y - 8).toFixed(0)} ${w * 0.62} ${y.toFixed(0)} T ${w * 1.05} ${(y - 3).toFixed(0)}"
              stroke="#FFFFFF" stroke-opacity="${(0.24 - i * 0.045).toFixed(2)}" stroke-width="${2.6 - i * 0.35}" fill="none" stroke-linecap="round"/>`
  }

  // Wet sand, then dry sand: the shoreline is what makes this read as a beach.
  const shoreline = `M0 ${(shore + rng.int(-10, 6)).toFixed(0)}
    Q ${(w * 0.28).toFixed(0)} ${(shore - 18).toFixed(0)} ${(w * 0.56).toFixed(0)} ${(shore + 6).toFixed(0)}
    T ${w} ${(shore - 8).toFixed(0)} L${w} ${h} L0 ${h} Z`

  return [
    `<rect x="0" y="${sea}" width="${w}" height="${shore - sea + 4}" fill="${p.near}"/>`,
    headland,
    surf,
    `<path d="${shoreline}" fill="#F0E2CB"/>`,
    `<path d="${shoreline}" fill="#FFFFFF" opacity=".28" transform="translate(0,-10)"/>`,
  ].join('')
}

function skylineScene(rng, p, w, h) {
  const horizon = h * 0.76
  const tower = (x, bw, bh, fill, lit) => {
    const top = horizon - bh
    let win = ''
    if (lit) {
      for (let wy = top + 12; wy < horizon - 14; wy += 18) {
        for (let wx = x + 7; wx < x + bw - 11; wx += 15) {
          if (rng.chance(0.4)) {
            win += `<rect x="${wx}" y="${wy}" width="5" height="8" rx="1" fill="#FFFFFF" opacity="${(0.3 + rng.next() * 0.45).toFixed(2)}"/>`
          }
        }
      }
    }
    return `<rect x="${x}" y="${top}" width="${bw}" height="${bh + 6}" rx="3" fill="${fill}"/>${win}`
  }

  let far = ''
  let x = -18
  while (x < w + 18) {
    const bw = rng.int(30, 64)
    far += tower(x, bw, rng.int(50, 140), p.far, false)
    x += bw + rng.int(6, 16)
  }

  let near = ''
  x = -14
  while (x < w + 18) {
    const bw = rng.int(38, 76)
    const bh = rng.int(70, 210)
    near += tower(x, bw, bh, p.near, true)
    if (rng.chance(0.3)) near += `<rect x="${x + bw / 2 - 2.5}" y="${horizon - bh - 24}" width="5" height="24" fill="${p.near}"/>`
    x += bw + rng.int(10, 22)
  }

  return `${far}<g opacity=".92">${near}</g><rect x="0" y="${horizon}" width="${w}" height="${h - horizon}" fill="${p.deep}" opacity=".92"/>`
}

/* ---------------------------------------------------------------- hotels */

function hotelScene(rng, p, w, h) {
  const style = rng.pick(['tower', 'resort', 'courtyard'])
  const ground = h * 0.88
  const windows = (x, y, bw, bh, step = 26) => {
    let out = ''
    for (let wy = y + 16; wy < y + bh - 16; wy += step) {
      for (let wx = x + 14; wx < x + bw - 18; wx += step) {
        out += `<rect x="${wx}" y="${wy}" width="${step * 0.46}" height="${step * 0.4}" rx="2.5" fill="#FFFFFF" opacity="${(0.28 + rng.next() * 0.5).toFixed(2)}"/>`
      }
    }
    return out
  }

  if (style === 'resort') {
    const bw = w * 0.78
    const bx = (w - bw) / 2
    const by = h * 0.4
    return [
      `<rect x="${bx}" y="${by}" width="${bw}" height="${ground - by}" rx="8" fill="${p.mid}"/>`,
      windows(bx, by, bw, ground - by, 30),
      `<path d="M${bx - 16} ${by} L${w / 2} ${by - h * 0.14} L${bx + bw + 16} ${by} Z" fill="${p.near}"/>`,
      `<rect x="${w * 0.12}" y="${ground}" width="${w * 0.76}" height="${h * 0.07}" rx="${h * 0.035}" fill="${p.far}" opacity=".85"/>`,
      `<rect x="0" y="${h * 0.95}" width="${w}" height="${h * 0.05}" fill="${p.deep}" opacity=".7"/>`,
    ].join('')
  }

  if (style === 'courtyard') {
    const wingW = w * 0.3
    const by = h * 0.3
    return [
      `<rect x="${w * 0.04}" y="${by}" width="${wingW}" height="${ground - by}" rx="6" fill="${p.near}"/>`,
      windows(w * 0.04, by, wingW, ground - by, 24),
      `<rect x="${w - w * 0.04 - wingW}" y="${by + h * 0.08}" width="${wingW}" height="${ground - by - h * 0.08}" rx="6" fill="${p.mid}"/>`,
      windows(w - w * 0.04 - wingW, by + h * 0.08, wingW, ground - by - h * 0.08, 24),
      `<rect x="${w * 0.36}" y="${h * 0.66}" width="${w * 0.28}" height="${ground - h * 0.66}" rx="5" fill="${p.far}"/>`,
      `<rect x="${w * 0.38}" y="${ground + 4}" width="${w * 0.24}" height="${h * 0.05}" rx="${h * 0.025}" fill="#FFFFFF" opacity=".45"/>`,
      `<rect x="0" y="${h * 0.94}" width="${w}" height="${h * 0.06}" fill="${p.deep}" opacity=".7"/>`,
    ].join('')
  }

  const bw = w * 0.48
  const bx = (w - bw) / 2
  const by = h * 0.14
  return [
    `<rect x="${bx - w * 0.19}" y="${h * 0.52}" width="${w * 0.17}" height="${ground - h * 0.52}" rx="5" fill="${p.far}"/>`,
    `<rect x="${bx + bw + w * 0.02}" y="${h * 0.46}" width="${w * 0.17}" height="${ground - h * 0.46}" rx="5" fill="${p.far}"/>`,
    `<rect x="${bx}" y="${by}" width="${bw}" height="${ground - by}" rx="7" fill="${p.near}"/>`,
    windows(bx, by, bw, ground - by, 26),
    `<rect x="${bx - 22}" y="${ground - 6}" width="${bw + 44}" height="10" rx="5" fill="${p.deep}"/>`,
    `<rect x="0" y="${h * 0.94}" width="${w}" height="${h * 0.06}" fill="${p.deep}" opacity=".8"/>`,
  ].join('')
}

/* ------------------------------------------------------------------ cars */

const CAR_BODIES = {
  hatchback: 'M26 84 L46 50 Q52 41 64 40 L132 36 Q148 35 160 44 L190 68 L244 74 Q260 76 260 90 L260 98 Q260 103 254 103 L32 103 Q24 103 24 95 Z',
  sedan: 'M18 86 L40 54 Q47 44 60 43 L140 38 Q158 37 172 47 L208 70 L258 77 Q274 79 274 92 L274 100 Q274 105 268 105 L24 105 Q16 105 16 96 Z',
  suv: 'M22 80 L40 40 Q47 29 62 28 L152 25 Q170 25 181 36 L211 64 L260 71 Q276 73 276 88 L276 101 Q276 106 270 106 L28 106 Q20 106 20 97 Z',
  mpv: 'M20 82 L34 36 Q40 25 56 24 L162 22 Q182 22 195 36 L223 66 L262 73 Q278 75 278 90 L278 102 Q278 107 272 107 L26 107 Q18 107 18 98 Z',
  luxury: 'M16 86 L38 52 Q46 41 60 40 L144 35 Q164 34 179 45 L218 70 L264 77 Q280 79 280 91 L280 99 Q280 104 274 104 L22 104 Q14 104 14 95 Z',
}

function carScene(rng, p, w, h, shape = 'sedan', body) {
  const paint = body || p.mid
  const path = CAR_BODIES[shape] || CAR_BODIES.sedan
  const wheel = (cx) => `
    <circle cx="${cx}" cy="104" r="24" fill="#171C38"/>
    <circle cx="${cx}" cy="104" r="12" fill="#E9ECF6"/>
    <circle cx="${cx}" cy="104" r="4" fill="#AEB6D0"/>`

  // The car is drawn on a 300×140 stage, then scaled to fill the frame.
  const scale = Math.min(w / 300, h / 150) * 1.06
  const tx = (w - 300 * scale) / 2
  const ty = (h - 150 * scale) / 2 + h * 0.04

  return `
    <g transform="translate(${tx.toFixed(1)}, ${ty.toFixed(1)}) scale(${scale.toFixed(3)})">
      <ellipse cx="150" cy="130" rx="146" ry="10" fill="${p.deep}" opacity=".13"/>
      <path d="${path}" fill="${paint}"/>
      <path d="M64 50 L132 45 L130 74 L52 74 Z" fill="#FFFFFF" opacity=".78"/>
      <path d="M142 45 L164 52 L194 72 L142 74 Z" fill="#FFFFFF" opacity=".78"/>
      <rect x="18" y="80" width="16" height="8" rx="4" fill="#E4572E" opacity=".9"/>
      <rect x="248" y="78" width="20" height="9" rx="4.5" fill="#F7B955"/>
      <path d="M40 96 L262 96" stroke="#000000" stroke-opacity=".08" stroke-width="3"/>
      ${wheel(86)}${wheel(220)}
    </g>`
}

/* ----------------------------------------------------------------- entry */

/**
 * Deterministic vector artwork used when photography is unavailable.
 * kind: 'city' | 'hotel' | 'car'
 */
export function vectorArt(kind, seed, opts = {}) {
  const rng = makeRng(`${kind}:${seed}`)
  const w = opts.w || 640
  const h = opts.h || 420
  const p = PALETTES[Math.floor(rng.next() * PALETTES.length)]
  const gid = `s${Math.abs(hashish(`${kind}${seed}`))}`

  let scene
  if (kind === 'car') {
    scene = carScene(rng, p, w, h, opts.shape, opts.body)
  } else if (kind === 'hotel') {
    scene = hotelScene(rng, p, w, h)
  } else {
    const variant = opts.variant || rng.pick(['skyline', 'mountain', 'coast'])
    scene =
      variant === 'mountain' ? mountainScene(rng, p, w, h) : variant === 'coast' ? coastScene(rng, p, w, h) : skylineScene(rng, p, w, h)
  }

  const sun =
    kind === 'car'
      ? ''
      : `<circle cx="${(w * (0.2 + rng.next() * 0.6)).toFixed(0)}" cy="${(h * (0.16 + rng.next() * 0.1)).toFixed(0)}" r="${(kind === 'hotel' ? h * 0.06 : h * 0.075).toFixed(0)}" fill="${p.sun}" opacity=".92"/>`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#${gid})"/>
    ${sun}${scene}
  </svg>`
  return enc(svg)
}

function hashish(s) {
  let h = 0
  for (let i = 0; i < String(s).length; i++) h = (Math.imul(31, h) + String(s).charCodeAt(i)) | 0
  return h
}

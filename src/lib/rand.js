// Deterministic pseudo-randomness.
// Same seed -> same results, so a search, its results page and the detail page
// all agree with each other without any state being passed around.

export function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < String(str).length; i++) {
    h ^= String(str).charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry32(seed) {
  let a = typeof seed === 'string' ? hashString(seed) : seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeRng(seed) {
  const r = mulberry32(seed)
  return {
    next: r,
    int: (min, max) => Math.floor(r() * (max - min + 1)) + min,
    pick: (arr) => arr[Math.floor(r() * arr.length)],
    pickMany: (arr, n) => {
      const copy = [...arr]
      const out = []
      while (out.length < Math.min(n, arr.length)) {
        out.push(copy.splice(Math.floor(r() * copy.length), 1)[0])
      }
      return out
    },
    chance: (p) => r() < p,
  }
}

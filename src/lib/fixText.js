/*
 * Render-time safety net for text that was stored with broken encoding
 * (UTF-8 bytes that were read as Windows-1252, e.g. "1â€“2 years").
 * Clean strings are returned unchanged.
 */
const CP1252 = {
  0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86,
  0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C,
  0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95,
  0x2013: 0x96, 0x2014: 0x97, 0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B,
  0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F,
}

const toByte = (ch) => {
  const n = ch.charCodeAt(0)
  return CP1252[n] ?? (n < 256 ? n : -1)
}

// Applied before the strict decode: a lone en dash read as cp1252 (E2 80 96) would otherwise decode to U+2016.
// Known sequences where the third byte was lost or replaced by a straight quote.
const LOOSE = [
  [/\u00e2\u20ac[\u201c"\u2013\u0093\u0096]/g, '\u2013'], // en dash
  [/\u00e2\u20ac[\u201d\u2014\u0094\u0097]/g, '\u2014'],  // em dash
  [/\u00e2\u20ac\u2122/g, '\u2019'],          // right single quote
  [/\u00e2\u20ac\u02dc/g, '\u2018'],          // left single quote
]

const SUSPECT = /[\u00c2-\u00f4][^\x00-\x7f]{1,3}/g
const utf8 = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { fatal: true }) : null

export function fixMojibake(value) {
  if (typeof value !== 'string' || !utf8) return value
  if (!/[\u00c2-\u00f4]/.test(value)) return value
  let out = value
  for (const [re, rep] of LOOSE) out = out.replace(re, rep)
  out = out.replace(SUSPECT, (m) => {
    for (let len = Math.min(4, m.length); len >= 2; len--) {
      const bytes = [...m.slice(0, len)].map(toByte)
      if (bytes.some((b) => b < 0)) continue
      try { return utf8.decode(Uint8Array.from(bytes)) + m.slice(len) } catch { /* try shorter */ }
    }
    return m
  })
  return out
}

export default fixMojibake
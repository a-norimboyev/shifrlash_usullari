export function encode(text) {
  try {
    return btoa(unescape(encodeURIComponent(text)))
  } catch {
    return null
  }
}

export function decode(encoded) {
  try {
    const cleaned = encoded.replace(/\s/g, '')
    return decodeURIComponent(escape(atob(cleaned)))
  } catch {
    return null
  }
}

export function buildBase64Preview(text) {
  if (!text) return []
  const bytes = new TextEncoder().encode(text.slice(0, 18))
  return Array.from(bytes).map((b, i) => ({
    index: i,
    char: text[i] ?? '',
    byte: b,
    bin: b.toString(2).padStart(8, '0'),
    hex: b.toString(16).padStart(2, '0').toUpperCase(),
  }))
}

const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function caesarChar(ch, shift, mode) {
  const s = mode === 'decrypt' ? (26 - shift) % 26 : shift
  if (ch >= 'A' && ch <= 'Z') return LATIN[(LATIN.indexOf(ch) + s) % 26]
  if (ch >= 'a' && ch <= 'z') return LATIN[(LATIN.indexOf(ch.toUpperCase()) + s) % 26].toLowerCase()
  return ch
}

export function buildCaesarPreview(text, shift, mode) {
  return text.split('').map((ch, index) => {
    const upper = ch.toUpperCase()
    const sourceIndex = LATIN.indexOf(upper)
    if (sourceIndex === -1) {
      return {
        index,
        source: ch,
        sourceIndex: null,
        shift,
        resultIndex: null,
        result: ch,
        skipped: true,
      }
    }

    const resultIndex = mode === 'encrypt'
      ? (sourceIndex + shift) % 26
      : (sourceIndex - shift + 26) % 26

    return {
      index,
      source: ch,
      sourceIndex,
      shift,
      resultIndex,
      result: caesarChar(ch, shift, mode),
      skipped: false,
    }
  })
}

export { LATIN }

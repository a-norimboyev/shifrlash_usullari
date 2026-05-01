const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function vigenereEncrypt(text, key) {
  const k = key.toUpperCase().replace(/[^A-Z]/g, '')
  if (!k.length) return text
  let ki = 0
  return text.split('').map(ch => {
    if (ch >= 'A' && ch <= 'Z') {
      const shift = LATIN.indexOf(k[ki % k.length])
      ki++
      return LATIN[(LATIN.indexOf(ch) + shift) % 26]
    }
    if (ch >= 'a' && ch <= 'z') {
      const shift = LATIN.indexOf(k[ki % k.length])
      ki++
      return LATIN[(LATIN.indexOf(ch.toUpperCase()) + shift) % 26].toLowerCase()
    }
    return ch
  }).join('')
}

export function vigenereDecrypt(text, key) {
  const k = key.toUpperCase().replace(/[^A-Z]/g, '')
  if (!k.length) return text
  let ki = 0
  return text.split('').map(ch => {
    if (ch >= 'A' && ch <= 'Z') {
      const shift = LATIN.indexOf(k[ki % k.length])
      ki++
      return LATIN[(LATIN.indexOf(ch) - shift + 26) % 26]
    }
    if (ch >= 'a' && ch <= 'z') {
      const shift = LATIN.indexOf(k[ki % k.length])
      ki++
      return LATIN[(LATIN.indexOf(ch.toUpperCase()) - shift + 26) % 26].toLowerCase()
    }
    return ch
  }).join('')
}

export function buildVigenereTable(key) {
  const k = key.toUpperCase().replace(/[^A-Z]/g, '')
  return LATIN.split('').map(ch => {
    const row = { char: ch, encrypted: '' }
    if (k.length > 0) {
      const idx = LATIN.indexOf(ch)
      row.encrypted = k.split('').map(kch => LATIN[(idx + LATIN.indexOf(kch)) % 26]).join('')
    }
    return row
  })
}

export function buildVigenerePreview(text, key, mode = 'encrypt') {
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '')
  if (!cleanKey.length) return []

  let keyIndex = 0
  const preview = []

  text.split('').forEach((ch, index) => {
    const upper = ch.toUpperCase()
    const sourceIndex = LATIN.indexOf(upper)
    if (sourceIndex === -1) {
      preview.push({
        index,
        source: ch,
        skipped: true,
        result: ch,
      })
      return
    }

    const keyChar = cleanKey[keyIndex % cleanKey.length]
    const keyShift = LATIN.indexOf(keyChar)
    const resultIndex = mode === 'encrypt'
      ? (sourceIndex + keyShift) % 26
      : (sourceIndex - keyShift + 26) % 26

    preview.push({
      index,
      source: ch,
      sourceIndex,
      keyChar,
      keyShift,
      resultIndex,
      result: ch === upper ? LATIN[resultIndex] : LATIN[resultIndex].toLowerCase(),
      skipped: false,
    })

    keyIndex++
  })

  return preview
}

export { LATIN }

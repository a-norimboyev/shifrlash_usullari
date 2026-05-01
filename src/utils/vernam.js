/**
 * Vernam (One-Time Pad) cipher
 * C[i] = M[i] XOR K[i]
 * Kalit matn uzunligiga teng yoki undan uzun bo'lishi kerak.
 */

/**
 * Tasodifiy kalit yaratish (matn uzunligi bo'yicha)
 * @param {number} length
 * @returns {string} hex string
 */
export function randomVernamKey(length) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Matnni Vernam usulida shifrlash
 * @param {string} text - oddiy matn
 * @param {string} keyHex - hex kalit (kamida text.length * 2 ta belgi)
 * @returns {{ cipher: string, keyHex: string }} - hex natija va ishlatilgan kalit
 */
export function vernamEncrypt(text, keyHex) {
  const bytes = new TextEncoder().encode(text)
  const keyBytes = hexToBytes(keyHex)
  if (keyBytes.length < bytes.length) {
    throw new Error('Kalit matndan qisqa!')
  }
  const out = bytes.map((b, i) => b ^ keyBytes[i])
  return bytesToHex(out)
}

/**
 * Vernam shifrlangan matnni deshifrlash
 * @param {string} cipherHex - shifrlangan hex matn
 * @param {string} keyHex - hex kalit
 * @returns {string} - oddiy matn
 */
export function vernamDecrypt(cipherHex, keyHex) {
  const bytes = hexToBytes(cipherHex)
  const keyBytes = hexToBytes(keyHex)
  if (keyBytes.length < bytes.length) {
    throw new Error('Kalit matndan qisqa!')
  }
  const out = bytes.map((b, i) => b ^ keyBytes[i])
  return new TextDecoder().decode(new Uint8Array(out))
}

export function buildVernamPreview(input, keyHex, mode = 'encrypt') {
  const keyBytes = hexToBytes(keyHex)
  const sourceBytes = mode === 'encrypt' ? Array.from(new TextEncoder().encode(input)) : hexToBytes(input)

  if (keyBytes.length < sourceBytes.length) {
    throw new Error('Kalit matndan qisqa!')
  }

  return sourceBytes.map((sourceByte, index) => {
    const keyByte = keyBytes[index]
    const resultByte = sourceByte ^ keyByte
    const resultChar = mode === 'decrypt' ? new TextDecoder().decode(new Uint8Array([resultByte])) : null

    return {
      index,
      sourceByte,
      keyByte,
      resultByte,
      sourceHex: sourceByte.toString(16).padStart(2, '0'),
      keyHex: keyByte.toString(16).padStart(2, '0'),
      resultHex: resultByte.toString(16).padStart(2, '0'),
      sourceBin: sourceByte.toString(2).padStart(8, '0'),
      keyBin: keyByte.toString(2).padStart(8, '0'),
      resultBin: resultByte.toString(2).padStart(8, '0'),
      sourceChar: mode === 'encrypt' ? new TextDecoder().decode(new Uint8Array([sourceByte])) : null,
      resultChar,
    }
  })
}

function hexToBytes(hex) {
  const clean = hex.replace(/\s+/g, '')
  if (clean.length % 2 !== 0) throw new Error('Noto\'g\'ri hex format')
  const bytes = []
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16))
  }
  return bytes
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ')
}

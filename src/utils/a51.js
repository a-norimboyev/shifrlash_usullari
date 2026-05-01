function clockLFSR(reg, bits, taps) {
  let feedback = 0
  for (const tap of taps) feedback ^= (reg >> tap) & 1
  return ((reg << 1) & ((1 << bits) - 1)) | feedback
}

function a51KeyStream(keyHex, frameNum, length) {
  const hex = keyHex.padEnd(16, '0').slice(0, 16)
  const keyBig = BigInt('0x' + hex)
  let r1 = 0, r2 = 0, r3 = 0

  for (let i = 0; i < 64; i++) {
    const bit = Number((keyBig >> BigInt(i)) & 1n)
    r1 ^= bit; r2 ^= bit; r3 ^= bit
    r1 = clockLFSR(r1, 19, [13, 16, 17, 18])
    r2 = clockLFSR(r2, 22, [20, 21])
    r3 = clockLFSR(r3, 23, [7, 20, 21, 22])
  }

  for (let i = 0; i < 22; i++) {
    const bit = (frameNum >> i) & 1
    r1 ^= bit; r2 ^= bit; r3 ^= bit
    r1 = clockLFSR(r1, 19, [13, 16, 17, 18])
    r2 = clockLFSR(r2, 22, [20, 21])
    r3 = clockLFSR(r3, 23, [7, 20, 21, 22])
  }

  for (let i = 0; i < 100; i++) {
    const c1 = (r1 >> 8) & 1, c2 = (r2 >> 10) & 1, c3 = (r3 >> 10) & 1
    const maj = (c1 & c2) | (c2 & c3) | (c1 & c3)
    if (c1 === maj) r1 = clockLFSR(r1, 19, [13, 16, 17, 18])
    if (c2 === maj) r2 = clockLFSR(r2, 22, [20, 21])
    if (c3 === maj) r3 = clockLFSR(r3, 23, [7, 20, 21, 22])
  }

  const bits = []
  for (let i = 0; i < length; i++) {
    const c1 = (r1 >> 8) & 1, c2 = (r2 >> 10) & 1, c3 = (r3 >> 10) & 1
    const maj = (c1 & c2) | (c2 & c3) | (c1 & c3)
    if (c1 === maj) r1 = clockLFSR(r1, 19, [13, 16, 17, 18])
    if (c2 === maj) r2 = clockLFSR(r2, 22, [20, 21])
    if (c3 === maj) r3 = clockLFSR(r3, 23, [7, 20, 21, 22])
    bits.push(((r1 >> 18) ^ (r2 >> 21) ^ (r3 >> 22)) & 1)
  }
  return bits
}

function bitsToByte(bits, offset) {
  let value = 0
  for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
    value |= bits[offset + bitIndex] << (7 - bitIndex)
  }
  return value
}

export function a51Encrypt(text, keyHex, frameNum) {
  const bytes = new TextEncoder().encode(text)
  const ksBits = a51KeyStream(keyHex, frameNum, bytes.length * 8)
  const result = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    const ksByte = bitsToByte(ksBits, i * 8)
    result[i] = bytes[i] ^ ksByte
  }
  return Array.from(result).map(b => b.toString(16).padStart(2, '0')).join(' ')
}

export function a51Decrypt(hexStr, keyHex, frameNum) {
  try {
    const parts = hexStr.trim().split(/\s+/)
    const bytes = Uint8Array.from(parts.map(h => parseInt(h, 16)))
    if (bytes.some(isNaN)) throw new Error()
    const ksBits = a51KeyStream(keyHex, frameNum, bytes.length * 8)
    const result = new Uint8Array(bytes.length)
    for (let i = 0; i < bytes.length; i++) {
      const ksByte = bitsToByte(ksBits, i * 8)
      result[i] = bytes[i] ^ ksByte
    }
    return new TextDecoder().decode(result)
  } catch (_) {
    return "Xato: noto'g'ri shifr matni (hex formatda kiriting)!"
  }
}

export function buildA51Preview(text, keyHex, frameNum, mode = 'encrypt') {
  try {
    let sourceBytes
    if (mode === 'decrypt') {
      const parts = text.trim().split(/\s+/).filter(Boolean)
      sourceBytes = Uint8Array.from(parts.map(h => parseInt(h, 16)))
      if (sourceBytes.some(isNaN)) return []
    } else {
      sourceBytes = new TextEncoder().encode(text)
    }

    const previewBytes = Array.from(sourceBytes)
    if (!previewBytes.length) return []

    const ksBits = a51KeyStream(keyHex, frameNum, previewBytes.length * 8)
    return previewBytes.map((byte, index) => {
      const keystreamByte = bitsToByte(ksBits, index * 8)
      const outputByte = byte ^ keystreamByte
      return {
        index,
        inputByte: byte,
        inputHex: byte.toString(16).padStart(2, '0'),
        inputBin: byte.toString(2).padStart(8, '0'),
        keystreamHex: keystreamByte.toString(16).padStart(2, '0'),
        keystreamBin: keystreamByte.toString(2).padStart(8, '0'),
        outputHex: outputByte.toString(16).padStart(2, '0'),
        outputBin: outputByte.toString(2).padStart(8, '0'),
        outputChar: mode === 'decrypt' ? String.fromCharCode(outputByte) : null,
      }
    })
  } catch (_) {
    return []
  }
}

export function randomHexKey() {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

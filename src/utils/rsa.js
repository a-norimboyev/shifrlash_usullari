function modPow(base, exp, mod) {
  let result = 1n
  base = base % mod
  while (exp > 0n) {
    if (exp % 2n === 1n) result = result * base % mod
    exp = exp / 2n
    base = base * base % mod
  }
  return result
}

function gcd(a, b) {
  while (b) { [a, b] = [b, a % b] }
  return a
}

function modInverse(e, phi) {
  let [old_r, r] = [e, phi]
  let [old_s, s] = [1n, 0n]
  while (r !== 0n) {
    const q = old_r / r
    ;[old_r, r] = [r, old_r - q * r]
    ;[old_s, s] = [s, old_s - q * s]
  }
  return ((old_s % phi) + phi) % phi
}

function isPrimeN(n) {
  if (n < 2n) return false
  if (n === 2n) return true
  if (n % 2n === 0n) return false
  for (let i = 3n; i * i <= n; i += 2n) {
    if (n % i === 0n) return false
  }
  return true
}

export function generateKeys(pVal, qVal) {
  const p = BigInt(pVal)
  const q = BigInt(qVal)
  if (!isPrimeN(p) || !isPrimeN(q)) return { error: 'p va q tub son bolishi shart!' }
  if (p === q) return { error: 'p va q har xil bolishi kerak!' }
  const n = p * q
  if (n < 256n) return { error: "p * q > 255 bolishi kerak (kattaroq sonlar tanlang)" }
  const phi = (p - 1n) * (q - 1n)
  let e = 65537n
  if (e >= phi || gcd(e, phi) !== 1n) {
    e = 3n
    while (e < phi && gcd(e, phi) !== 1n) e += 2n
  }
  const d = modInverse(e, phi)
  return { p, q, n, phi, e, d, error: null }
}

export function rsaEncrypt(text, e, n) {
  return text.split('').map(ch => modPow(BigInt(ch.charCodeAt(0)), e, n).toString()).join(' ')
}

export function rsaDecrypt(cipher, d, n) {
  try {
    return cipher.trim().split(/\s+/).map(num =>
      String.fromCharCode(Number(modPow(BigInt(num), d, n)))
    ).join('')
  } catch (_) {
    return "Xato: noto'g'ri shifr matni!"
  }
}

export function buildRsaPreview(input, exp, n, mode = 'encrypt') {
  try {
    if (mode === 'decrypt') {
      return input.trim().split(/\s+/).filter(Boolean).map((num, index) => {
        const c = BigInt(num)
        const decoded = modPow(c, exp, n)
        return {
          index,
          source: num,
          sourceCode: num,
          formula: `${num}^${exp.toString()} mod ${n.toString()}`,
          value: decoded.toString(),
          result: String.fromCharCode(Number(decoded)),
          resultCode: decoded.toString(),
        }
      })
    }

    return input.split('').map((ch, index) => {
      const m = BigInt(ch.charCodeAt(0))
      const encoded = modPow(m, exp, n)
      return {
        index,
        source: ch,
        sourceCode: m.toString(),
        formula: `${m.toString()}^${exp.toString()} mod ${n.toString()}`,
        value: encoded.toString(),
        result: encoded.toString(),
        resultCode: encoded.toString(),
      }
    })
  } catch (_) {
    return []
  }
}

export const PRESET_PRIMES = [
  { p: 61, q: 53 },
  { p: 89, q: 97 },
  { p: 113, q: 127 },
  { p: 151, q: 157 },
  { p: 199, q: 211 },
]

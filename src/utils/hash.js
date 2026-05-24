async function digest(algorithm, text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const sha1   = text => digest('SHA-1',   text)
export const sha256 = text => digest('SHA-256',  text)
export const sha512 = text => digest('SHA-512',  text)

export const ALGORITHMS = [
  { id: 'sha256', label: 'SHA-256', bits: 256,  fn: sha256 },
  { id: 'sha512', label: 'SHA-512', bits: 512,  fn: sha512 },
  { id: 'sha1',   label: 'SHA-1',   bits: 160,  fn: sha1   },
]

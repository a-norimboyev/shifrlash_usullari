import { useState } from 'react'
import AppIcon from './AppIcon'
import CopyBtn from './CopyBtn'
import { buildRsaPreview, generateKeys, rsaEncrypt, rsaDecrypt, PRESET_PRIMES } from '../utils/rsa'

export default function RsaTab() {
  const [p, setP] = useState('61')
  const [q, setQ] = useState('53')
  const [keys, setKeys] = useState(null)
  const [keyError, setKeyError] = useState('')
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [opError, setOpError] = useState('')
  const [mode, setMode] = useState('encrypt')

  const handleGenerate = () => {
    setOpError('')
    const result = generateKeys(p, q)
    if (result.error) { setKeyError(result.error); setKeys(null) }
    else { setKeys(result); setKeyError('') }
  }

  const handlePreset = (preset) => {
    setP(String(preset.p)); setQ(String(preset.q))
    setKeys(null); setKeyError('')
  }

  const handleEncrypt = () => {
    if (!keys) { setOpError('Avval kalit yarating!'); return }
    if (!inputText.trim()) { setOutputText(''); return }
    setMode('encrypt')
    setOpError(''); setOutputText(rsaEncrypt(inputText, keys.e, keys.n))
  }

  const handleDecrypt = () => {
    if (!keys) { setOpError('Avval kalit yarating!'); return }
    if (!inputText.trim()) { setOutputText(''); return }
    setMode('decrypt')
    setOpError(''); setOutputText(rsaDecrypt(inputText, keys.d, keys.n))
  }

  const rsaSteps = keys && inputText.trim()
    ? buildRsaPreview(inputText, mode === 'encrypt' ? keys.e : keys.d, keys.n, mode)
    : []

  return (
    <>
      <div className='rsa-section'>
        <h3 className='section-title'><AppIcon name='rsa' className='ui-icon' />Kalit Yaratish</h3>
        <p className='info-sub' style={{ marginBottom: '10px' }}>Tez tanlash:</p>
        <div className='preset-row'>
          {PRESET_PRIMES.map((pr, i) => (
            <button key={i} className='preset-btn' onClick={() => handlePreset(pr)}>
              p={pr.p}, q={pr.q}
            </button>
          ))}
        </div>
        <div className='pq-row'>
          <div className='form-group' style={{ flex: 1, marginBottom: 0 }}>
            <label>p (tub son)</label>
            <input className='pq-input' type='number' value={p} onChange={e => { setP(e.target.value); setKeys(null) }} />
          </div>
          <div className='form-group' style={{ flex: 1, marginBottom: 0 }}>
            <label>q (tub son)</label>
            <input className='pq-input' type='number' value={q} onChange={e => { setQ(e.target.value); setKeys(null) }} />
          </div>
          <button className='btn btn-encrypt' style={{ alignSelf: 'flex-end', flex: '0 0 auto' }} onClick={handleGenerate}>
            <AppIcon name='settings' className='ui-icon sm' />Kalit
          </button>
        </div>
        {keyError && <p className='error-msg'>{keyError}</p>}
        {keys && (
          <div className='keys-display'>
            <div className='key-box public'>
              <span className='key-label'><AppIcon name='public' className='ui-icon sm' />Ochiq kalit (Public Key)</span>
              <code>n = {keys.n.toString()}</code>
              <code>e = {keys.e.toString()}</code>
            </div>
            <div className='key-box private'>
              <span className='key-label'><AppIcon name='private' className='ui-icon sm' />Yopiq kalit (Private Key)</span>
              <code>n = {keys.n.toString()}</code>
              <code>d = {keys.d.toString()}</code>
            </div>
          </div>
        )}
        {keys && (
          <div className='info-box calc-panel' style={{ marginTop: '16px' }}>
            <h3><AppIcon name='calc' className='ui-icon' />Kalit qanday topildi</h3>
            <div className='calc-list'>
              <div className='calc-item'>
                <span className='calc-chip'>1</span>
                <span className='calc-main'>n = p × q = {keys.p.toString()} × {keys.q.toString()}</span>
                <span className='calc-result'>{keys.n.toString()}</span>
              </div>
              <div className='calc-item'>
                <span className='calc-chip'>2</span>
                <span className='calc-main'>φ(n) = (p - 1) × (q - 1)</span>
                <span className='calc-result'>{keys.phi.toString()}</span>
              </div>
              <div className='calc-item'>
                <span className='calc-chip'>3</span>
                <span className='calc-main'>e va φ(n) o'zaro tub tanlanadi</span>
                <span className='calc-result'>e = {keys.e.toString()}</span>
              </div>
              <div className='calc-item'>
                <span className='calc-chip'>4</span>
                <span className='calc-main'>d = e ning φ(n) bo'yicha teskari elementi</span>
                <span className='calc-result'>d = {keys.d.toString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='form-group'>
        <label><AppIcon name='input' className='ui-icon sm' />Kirish matni / shifr</label>
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder='Shifrlash uchun matn yoki deshifrlash uchun raqamlar...'
        />
      </div>
      {opError && <p className='error-msg'>{opError}</p>}

      <div className='btn-row'>
        <button className='btn btn-encrypt' onClick={handleEncrypt}><AppIcon name='encrypt' className='ui-icon sm' />Shifrlash</button>
        <button className='btn btn-decrypt' onClick={handleDecrypt}><AppIcon name='decrypt' className='ui-icon sm' />Deshifrlash</button>
        <button className='btn btn-clear' onClick={() => { setInputText(''); setOutputText(''); setOpError('') }}><AppIcon name='clear' className='ui-icon sm' />Tozalash</button>
      </div>

      <div className='form-group'>
        <label><AppIcon name='output' className='ui-icon sm' />Natija</label>
        <textarea readOnly value={outputText} placeholder='Natija shu yerda korinadi...' />
        <CopyBtn text={outputText} />
      </div>

      {rsaSteps.length > 0 && (
        <div className='info-box calc-panel'>
          <h3><AppIcon name='calc' className='ui-icon' />Barcha belgilar bo'yicha hisob</h3>
          <p className='info-sub'>
            {mode === 'encrypt' ? 'Shifrlash' : 'Deshifrlash'} formulasi: {mode === 'encrypt' ? 'c = m^e mod n' : 'm = c^d mod n'}. Barcha belgilar ko'rsatilgan.
          </p>
          <div className='calc-list calc-scroll'>
            {rsaSteps.map(step => (
              <div className='calc-item' key={step.index}>
                <span className='calc-chip'>#{step.index + 1}</span>
                <div className='calc-main'>
                  <strong>{step.source}</strong>
                  {' '}→ kod: {step.sourceCode}
                  <br />
                  {step.formula} = {step.value}
                </div>
                <span className='calc-result'>{step.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className='divider' />
      <div className='info-box'>
        <h3><AppIcon name='info' className='ui-icon' />RSA haqida</h3>
        <ul className='rsa-info-list'>
          <li>RSA — <b>ochiq kalitli</b> shifrlash algoritmi</li>
          <li>Shifrlash uchun <b>ochiq kalit</b> (n, e) ishlatiladi</li>
          <li>Deshifrlash uchun <b>yopiq kalit</b> (n, d) ishlatiladi</li>
          <li>Har bir belgi: <b>c = m^e mod n</b></li>
          <li>Qayta tiklash: <b>m = c^d mod n</b></li>
        </ul>
      </div>
    </>
  )
}

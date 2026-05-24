import { useState, useRef } from 'react'
import AppIcon from './AppIcon'
import CopyBtn from './CopyBtn'
import { buildVernamPreview, vernamEncrypt, vernamDecrypt, randomVernamKey } from '../utils/vernam'
import { useHistory } from '../context/HistoryContext'

export default function VernamTab() {
  const [inputText, setInputText] = useState('')
  const [keyHex, setKeyHex] = useState('')
  const [outputText, setOutputText] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('encrypt')
  const fileRef = useRef()
  const { addHistory } = useHistory()

  const handleGenerateKey = () => {
    if (!inputText) { setError('Avval matn kiriting!'); return }
    const byteLen = new TextEncoder().encode(inputText).length
    setKeyHex(randomVernamKey(byteLen))
    setError('')
  }

  const handleEncrypt = () => {
    setError('')
    try {
      if (!inputText.trim()) { setOutputText(''); return }
      if (!keyHex.trim()) { setError('Kalit kiriting yoki yarating!'); return }
      const result = vernamEncrypt(inputText, keyHex)
      setOutputText(result)
      setMode('encrypt')
      addHistory({ algo: 'vernam', algoLabel: 'Vernam', mode: 'encrypt', input: inputText.slice(0,60), output: result.slice(0,60) })
    } catch (e) { setError(e.message) }
  }

  const handleDecrypt = () => {
    setError('')
    try {
      if (!inputText.trim()) { setOutputText(''); return }
      if (!keyHex.trim()) { setError('Kalit kiriting!'); return }
      const result = vernamDecrypt(inputText, keyHex)
      setOutputText(result)
      setMode('decrypt')
      addHistory({ algo: 'vernam', algoLabel: 'Vernam', mode: 'decrypt', input: inputText.slice(0,60), output: result.slice(0,60) })
    } catch (e) { setError(e.message) }
  }

  const handleClear = () => { setInputText(''); setKeyHex(''); setOutputText(''); setError('') }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setInputText(ev.target.result)
    reader.readAsText(file)
  }

  const showXor = (() => {
    try {
      if (!inputText || !keyHex) return null
      return buildVernamPreview(inputText, keyHex, mode)
    } catch { return null }
  })()

  return (
    <>
      <div className='form-group'>
        <label>
          <AppIcon name='input' className='ui-icon sm' />Kirish (matn yoki shifrlangan hex)
          <button className='upload-btn' onClick={() => fileRef.current.click()}>
            <AppIcon name='upload' className='ui-icon sm' />Fayl yuklash
          </button>
          <input ref={fileRef} type='file' accept='.txt' style={{ display: 'none' }} onChange={handleFile} />
        </label>
        <textarea
          value={inputText}
          onChange={e => { setInputText(e.target.value); setError('') }}
          placeholder='Shifrlash uchun matn yoki deshifrlash uchun hex...'
        />
      </div>

      <div className='form-group'>
        <label><AppIcon name='key' className='ui-icon sm' />Bir martalik kalit (hex)</label>
        <div className='shift-row' style={{ gap: '10px' }}>
          <input
            className='pq-input'
            style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.8rem' }}
            type='text'
            value={keyHex}
            onChange={e => { setKeyHex(e.target.value); setError('') }}
            placeholder='Hex kalit (masalan: 3f a2 c1 ...)'
          />
          <button className='btn btn-secondary' style={{ whiteSpace: 'nowrap' }} onClick={handleGenerateKey}>
            <AppIcon name='random' className='ui-icon sm' />Kalit yaratish
          </button>
        </div>
        {error && <p className='error-msg' style={{ marginTop: '8px', marginBottom: 0 }}>{error}</p>}
      </div>

      <div className='btn-row'>
        <button className='btn btn-encrypt' onClick={handleEncrypt}><AppIcon name='encrypt' className='ui-icon sm' />Shifrlash</button>
        <button className='btn btn-decrypt' onClick={handleDecrypt}><AppIcon name='decrypt' className='ui-icon sm' />Deshifrlash</button>
        <button className='btn btn-clear' onClick={handleClear}><AppIcon name='clear' className='ui-icon sm' />Tozalash</button>
      </div>

      <div className='form-group'>
        <label><AppIcon name='output' className='ui-icon sm' />Natija ({mode === 'encrypt' ? 'hex chiqish' : 'ochiq matn'})</label>
        <textarea readOnly value={outputText} placeholder="Natija shu yerda ko'rinadi..." />
        <CopyBtn text={outputText} filename='vernam_natija.txt' />
      </div>

      {showXor && (
        <>
          <hr className='divider' />
          <div className='info-box'>
            <h3><AppIcon name='vernam' className='ui-icon' />XOR vizualizatsiya (barcha baytlar)</h3>
            <p className='info-sub' style={{ marginBottom: '12px' }}>
              Har bir bayt: {mode === 'encrypt' ? 'Matn XOR Kalit = Shifr' : 'Shifr XOR Kalit = Matn'}
            </p>
            <div className='vernam-xor-table calc-scroll'>
              <div className='vernam-xor-header'>
                <span>{mode === 'encrypt' ? 'Matn (M)' : 'Shifr (C)'}</span>
                <span>XOR</span>
                <span>Kalit (K)</span>
                <span>=</span>
                <span>{mode === 'encrypt' ? 'Shifr (C)' : 'Matn (M)'}</span>
              </div>
              {showXor.map((row, i) => (
                <div className='vernam-xor-row' key={i}>
                  <span className='vernam-hex vernam-m'>{row.sourceHex}</span>
                  <span className='vernam-op'>⊕</span>
                  <span className='vernam-hex vernam-k'>{row.keyHex}</span>
                  <span className='vernam-op'>=</span>
                  <span className='vernam-hex vernam-c'>{row.resultHex}</span>
                </div>
              ))}
            </div>
            <div className='calc-list calc-scroll' style={{ marginTop: '14px' }}>
              {showXor.map((row, i) => (
                <div className='calc-item' key={`detail-${i}`}>
                  <span className='calc-chip'>B{i + 1}</span>
                  <div className='calc-main'>
                    {row.sourceHex} ({row.sourceBin}) XOR {row.keyHex} ({row.keyBin})
                    <br />= {row.resultHex} ({row.resultBin})
                  </div>
                  <span className='calc-result'>{mode === 'decrypt' ? row.resultChar : row.resultHex}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <hr className='divider' />
      <div className='info-box'>
        <h3><AppIcon name='info' className='ui-icon' />Vernam shifri haqida</h3>
        <ul className='rsa-info-list'>
          <li><b>Bir martalik kalit (OTP)</b> — eng xavfsiz shifrlash usuli</li>
          <li>Kalit <b>matn uzunligiga teng</b> va faqat bir marta ishlatiladi</li>
          <li>Shifrlash: <b>C = M ⊕ K</b> (XOR)</li>
          <li>Deshifrlash: <b>M = C ⊕ K</b> (bir xil amal)</li>
          <li>To'g'ri ishlatilganda <b>mutlaq kriptografik mustahkamlik</b> ta'minlaydi</li>
        </ul>
      </div>
    </>
  )
}

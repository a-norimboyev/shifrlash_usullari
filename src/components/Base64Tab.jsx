import { useState, useRef } from 'react'
import AppIcon from './AppIcon'
import CopyBtn from './CopyBtn'
import { encode, decode, buildBase64Preview } from '../utils/base64'
import { useHistory } from '../context/HistoryContext'

export default function Base64Tab() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('encode')
  const fileRef = useRef()
  const { addHistory } = useHistory()

  const handleEncode = () => {
    setError('')
    setMode('encode')
    const result = encode(inputText)
    if (result === null) { setError("Kodlashda xatolik!"); return }
    setOutputText(result)
    if (inputText.trim()) addHistory({
      algo: 'base64', algoLabel: 'Base64',
      mode: 'encode',
      input: inputText.slice(0, 60),
      output: result.slice(0, 60),
    })
  }

  const handleDecode = () => {
    setError('')
    setMode('decode')
    const result = decode(inputText)
    if (result === null) { setError("Noto'g'ri Base64 format! Kirish matnini tekshiring."); return }
    setOutputText(result)
    if (inputText.trim()) addHistory({
      algo: 'base64', algoLabel: 'Base64',
      mode: 'decode',
      input: inputText.slice(0, 60),
      output: result.slice(0, 60),
    })
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setInputText(ev.target.result)
    reader.readAsText(file)
  }

  const preview = buildBase64Preview(inputText)

  return (
    <>
      <div className='form-group'>
        <label>
          <AppIcon name='input' className='ui-icon sm' />Kirish matni
          <button className='upload-btn' onClick={() => fileRef.current.click()}>
            <AppIcon name='upload' className='ui-icon sm' />Fayl yuklash
          </button>
          <input ref={fileRef} type='file' accept='.txt' style={{ display: 'none' }} onChange={handleFile} />
        </label>
        <textarea
          value={inputText}
          onChange={e => { setInputText(e.target.value); setError('') }}
          placeholder={mode === 'encode' ? 'Kodlash uchun matn kiriting...' : 'Base64 matn kiriting (deskodlash uchun)...'}
        />
      </div>

      {error && <p className='error-msg'>{error}</p>}

      <div className='btn-row'>
        <button className='btn btn-encrypt' onClick={handleEncode}>
          <AppIcon name='encrypt' className='ui-icon sm' />Kodlash (Encode)
        </button>
        <button className='btn btn-decrypt' onClick={handleDecode}>
          <AppIcon name='decrypt' className='ui-icon sm' />Dekodlash (Decode)
        </button>
        <button className='btn btn-clear' onClick={() => { setInputText(''); setOutputText(''); setError('') }}>
          <AppIcon name='clear' className='ui-icon sm' />Tozalash
        </button>
      </div>

      <div className='form-group'>
        <label><AppIcon name='output' className='ui-icon sm' />Natija</label>
        <textarea readOnly value={outputText} placeholder="Natija shu yerda ko'rinadi..." />
        <CopyBtn text={outputText} filename='base64_natija.txt' />
      </div>

      {preview.length > 0 && (
        <div className='info-box calc-panel'>
          <h3><AppIcon name='calc' className='ui-icon' />Bayt ko'rinishi (hex & binary)</h3>
          <p className='info-sub'>Har bir belgi baytlarga aylantiriladi, so'ng 6-bitli guruhlarga bo'linadi</p>
          <div className='calc-list calc-scroll'>
            {preview.map(p => (
              <div className='calc-item' key={p.index}>
                <span className='calc-chip'>'{p.char}'</span>
                <div className='calc-main'>
                  <strong>0x{p.hex}</strong> = <span style={{ fontFamily: 'monospace', color: 'var(--accent-3)' }}>{p.bin}</span>
                </div>
                <span className='calc-result'>{p.byte}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className='divider' />
      <div className='info-box'>
        <h3><AppIcon name='info' className='ui-icon' />Base64 haqida</h3>
        <ul className='rsa-info-list'>
          <li>Base64 — binary ma'lumotlarni <b>matn sifatida</b> ifodalash usuli</li>
          <li>64 ta belgi ishlatiladi: <b>A–Z, a–z, 0–9, +, /</b></li>
          <li>Har 3 bayt → 4 ta Base64 belgisi (33% kattaroq)</li>
          <li>Email, URL, API larda keng qo'llaniladi</li>
          <li>Shifrlash emas — oddiy <b>kodlash</b> usuli</li>
          <li>Oxirida <b>=</b> belgisi to'ldiruvchi (padding) hisoblanadi</li>
        </ul>
      </div>
    </>
  )
}

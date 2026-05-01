import { useState } from 'react'
import AppIcon from './AppIcon'
import CopyBtn from './CopyBtn'
import { buildVigenerePreview, vigenereEncrypt, vigenereDecrypt, LATIN } from '../utils/vigenere'

export default function VigenereTab() {
  const [inputText, setInputText] = useState('')
  const [keyword, setKeyword] = useState('KEY')
  const [outputText, setOutputText] = useState('')
  const [keyError, setKeyError] = useState('')
  const [mode, setMode] = useState('encrypt')

  const validateKey = (k) => /^[a-zA-Z]+$/.test(k)

  const handleKey = (val) => {
    setKeyword(val)
    setKeyError(val && !validateKey(val) ? 'Kalit faqat lotin harflaridan iborat bolishi kerak!' : '')
  }

  const handleEncrypt = () => {
    if (!validateKey(keyword)) { setKeyError('Yaroqli kalit kiriting!'); return }
    if (!inputText.trim()) { setOutputText(''); return }
    setMode('encrypt')
    setOutputText(vigenereEncrypt(inputText, keyword))
  }

  const handleDecrypt = () => {
    if (!validateKey(keyword)) { setKeyError('Yaroqli kalit kiriting!'); return }
    if (!inputText.trim()) { setOutputText(''); return }
    setMode('decrypt')
    setOutputText(vigenereDecrypt(inputText, keyword))
  }

  const keyUpper = keyword.toUpperCase().replace(/[^A-Z]/g, '')
  const previewSteps = buildVigenerePreview(inputText, keyword, mode)

  return (
    <>
      <div className='form-group'>
        <label><AppIcon name='input' className='ui-icon sm' />Kirish matni</label>
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder='Shifrlash yoki deshifrlash uchun matn kiriting...'
        />
      </div>

      <div className='form-group'>
        <label><AppIcon name='key' className='ui-icon sm' />Kalit so'z (faqat lotin harflari)</label>
        <div className='shift-row' style={{ gap: '10px' }}>
          <input
            className='pq-input'
            style={{ flex: 1, fontFamily: 'monospace', letterSpacing: '3px', textTransform: 'uppercase' }}
            type='text'
            value={keyword}
            onChange={e => handleKey(e.target.value)}
            placeholder='Masalan: SECRET'
          />
          <div className='shift-value' style={{ width: 'auto', minWidth: '48px', padding: '0 12px', fontSize: '0.8rem' }}>
            {keyUpper.length}
          </div>
        </div>
        {keyError && <p className='error-msg' style={{ marginTop: '8px', marginBottom: 0 }}>{keyError}</p>}
      </div>

      <div className='btn-row'>
        <button className='btn btn-encrypt' onClick={handleEncrypt}><AppIcon name='encrypt' className='ui-icon sm' />Shifrlash</button>
        <button className='btn btn-decrypt' onClick={handleDecrypt}><AppIcon name='decrypt' className='ui-icon sm' />Deshifrlash</button>
        <button className='btn btn-clear' onClick={() => { setInputText(''); setOutputText('') }}><AppIcon name='clear' className='ui-icon sm' />Tozalash</button>
      </div>

      <div className='form-group'>
        <label><AppIcon name='output' className='ui-icon sm' />Natija</label>
        <textarea readOnly value={outputText} placeholder='Natija shu yerda korinadi...' />
        <CopyBtn text={outputText} />
      </div>

      {previewSteps.length > 0 && (
        <div className='info-box calc-panel'>
          <h3><AppIcon name='calc' className='ui-icon' />Harfma-harf hisoblash</h3>
          <p className='info-sub'>Har bir harf uchun kalit harfi olinadi va {mode === 'encrypt' ? 'qo\'shiladi' : 'ayiriladi'}. Barcha belgilar ko'rsatilgan.</p>
          <div className='calc-list calc-scroll'>
            {previewSteps.map(step => (
              <div className='calc-item' key={step.index}>
                <span className='calc-chip'>#{step.index + 1}</span>
                <div className='calc-main'>
                  {step.skipped ? (
                    <>
                      <strong>{step.source}</strong> harf emas, kalit siljimaydi
                    </>
                  ) : (
                    <>
                      <strong>{step.source.toUpperCase()}</strong> ({step.sourceIndex})
                      {' '}{mode === 'encrypt' ? '+' : '-'} {step.keyChar} ({step.keyShift})
                      {' '}= {step.result.toUpperCase()} ({step.resultIndex})
                    </>
                  )}
                </div>
                <span className='calc-result'>{step.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className='divider' />

      {keyUpper.length > 0 && (
        <div className='info-box'>
          <h3><AppIcon name='alphabet' className='ui-icon' />Kalit: <span style={{ color: 'var(--accent)', fontFamily: 'monospace', letterSpacing: '3px' }}>{keyUpper}</span></h3>
          <p className='info-sub' style={{ marginBottom: '12px' }}>
            Har bir harf uchun siljish: kalit harfining tartib raqami (A=0, B=1, ...)
          </p>

          <div className='vig-key-row'>
            {keyUpper.split('').map((kch, i) => (
              <div className='vig-key-cell' key={i}>
                <span className='vig-kchar'>{kch}</span>
                <span className='vig-knum'>+{LATIN.indexOf(kch)}</span>
              </div>
            ))}
          </div>

          <p className='info-sub' style={{ marginTop: '16px', marginBottom: '10px' }}>
            Vigenère jadvali (kalit harflari bo'yicha siljish):
          </p>
          <div className='vig-table-wrapper'>
            <table className='vig-table'>
              <thead>
                <tr>
                  <th className='vig-th-corner'></th>
                  {keyUpper.split('').map((kch, i) => (
                    <th key={i} className='vig-th'>{kch}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LATIN.split('').map((ch) => (
                  <tr key={ch}>
                    <td className='vig-td-row'>{ch}</td>
                    {keyUpper.split('').map((kch, i) => (
                      <td key={i} className='vig-td'>
                        {LATIN[(LATIN.indexOf(ch) + LATIN.indexOf(kch)) % 26]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!keyUpper.length && (
        <div className='info-box'>
          <h3><AppIcon name='info' className='ui-icon' />Vigenère haqida</h3>
          <ul className='rsa-info-list'>
            <li>Vigenère — <b>kalit so'z asosida</b> ko'p siljishli shifrlash</li>
            <li>Sezardan farqi: har bir harf <b>turli siljish</b> bilan shifrlangan</li>
            <li>Kalit so'z takrorlanib matn uzunligiga yetkaziladi</li>
            <li>Shifrlash: <b>C = (M + K) mod 26</b></li>
            <li>Deshifrlash: <b>M = (C - K + 26) mod 26</b></li>
          </ul>
        </div>
      )}
    </>
  )
}

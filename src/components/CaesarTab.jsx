import { useState, useCallback } from 'react'
import AppIcon from './AppIcon'
import CopyBtn from './CopyBtn'
import { buildCaesarPreview, caesarChar, LATIN } from '../utils/caesar'

export default function CaesarTab() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [shift, setShift] = useState(3)
  const [mode, setMode] = useState('encrypt')

  const processText = useCallback((mode) => {
    setMode(mode)
    setOutputText(inputText.split('').map(ch => caesarChar(ch, shift, mode)).join(''))
  }, [inputText, shift])

  const handleShift = (val) => setShift(Math.min(25, Math.max(1, Number(val))))

  const previewSteps = buildCaesarPreview(inputText, shift, mode)

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
        <label><AppIcon name='frame' className='ui-icon sm' />Siljish miqdori (shift)</label>
        <div className='shift-row'>
          <input type='range' min='1' max='25' value={shift} onChange={e => handleShift(e.target.value)} />
          <div className='shift-value'>{shift}</div>
          <input type='number' className='shift-number' min='1' max='25' value={shift} onChange={e => handleShift(e.target.value)} />
        </div>
      </div>

      <div className='btn-row'>
        <button className='btn btn-encrypt' onClick={() => processText('encrypt')}><AppIcon name='encrypt' className='ui-icon sm' />Shifrlash</button>
        <button className='btn btn-decrypt' onClick={() => processText('decrypt')}><AppIcon name='decrypt' className='ui-icon sm' />Deshifrlash</button>
        <button className='btn btn-clear' onClick={() => { setInputText(''); setOutputText('') }}><AppIcon name='clear' className='ui-icon sm' />Tozalash</button>
      </div>

      <div className='form-group'>
        <label><AppIcon name='output' className='ui-icon sm' />Natija</label>
        <textarea readOnly value={outputText} placeholder='Natija shu yerda korinadi...' />
        <CopyBtn text={outputText} />
      </div>

      {previewSteps.length > 0 && (
        <div className='info-box calc-panel'>
          <h3><AppIcon name='calc' className='ui-icon' />Qanday hisobladi</h3>
          <p className='info-sub'>
            {mode === 'encrypt' ? 'Shifrlash' : 'Deshifrlash'} formulasi: harf {mode === 'encrypt' ? '+' : '-'} {shift} siljiydi. Barcha belgilar ko'rsatilgan.
          </p>
          <div className='calc-list calc-scroll'>
            {previewSteps.map(step => (
              <div className='calc-item' key={step.index}>
                <span className='calc-chip'>#{step.index + 1}</span>
                <div className='calc-main'>
                  {step.skipped ? (
                    <>
                      <strong>{step.source}</strong> harf emas, shu sabab o'zgarmaydi
                    </>
                  ) : (
                    <>
                      <strong>{step.source.toUpperCase()}</strong> ({step.sourceIndex})
                      {' '}{mode === 'encrypt' ? '+' : '-'} {step.shift}
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
      <div className='info-box'>
        <h3><AppIcon name='alphabet' className='ui-icon' />Alifbo (Shift: {shift})</h3>
        <p className='info-sub'>Yuqori: asl harf | Pastki: shifrlangan harf</p>
        <div className='alphabet-row'>
          {LATIN.split('').map(ch => {
            const shifted = LATIN[(LATIN.indexOf(ch) + shift) % 26]
            return (
              <div className='alpha-pair' key={ch}>
                <span className='orig'>{ch}</span>
                <span className='shifted'>{shifted}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

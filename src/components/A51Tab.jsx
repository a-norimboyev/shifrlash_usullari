import { useState } from 'react'
import AppIcon from './AppIcon'
import CopyBtn from './CopyBtn'
import { a51Encrypt, a51Decrypt, buildA51Preview, randomHexKey } from '../utils/a51'

export default function A51Tab() {
  const [key, setKey] = useState('00112233aabbccdd')
  const [frame, setFrame] = useState(0)
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [keyError, setKeyError] = useState('')
  const [mode, setMode] = useState('encrypt')

  const validateKey = (k) => /^[0-9a-fA-F]{1,16}$/.test(k)

  const handleKey = (val) => {
    setKey(val)
    setKeyError(val && !validateKey(val)
      ? 'Kalit faqat hex (0-9, a-f) raqamlardan iborat bolishi kerak (max 16 belgi)'
      : '')
  }

  const handleEncrypt = () => {
    if (!validateKey(key)) { setKeyError('Yaroqli hex kalit kiriting!'); return }
    if (!inputText.trim()) { setOutputText(''); return }
    setMode('encrypt')
    setOutputText(a51Encrypt(inputText, key, frame))
  }

  const handleDecrypt = () => {
    if (!validateKey(key)) { setKeyError('Yaroqli hex kalit kiriting!'); return }
    if (!inputText.trim()) { setOutputText(''); return }
    setMode('decrypt')
    setOutputText(a51Decrypt(inputText, key, frame))
  }

  const genKey = () => {
    const k = randomHexKey()
    setKey(k); setKeyError('')
  }

  const a51Steps = validateKey(key) && inputText.trim()
    ? buildA51Preview(inputText, key, frame, mode)
    : []

  return (
    <>
      <div className='rsa-section'>
        <h3 className='section-title'><AppIcon name='settings' className='ui-icon' />A5/1 Parametrlari</h3>

        <div className='form-group' style={{ marginBottom: '14px' }}>
          <label><AppIcon name='key' className='ui-icon sm' />Kalit (64-bit hex, 16 belgi)</label>
          <div className='shift-row' style={{ gap: '10px' }}>
            <input
              className='pq-input'
              style={{ flex: 1, fontFamily: 'monospace', letterSpacing: '2px' }}
              type='text'
              maxLength={16}
              value={key}
              onChange={e => handleKey(e.target.value.toLowerCase())}
              placeholder='00112233aabbccdd'
            />
            <button
              className='btn btn-decrypt'
              style={{ flex: '0 0 auto', padding: '10px 14px', fontSize: '0.85rem' }}
              onClick={genKey}
            >
              <AppIcon name='random' className='ui-icon sm' />Tasodifiy
            </button>
          </div>
          {keyError && <p className='error-msg' style={{ marginTop: '8px', marginBottom: 0 }}>{keyError}</p>}
        </div>

        <div className='form-group' style={{ marginBottom: 0 }}>
          <label><AppIcon name='frame' className='ui-icon sm' />Freym raqami (0 – 4194303)</label>
          <div className='shift-row'>
            <input
              type='range' min='0' max='4194303'
              value={frame}
              onChange={e => setFrame(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <div className='shift-value' style={{ width: 'auto', minWidth: '60px', padding: '0 10px', fontSize: '0.85rem' }}>
              {frame}
            </div>
            <input
              type='number' className='shift-number'
              style={{ width: '90px' }}
              min='0' max='4194303'
              value={frame}
              onChange={e => setFrame(Math.min(4194303, Math.max(0, Number(e.target.value))))}
            />
          </div>
        </div>
      </div>

      <div className='form-group'>
        <label><AppIcon name='input' className='ui-icon sm' />Kirish matni / shifr (hex)</label>
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder='Shifrlash uchun matn yoki deshifrlash uchun hex raqamlar (masalan: 3f a2 b7 ...)'
        />
      </div>

      <div className='btn-row'>
        <button className='btn btn-encrypt' onClick={handleEncrypt}><AppIcon name='encrypt' className='ui-icon sm' />Shifrlash</button>
        <button className='btn btn-decrypt' onClick={handleDecrypt}><AppIcon name='decrypt' className='ui-icon sm' />Deshifrlash</button>
        <button className='btn btn-clear' onClick={() => { setInputText(''); setOutputText('') }}><AppIcon name='clear' className='ui-icon sm' />Tozalash</button>
      </div>

      <div className='form-group'>
        <label><AppIcon name='output' className='ui-icon sm' />Natija</label>
        <textarea readOnly value={outputText} placeholder='Natija shu yerda korinadi...' style={{ fontFamily: 'monospace', letterSpacing: '1px' }} />
        <CopyBtn text={outputText} />
      </div>

      {a51Steps.length > 0 && (
        <div className='info-box calc-panel'>
          <h3><AppIcon name='calc' className='ui-icon' />Keystream qanday ishladi</h3>
          <p className='info-sub'>Har bir bayt uchun: kirish XOR A5/1 keystream = chiqish. Barcha baytlar ko'rsatilgan.</p>
          <div className='calc-list calc-scroll'>
            {a51Steps.map(step => (
              <div className='calc-item' key={step.index}>
                <span className='calc-chip'>B{step.index + 1}</span>
                <div className='calc-main'>
                  {step.inputHex} ({step.inputBin})
                  {' '}XOR {step.keystreamHex} ({step.keystreamBin})
                  <br />
                  = {step.outputHex} ({step.outputBin})
                </div>
                <span className='calc-result'>{step.outputChar ?? step.outputHex}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className='divider' />
      <div className='info-box'>
        <h3><AppIcon name='info' className='ui-icon' />A5/1 haqida</h3>
        <ul className='rsa-info-list'>
          <li>A5/1 — <b>GSM aloqa tizimida</b> qo'llaniladigan oqim shifri</li>
          <li>3 ta <b>LFSR</b> (chiziqli teskari aloqali siljish registri) ishlatadi</li>
          <li>R1: 19 bit | R2: 22 bit | R3: 23 bit</li>
          <li><b>Ko'pchilik ovoz berish</b> (majority clocking) usuli bilan ishlaydi</li>
          <li>Kalit: <b>64 bit</b> | Freym raqami: <b>22 bit</b></li>
          <li>Natija <b>hex formatda</b> ko'rsatiladi</li>
        </ul>

        <div className='lfsr-viz'>
          <div className='lfsr-row'>
            <span className='lfsr-label'>R1</span>
            <div className='lfsr-bar r1'><span>19 bit</span></div>
            <span className='lfsr-tap'>tap: 13,16,17,18</span>
          </div>
          <div className='lfsr-row'>
            <span className='lfsr-label'>R2</span>
            <div className='lfsr-bar r2'><span>22 bit</span></div>
            <span className='lfsr-tap'>tap: 20,21</span>
          </div>
          <div className='lfsr-row'>
            <span className='lfsr-label'>R3</span>
            <div className='lfsr-bar r3'><span>23 bit</span></div>
            <span className='lfsr-tap'>tap: 7,20,21,22</span>
          </div>
        </div>
      </div>
    </>
  )
}

import { useState, useRef } from 'react'
import AppIcon from './AppIcon'
import CopyBtn from './CopyBtn'
import { ALGORITHMS } from '../utils/hash'
import { useHistory } from '../context/HistoryContext'

export default function HashTab() {
  const [inputText, setInputText] = useState('')
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [activeAlgo, setActiveAlgo] = useState('sha256')
  const fileRef = useRef()
  const { addHistory } = useHistory()

  const handleHash = async () => {
    if (!inputText.trim()) return
    setLoading(true)
    const out = {}
    for (const alg of ALGORITHMS) {
      out[alg.id] = await alg.fn(inputText)
    }
    setResults(out)
    setLoading(false)
    addHistory({
      algo: 'hash', algoLabel: 'Hash',
      mode: activeAlgo.toUpperCase(),
      input: inputText.slice(0, 60),
      output: (out[activeAlgo] || '').slice(0, 60),
    })
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setInputText(ev.target.result)
    reader.readAsText(file)
  }

  const currentHash = results[activeAlgo] || ''

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
          onChange={e => setInputText(e.target.value)}
          placeholder='Xash olish uchun matn kiriting...'
        />
      </div>

      <div className='form-group'>
        <label><AppIcon name='settings' className='ui-icon sm' />Algoritm tanlash</label>
        <div className='algo-selector'>
          {ALGORITHMS.map(alg => (
            <button
              key={alg.id}
              className={`algo-btn${activeAlgo === alg.id ? ' active' : ''}`}
              onClick={() => setActiveAlgo(alg.id)}
            >
              <span className='algo-name'>{alg.label}</span>
              <span className='algo-bits'>{alg.bits} bit</span>
            </button>
          ))}
        </div>
      </div>

      <div className='btn-row'>
        <button className='btn btn-encrypt' onClick={handleHash} disabled={loading || !inputText.trim()}>
          <AppIcon name='hash' className='ui-icon sm' />
          {loading ? 'Hisoblanmoqda...' : 'Xash hisoblash'}
        </button>
        <button className='btn btn-clear' onClick={() => { setInputText(''); setResults({}) }}>
          <AppIcon name='clear' className='ui-icon sm' />Tozalash
        </button>
      </div>

      {Object.keys(results).length > 0 && (
        <div className='hash-results'>
          {ALGORITHMS.map(alg => (
            <div
              key={alg.id}
              className={`hash-result-item${activeAlgo === alg.id ? ' active' : ''}`}
              onClick={() => setActiveAlgo(alg.id)}
            >
              <div className='hash-result-header'>
                <span className='hash-algo-badge'>{alg.label}</span>
                <span className='hash-bits'>{alg.bits / 4} hex raqam</span>
              </div>
              <div className='hash-value'>{results[alg.id]}</div>
              <CopyBtn text={results[alg.id]} filename={`${alg.id}_hash.txt`} />
            </div>
          ))}
        </div>
      )}

      {!Object.keys(results).length && (
        <>
          <hr className='divider' />
          <div className='info-box'>
            <h3><AppIcon name='info' className='ui-icon' />Kriptografik xash funksiyalari</h3>
            <ul className='rsa-info-list'>
              <li><b>SHA-256</b> — Bitcoin, SSL sertifikatlar, parol saqlashda ishlatiladi</li>
              <li><b>SHA-512</b> — SHA-256 dan kuchliroq, 512 bitli chiqish</li>
              <li><b>SHA-1</b> — Eski, hozir <b>ishonchsiz</b> hisoblanadi (eskirgan)</li>
              <li>Xash <b>bir tomonlama</b>: chiqishdan kirishni tiklash imkonsiz</li>
              <li>Bir xil kirishdan <b>har doim bir xil chiqish</b> olinadi</li>
              <li>Kichik o'zgartirish → <b>butunlay boshqa</b> xash hosil bo'ladi</li>
            </ul>
          </div>
        </>
      )}
    </>
  )
}

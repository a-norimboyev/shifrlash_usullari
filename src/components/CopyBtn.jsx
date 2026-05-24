import { useState } from 'react'
import AppIcon from './AppIcon'

export default function CopyBtn({ text, filename = 'natija.txt' }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const download = () => {
    if (!text) return
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
      <button className={copied ? 'copy-btn copied' : 'copy-btn'} onClick={copy}>
        <AppIcon name={copied ? 'check' : 'copy'} className='ui-icon sm' />
        {copied ? 'Nusxa olindi!' : 'Nusxa olish'}
      </button>
      <button className='copy-btn' onClick={download} disabled={!text}>
        <AppIcon name='download' className='ui-icon sm' />
        Yuklab olish
      </button>
    </div>
  )
}

import { useState } from 'react'
import AppIcon from './AppIcon'

export default function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button className={copied ? 'copy-btn copied' : 'copy-btn'} onClick={copy}>
      <AppIcon name={copied ? 'check' : 'copy'} className='ui-icon sm' />
      {copied ? 'Nusxa olindi!' : 'Nusxa olish'}
    </button>
  )
}

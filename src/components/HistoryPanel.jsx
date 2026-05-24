import { useHistory } from '../context/HistoryContext'
import AppIcon from './AppIcon'

const ALGO_COLORS = {
  caesar:  { bg: 'rgba(242,140,62,0.15)',  border: 'rgba(242,140,62,0.4)',  color: '#f28c3e' },
  rsa:     { bg: 'rgba(79,163,247,0.15)',  border: 'rgba(79,163,247,0.4)',  color: '#4fa3f7' },
  a51:     { bg: 'rgba(122,108,242,0.15)', border: 'rgba(122,108,242,0.4)', color: '#7a6cf2' },
  vigenere:{ bg: 'rgba(28,168,121,0.15)',  border: 'rgba(28,168,121,0.4)',  color: '#1ca879' },
  vernam:  { bg: 'rgba(220,161,59,0.15)',  border: 'rgba(220,161,59,0.4)',  color: '#dca13b' },
  base64:  { bg: 'rgba(34,211,238,0.15)',  border: 'rgba(34,211,238,0.4)',  color: '#22d3ee' },
  hash:    { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   color: '#ef4444' },
}

const MODE_LABELS = {
  encrypt: 'Shifrlash',
  decrypt: 'Deshifrlash',
  encode:  'Kodlash',
  decode:  'Dekodlash',
  'SHA-256': 'SHA-256',
  'SHA-512': 'SHA-512',
  'SHA-1':   'SHA-1',
}

function timeAgo(ms) {
  const sec = Math.floor((Date.now() - ms) / 1000)
  if (sec < 60) return `${sec}s oldin`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m oldin`
  return `${Math.floor(min / 60)}s oldin`
}

export default function HistoryPanel({ onClose }) {
  const { history, clearHistory } = useHistory()

  return (
    <div className='history-overlay' onClick={e => e.target === e.currentTarget && onClose()}>
      <div className='history-panel'>
        <div className='history-header'>
          <div className='history-title'>
            <AppIcon name='history' className='ui-icon' />
            <span>Amallar tarixi</span>
            <span className='history-count'>{history.length}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {history.length > 0 && (
              <button className='history-clear-btn' onClick={clearHistory}>
                <AppIcon name='clear' className='ui-icon sm' />Tozalash
              </button>
            )}
            <button className='history-close-btn' onClick={onClose}>
              <AppIcon name='close' className='ui-icon sm' />
            </button>
          </div>
        </div>

        <div className='history-list'>
          {history.length === 0 ? (
            <div className='history-empty'>
              <AppIcon name='history' className='ui-icon' />
              <p>Hozircha tarix yo'q</p>
              <span>Shifrlash yoki kodlash amalga oshirilgandan so'ng bu yerda ko'rinadi</span>
            </div>
          ) : (
            history.map(item => {
              const c = ALGO_COLORS[item.algo] ?? ALGO_COLORS.caesar
              return (
                <div key={item.id} className='history-item'>
                  <div className='history-item-top'>
                    <span
                      className='history-algo-badge'
                      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
                    >
                      {item.algoLabel}
                    </span>
                    <span className='history-mode'>{MODE_LABELS[item.mode] ?? item.mode}</span>
                    <span className='history-time'>{timeAgo(item.time)}</span>
                  </div>
                  <div className='history-io'>
                    <div className='history-text'>
                      <span className='hio-label'>Kirish</span>
                      <span className='hio-val'>{item.input || '—'}</span>
                    </div>
                    <AppIcon name='arrow' className='ui-icon sm' style={{ flexShrink: 0, opacity: 0.4 }} />
                    <div className='history-text'>
                      <span className='hio-label'>Natija</span>
                      <span className='hio-val'>{item.output || '—'}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

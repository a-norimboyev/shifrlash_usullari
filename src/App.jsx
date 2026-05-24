import { useState } from 'react'
import './App.css'
import AppIcon from './components/AppIcon'
import CaesarTab from './components/CaesarTab'
import RsaTab from './components/RsaTab'
import A51Tab from './components/A51Tab'
import VigenereTab from './components/VigenereTab'
import VernamTab from './components/VernamTab'
import Base64Tab from './components/Base64Tab'
import HashTab from './components/HashTab'
import HistoryPanel from './components/HistoryPanel'
import { useHistory } from './context/HistoryContext'

const TABS = [
  { id: 'caesar',   icon: 'caesar',  label: 'Sezar',   desc: 'Klassik siljish shifri' },
  { id: 'rsa',      icon: 'rsa',     label: 'RSA',     desc: 'Ochiq kalit kriptografiyasi' },
  { id: 'a51',      icon: 'a51',     label: 'A5/1',    desc: 'GSM oqim shifri' },
  { id: 'vigenere', icon: 'vigenere',label: 'Vigenère',desc: "Ko'p siljishli shifr" },
  { id: 'vernam',   icon: 'vernam',  label: 'Vernam',  desc: 'Bir martalik kalit (OTP)' },
  { id: 'base64',   icon: 'base64',  label: 'Base64',  desc: 'Ikkilik-matn kodlash' },
  { id: 'hash',     icon: 'hash',    label: 'Hash',    desc: 'SHA-256 / SHA-512 / SHA-1' },
]

export default function App() {
  const [tab, setTab] = useState('caesar')
  const [showHistory, setShowHistory] = useState(false)
  const { history } = useHistory()
  const current = TABS.find(t => t.id === tab)

  return (
    <div className={`app-layout theme-${tab}`}>
      <aside className='sidebar'>
        <div className='sidebar-brand'>
          <AppIcon name='brand' className='brand-icon' />
          <div>
            <div className='brand-name'>SHIFRLASH</div>
            <div className='brand-sub'>VOSITASI</div>
          </div>
        </div>

        <nav className='sidebar-nav'>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`nav-item${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <AppIcon name={t.icon} className='nav-icon' />
              <div className='nav-text'>
                <span className='nav-label'>{t.label}</span>
                <span className='nav-desc'>{t.desc}</span>
              </div>
              {tab === t.id && <span className='nav-arrow'>›</span>}
            </button>
          ))}
        </nav>

        <div className='sidebar-footer'>
          <div className='footer-badge'>7 ta algoritm</div>
          <p>Kriptografiya o&apos;quv vositasi</p>
          <button
            className='history-toggle-btn'
            onClick={() => setShowHistory(true)}
          >
            <AppIcon name='history' className='ui-icon sm' />
            Tarix
            {history.length > 0 && (
              <span className='history-badge-count'>{history.length}</span>
            )}
          </button>
        </div>
      </aside>

      <main className='main-content'>
        <div className='content-inner'>
          <div className='content-header'>
            <div className='ch-left'>
              <AppIcon name={current.icon} className='ch-icon' />
              <div>
                <h2 className='ch-title'>{current.label}</h2>
                <p className='ch-desc'>{current.desc}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                className='header-history-btn'
                onClick={() => setShowHistory(true)}
                title='Amallar tarixi'
              >
                <AppIcon name='history' className='ui-icon sm' />
                {history.length > 0 && (
                  <span className='history-badge-count'>{history.length}</span>
                )}
              </button>
              <span className='ch-badge'>{current.id.toUpperCase()}</span>
            </div>
          </div>

          <div className='content-stage' key={tab}>
            {tab === 'caesar'   && <CaesarTab />}
            {tab === 'rsa'      && <RsaTab />}
            {tab === 'a51'      && <A51Tab />}
            {tab === 'vigenere' && <VigenereTab />}
            {tab === 'vernam'   && <VernamTab />}
            {tab === 'base64'   && <Base64Tab />}
            {tab === 'hash'     && <HashTab />}
          </div>
        </div>
      </main>

      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}
    </div>
  )
}

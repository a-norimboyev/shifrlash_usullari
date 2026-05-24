import { createContext, useContext, useState } from 'react'

const HistoryContext = createContext(null)

const MAX = 30

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shifrlash_history') || '[]') }
    catch { return [] }
  })

  const addHistory = (item) => {
    setHistory(prev => {
      const next = [{ ...item, id: Date.now(), time: Date.now() }, ...prev].slice(0, MAX)
      try { localStorage.setItem('shifrlash_history', JSON.stringify(next)) } catch {}
      return next
    })
  }

  const clearHistory = () => {
    setHistory([])
    try { localStorage.removeItem('shifrlash_history') } catch {}
  }

  return (
    <HistoryContext.Provider value={{ history, addHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => useContext(HistoryContext)

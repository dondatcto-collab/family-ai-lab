import { useState, useCallback } from 'react'

const KEY = 'family-ai-lab-v2'

const fresh = () => ({
  childName: '',
  apiKey: '',
  completedDays: [],
  sessions: {},
  journalEntries: {},
  streak: 0,
  lastActiveDate: null,
  totalHints: 0,
  selfSolvedCount: 0,
})

const load = () => {
  try { const r = localStorage.getItem(KEY); return r ? { ...fresh(), ...JSON.parse(r) } : fresh() }
  catch { return fresh() }
}

const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {} }

export function useProgress() {
  const [state, setState] = useState(load)

  const update = useCallback((patch) => {
    setState(prev => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }
      save(next)
      return next
    })
  }, [])

  const completeDay = useCallback((dayId, sessionData = {}) => {
    setState(prev => {
      if (prev.completedDays.includes(dayId)) return prev
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const streak = prev.lastActiveDate === yesterday ? prev.streak + 1
        : prev.lastActiveDate === today ? prev.streak : 1
      const next = {
        ...prev,
        completedDays: [...prev.completedDays, dayId],
        sessions: { ...prev.sessions, [dayId]: { ...sessionData, completedAt: new Date().toISOString() } },
        streak,
        lastActiveDate: today,
        totalHints: prev.totalHints + (sessionData.hintsUsed || 0),
        selfSolvedCount: prev.selfSolvedCount + (sessionData.selfSolved ? 1 : 0),
      }
      save(next)
      return next
    })
  }, [])

  const saveJournal = useCallback((dayId, text) => {
    setState(prev => {
      const next = { ...prev, journalEntries: { ...prev.journalEntries, [dayId]: { text, savedAt: new Date().toISOString() } } }
      save(next)
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    const s = fresh()
    save(s)
    setState(s)
  }, [])

  return { state, update, completeDay, saveJournal, resetAll }
}

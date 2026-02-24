import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type {
  Message, ChecklistItem, ShiftTemplate, ReportData, Kudo,
} from '../types'
import { DEFAULT_SHIFT_TEMPLATES } from '../types'

// ─── localStorage helpers ─────────────────────────────────────
function save<T>(key: string, data: T) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch { /**/ }
}
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}

// ─── Context shape ─────────────────────────────────────────────
interface ReceptionCtx {
  // Global alert
  globalAlert: string
  setGlobalAlert: (v: string) => void

  // Messages / chat
  messages: Message[]
  addMessage: (text: string, user?: string) => void

  // Daily checklist  (keyed by ISO date string)
  getChecklist: (date: string) => ChecklistItem[]
  setChecklist: (date: string, items: ChecklistItem[]) => void

  // Daily reports   (keyed by ISO date string)
  getReport: (date: string) => ReportData
  setReport: (date: string, data: ReportData) => void

  // Shift templates
  shiftTemplates: ShiftTemplate[]
  addShiftTemplate: (t: Omit<ShiftTemplate, 'id'>) => void
  removeShiftTemplate: (id: string) => void

  // Kudos wall
  kudosWall: Kudo[]
  addKudo: (to: string, message: string) => void

  // Panic state
  panicActive: boolean
  triggerPanic: () => void
  dismissPanic: () => void
}

const ReceptionContext = createContext<ReceptionCtx | null>(null)

export function ReceptionProvider({ children }: { children: ReactNode }) {
  const [globalAlert, _setAlert] = useState<string>(() => load('nyxgrid_alert', ''))
  const [messages, _setMessages] = useState<Message[]>(() =>
    load('nyxgrid_messages', [
      { id: 'sys1', text: 'Welcome to NyxGrid! Chat feed is live.', user: 'SYSTEM', createdAt: Date.now() - 3600000 },
    ])
  )
  const [checklists, _setChecklists] = useState<Record<string, ChecklistItem[]>>(() =>
    load('nyxgrid_checklists', {})
  )
  const [reports, _setReports] = useState<Record<string, ReportData>>(() =>
    load('nyxgrid_reports', {})
  )
  const [shiftTemplates, _setTemplates] = useState<ShiftTemplate[]>(() =>
    load('nyxgrid_shift_templates', DEFAULT_SHIFT_TEMPLATES)
  )
  const [kudosWall, _setKudos] = useState<Kudo[]>(() =>
    load('nyxgrid_kudos', [])
  )
  const [panicActive, setPanicActive] = useState(false)

  const setGlobalAlert = useCallback((v: string) => {
    _setAlert(v)
    save('nyxgrid_alert', v)
  }, [])

  const addMessage = useCallback((text: string, user = 'YOU') => {
    const msg: Message = { id: `m-${Date.now()}`, text, user, createdAt: Date.now() }
    _setMessages(prev => {
      const updated = [...prev, msg]
      save('nyxgrid_messages', updated)
      return updated
    })
  }, [])

  const getChecklist = useCallback((date: string) => checklists[date] ?? [], [checklists])

  const setChecklist = useCallback((date: string, items: ChecklistItem[]) => {
    _setChecklists(prev => {
      const updated = { ...prev, [date]: items }
      save('nyxgrid_checklists', updated)
      return updated
    })
  }, [])

  const getReport = useCallback((date: string) => reports[date] ?? {}, [reports])

  const setReport = useCallback((date: string, data: ReportData) => {
    _setReports(prev => {
      const updated = { ...prev, [date]: data }
      save('nyxgrid_reports', updated)
      return updated
    })
  }, [])

  const addShiftTemplate = useCallback((t: Omit<ShiftTemplate, 'id'>) => {
    const newT: ShiftTemplate = { ...t, id: `t-${Date.now()}` }
    _setTemplates(prev => {
      const updated = [...prev, newT]
      save('nyxgrid_shift_templates', updated)
      return updated
    })
  }, [])

  const removeShiftTemplate = useCallback((id: string) => {
    _setTemplates(prev => {
      const updated = prev.filter(t => t.id !== id)
      save('nyxgrid_shift_templates', updated)
      return updated
    })
  }, [])

  const addKudo = useCallback((to: string, message: string) => {
    const kudo: Kudo = { id: Date.now(), from: 'Team Member', to, message, timestamp: new Date().toISOString() }
    _setKudos(prev => {
      const updated = [kudo, ...prev]
      save('nyxgrid_kudos', updated)
      return updated
    })
  }, [])

  const triggerPanic = useCallback(() => setPanicActive(true), [])
  const dismissPanic = useCallback(() => setPanicActive(false), [])

  return (
    <ReceptionContext.Provider value={{
      globalAlert, setGlobalAlert,
      messages, addMessage,
      getChecklist, setChecklist,
      getReport, setReport,
      shiftTemplates, addShiftTemplate, removeShiftTemplate,
      kudosWall, addKudo,
      panicActive, triggerPanic, dismissPanic,
    }}>
      {children}
    </ReceptionContext.Provider>
  )
}

export function useReception() {
  const ctx = useContext(ReceptionContext)
  if (!ctx) throw new Error('useReception must be used inside ReceptionProvider')
  return ctx
}

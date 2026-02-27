import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { StaffMember, Shift, CalendarAssignment } from '../types'

interface SchedulerContextValue {
  staff: StaffMember[]
  shifts: Shift[]
  calendarAssignments: CalendarAssignment[]
  loading: boolean
  addStaff: (member: Omit<StaffMember, 'id'>) => void
  updateStaff: (id: string, updates: Partial<StaffMember>) => void
  removeStaff: (id: string) => void
  addShift: (shift: Omit<Shift, 'id'>) => void
  removeShift: (id: string) => void
  getStaffById: (id: string) => StaffMember | undefined
  getShiftsForStaff: (staffId: string) => Shift[]
  getShiftsForDay: (day: string) => Shift[]
  addCalendarAssignment: (staffId: string, date: string) => void
  removeCalendarAssignment: (id: string) => void
  getAssignmentsForDate: (date: string) => CalendarAssignment[]
}

const SchedulerContext = createContext<SchedulerContextValue | null>(null)

const API = '/api'

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`)
  return res.json()
}

export function SchedulerProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [calendarAssignments, setCalendarAssignments] = useState<CalendarAssignment[]>([])
  const [loading, setLoading] = useState(true)

  // ── Load all data on mount ──────────────────────────────────
  useEffect(() => {
    Promise.all([
      apiFetch('/staff'),
      apiFetch('/shifts'),
      apiFetch('/calendar-assignments'),
    ])
      .then(([s, sh, ca]) => {
        setStaff(s)
        setShifts(sh)
        setCalendarAssignments(ca)
      })
      .catch(err => console.error('Failed to load data from API:', err))
      .finally(() => setLoading(false))
  }, [])

  // ── Staff ───────────────────────────────────────────────────
  function addStaff(member: Omit<StaffMember, 'id'>) {
    const tempId = `tmp_${Date.now()}`
    setStaff(prev => [...prev, { ...member, id: tempId }])
    apiFetch('/staff', { method: 'POST', body: JSON.stringify(member) })
      .then(saved => setStaff(prev => prev.map(m => m.id === tempId ? saved : m)))
      .catch(() => setStaff(prev => prev.filter(m => m.id !== tempId)))
  }

  function updateStaff(id: string, updates: Partial<StaffMember>) {
    setStaff(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
    const current = staff.find(m => m.id === id)
    if (!current) return
    apiFetch(`/staff/${id}`, { method: 'PUT', body: JSON.stringify({ ...current, ...updates }) })
      .catch(() => setStaff(prev => prev.map(m => m.id === id ? current : m))) // rollback
  }

  function removeStaff(id: string) {
    const prev_staff = staff
    const prev_shifts = shifts
    setStaff(prev => prev.filter(m => m.id !== id))
    setShifts(prev => prev.filter(s => s.staffId !== id))
    apiFetch(`/staff/${id}`, { method: 'DELETE' })
      .catch(() => { setStaff(prev_staff); setShifts(prev_shifts) })
  }

  // ── Shifts ──────────────────────────────────────────────────
  function addShift(shift: Omit<Shift, 'id'>) {
    const tempId = `tmp_${Date.now()}`
    setShifts(prev => [...prev, { ...shift, id: tempId }])
    apiFetch('/shifts', { method: 'POST', body: JSON.stringify(shift) })
      .then(saved => setShifts(prev => prev.map(s => s.id === tempId ? saved : s)))
      .catch(() => setShifts(prev => prev.filter(s => s.id !== tempId)))
  }

  function removeShift(id: string) {
    setShifts(prev => prev.filter(s => s.id !== id))
    apiFetch(`/shifts/${id}`, { method: 'DELETE' })
      .catch(() => apiFetch('/shifts').then(setShifts)) // re-sync on failure
  }

  // ── Calendar Assignments ────────────────────────────────────
  function addCalendarAssignment(staffId: string, date: string) {
    if (staffId !== 'needs-coverage') {
      if (calendarAssignments.some(a => a.staffId === staffId && a.date === date)) return
    }
    const tempId = `tmp_${Date.now()}`
    setCalendarAssignments(prev => [...prev, { id: tempId, staffId, date }])
    apiFetch('/calendar-assignments', { method: 'POST', body: JSON.stringify({ staffId, date }) })
      .then(saved => setCalendarAssignments(prev => prev.map(a => a.id === tempId ? saved : a)))
      .catch(() => setCalendarAssignments(prev => prev.filter(a => a.id !== tempId)))
  }

  function removeCalendarAssignment(id: string) {
    setCalendarAssignments(prev => prev.filter(a => a.id !== id))
    apiFetch(`/calendar-assignments/${id}`, { method: 'DELETE' })
      .catch(() => apiFetch('/calendar-assignments').then(setCalendarAssignments))
  }

  // ── Derived queries ─────────────────────────────────────────
  function getStaffById(id: string) { return staff.find(m => m.id === id) }
  function getShiftsForStaff(staffId: string) { return shifts.filter(s => s.staffId === staffId) }
  function getShiftsForDay(day: string) { return shifts.filter(s => s.day === day) }
  function getAssignmentsForDate(date: string) { return calendarAssignments.filter(a => a.date === date) }

  return (
    <SchedulerContext.Provider value={{
      staff, shifts, calendarAssignments, loading,
      addStaff, updateStaff, removeStaff,
      addShift, removeShift,
      getStaffById, getShiftsForStaff, getShiftsForDay,
      addCalendarAssignment, removeCalendarAssignment, getAssignmentsForDate,
    }}>
      {children}
    </SchedulerContext.Provider>
  )
}

export function useScheduler() {
  const ctx = useContext(SchedulerContext)
  if (!ctx) throw new Error('useScheduler must be used inside SchedulerProvider')
  return ctx
}

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { SAMPLE_STAFF, SAMPLE_SHIFTS } from '../types'
import type { StaffMember, Shift, CalendarAssignment } from '../types'

interface SchedulerContextValue {
  staff: StaffMember[]
  shifts: Shift[]
  calendarAssignments: CalendarAssignment[]
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

let idCounter = 100

function newId(prefix: string) {
  return `${prefix}${++idCounter}`
}

export function SchedulerProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<StaffMember[]>(SAMPLE_STAFF)
  const [shifts, setShifts] = useState<Shift[]>(SAMPLE_SHIFTS)
  const [calendarAssignments, setCalendarAssignments] = useState<CalendarAssignment[]>([])

  function addStaff(member: Omit<StaffMember, 'id'>) {
    setStaff(prev => [...prev, { ...member, id: newId('s') }])
  }

  function updateStaff(id: string, updates: Partial<StaffMember>) {
    setStaff(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  function removeStaff(id: string) {
    setStaff(prev => prev.filter(m => m.id !== id))
    setShifts(prev => prev.filter(s => s.staffId !== id))
  }

  function addShift(shift: Omit<Shift, 'id'>) {
    setShifts(prev => [...prev, { ...shift, id: newId('sh') }])
  }

  function removeShift(id: string) {
    setShifts(prev => prev.filter(s => s.id !== id))
  }

  function getStaffById(id: string) {
    return staff.find(m => m.id === id)
  }

  function getShiftsForStaff(staffId: string) {
    return shifts.filter(s => s.staffId === staffId)
  }

  function getShiftsForDay(day: string) {
    return shifts.filter(s => s.day === day)
  }

  function addCalendarAssignment(staffId: string, date: string) {
    // Prevent duplicates for regular staff (allow multiple needs-coverage)
    if (staffId !== 'needs-coverage') {
      const alreadyExists = calendarAssignments.some(a => a.staffId === staffId && a.date === date)
      if (alreadyExists) return
    }
    setCalendarAssignments(prev => [...prev, { id: newId('ca'), staffId, date }])
  }

  function removeCalendarAssignment(id: string) {
    setCalendarAssignments(prev => prev.filter(a => a.id !== id))
  }

  function getAssignmentsForDate(date: string) {
    return calendarAssignments.filter(a => a.date === date)
  }

  return (
    <SchedulerContext.Provider value={{
      staff, shifts, calendarAssignments,
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

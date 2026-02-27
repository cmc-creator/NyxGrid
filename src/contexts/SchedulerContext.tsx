import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, getDocs, writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import { SAMPLE_STAFF, SAMPLE_SHIFTS } from '../types'
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

export function SchedulerProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [calendarAssignments, setCalendarAssignments] = useState<CalendarAssignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubStaff: (() => void) | undefined
    let unsubShifts: (() => void) | undefined
    let unsubCal: (() => void) | undefined

    async function init() {
      // Seed sample data on first ever load
      const snap = await getDocs(collection(db, 'staff'))
      if (snap.empty) {
        const batch = writeBatch(db)
        for (const s of SAMPLE_STAFF) {
          batch.set(doc(db, 'staff', s.id), s)
        }
        for (const sh of SAMPLE_SHIFTS) {
          batch.set(doc(db, 'shifts', sh.id), sh)
        }
        await batch.commit()
      }

      // Track which collections have loaded their first snapshot
      const loaded = new Set<string>()
      const checkLoaded = (col: string) => {
        loaded.add(col)
        if (loaded.size >= 3) setLoading(false)
      }

      unsubStaff = onSnapshot(collection(db, 'staff'), s => {
        setStaff(s.docs.map(d => ({ id: d.id, ...d.data() } as StaffMember)))
        checkLoaded('staff')
      })
      unsubShifts = onSnapshot(collection(db, 'shifts'), s => {
        setShifts(s.docs.map(d => ({ id: d.id, ...d.data() } as Shift)))
        checkLoaded('shifts')
      })
      unsubCal = onSnapshot(collection(db, 'calendarAssignments'), s => {
        setCalendarAssignments(s.docs.map(d => ({ id: d.id, ...d.data() } as CalendarAssignment)))
        checkLoaded('calendarAssignments')
      })
    }

    init().catch(err => {
      console.error('Firebase init error:', err)
      setLoading(false)
    })

    return () => {
      unsubStaff?.()
      unsubShifts?.()
      unsubCal?.()
    }
  }, [])

  // ── Staff ───────────────────────────────────────────────────
  function addStaff(member: Omit<StaffMember, 'id'>) {
    addDoc(collection(db, 'staff'), member).catch(console.error)
  }

  function updateStaff(id: string, updates: Partial<StaffMember>) {
    updateDoc(doc(db, 'staff', id), updates as Record<string, unknown>).catch(console.error)
  }

  function removeStaff(id: string) {
    deleteDoc(doc(db, 'staff', id)).catch(console.error)
    shifts.filter(s => s.staffId === id).forEach(s =>
      deleteDoc(doc(db, 'shifts', s.id)).catch(console.error)
    )
    calendarAssignments.filter(a => a.staffId === id).forEach(a =>
      deleteDoc(doc(db, 'calendarAssignments', a.id)).catch(console.error)
    )
  }

  // ── Shifts ──────────────────────────────────────────────────
  function addShift(shift: Omit<Shift, 'id'>) {
    addDoc(collection(db, 'shifts'), shift).catch(console.error)
  }

  function removeShift(id: string) {
    deleteDoc(doc(db, 'shifts', id)).catch(console.error)
  }

  // ── Calendar Assignments ────────────────────────────────────
  function addCalendarAssignment(staffId: string, date: string) {
    if (staffId !== 'needs-coverage') {
      if (calendarAssignments.some(a => a.staffId === staffId && a.date === date)) return
    }
    addDoc(collection(db, 'calendarAssignments'), { staffId, date }).catch(console.error)
  }

  function removeCalendarAssignment(id: string) {
    deleteDoc(doc(db, 'calendarAssignments', id)).catch(console.error)
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

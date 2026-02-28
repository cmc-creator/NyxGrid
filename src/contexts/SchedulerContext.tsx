import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, getDocs, writeBatch, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { SAMPLE_STAFF, SAMPLE_SHIFTS } from '../types'
import type { StaffMember, Shift, CalendarAssignment, Announcement, LeaveRequest } from '../types'

interface SchedulerContextValue {
  staff: StaffMember[]
  shifts: Shift[]
  calendarAssignments: CalendarAssignment[]
  announcements: Announcement[]
  leaveRequests: LeaveRequest[]
  loading: boolean
  addStaff: (member: Omit<StaffMember, 'id'>) => void
  updateStaff: (id: string, updates: Partial<StaffMember>) => void
  removeStaff: (id: string) => void
  addShift: (shift: Omit<Shift, 'id'>) => void
  updateShift: (id: string, updates: Partial<Omit<Shift, 'id'>>) => void
  removeShift: (id: string) => void
  getStaffById: (id: string) => StaffMember | undefined
  getShiftsForStaff: (staffId: string) => Shift[]
  getShiftsForDay: (day: string) => Shift[]
  addCalendarAssignment: (staffId: string, date: string) => void
  removeCalendarAssignment: (id: string) => void
  getAssignmentsForDate: (date: string) => CalendarAssignment[]
  bulkAddCalendarAssignments: (items: Array<{ staffId: string; date: string }>) => void
  copyWeekToNext: (weekStartIso: string) => void
  addAnnouncement: (text: string, authorName: string) => void
  removeAnnouncement: (id: string) => void
  addLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => void
  updateLeaveRequest: (id: string, status: LeaveRequest['status']) => void
  removeLeaveRequest: (id: string) => void
}

const SchedulerContext = createContext<SchedulerContextValue | null>(null)

export function SchedulerProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [calendarAssignments, setCalendarAssignments] = useState<CalendarAssignment[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubStaff: (() => void) | undefined
    let unsubShifts: (() => void) | undefined
    let unsubCal: (() => void) | undefined
    let unsubAnn: (() => void) | undefined
    let unsubLeave: (() => void) | undefined

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
        if (loaded.size >= 5) setLoading(false)
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
      unsubAnn = onSnapshot(collection(db, 'announcements'), s => {
        const list = s.docs.map(d => ({
          id: d.id, text: d.data().text ?? '',
          authorName: d.data().authorName ?? '',
          pinned: d.data().pinned ?? false,
          createdAt: d.data().createdAt?.toMillis?.() ?? Date.now(),
        } as Announcement))
        list.sort((a, b) => b.createdAt - a.createdAt)
        setAnnouncements(list)
        checkLoaded('announcements')
      })
      unsubLeave = onSnapshot(collection(db, 'leaveRequests'), s => {
        const list = s.docs.map(d => ({
          id: d.id, staffId: d.data().staffId ?? '',
          startDate: d.data().startDate ?? '',
          endDate: d.data().endDate ?? '',
          reason: d.data().reason ?? '',
          status: d.data().status ?? 'pending',
          createdAt: d.data().createdAt?.toMillis?.() ?? Date.now(),
          authorName: d.data().authorName,
        } as LeaveRequest))
        list.sort((a, b) => b.createdAt - a.createdAt)
        setLeaveRequests(list)
        checkLoaded('leaveRequests')
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
      unsubAnn?.()
      unsubLeave?.()
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

  function updateShift(id: string, updates: Partial<Omit<Shift, 'id'>>) {
    updateDoc(doc(db, 'shifts', id), updates as Record<string, unknown>).catch(console.error)
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

  function bulkAddCalendarAssignments(items: Array<{ staffId: string; date: string }>) {
    const batch = writeBatch(db)
    for (const item of items) {
      if (item.staffId !== 'needs-coverage') {
        if (calendarAssignments.some(a => a.staffId === item.staffId && a.date === item.date)) continue
      }
      batch.set(doc(collection(db, 'calendarAssignments')), item)
    }
    batch.commit().catch(console.error)
  }

  // Copy all calendar assignments from one week (Mon–Sun) to the next
  function copyWeekToNext(weekStartIso: string) {
    const start = new Date(weekStartIso + 'T12:00:00')
    const items: Array<{ staffId: string; date: string }> = []
    for (let i = 0; i < 7; i++) {
      const srcDate = new Date(start); srcDate.setDate(start.getDate() + i)
      const srcIso = `${srcDate.getFullYear()}-${String(srcDate.getMonth()+1).padStart(2,'0')}-${String(srcDate.getDate()).padStart(2,'0')}`
      const dstDate = new Date(start); dstDate.setDate(start.getDate() + i + 7)
      const dstIso = `${dstDate.getFullYear()}-${String(dstDate.getMonth()+1).padStart(2,'0')}-${String(dstDate.getDate()).padStart(2,'0')}`
      calendarAssignments.filter(a => a.date === srcIso).forEach(a => items.push({ staffId: a.staffId, date: dstIso }))
    }
    if (items.length > 0) bulkAddCalendarAssignments(items)
  }

  // ── Announcements ───────────────────────────────────────────
  function addAnnouncement(text: string, authorName: string) {
    addDoc(collection(db, 'announcements'), { text, authorName, pinned: false, createdAt: serverTimestamp() }).catch(console.error)
  }
  function removeAnnouncement(id: string) {
    deleteDoc(doc(db, 'announcements', id)).catch(console.error)
  }

  // ── Leave Requests ──────────────────────────────────────────
  function addLeaveRequest(req: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) {
    addDoc(collection(db, 'leaveRequests'), { ...req, status: 'pending', createdAt: serverTimestamp() }).catch(console.error)
  }
  function updateLeaveRequest(id: string, status: LeaveRequest['status']) {
    updateDoc(doc(db, 'leaveRequests', id), { status }).catch(console.error)
  }
  function removeLeaveRequest(id: string) {
    deleteDoc(doc(db, 'leaveRequests', id)).catch(console.error)
  }

  // ── Derived queries ─────────────────────────────────────────
  function getStaffById(id: string) { return staff.find(m => m.id === id) }
  function getShiftsForStaff(staffId: string) { return shifts.filter(s => s.staffId === staffId) }
  function getShiftsForDay(day: string) { return shifts.filter(s => s.day === day) }
  function getAssignmentsForDate(date: string) { return calendarAssignments.filter(a => a.date === date) }

  return (
    <SchedulerContext.Provider value={{
      staff, shifts, calendarAssignments, announcements, leaveRequests, loading,
      addStaff, updateStaff, removeStaff,
      addShift, updateShift, removeShift,
      getStaffById, getShiftsForStaff, getShiftsForDay,
      addCalendarAssignment, removeCalendarAssignment, getAssignmentsForDate,
      bulkAddCalendarAssignments, copyWeekToNext,
      addAnnouncement, removeAnnouncement,
      addLeaveRequest, updateLeaveRequest, removeLeaveRequest,
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

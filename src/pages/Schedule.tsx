import { useState, useRef, Fragment } from 'react'
import { Plus, Trash2, X, ChevronLeft, ChevronRight, Calendar, LayoutGrid, List, Download } from 'lucide-react'
import { useScheduler } from '../contexts/SchedulerContext'
import { WEEK_DAYS, POSITIONS } from '../types'
import type { WeekDay, Shift } from '../types'

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
function toIso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
function getMonthWeeks(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const weeks: Date[][] = []
  let week: Date[] = []
  const startDow = firstDay.getDay()
  for (let i = 0; i < startDow; i++) week.push(new Date(year, month, 1 - (startDow - i)))
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, month, d))
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  if (week.length > 0) {
    while (week.length < 7) {
      const last = week[week.length - 1]
      const next = new Date(last); next.setDate(next.getDate() + 1); week.push(next)
    }
    weeks.push(week)
  }
  return weeks
}

const DOW_MAP: WeekDay[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DOW_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

interface AddShiftModalProps { day: WeekDay; onClose: () => void }
function AddShiftModal({ day, onClose }: AddShiftModalProps) {
  const { staff, addShift } = useScheduler()
  const [staffId, setStaffId] = useState(staff.filter(s => s.status === 'active')[0]?.id ?? '')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [position, setPosition] = useState(POSITIONS[0])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); if (!staffId) return
    addShift({ staffId, day, startTime, endTime, position }); onClose()
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Add Shift &mdash; {day}</h2>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 8 }}><X size={15} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Staff Member</label>
            <select className="themed-input rounded-lg px-3 py-2" value={staffId} onChange={e => setStaffId(e.target.value)}>
              {staff.filter(s => s.status === 'active').map(m => <option key={m.id} value={m.id}>{m.name} &mdash; {m.role}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start</label>
              <input type="time" className="themed-input rounded-lg px-3 py-2" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End</label>
              <input type="time" className="themed-input rounded-lg px-3 py-2" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Position</label>
            <select className="themed-input rounded-lg px-3 py-2" value={position} onChange={e => setPosition(e.target.value)}>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-accent mt-2" style={{ width: '100%', padding: '10px' }}>Add Shift</button>
        </form>
      </div>
    </div>
  )
}
// --- Week View ---------------------------------------------------------
function WeekView() {
  const { staff, shifts, removeShift } = useScheduler()
  const [addModal, setAddModal] = useState<WeekDay | null>(null)
  const scheduledStaff = staff.filter(m => shifts.some(s => s.staffId === m.id) || m.status === 'active')
  function getShift(staffId: string, day: WeekDay): Shift[] {
    return shifts.filter(s => s.staffId === staffId && s.day === day)
  }
  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <div className="schedule-grid" style={{ gridTemplateColumns: `200px repeat(${WEEK_DAYS.length}, 1fr)`, minWidth: 700 }}>
          <div className="schedule-header-cell" style={{ borderRight: '2px solid var(--border)' }}>Staff</div>
          {WEEK_DAYS.map(d => (
            <div key={d} className="schedule-header-cell flex items-center justify-between">
              <span>{d}</span>
              <button onClick={() => setAddModal(d)} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, borderRadius: 4 }}><Plus size={13} /></button>
            </div>
          ))}
          {scheduledStaff.map(member => {
            const rgb = hexToRgb(member.color)
            return (
              <Fragment key={member.id}>
                <div className="schedule-row-label" style={{ borderRight: '2px solid var(--border)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: member.color, boxShadow: `0 0 6px rgba(${rgb}, 0.9)`, flexShrink: 0 }} />
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: `rgba(${rgb}, 0.18)`, color: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                    {member.name.split(' ').map((p: string) => p[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{member.role}</div>
                  </div>
                </div>
                {WEEK_DAYS.map(day => {
                  const dayShifts = getShift(member.id, day)
                  return (
                    <div key={`cell-${member.id}-${day}`} className="schedule-cell" onClick={() => setAddModal(day)}>
                      {dayShifts.map(shift => (
                        <div key={shift.id} className="shift-block flex items-center justify-between" style={{ background: `rgba(${rgb}, 0.18)`, borderLeft: `3px solid ${member.color}`, color: member.color, marginBottom: 3 }} onClick={e => e.stopPropagation()}>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700 }}>{shift.startTime}–{shift.endTime}</div>
                            <div style={{ fontSize: 9.5, opacity: 0.75, fontWeight: 500 }}>{shift.position}</div>
                          </div>
                          <button onClick={() => removeShift(shift.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 2, opacity: 0.6, borderRadius: 3 }}><Trash2 size={10} /></button>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </Fragment>
            )
          })}
        </div>
      </div>
      {scheduledStaff.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>No active staff yet</div>
          <div style={{ fontSize: 12 }}>Add staff in the Staff tab, then assign their recurring weekly shifts here</div>
        </div>
      )}
      {addModal && <AddShiftModal day={addModal} onClose={() => setAddModal(null)} />}
    </>
  )
}

// --- Month View --------------------------------------------------------
function MonthView() {
  const { staff, shifts, calendarAssignments, addCalendarAssignment, removeCalendarAssignment } = useScheduler()
  const today = new Date()
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [dragOverDate, setDragOverDate] = useState<string | null>(null)

  const dragging = useRef<{ staffId: string; assignmentId?: string } | null>(null)
  const enterCount = useRef<Record<string, number>>({})

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const weeks = getMonthWeeks(year, month)
  const todayIso = toIso(today)

  function prevMonth() { setViewDate(new Date(year, month - 1, 1)) }
  function nextMonth() { setViewDate(new Date(year, month + 1, 1)) }

  // Look up recurring weekly shifts for a staff member on a specific calendar date
  function getShiftsForDate(staffId: string, date: Date): Shift[] {
    const dayOfWeek = DOW_MAP[date.getDay()]
    return shifts.filter(s => s.staffId === staffId && s.day === dayOfWeek)
  }

  function makeDragGhost(label: string, color: string) {
    const g = document.createElement('div')
    g.textContent = label
    Object.assign(g.style, {
      position: 'fixed', top: '-999px',
      background: color, color: '#fff',
      padding: '5px 12px', borderRadius: '8px',
      fontSize: '12px', fontWeight: '700', pointerEvents: 'none',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
    })
    document.body.appendChild(g)
    return g
  }

  function handleRosterDragStart(e: React.DragEvent, staffId: string) {
    dragging.current = { staffId }
    e.dataTransfer.setData('text/plain', staffId)
    e.dataTransfer.effectAllowed = 'copy'
    const member = staff.find(m => m.id === staffId)
    const label = staffId === 'needs-coverage' ? 'Needs Coverage' : (member?.name ?? staffId)
    const color = staffId === 'needs-coverage' ? '#ef4444' : (member?.color ?? '#7c3aed')
    const ghost = makeDragGhost(label, color)
    e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, 20)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  function handleChipDragStart(e: React.DragEvent, assignmentId: string, staffId: string) {
    e.stopPropagation()
    dragging.current = { staffId, assignmentId }
    e.dataTransfer.setData('text/plain', staffId)
    e.dataTransfer.effectAllowed = 'move'
    const member = staff.find(m => m.id === staffId)
    const label = staffId === 'needs-coverage' ? 'Coverage' : (member?.name?.split(' ')[0] ?? staffId)
    const color = staffId === 'needs-coverage' ? '#ef4444' : (member?.color ?? '#7c3aed')
    const ghost = makeDragGhost(label, color)
    e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, 20)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  function handleDragEnd() {
    dragging.current = null
    enterCount.current = {}
    setDragOverDate(null)
  }

  function handleDragEnter(e: React.DragEvent, iso: string) {
    e.preventDefault()
    enterCount.current[iso] = (enterCount.current[iso] ?? 0) + 1
    setDragOverDate(iso)
  }

  function handleDragLeave(_e: React.DragEvent, iso: string) {
    enterCount.current[iso] = (enterCount.current[iso] ?? 1) - 1
    if ((enterCount.current[iso] ?? 0) <= 0) {
      enterCount.current[iso] = 0
      setDragOverDate(prev => (prev === iso ? null : prev))
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = dragging.current?.assignmentId ? 'move' : 'copy'
  }

  function handleDrop(e: React.DragEvent, date: Date) {
    e.preventDefault()
    const current = dragging.current
    const staffId = current?.staffId ?? e.dataTransfer.getData('text/plain')
    if (!staffId) return
    if (current?.assignmentId) removeCalendarAssignment(current.assignmentId)
    addCalendarAssignment(staffId, toIso(date))
    dragging.current = null
    enterCount.current = {}
    setDragOverDate(null)
  }

  const rosterStaff = staff.filter(s => s.status !== 'inactive')

  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>

      {/* Left roster panel */}
      <div style={{ width: 180, flexShrink: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
          Drag to schedule
        </div>
        <div
          draggable onDragStart={e => handleRosterDragStart(e, 'needs-coverage')} onDragEnd={handleDragEnd}
          className="roster-drag-item needs-coverage-drag"
          title="Drag to mark a day as needing coverage"
        >
          <div className="needs-coverage-triangle" />
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>Needs Coverage</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Drag onto day</div>
          </div>
        </div>
        <div style={{ marginBottom: 8, borderBottom: '1px solid var(--border)', paddingBottom: 4 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 'calc(100vh - 260px)', overflowY: 'auto', paddingRight: 2 }}>
          {rosterStaff.map(member => {
            const rgb = hexToRgb(member.color)
            return (
              <div
                key={member.id} draggable
                onDragStart={e => handleRosterDragStart(e, member.id)} onDragEnd={handleDragEnd}
                className="roster-drag-item"
                style={{ '--staff-color': member.color, borderColor: `rgba(${rgb}, 0.35)` } as React.CSSProperties}
                title={`${member.name} — drag to schedule`}
              >
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: `rgba(${rgb}, 0.18)`, border: `2px solid ${member.color}`, color: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                  {member.name.split(' ').map((p: string) => p[0]).join('').slice(0, 2)}
                </div>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{member.role}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly calendar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button className="btn-ghost" onClick={prevMonth} style={{ padding: '6px 10px' }}><ChevronLeft size={16} /></button>
          <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>{MONTH_NAMES[month]} {year}</span>
          <button className="btn-ghost" onClick={nextMonth} style={{ padding: '6px 10px' }}><ChevronRight size={16} /></button>
        </div>
        {/* DOW headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
          {DOW_LABELS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 0' }}>{d}</div>
          ))}
        </div>
        {/* Weeks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {week.map((date, di) => {
                const iso = toIso(date)
                const isCurrentMonth = date.getMonth() === month
                const isToday = iso === todayIso
                const isDragOver = dragOverDate === iso
                const assignments = calendarAssignments.filter(a => a.date === iso)
                const hasCoverage = assignments.some(a => a.staffId === 'needs-coverage')
                const conflictIds = new Set(
                  Object.entries(
                    assignments.reduce((acc, a) => {
                      if (a.staffId !== 'needs-coverage') acc[a.staffId] = (acc[a.staffId] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                  ).filter(([, v]) => v > 1).map(([k]) => k)
                )
                return (
                  <div
                    key={di}
                    className={`calendar-cell${isDragOver ? ' drag-over' : ''}${isToday ? ' today-cell' : ''}${hasCoverage ? ' has-coverage' : ''}`}
                    style={{ opacity: isCurrentMonth ? 1 : 0.25 }}
                    onDragEnter={e => handleDragEnter(e, iso)}
                    onDragLeave={e => handleDragLeave(e, iso)}
                    onDragOver={handleDragOver}
                    onDrop={e => handleDrop(e, date)}
                  >
                    <div style={{ marginBottom: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        className={isToday ? 'today-badge' : ''}
                        style={{ fontSize: 13, fontWeight: isToday ? 800 : 600, color: isToday ? undefined : 'var(--text-secondary)' }}
                      >
                        {date.getDate()}
                      </span>
                      {assignments.length > 0 && (
                        <span style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 600 }}>{assignments.length}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                      {assignments.map(a => {
                        if (a.staffId === 'needs-coverage') {
                          return (
                            <div
                              key={a.id} draggable
                              onDragStart={e => handleChipDragStart(e, a.id, a.staffId)}
                              onDragEnd={handleDragEnd}
                              className="coverage-full-chip"
                              onClick={() => removeCalendarAssignment(a.id)}
                              title="Drag to move · Click to remove"
                            >
                              <div className="coverage-full-triangle" />
                              <span className="coverage-full-label">Needs Coverage</span>
                            </div>
                          )
                        }
                        const member = staff.find(m => m.id === a.staffId)
                        if (!member) return null
                        const rgb = hexToRgb(member.color)
                        const dayShifts = getShiftsForDate(a.staffId, date)
                        return (
                          <div
                            key={a.id} draggable
                            onDragStart={e => handleChipDragStart(e, a.id, a.staffId)}
                            onDragEnd={handleDragEnd}
                            className="cal-chip"
                            style={{ background: conflictIds.has(a.staffId) ? 'rgba(245,158,11,0.12)' : `rgba(${rgb}, 0.18)`, borderLeft: `3px solid ${conflictIds.has(a.staffId) ? '#f59e0b' : member.color}`, color: conflictIds.has(a.staffId) ? '#f59e0b' : member.color, cursor: 'grab' }}
                            onClick={() => removeCalendarAssignment(a.id)}
                            title={`${member.name}${conflictIds.has(a.staffId) ? ' ⚠ Double-booked' : ''} — drag to move · click to remove`}
                          >
                            <span className="cal-chip-name">{member.name}</span>
                            {dayShifts.length > 0 ? (
                              <span className="cal-chip-time">
                                {dayShifts[0].startTime}–{dayShifts[0].endTime}
                                {dayShifts[0].position ? ` · ${dayShifts[0].position}` : ''}
                              </span>
                            ) : (
                              <span className="cal-chip-time">{member.role}</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11.5, color: 'var(--text-muted)' }}>
          💡 Drag roster → day to add &nbsp;·&nbsp; Drag chip → day to move &nbsp;·&nbsp; Click chip to remove
        </div>
        {!calendarAssignments.some(a => a.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) && (
          <div style={{ textAlign: 'center', padding: '24px 0 8px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📅</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>No shifts scheduled for {MONTH_NAMES[month]}</div>
            <div style={{ fontSize: 12 }}>Drag a staff member from the roster onto any day to get started</div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Day View --------------------------------------------------------
function DayView() {
  const { staff, calendarAssignments, shifts, removeCalendarAssignment } = useScheduler()
  const [date, setDate] = useState(() => toIso(new Date()))

  const allForDate = calendarAssignments.filter(a => a.date === date)
  const assignments = allForDate.filter(a => a.staffId !== 'needs-coverage')
  const hasCoverage = allForDate.some(a => a.staffId === 'needs-coverage')
  const staffCounts = assignments.reduce((acc, a) => {
    acc[a.staffId] = (acc[a.staffId] || 0) + 1; return acc
  }, {} as Record<string, number>)

  const dateObj = new Date(date + 'T12:00:00')
  const dow = DOW_MAP[dateObj.getDay()]
  const todayIso = toIso(new Date())
  const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  function prev() { const d = new Date(date + 'T12:00:00'); d.setDate(d.getDate() - 1); setDate(toIso(d)) }
  function next() { const d = new Date(date + 'T12:00:00'); d.setDate(d.getDate() + 1); setDate(toIso(d)) }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className="btn-ghost" onClick={prev} style={{ padding: '6px 10px' }}><ChevronLeft size={15} /></button>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', minWidth: 200 }}>{dayLabel}</span>
        <button className="btn-ghost" onClick={next} style={{ padding: '6px 10px' }}><ChevronRight size={15} /></button>
        {date !== todayIso && (
          <button className="btn-ghost" onClick={() => setDate(todayIso)} style={{ padding: '5px 12px', fontSize: 12 }}>Today</button>
        )}
        {hasCoverage && (
          <span style={{ padding: '3px 12px', borderRadius: 99, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171', fontSize: 11, fontWeight: 700 }}>⚠ Needs Coverage</span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{assignments.length} staff · {dow}</span>
      </div>
      {assignments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>No staff scheduled for this day</div>
          <div style={{ fontSize: 12 }}>Switch to Month view and drag staff onto a date to schedule them</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {assignments.map(a => {
            const member = staff.find(m => m.id === a.staffId)
            if (!member) return null
            const rgb = hexToRgb(member.color)
            const isConflict = (staffCounts[a.staffId] || 0) > 1
            const memberShifts = shifts.filter(s => s.staffId === a.staffId && s.day === dow)
            return (
              <div key={a.id} style={{
                background: isConflict ? 'rgba(245,158,11,0.08)' : `rgba(${rgb}, 0.08)`,
                border: `1px solid ${isConflict ? 'rgba(245,158,11,0.4)' : `rgba(${rgb}, 0.3)`}`,
                borderLeft: `4px solid ${isConflict ? '#f59e0b' : member.color}`,
                borderRadius: 12, padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `rgba(${rgb}, 0.2)`, border: `2px solid ${member.color}`, color: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
                  {member.name.split(' ').map((p: string) => p[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</span>
                    {isConflict && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Double Booked</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{member.role} · {member.department}</div>
                  {memberShifts.length > 0 && (
                    <div style={{ fontSize: 12, color: member.color, fontWeight: 600, marginTop: 3 }}>
                      {memberShifts[0].startTime}–{memberShifts[0].endTime} · {memberShifts[0].position}
                    </div>
                  )}
                </div>
                <button onClick={() => removeCalendarAssignment(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 6, opacity: 0.6 }}><X size={14} /></button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// --- Main Schedule Page ------------------------------------------------
export default function Schedule() {
  const { shifts, calendarAssignments, staff } = useScheduler()
  const [view, setView] = useState<'week' | 'month' | 'day'>('month')

  function downloadCSV() {
    const rows: string[][] = [['Date','Staff','Role','Department','Start Time','End Time','Position']]
    calendarAssignments
      .filter(a => a.staffId !== 'needs-coverage')
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach(a => {
        const member = staff.find(m => m.id === a.staffId)
        if (!member) return
        const dow = DOW_MAP[new Date(a.date + 'T12:00:00').getDay()]
        const sh = shifts.filter(s => s.staffId === a.staffId && s.day === dow)[0]
        rows.push([a.date, member.name, member.role, member.department, sh?.startTime ?? '', sh?.endTime ?? '', sh?.position ?? ''])
      })
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const tag = document.createElement('a')
    tag.href = url; tag.download = 'nyxgrid-schedule.csv'; tag.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="p-6" style={{ color: 'var(--text-primary)' }}>
      <div className="flex items-center justify-between mb-5">
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
          {view === 'week' ? `${shifts.length} recurring shifts` : view === 'month' ? `${calendarAssignments.length} scheduled this month` : 'Day view'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={downloadCSV} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 12 }} title="Export CSV">
            <Download size={13} /> Export
          </button>
          <div style={{ display: 'flex', gap: 3, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
            <button onClick={() => setView('day')} className={view === 'day' ? 'btn-accent' : 'btn-ghost'} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 13, borderRadius: 7 }}>
              <List size={14} /> Day
            </button>
            <button onClick={() => setView('week')} className={view === 'week' ? 'btn-accent' : 'btn-ghost'} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 13, borderRadius: 7 }}>
              <LayoutGrid size={14} /> Week
            </button>
            <button onClick={() => setView('month')} className={view === 'month' ? 'btn-accent' : 'btn-ghost'} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 13, borderRadius: 7 }}>
              <Calendar size={14} /> Month
            </button>
          </div>
        </div>
      </div>
      {view === 'week' ? <WeekView /> : view === 'month' ? <MonthView /> : <DayView />}
    </div>
  )
}
import { useState, Fragment } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { useScheduler } from '../contexts/SchedulerContext'
import { WEEK_DAYS, POSITIONS } from '../types'
import type { WeekDay, Shift } from '../types'

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

interface AddShiftModalProps {
  day: WeekDay
  onClose: () => void
}

function AddShiftModal({ day, onClose }: AddShiftModalProps) {
  const { staff, addShift } = useScheduler()
  const [staffId, setStaffId] = useState(staff[0]?.id ?? '')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [position, setPosition] = useState(POSITIONS[0])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!staffId) return
    addShift({ staffId, day, startTime, endTime, position })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            Add Shift — {day}
          </h2>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 8 }}><X size={15} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Staff Member</label>
            <select
              className="themed-input rounded-lg px-3 py-2"
              value={staffId}
              onChange={e => setStaffId(e.target.value)}
            >
              {staff.filter(s => s.status === 'active').map(m => (
                <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start</label>
              <input
                type="time"
                className="themed-input rounded-lg px-3 py-2"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End</label>
              <input
                type="time"
                className="themed-input rounded-lg px-3 py-2"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Position</label>
            <select
              className="themed-input rounded-lg px-3 py-2"
              value={position}
              onChange={e => setPosition(e.target.value)}
            >
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <button type="submit" className="btn-accent mt-2" style={{ width: '100%', padding: '10px' }}>
            Add Shift
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Schedule() {
  const { staff, shifts, getStaffById, removeShift } = useScheduler()
  const [addModal, setAddModal] = useState<WeekDay | null>(null)

  // Get unique staff that appear in shifts
  const scheduledStaff = staff.filter(m =>
    shifts.some(s => s.staffId === m.id) || m.status === 'active'
  )

  function getShift(staffId: string, day: WeekDay): Shift[] {
    return shifts.filter(s => s.staffId === staffId && s.day === day)
  }

  return (
    <div className="p-6" style={{ color: 'var(--text-primary)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
            {shifts.length} shifts across {WEEK_DAYS.length} days
          </p>
        </div>
        <button
          className="btn-accent flex items-center gap-2"
          onClick={() => setAddModal('Mon')}
        >
          <Plus size={15} /> Add Shift
        </button>
      </div>

      {/* Scrollable schedule grid */}
      <div style={{ overflowX: 'auto' }}>
        <div
          className="schedule-grid"
          style={{ gridTemplateColumns: `200px repeat(${WEEK_DAYS.length}, 1fr)`, minWidth: 700 }}
        >
          {/* Header row */}
          <div className="schedule-header-cell" style={{ borderRight: '2px solid var(--border)' }}>Staff</div>
          {WEEK_DAYS.map(d => (
            <div key={d} className="schedule-header-cell flex items-center justify-between">
              <span>{d}</span>
              <button
                onClick={() => setAddModal(d)}
                style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, borderRadius: 4 }}
                title={`Add shift on ${d}`}
              >
                <Plus size={13} />
              </button>
            </div>
          ))}

          {/* Staff rows */}
          {scheduledStaff.map(member => {
            const rgb = hexToRgb(member.color)
            return (
              <Fragment key={member.id}>
                {/* Row label */}
                <div
                  className="schedule-row-label"
                  style={{ borderRight: '2px solid var(--border)' }}
                >
                  {/* Color indicator bar + avatar */}
                  <div
                    style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: member.color,
                      boxShadow: `0 0 6px rgba(${rgb}, 0.9)`,
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: `rgba(${rgb}, 0.18)`,
                      color: member.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, flexShrink: 0,
                    }}
                  >
                    {member.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{member.role}</div>
                  </div>
                </div>

                {/* Day cells */}
                {WEEK_DAYS.map(day => {
                  const dayShifts = getShift(member.id, day)
                  return (
                    <div
                      key={`cell-${member.id}-${day}`}
                      className="schedule-cell"
                      onClick={() => setAddModal(day)}
                    >
                      {dayShifts.map(shift => (
                        <div
                          key={shift.id}
                          className="shift-block flex items-center justify-between"
                          style={{
                            background: `rgba(${rgb}, 0.18)`,
                            borderLeft: `3px solid ${member.color}`,
                            color: member.color,
                            marginBottom: 3,
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700 }}>{shift.startTime}–{shift.endTime}</div>
                            <div style={{ fontSize: 9.5, opacity: 0.75, fontWeight: 500 }}>{shift.position}</div>
                          </div>
                          <button
                            onClick={() => removeShift(shift.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 2, opacity: 0.6, borderRadius: 3 }}
                            title="Remove shift"
                          >
                            <Trash2 size={10} />
                          </button>
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

      {addModal && (
        <AddShiftModal day={addModal} onClose={() => setAddModal(null)} />
      )}
    </div>
  )
}

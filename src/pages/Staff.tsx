import { useState } from 'react'
import { Plus, X, Search } from 'lucide-react'
import { useScheduler } from '../contexts/SchedulerContext'
import { STAFF_COLORS } from '../types'
import type { StaffMember } from '../types'
import StaffBadge from '../components/StaffBadge'

const DEPARTMENTS = ['Management', 'Bar', 'Kitchen', 'FOH', 'Delivery', 'Support']
const ROLES = ['Manager', 'Supervisor', 'Barista', 'Cook', 'Line Cook', 'Server', 'Host', 'Dishwasher', 'Delivery', 'Part-time']

interface EditModalProps {
  member?: StaffMember
  onClose: () => void
}

function EditModal({ member, onClose }: EditModalProps) {
  const { addStaff, updateStaff, removeStaff } = useScheduler()
  const [name, setName] = useState(member?.name ?? '')
  const [role, setRole] = useState(member?.role ?? ROLES[0])
  const [department, setDepartment] = useState(member?.department ?? DEPARTMENTS[0])
  const [color, setColor] = useState(member?.color ?? STAFF_COLORS[0].hex)
  const [email, setEmail] = useState(member?.email ?? '')
  const [status, setStatus] = useState<StaffMember['status']>(member?.status ?? 'active')
  const [hours, setHours] = useState(member?.hoursPerWeek?.toString() ?? '40')
  const [unavailableDays, setUnavailableDays] = useState<string[]>(member?.unavailableDays ?? [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const data = {
      name: name.trim(), role, department, color, email,
      status, hoursPerWeek: parseInt(hours) || 40,
      unavailableDays,
    }
    if (member) {
      updateStaff(member.id, data)
    } else {
      addStaff(data)
    }
    onClose()
  }

  function handleDelete() {
    if (!member) return
    if (confirm(`Remove ${member.name} from the schedule?`)) {
      removeStaff(member.id)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            {member ? 'Edit Staff Member' : 'Add Staff Member'}
          </h2>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 8 }}><X size={15} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name *</label>
            <input
              type="text"
              className="themed-input rounded-lg px-3 py-2"
              placeholder="First Last"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* Role + Department */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label>
              <select className="themed-input rounded-lg px-3 py-2" value={role} onChange={e => setRole(e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</label>
              <select className="themed-input rounded-lg px-3 py-2" value={department} onChange={e => setDepartment(e.target.value)}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Email + Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
              <input
                type="email"
                className="themed-input rounded-lg px-3 py-2"
                placeholder="name@work.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hours/Week</label>
              <input
                type="number"
                className="themed-input rounded-lg px-3 py-2"
                min={1} max={80}
                value={hours}
                onChange={e => setHours(e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
            <div className="flex gap-2">
              {(['active', 'on-leave', 'inactive'] as StaffMember['status'][]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={status === s ? 'btn-accent' : 'btn-ghost'}
                  style={{ flex: 1, padding: '7px 0', fontSize: 12 }}
                >
                  {s === 'active' ? '✓ Active' : s === 'on-leave' ? '☕ On Leave' : '○ Inactive'}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unavailable Days</label>
            <div className="flex gap-1.5">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setUnavailableDays(prev =>
                    prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                  )}
                  className={unavailableDays.includes(day) ? 'btn-accent' : 'btn-ghost'}
                  style={{ flex: 1, padding: '5px 0', fontSize: 10, fontWeight: 700 }}
                >
                  {day}
                </button>
              ))}
            </div>
            {unavailableDays.length > 0 && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Off: {unavailableDays.join(', ')}</div>
            )}
          </div>

          {/* Badge Color */}
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Badge Color
            </label>
            <div className="flex flex-wrap gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              {STAFF_COLORS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className="staff-color-swatch"
                  style={{ background: c.hex }}
                  title={c.label}
                >
                  {color === c.hex && (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 9, color: '#fff', fontWeight: 900, lineHeight: 1 }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            {/* Preview */}
            <div className="flex items-center gap-2" style={{ marginTop: 2 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}88`, border: '2px solid var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Preview — {name || 'Name'}'s badge color
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            {member && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn-ghost"
                style={{ padding: '10px 16px', color: 'var(--danger)', borderColor: 'var(--danger)', opacity: 0.8 }}
              >
                Remove
              </button>
            )}
            <button type="submit" className="btn-accent" style={{ flex: 1, padding: '10px' }}>
              {member ? 'Save Changes' : 'Add Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Staff() {
  const { staff } = useScheduler()
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('All')

  const departments = ['All', ...Array.from(new Set(staff.map(s => s.department)))]

  const filtered = staff.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
    const matchDept = filterDept === 'All' || m.department === filterDept
    return matchSearch && matchDept
  })

  function openAdd() {
    setEditTarget(null)
    setShowModal(true)
  }

  function openEdit(m: StaffMember) {
    setEditTarget(m)
    setShowModal(true)
  }

  return (
    <div className="p-6" style={{ color: 'var(--text-primary)' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1" style={{ minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="themed-input rounded-lg pl-8 pr-3 py-2 w-full"
            placeholder="Search staff..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setFilterDept(d)}
              className={filterDept === d ? 'btn-accent' : 'btn-ghost'}
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              {d}
            </button>
          ))}
        </div>

        <button onClick={openAdd} className="btn-accent flex items-center gap-2">
          <Plus size={15} /> Add Staff
        </button>
      </div>

      {/* Color legend */}
      <div
        className="flex flex-wrap gap-3 mb-5 p-3 rounded-xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      >
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'center' }}>
          Color Key
        </span>
        {[...new Map(staff.map(s => [s.color, s])).values()].map(s => (
          <div key={s.color} className="flex items-center gap-1.5">
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, boxShadow: `0 0 5px ${s.color}88` }} />
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.department}</span>
          </div>
        ))}
      </div>

      {/* Staff grid */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filtered.map(member => (
          <StaffBadge key={member.id} member={member} onEdit={openEdit} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            No staff members match your search.
          </div>
        )}
      </div>

      {showModal && (
        <EditModal
          member={editTarget ?? undefined}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

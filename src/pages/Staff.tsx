import { useState, useMemo } from 'react'
import {
  Plus, X, Search, LayoutGrid, List, ArrowUpDown,
  Mail, Phone, Clock, Calendar, FileText, ChevronDown,
  CheckCircle, Coffee, AlertCircle, Edit2,
} from 'lucide-react'
import { useScheduler } from '../contexts/SchedulerContext'
import { STAFF_COLORS } from '../types'
import type { StaffMember, ContractType } from '../types'

/* ─── Constants ──────────────────────────────────────────────── */
const DEPARTMENTS   = ['Front Desk', 'Management', 'Administration', 'Security', 'Concierge', 'Night Shift', 'Facilities']
const ROLES         = ['Receptionist', 'Senior Receptionist', 'Front Desk Agent', 'Night Auditor', 'Concierge', 'Team Lead', 'Supervisor', 'Manager', 'Admin Assistant', 'Part-time']
const CONTRACT_TYPES: ContractType[] = ['Full-Time', 'Part-Time', 'Casual', 'Zero-Hours']
const WEEK_DAYS     = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const STATUS_META = {
  active:     { label: 'Active',   color: '#10b981', icon: <CheckCircle size={11} /> },
  'on-leave': { label: 'On Leave', color: '#f59e0b', icon: <Coffee      size={11} /> },
  inactive:   { label: 'Inactive', color: '#6b7280', icon: <AlertCircle size={11} /> },
}

const CONTRACT_COLORS: Record<ContractType, string> = {
  'Full-Time':  '#6366f1',
  'Part-Time':  '#0ea5e9',
  'Casual':     '#f97316',
  'Zero-Hours': '#a78bfa',
}

function hexToRgb(hex: string) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`
}
function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

/* ─── Edit Modal ─────────────────────────────────────────────── */
type ModalTab = 'profile' | 'contact' | 'schedule' | 'notes'

function EditModal({ member, onClose }: { member?: StaffMember; onClose: () => void }) {
  const { addStaff, updateStaff, removeStaff } = useScheduler()
  const [tab, setTab] = useState<ModalTab>('profile')

  const [name,         setName]         = useState(member?.name ?? '')
  const [role,         setRole]         = useState(member?.role ?? ROLES[0])
  const [department,   setDepartment]   = useState(member?.department ?? DEPARTMENTS[0])
  const [contractType, setContractType] = useState<ContractType>(member?.contractType ?? 'Full-Time')
  const [status,       setStatus]       = useState<StaffMember['status']>(member?.status ?? 'active')
  const [email,        setEmail]        = useState(member?.email ?? '')
  const [phone,        setPhone]        = useState(member?.phone ?? '')
  const [hours,        setHours]        = useState(member?.hoursPerWeek?.toString() ?? '37')
  const [startDate,    setStartDate]    = useState(member?.startDate ?? '')
  const [unavDays,     setUnavDays]     = useState<string[]>(member?.unavailableDays ?? [])
  const [color,        setColor]        = useState(member?.color ?? STAFF_COLORS[0].hex)
  const [notes,        setNotes]        = useState(member?.notes ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setTab('profile'); return }
    const data: Omit<StaffMember, 'id'> = {
      name: name.trim(), role, department, contractType,
      status, email, phone, hoursPerWeek: parseInt(hours) || 37,
      startDate: startDate || undefined,
      unavailableDays: unavDays,
      color, notes: notes.trim() || undefined,
    }
    member ? updateStaff(member.id, data) : addStaff(data)
    onClose()
  }

  function handleDelete() {
    if (!member) return
    if (confirm(`Remove ${member.name}? This will delete all their shifts too.`)) {
      removeStaff(member.id); onClose()
    }
  }

  const TABS: { id: ModalTab; label: string }[] = [
    { id: 'profile',  label: 'Profile'  },
    { id: 'contact',  label: 'Contact'  },
    { id: 'schedule', label: 'Schedule' },
    { id: 'notes',    label: 'Notes'    },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 520, padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* Header + tabs */}
        <div style={{ padding: '20px 24px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {member && (
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: `rgba(${hexToRgb(color)}, 0.2)`, border: `2px solid ${color}`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                  {initials(name || member.name)}
                </div>
              )}
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
                {member ? `Edit — ${member.name}` : 'Add Staff Member'}
              </h2>
            </div>
            <button className="btn-ghost" onClick={onClose} style={{ padding: 6 }}><X size={14} /></button>
          </div>
          <div className="flex gap-0">
            {TABS.map(t => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
                padding: '8px 16px', fontSize: 12, fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer',
                color: tab === t.id ? 'var(--accent)' : 'var(--text-muted)',
                borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.15s',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>

            {/* ── Profile ── */}
            {tab === 'profile' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" className="themed-input rounded-lg px-3 py-2" placeholder="First Last" value={name} onChange={e => setName(e.target.value)} required autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label style={labelStyle}>Role</label>
                    <select className="themed-input rounded-lg px-3 py-2" value={role} onChange={e => setRole(e.target.value)}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label style={labelStyle}>Department</label>
                    <select className="themed-input rounded-lg px-3 py-2" value={department} onChange={e => setDepartment(e.target.value)}>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label style={labelStyle}>Contract Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {CONTRACT_TYPES.map(ct => (
                      <button key={ct} type="button" onClick={() => setContractType(ct)} style={{
                        padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: 'pointer', border: '1px solid',
                        background: contractType === ct ? `${CONTRACT_COLORS[ct]}22` : 'transparent',
                        borderColor: contractType === ct ? CONTRACT_COLORS[ct] : 'var(--border)',
                        color: contractType === ct ? CONTRACT_COLORS[ct] : 'var(--text-muted)',
                        transition: 'all 0.15s',
                      }}>{ct}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label style={labelStyle}>Status</label>
                  <div className="flex gap-2">
                    {(['active', 'on-leave', 'inactive'] as StaffMember['status'][]).map(s => (
                      <button key={s} type="button" onClick={() => setStatus(s)}
                        className={status === s ? 'btn-accent' : 'btn-ghost'}
                        style={{ flex: 1, padding: '7px 0', fontSize: 12 }}>
                        {s === 'active' ? '✓ Active' : s === 'on-leave' ? '☕ On Leave' : '○ Inactive'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Contact ── */}
            {tab === 'contact' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label style={labelStyle}>Email</label>
                  <input type="email" className="themed-input rounded-lg px-3 py-2" placeholder="name@workplace.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label style={labelStyle}>Phone / Mobile</label>
                  <input type="tel" className="themed-input rounded-lg px-3 py-2" placeholder="+44 7700 000000" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label style={labelStyle}>Contracted Hrs / Week</label>
                    <input type="number" className="themed-input rounded-lg px-3 py-2" min={1} max={80} value={hours} onChange={e => setHours(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label style={labelStyle}>Start Date</label>
                    <input type="date" className="themed-input rounded-lg px-3 py-2" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                </div>
                {startDate && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 12px', borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    📅 {name || 'This person'} started{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months ago
                    </strong>{' '}· {new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
              </div>
            )}

            {/* ── Schedule ── */}
            {tab === 'schedule' && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label style={labelStyle}>Unavailable Days <span style={{ color: 'var(--text-muted)', textTransform: 'none', fontWeight: 400, fontSize: 11 }}>(mark days off)</span></label>
                  <div className="flex gap-1.5">
                    {WEEK_DAYS.map(day => (
                      <button key={day} type="button"
                        onClick={() => setUnavDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                        style={{
                          flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 700, borderRadius: 8, cursor: 'pointer', border: '1px solid', transition: 'all 0.15s',
                          background: unavDays.includes(day) ? 'rgba(239,68,68,0.12)' : 'var(--bg-secondary)',
                          borderColor: unavDays.includes(day) ? 'rgba(239,68,68,0.5)' : 'var(--border)',
                          color: unavDays.includes(day) ? '#f87171' : 'var(--text-muted)',
                        }}>{day}</button>
                    ))}
                  </div>
                  {unavDays.length > 0 && <div style={{ fontSize: 11, color: '#f87171' }}>Not available: {unavDays.join(', ')}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <label style={labelStyle}>Badge Color</label>
                  <div className="flex flex-wrap gap-2.5 p-3 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    {STAFF_COLORS.map(c => (
                      <button key={c.id} type="button" onClick={() => setColor(c.hex)} className="staff-color-swatch" style={{ background: c.hex }} title={c.label}>
                        {color === c.hex && <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 9, color: '#fff', fontWeight: 900 }}>✓</span>}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}88`, border: '2px solid var(--border)' }} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{name || 'Name'}'s badge · {STAFF_COLORS.find(c => c.hex === color)?.label ?? ''}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Notes ── */}
            {tab === 'notes' && (
              <div className="flex flex-col gap-3">
                <label style={labelStyle}>Manager Notes</label>
                <textarea
                  className="themed-input rounded-lg px-3 py-2"
                  rows={8}
                  placeholder="Training notes, performance, preferences, emergency contact, anything relevant..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: 13, lineHeight: 1.6 }}
                />
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Visible to managers only. Not shared with staff.</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, background: 'var(--bg-card)' }}>
            {member && (
              <button type="button" onClick={handleDelete} className="btn-ghost"
                style={{ padding: '9px 16px', color: 'var(--danger)', borderColor: 'var(--danger)', opacity: 0.8, fontSize: 13 }}>
                Remove
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              {TABS.indexOf(TABS.find(t => t.id === tab)!) < TABS.length - 1 && (
                <button type="button" onClick={() => setTab(TABS[TABS.indexOf(TABS.find(t => t.id === tab)!) + 1].id)} className="btn-ghost" style={{ padding: '9px 16px', fontSize: 13 }}>
                  Next →
                </button>
              )}
              <button type="submit" className="btn-accent" style={{ padding: '9px 24px', fontSize: 13 }}>
                {member ? 'Save Changes' : 'Add Staff Member'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── Staff Page ─────────────────────────────────────────────── */
type SortKey = 'name' | 'department' | 'role' | 'status' | 'hours'

export default function Staff() {
  const { staff, getShiftsForStaff } = useScheduler()
  const [editTarget,    setEditTarget]    = useState<StaffMember | null>(null)
  const [showModal,     setShowModal]     = useState(false)
  const [search,        setSearch]        = useState('')
  const [filterDept,    setFilterDept]    = useState('All')
  const [filterStatus,  setFilterStatus]  = useState<'all' | StaffMember['status']>('all')
  const [viewMode,      setViewMode]      = useState<'card' | 'table'>('card')
  const [sortKey,       setSortKey]       = useState<SortKey>('name')
  const [sortAsc,       setSortAsc]       = useState(true)
  const [sortOpen,      setSortOpen]      = useState(false)

  function getWeeklyHours(m: StaffMember) {
    return getShiftsForStaff(m.id).reduce((acc, s) => {
      const [sh, sm] = s.startTime.split(':').map(Number)
      const [eh, em] = s.endTime.split(':').map(Number)
      return acc + (eh + em / 60 - sh - sm / 60)
    }, 0)
  }

  const departments = ['All', ...Array.from(new Set(staff.map(s => s.department))).sort()]

  const filtered = useMemo(() => {
    let list = staff.filter(m => {
      const q = search.toLowerCase()
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || (m.email ?? '').toLowerCase().includes(q) || (m.phone ?? '').includes(q)
      const matchDept   = filterDept === 'All' || m.department === filterDept
      const matchStatus = filterStatus === 'all' || m.status === filterStatus
      return matchSearch && matchDept && matchStatus
    })
    list = [...list].sort((a, b) => {
      let va: string | number = ''
      let vb: string | number = ''
      if      (sortKey === 'name')       { va = a.name;       vb = b.name       }
      else if (sortKey === 'department') { va = a.department;  vb = b.department }
      else if (sortKey === 'role')       { va = a.role;        vb = b.role       }
      else if (sortKey === 'status')     { va = a.status;      vb = b.status     }
      else if (sortKey === 'hours')      { va = getWeeklyHours(a); vb = getWeeklyHours(b) }
      if (typeof va === 'number') return sortAsc ? va - (vb as number) : (vb as number) - va
      return sortAsc ? va.localeCompare(vb as string) : (vb as string).localeCompare(va)
    })
    return list
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff, search, filterDept, filterStatus, sortKey, sortAsc])

  const active          = staff.filter(s => s.status === 'active').length
  const onLeave         = staff.filter(s => s.status === 'on-leave').length
  const inactive        = staff.filter(s => s.status === 'inactive').length
  const totalContracted = staff.filter(s => s.status === 'active').reduce((a, m) => a + (m.hoursPerWeek ?? 0), 0)

  function openAdd()               { setEditTarget(null);  setShowModal(true) }
  function openEdit(m: StaffMember){ setEditTarget(m);     setShowModal(true) }
  function toggleSort(k: SortKey)  { if (sortKey === k) setSortAsc(a => !a); else { setSortKey(k); setSortAsc(true) } }

  return (
    <div className="p-6" style={{ color: 'var(--text-primary)' }}>

      {/* ── Stats bar ── */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: 'Active',      value: active,        color: '#10b981',          filter: 'active'   as const },
          { label: 'On Leave',    value: onLeave,       color: '#f59e0b',          filter: 'on-leave' as const },
          { label: 'Inactive',    value: inactive,      color: '#6b7280',          filter: 'inactive' as const },
          { label: 'Total Staff', value: staff.length,  color: 'var(--accent)',    filter: 'all'      as const },
        ].map(stat => (
          <button key={stat.label} type="button" onClick={() => setFilterStatus(prev => prev === stat.filter ? 'all' : stat.filter)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '12px 18px', borderRadius: 12, border: '1px solid',
              background: filterStatus === stat.filter ? 'rgba(139,92,246,0.1)' : 'var(--bg-secondary)',
              borderColor: filterStatus === stat.filter ? stat.color : 'var(--border)',
              cursor: 'pointer', transition: 'all 0.15s', minWidth: 110, textAlign: 'left',
            }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 3 }}>{stat.label}</span>
          </button>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 18px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-secondary)', minWidth: 110 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{totalContracted}h</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 3 }}>Contracted / Week</span>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative" style={{ flex: 1, minWidth: 200 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="themed-input rounded-lg w-full" style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 13 }}
            placeholder="Search name, role, email, phone…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {departments.map(d => (
            <button key={d} onClick={() => setFilterDept(d)} className={filterDept === d ? 'btn-accent' : 'btn-ghost'} style={{ padding: '6px 11px', fontSize: 11, fontWeight: 600 }}>{d}</button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ position: 'relative' }}>
          <button type="button" onClick={() => setSortOpen(o => !o)} className="btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', fontSize: 12 }}>
            <ArrowUpDown size={13} /> Sort: {sortKey} {sortAsc ? '↑' : '↓'} <ChevronDown size={12} />
          </button>
          {sortOpen && (
            <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 50, minWidth: 150, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
              {(['name','department','role','status','hours'] as SortKey[]).map(k => (
                <button key={k} type="button" onClick={() => { toggleSort(k); setSortOpen(false) }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', fontSize: 12, fontWeight: sortKey === k ? 700 : 500, background: sortKey === k ? 'var(--accent-glow)' : 'none', color: sortKey === k ? 'var(--accent)' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                  {k.charAt(0).toUpperCase() + k.slice(1)} {sortKey === k ? (sortAsc ? '↑' : '↓') : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 2, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 9, padding: 3 }}>
          <button type="button" onClick={() => setViewMode('card')}  className={viewMode === 'card'  ? 'btn-accent' : 'btn-ghost'} style={{ padding: '5px 10px', borderRadius: 7 }}><LayoutGrid size={14} /></button>
          <button type="button" onClick={() => setViewMode('table')} className={viewMode === 'table' ? 'btn-accent' : 'btn-ghost'} style={{ padding: '5px 10px', borderRadius: 7 }}><List size={14} /></button>
        </div>

        <button onClick={openAdd} className="btn-accent flex items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
          <Plus size={14} /> Add Staff
        </button>
      </div>

      {/* ── Card View ── */}
      {viewMode === 'card' && (
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {filtered.map(m => <StaffCard key={m.id} member={m} weeklyHours={getWeeklyHours(m)} onEdit={openEdit} />)}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>👥</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>No staff match your filters</div>
              <div style={{ fontSize: 12 }}>Try a different search or department</div>
            </div>
          )}
        </div>
      )}

      {/* ── Table View ── */}
      {viewMode === 'table' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {[
                  { key: 'name',       label: 'Name'       },
                  { key: 'role',       label: 'Role'       },
                  { key: 'department', label: 'Department' },
                  { key: null,         label: 'Contract'   },
                  { key: 'status',     label: 'Status'     },
                  { key: 'hours',      label: 'Hrs/Week'   },
                  { key: null,         label: 'Off Days'   },
                  { key: null,         label: 'Contact'    },
                  { key: null,         label: ''           },
                ].map((col, i) => (
                  <th key={i} onClick={col.key ? () => toggleSort(col.key as SortKey) : undefined}
                    style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: col.key ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap' }}>
                    {col.label}{col.key && sortKey === col.key && (sortAsc ? ' ↑' : ' ↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const wh  = getWeeklyHours(m)
                const rgb = hexToRgb(m.color)
                const sm  = STATUS_META[m.status]
                const ct  = m.contractType
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: `rgba(${rgb},0.18)`, border: `2px solid ${m.color}`, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                          {initials(m.name)}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</span>
                        {m.notes && <span title={m.notes} style={{ color: 'var(--text-muted)', cursor: 'help' }}><FileText size={11} /></span>}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{m.role}</td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: `rgba(${rgb},0.12)`, color: m.color }}>{m.department}</span>
                    </td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      {ct && <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: `${CONTRACT_COLORS[ct]}18`, color: CONTRACT_COLORS[ct], border: `1px solid ${CONTRACT_COLORS[ct]}40` }}>{ct}</span>}
                    </td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: `${sm.color}18`, color: sm.color }}>
                        {sm.icon} {sm.label}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      <span style={{ color: m.hoursPerWeek && wh > m.hoursPerWeek ? 'var(--danger)' : 'var(--text-primary)', fontWeight: 600 }}>{wh.toFixed(1)}h</span>
                      {m.hoursPerWeek && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}> / {m.hoursPerWeek}h</span>}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div className="flex gap-1 flex-wrap">
                        {(m.unavailableDays ?? []).map(d => (
                          <span key={d} style={{ fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>{d}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div className="flex gap-2">
                        {m.email && <a href={`mailto:${m.email}`} style={{ color: 'var(--text-muted)' }} title={m.email}><Mail size={13} /></a>}
                        {m.phone && <a href={`tel:${m.phone}`}   style={{ color: 'var(--text-muted)' }} title={m.phone}><Phone size={13} /></a>}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <button type="button" onClick={() => openEdit(m)} className="btn-ghost" style={{ padding: '4px 8px' }}><Edit2 size={12} /></button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No staff match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <EditModal member={editTarget ?? undefined} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

/* ─── Staff Card ─────────────────────────────────────────────── */
function StaffCard({ member: m, weeklyHours: wh, onEdit }: { member: StaffMember; weeklyHours: number; onEdit: (m: StaffMember) => void }) {
  const rgb  = hexToRgb(m.color)
  const sm   = STATUS_META[m.status]
  const ct   = m.contractType
  const pct  = m.hoursPerWeek ? Math.min((wh / m.hoursPerWeek) * 100, 100) : 0
  const over = m.hoursPerWeek ? wh > m.hoursPerWeek : false

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14,
      padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'border-color 0.15s, transform 0.15s', cursor: 'default',
      borderLeft: `3px solid ${m.color}`,
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = m.color; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.borderLeftColor = m.color; (e.currentTarget as HTMLDivElement).style.transform = 'none' }}
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: `rgba(${rgb},0.18)`, border: `2px solid ${m.color}`, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0, position: 'relative' }}>
          {initials(m.name)}
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderRadius: '50%', background: sm.color, border: '2px solid var(--bg-card)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{m.name}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: `${sm.color}18`, color: sm.color }}>
              {sm.icon} {sm.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.role}</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>·</span>
            <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 99, background: `rgba(${rgb},0.12)`, color: m.color, fontWeight: 600 }}>{m.department}</span>
            {ct && <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 99, background: `${CONTRACT_COLORS[ct]}18`, color: CONTRACT_COLORS[ct], fontWeight: 600, border: `1px solid ${CONTRACT_COLORS[ct]}35` }}>{ct}</span>}
          </div>
        </div>
        <button type="button" onClick={() => onEdit(m)} className="btn-ghost" style={{ padding: 5, borderRadius: 7, flexShrink: 0 }} title="Edit"><Edit2 size={13} /></button>
      </div>

      {/* Hours utilisation bar */}
      {m.hoursPerWeek && (
        <div>
          <div className="flex justify-between mb-1">
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Scheduled this week</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: over ? 'var(--danger)' : 'var(--text-secondary)' }}>
              {wh.toFixed(1)}h / {m.hoursPerWeek}h {over && '⚠'}
            </span>
          </div>
          <div style={{ height: 5, borderRadius: 99, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: over ? 'var(--danger)' : m.color, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {/* Contact + tenure */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-3">
          {m.email && (
            <a href={`mailto:${m.email}`} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }} title={m.email}>
              <Mail size={11} /> <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</span>
            </a>
          )}
          {m.phone && (
            <a href={`tel:${m.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}>
              <Phone size={11} /> {m.phone}
            </a>
          )}
        </div>
        {m.startDate && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--text-muted)' }}>
            <Calendar size={10} /> Since {new Date(m.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Off days */}
      {(m.unavailableDays ?? []).length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Off:</span>
          {(m.unavailableDays ?? []).map(d => (
            <span key={d} style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>{d}</span>
          ))}
        </div>
      )}

      {/* Manager notes preview */}
      {m.notes && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, padding: '8px 10px', borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <FileText size={11} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{m.notes}</span>
        </div>
      )}
    </div>
  )
}

/* ─── Shared ─────────────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
  textTransform: 'uppercase', letterSpacing: '0.05em',
}

// suppress unused import warnings — icons used in JSX
void Clock

import { useMemo } from 'react'
import { Users, Clock, Calendar, TrendingUp, AlertTriangle, CheckCircle, Coffee, UserMinus, Sun } from 'lucide-react'
import { useScheduler } from '../contexts/SchedulerContext'
import { WEEK_DAYS } from '../types'

const DOW_MAP = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] as const
function toIso(d: Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
function hexToRgb(h: string) { return `${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}` }
function initials(name: string) { return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2) }
function greeting() { const h = new Date().getHours(); return h < 12 ? 'morning 🌅' : h < 17 ? 'afternoon ☀️' : 'evening 🌙' }

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
          <p style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 800, color: color ?? 'var(--accent)', lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{sub}</p>}
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>{icon}</div>
      </div>
    </div>
  )
}

function Alert({ color, icon, children }: { color: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', borderRadius: 8, background: `${color}15`, border: `1px solid ${color}33`, color: 'var(--text-secondary)', fontSize: 12.5 }}>
      <span style={{ color, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span>{children}</span>
    </div>
  )
}

export default function Dashboard() {
  const { staff, shifts, calendarAssignments } = useScheduler()

  const today = new Date()
  const todayIso = toIso(today)
  const todayDow = DOW_MAP[today.getDay()]
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const activeStaff  = staff.filter(s => s.status === 'active')
  const onLeaveStaff = staff.filter(s => s.status === 'on-leave')

  const todayAssignments = calendarAssignments.filter(a => a.date === todayIso && a.staffId !== 'needs-coverage')
  const todayStaffIds    = new Set(todayAssignments.map(a => a.staffId))
  const needsCoverage    = calendarAssignments.some(a => a.date === todayIso && a.staffId === 'needs-coverage')

  // Total scheduled hours today
  const todayHours = useMemo(() => {
    let total = 0
    todayAssignments.forEach(a => {
      shifts.filter(s => s.staffId === a.staffId && s.day === todayDow).forEach(s => {
        const [sh, sm] = s.startTime.split(':').map(Number)
        const [eh, em] = s.endTime.split(':').map(Number)
        total += eh + em / 60 - sh - sm / 60
      })
    })
    return total
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayAssignments, shifts, todayDow])

  // Staff assigned today but today is their day off
  const conflictToday = todayAssignments.filter(a => {
    const member = staff.find(m => m.id === a.staffId)
    return member?.unavailableDays?.includes(todayDow)
  })

  // Over-hours
  const overHoursStaff = activeStaff.filter(m => {
    const contracted = m.hoursPerWeek ?? 0
    if (!contracted) return false
    const scheduled = shifts.filter(s => s.staffId === m.id).reduce((acc, s) => {
      const [sh, sm] = s.startTime.split(':').map(Number)
      const [eh, em] = s.endTime.split(':').map(Number)
      return acc + (eh + em / 60 - sh - sm / 60)
    }, 0)
    return scheduled > contracted
  })

  // Shifts per day bar chart (recurring weekly)
  const maxDayShifts = Math.max(...WEEK_DAYS.map(d => shifts.filter(s => s.day === d).length), 1)

  // Department utilisation
  const depts = Array.from(new Set(staff.map(s => s.department))).sort()
  const deptStats = depts.map(dept => {
    const members = activeStaff.filter(m => m.department === dept)
    const scheduled = members.reduce((acc, m) =>
      acc + shifts.filter(s => s.staffId === m.id).reduce((a, s) => {
        const [sh, sm] = s.startTime.split(':').map(Number)
        const [eh, em] = s.endTime.split(':').map(Number)
        return a + (eh + em / 60 - sh - sm / 60)
      }, 0), 0)
    const contracted = members.reduce((a, m) => a + (m.hoursPerWeek ?? 0), 0)
    return { dept, count: members.length, scheduled, contracted, pct: contracted ? Math.min(Math.round((scheduled / contracted) * 100), 150) : 0 }
  }).filter(d => d.count > 0)

  const hasAlerts = conflictToday.length > 0 || onLeaveStaff.length > 0 || overHoursStaff.length > 0 || needsCoverage

  return (
    <div className="p-6" style={{ color: 'var(--text-primary)' }}>

      {/* Today header */}
      <div className="flex items-center justify-between mb-5" style={{ gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>Good {greeting()}</h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>{dateStr}</p>
        </div>
        {needsCoverage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 12, fontWeight: 700 }}>
            <AlertTriangle size={14} /> Coverage needed today
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <StatCard icon={<Users size={18}/>}      label="Active Staff"  value={activeStaff.length}       sub={`${onLeaveStaff.length} on leave`} />
        <StatCard icon={<Sun size={18}/>}        label="In Today"      value={todayStaffIds.size}        sub={`${todayHours.toFixed(1)}h coverage`} color="#10b981" />
        <StatCard icon={<Clock size={18}/>}      label="Weekly Shifts" value={shifts.length}            sub="recurring patterns" />
        <StatCard icon={<TrendingUp size={18}/>} label="Today Coverage" value={`${Math.round((todayStaffIds.size / Math.max(activeStaff.length, 1)) * 100)}%`} sub="of active team in today" color="#f59e0b" />
      </div>

      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>

        {/* Who's In Today */}
        <div className="stat-card">
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>👥 Who's In Today</h3>
          {todayAssignments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 12 }}>
              No one scheduled for today yet.<br/>
              <span style={{ fontSize: 11 }}>Drag staff onto today in the Month view.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 290, overflowY: 'auto' }}>
              {todayAssignments.map(a => {
                const member = staff.find(m => m.id === a.staffId)
                if (!member) return null
                const rgb = hexToRgb(member.color)
                const memberShifts = shifts.filter(s => s.staffId === a.staffId && s.day === todayDow)
                const isConflict = member.unavailableDays?.includes(todayDow)
                return (
                  <div key={a.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10,
                    background: isConflict ? 'rgba(239,68,68,0.08)' : `rgba(${rgb},0.08)`,
                    border: `1px solid ${isConflict ? 'rgba(239,68,68,0.3)' : `rgba(${rgb},0.2)`}`,
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `rgba(${rgb},0.2)`, border: `2px solid ${member.color}`, color: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                      {initials(member.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{member.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {memberShifts.length > 0 ? `${memberShifts[0].startTime}–${memberShifts[0].endTime} · ${memberShifts[0].position}` : member.role}
                      </div>
                    </div>
                    {isConflict && (
                      <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 99, background: 'rgba(239,68,68,0.15)', color: '#f87171', fontWeight: 700, border: '1px solid rgba(239,68,68,0.3)', whiteSpace: 'nowrap' }}>⚠ Day Off</span>
                    )}
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: `rgba(${rgb},0.15)`, color: member.color, fontWeight: 600, flexShrink: 0 }}>{member.status === 'on-leave' ? 'Leave' : 'Active'}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Heads Up */}
        <div className="stat-card">
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>⚡ Heads Up</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {conflictToday.map(a => {
              const member = staff.find(m => m.id === a.staffId)
              if (!member) return null
              return (
                <Alert key={a.id} color="#ef4444" icon={<AlertTriangle size={13}/>}>
                  <strong style={{ color: '#f87171' }}>{member.name.split(' ')[0]}</strong> is scheduled on their day off ({todayDow})
                </Alert>
              )
            })}
            {needsCoverage && (
              <Alert color="#ef4444" icon={<AlertTriangle size={13}/>}>
                <strong style={{ color: '#f87171' }}>Coverage needed</strong> — a slot for today is unfilled
              </Alert>
            )}
            {onLeaveStaff.length > 0 && (
              <Alert color="#f59e0b" icon={<Coffee size={13}/>}>
                <strong style={{ color: '#fbbf24' }}>{onLeaveStaff.map(s => s.name.split(' ')[0]).join(', ')}</strong> on leave this week
              </Alert>
            )}
            {overHoursStaff.map(m => (
              <Alert key={m.id} color="#ef4444" icon={<Clock size={13}/>}>
                <strong style={{ color: '#f87171' }}>{m.name.split(' ')[0]}</strong> is over their contracted hours
              </Alert>
            ))}
            {activeStaff.filter(m => shifts.filter(s => s.staffId === m.id).length === 0).slice(0, 2).map(m => (
              <Alert key={m.id} color="#6366f1" icon={<UserMinus size={13}/>}>
                <strong style={{ color: '#a5b4fc' }}>{m.name.split(' ')[0]}</strong> has no recurring shifts set
              </Alert>
            ))}
            {!hasAlerts && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle size={14} style={{ color: '#10b981' }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>All clear — no issues flagged</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>

        {/* Weekly load bar chart */}
        <div className="stat-card">
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>📊 Weekly Schedule Load</h3>
          <div className="flex items-end gap-2" style={{ height: 90 }}>
            {WEEK_DAYS.map(day => {
              const count = shifts.filter(s => s.day === day).length
              const isToday = (day as string) === todayDow
              return (
                <div key={day} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{count}</span>
                  <div style={{ width: '100%', borderRadius: 4, background: isToday ? 'var(--accent)' : 'var(--accent)', opacity: count === 0 ? 0.12 : isToday ? 1 : 0.5 + (count / maxDayShifts) * 0.4, height: count === 0 ? 4 : `${(count / maxDayShifts) * 72}px`, transition: 'height 0.4s ease', boxShadow: isToday ? `0 0 10px var(--accent)` : 'none' }} />
                  <span style={{ fontSize: 10, color: isToday ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: isToday ? 800 : 600 }}>{day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Department utilisation */}
        <div className="stat-card">
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>🏢 Dept. Utilisation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {deptStats.slice(0, 6).map(d => (
              <div key={d.dept}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{d.dept} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({d.count})</span></span>
                  <span style={{ fontSize: 11, color: d.pct > 100 ? '#f87171' : 'var(--text-muted)' }}>{d.scheduled.toFixed(0)}h / {d.contracted}h · {d.pct}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(d.pct, 100)}%`, borderRadius: 99, background: d.pct >= 90 ? '#10b981' : d.pct >= 60 ? 'var(--accent)' : '#f59e0b', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
            {deptStats.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: 16 }}>No active staff with departments</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

// suppress unused import warning
void TrendingUp

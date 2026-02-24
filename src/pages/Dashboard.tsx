import { Users, Clock, Calendar, TrendingUp, AlertTriangle } from 'lucide-react'
import { useScheduler } from '../contexts/SchedulerContext'
import { WEEK_DAYS } from '../types'
import StaffBadge from '../components/StaffBadge'

function StatCard({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 800, color: color ?? 'var(--accent)', lineHeight: 1 }}>
            {value}
          </p>
          {sub && (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{sub}</p>
          )}
        </div>
        <div
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--accent-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)',
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { staff, shifts } = useScheduler()
  const activeStaff = staff.filter(s => s.status === 'active')
  const onLeave = staff.filter(s => s.status === 'on-leave')

  const totalHours = shifts.reduce((acc, s) => {
    const [sh, sm] = s.startTime.split(':').map(Number)
    const [eh, em] = s.endTime.split(':').map(Number)
    return acc + (eh + em / 60 - sh - sm / 60)
  }, 0)

  // Shifts per day
  const shiftsByDay = WEEK_DAYS.map(d => ({
    day: d,
    count: shifts.filter(s => s.day === d).length,
  }))
  const maxShifts = Math.max(...shiftsByDay.map(d => d.count), 1)

  const recent = staff.filter(s => s.status === 'active').slice(0, 4)

  return (
    <div className="p-6" style={{ color: 'var(--text-primary)' }}>
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <StatCard icon={<Users size={20} />}       label="Active Staff"  value={activeStaff.length} sub={`${onLeave.length} on leave`} />
        <StatCard icon={<Clock size={20} />}        label="Weekly Hours"  value={`${totalHours.toFixed(0)}h`} sub="scheduled this week" />
        <StatCard icon={<Calendar size={20} />}     label="Total Shifts"  value={shifts.length}  sub="this week" />
        <StatCard icon={<TrendingUp size={20} />}   label="Coverage"      value={`${Math.round((shifts.length / (activeStaff.length * 5)) * 100)}%`} sub="avg shift fill" />
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Shifts per day bar chart */}
        <div className="stat-card">
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            Shifts per Day
          </h3>
          <div className="flex items-end gap-2" style={{ height: 100 }}>
            {shiftsByDay.map(({ day, count }) => (
              <div key={day} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{count}</span>
                <div
                  style={{
                    width: '100%', borderRadius: 4,
                    background: 'var(--accent)',
                    opacity: count === 0 ? 0.15 : 0.7 + (count / maxShifts) * 0.3,
                    height: count === 0 ? 4 : `${(count / maxShifts) * 80}px`,
                    transition: 'height 0.4s ease',
                  }}
                />
                <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="stat-card">
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            Heads Up
          </h3>
          <div className="flex flex-col gap-3">
            {onLeave.length > 0 && (
              <div className="flex items-center gap-2" style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#f59e0b' }}>{onLeave.map(s => s.name.split(' ')[0]).join(', ')}</strong> on leave this week
                </span>
              </div>
            )}
            {staff.filter(s => {
              const hrs = shifts.filter(sh => sh.staffId === s.id).reduce((a, sh) => {
                const [sh2, sm2] = sh.startTime.split(':').map(Number)
                const [eh2, em2] = sh.endTime.split(':').map(Number)
                return a + (eh2 + em2 / 60 - sh2 - sm2 / 60)
              }, 0)
              return s.hoursPerWeek && hrs > s.hoursPerWeek
            }).map(s => (
              <div key={s.id} className="flex items-center gap-2" style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#ef4444' }}>{s.name.split(' ')[0]}</strong> over scheduled hours
                </span>
              </div>
            ))}
            {staff.filter(s => shifts.filter(sh => sh.staffId === s.id).length === 0 && s.status === 'active').slice(0, 2).map(s => (
              <div key={s.id} className="flex items-center gap-2" style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Calendar size={14} style={{ color: '#6366f1', flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#a5b4fc' }}>{s.name.split(' ')[0]}</strong> has no shifts this week
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent staff */}
      <div className="mt-6">
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
          Staff Overview
        </h3>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {recent.map(m => (
            <StaffBadge key={m.id} member={m} />
          ))}
        </div>
      </div>
    </div>
  )
}

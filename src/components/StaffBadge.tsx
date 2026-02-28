import { Phone, Mail, Clock, MoreVertical, CheckCircle, AlertCircle, Coffee } from 'lucide-react'
import { STAFF_COLORS } from '../types'
import type { StaffMember } from '../types'
import { useScheduler } from '../contexts/SchedulerContext'

interface StaffBadgeProps {
  member: StaffMember
  onEdit?: (member: StaffMember) => void
  compact?: boolean
}

function getInitials(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

const STATUS_ICON = {
  'active':   <CheckCircle size={11} />,
  'on-leave': <Coffee      size={11} />,
  'inactive': <AlertCircle size={11} />,
}

const STATUS_COLOR = {
  'active':   '#10b981',
  'on-leave': '#f59e0b',
  'inactive': '#6b7280',
}

const STATUS_LABEL = {
  'active':   'Active',
  'on-leave': 'On Leave',
  'inactive': 'Inactive',
}

export default function StaffBadge({ member, onEdit, compact = false }: StaffBadgeProps) {
  const { getShiftsForStaff } = useScheduler()
  const shifts = getShiftsForStaff(member.id)
  const weeklyHours = shifts.reduce((acc, s) => {
    const [sh, sm] = s.startTime.split(':').map(Number)
    const [eh, em] = s.endTime.split(':').map(Number)
    return acc + (eh + em / 60 - sh - sm / 60)
  }, 0)

  const rgb = hexToRgb(member.color)

  if (compact) {
    return (
      <div
        className="staff-badge"
        style={{ '--staff-color': member.color } as React.CSSProperties}
      >
        {/* Avatar */}
        <div
          className="staff-avatar"
          style={{
            background: `rgba(${rgb}, 0.18)`,
            color: member.color,
            width: 46,
            height: 46,
            fontSize: 17,
          }}
        >
          {getInitials(member.name)}
          {/* Color dot indicator */}
          <div
            className="staff-color-dot"
            style={{ background: member.color, boxShadow: `0 0 6px rgba(${rgb}, 0.8)` }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {member.name}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{member.role}</div>
        </div>

        {/* Status dot */}
        <div
          style={{
            width: 9, height: 9, borderRadius: '50%',
            background: STATUS_COLOR[member.status],
            flexShrink: 0,
            boxShadow: `0 0 5px ${STATUS_COLOR[member.status]}`,
          }}
          title={STATUS_LABEL[member.status]}
        />
      </div>
    )
  }

  return (
    <div
      className="staff-badge"
      style={{ '--staff-color': member.color } as React.CSSProperties}
    >
      {/* Avatar + color dot */}
      <div
        className="staff-avatar"
        style={{
          background: `rgba(${rgb}, 0.18)`,
          color: member.color,
          width: 48,
          height: 48,
          fontSize: 17,
        }}
      >
        {getInitials(member.name)}
        {/* Colored status dot on avatar */}
        <div
          className="staff-color-dot"
          style={{
            background: member.color,
            boxShadow: `0 0 7px rgba(${rgb}, 0.9)`,
            width: 14,
            height: 14,
          }}
        />
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center gap-2">
          <span style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--text-primary)' }}>
            {member.name}
          </span>
          {/* Status pill */}
          <span
            className="role-pill"
            style={{
              background: `rgba(${hexToRgb(STATUS_COLOR[member.status])}, 0.15)`,
              color: STATUS_COLOR[member.status],
              fontSize: 10,
            }}
          >
            {STATUS_ICON[member.status]}
            {STATUS_LABEL[member.status]}
          </span>
        </div>

        {/* Role + department */}
        <div className="flex items-center gap-2 mt-1">
          <span
            className="role-pill"
            style={{
              background: `rgba(${rgb}, 0.14)`,
              color: member.color,
            }}
          >
            {member.role}
          </span>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            {member.department}
          </span>
        </div>

        {/* Contact + hours */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {member.email && (
            <span className="flex items-center gap-1" style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
              <Mail size={11} /> {member.email}
            </span>
          )}
          <span className="flex items-center gap-1" style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            <Clock size={11} />
            {weeklyHours.toFixed(1)}h this week
            {member.hoursPerWeek && (
              <span style={{ color: weeklyHours > member.hoursPerWeek ? 'var(--danger)' : 'var(--success)' }}>
                {' '}/ {member.hoursPerWeek}h
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Color pick indicator + menu */}
      <div className="flex flex-col items-center gap-3">
        {/* Color swatch showing assigned color */}
        <div
          title={`Color: ${STAFF_COLORS.find(c => c.hex === member.color)?.label ?? member.color}`}
          style={{
            width: 18, height: 18, borderRadius: '50%',
            background: member.color,
            border: '2px solid var(--bg-card)',
            boxShadow: `0 0 8px rgba(${rgb}, 0.7)`,
            flexShrink: 0,
          }}
        />

        {onEdit && (
          <button
            onClick={() => onEdit(member)}
            className="btn-ghost flex items-center justify-center"
            style={{ padding: 5, borderRadius: 6 }}
            title="Edit staff member"
          >
            <MoreVertical size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

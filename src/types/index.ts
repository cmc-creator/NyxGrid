// ─── Theme ────────────────────────────────────────────────────
export interface Theme {
  id: string
  name: string
  emoji: string
  isDark: boolean
  preview: {
    bg: string
    accent: string
    pop: string
  }
}

export const THEMES: Theme[] = [
  {
    id: 'dark-space',
    name: 'Dark Space',
    emoji: '🌌',
    isDark: true,
    preview: { bg: '#0a0a16', accent: '#7c3aed', pop: '#a855f7' },
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    emoji: '🌊',
    isDark: true,
    preview: { bg: '#040d18', accent: '#0ea5e9', pop: '#38bdf8' },
  },
  {
    id: 'forest-night',
    name: 'Forest Night',
    emoji: '🌲',
    isDark: true,
    preview: { bg: '#060e08', accent: '#16a34a', pop: '#4ade80' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    isDark: true,
    preview: { bg: '#110806', accent: '#f97316', pop: '#fbbf24' },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    emoji: '🌙',
    isDark: true,
    preview: { bg: '#050508', accent: '#8b5cf6', pop: '#a78bfa' },
  },
  {
    id: 'arctic',
    name: 'Arctic',
    emoji: '❄️',
    isDark: false,
    preview: { bg: '#f0f6fc', accent: '#0369a1', pop: '#0ea5e9' },
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    emoji: '🌸',
    isDark: true,
    preview: { bg: '#120810', accent: '#e11d78', pop: '#f472b6' },
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    emoji: '⚡',
    isDark: true,
    preview: { bg: '#030308', accent: '#00ff99', pop: '#ff0066' },
  },
]

// ─── Staff Colors ─────────────────────────────────────────────
export const STAFF_COLORS: { id: string; hex: string; label: string }[] = [
  { id: 'violet',   hex: '#8b5cf6', label: 'Violet'   },
  { id: 'sky',      hex: '#0ea5e9', label: 'Sky'       },
  { id: 'emerald',  hex: '#10b981', label: 'Emerald'   },
  { id: 'rose',     hex: '#f43f5e', label: 'Rose'      },
  { id: 'amber',    hex: '#f59e0b', label: 'Amber'     },
  { id: 'pink',     hex: '#ec4899', label: 'Pink'      },
  { id: 'teal',     hex: '#14b8a6', label: 'Teal'      },
  { id: 'orange',   hex: '#f97316', label: 'Orange'    },
  { id: 'lime',     hex: '#84cc16', label: 'Lime'      },
  { id: 'cyan',     hex: '#06b6d4', label: 'Cyan'      },
  { id: 'indigo',   hex: '#6366f1', label: 'Indigo'    },
  { id: 'fuchsia',  hex: '#d946ef', label: 'Fuchsia'   },
]

// ─── Staff Member ─────────────────────────────────────────────
export type ContractType = 'Full-Time' | 'Part-Time' | 'Casual' | 'Zero-Hours'

export interface StaffMember {
  id: string
  name: string
  role: string
  department: string
  color: string   // hex from STAFF_COLORS
  phone?: string
  email?: string
  hoursPerWeek?: number
  status: 'active' | 'inactive' | 'on-leave'
  unavailableDays?: string[]  // WeekDay values e.g. ['Sat','Sun']
  contractType?: ContractType
  startDate?: string          // ISO date 'YYYY-MM-DD'
  notes?: string              // manager notes
}

// ─── Shift ────────────────────────────────────────────────────
export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export interface Shift {
  id: string
  staffId: string
  day: WeekDay
  startTime: string
  endTime: string
  position: string
  note?: string
}

// ─── Calendar Assignment (monthly drag-and-drop) ──────────────
// staffId can be a real staff id OR 'needs-coverage' for the red triangle marker
export interface CalendarAssignment {
  id: string
  staffId: string
  date: string // ISO 'YYYY-MM-DD'
}

// ─── Sample Data ──────────────────────────────────────────────
export const SAMPLE_STAFF: StaffMember[] = [
  { id: 's1',  name: 'You (Manager)',    role: 'Manager',             department: 'Management', color: '#8b5cf6', status: 'active',   hoursPerWeek: 40, email: '' },
  { id: 's2',  name: 'Team Lead',        role: 'Team Lead',           department: 'Front Desk', color: '#6366f1', status: 'active',   hoursPerWeek: 40, email: '' },
  { id: 's3',  name: 'Receptionist A',   role: 'Receptionist',        department: 'Front Desk', color: '#0ea5e9', status: 'active',   hoursPerWeek: 37, email: '' },
  { id: 's4',  name: 'Receptionist B',   role: 'Receptionist',        department: 'Front Desk', color: '#06b6d4', status: 'active',   hoursPerWeek: 37, email: '' },
  { id: 's5',  name: 'Receptionist C',   role: 'Senior Receptionist', department: 'Front Desk', color: '#f97316', status: 'active',   hoursPerWeek: 37, email: '' },
  { id: 's6',  name: 'Night Auditor',    role: 'Night Auditor',       department: 'Night Shift', color: '#f59e0b', status: 'active',   hoursPerWeek: 37, email: '' },
  { id: 's7',  name: 'Concierge A',      role: 'Concierge',           department: 'Concierge',  color: '#10b981', status: 'active',   hoursPerWeek: 37, email: '' },
  { id: 's8',  name: 'Admin Assistant',  role: 'Admin Assistant',     department: 'Administration', color: '#14b8a6', status: 'active', hoursPerWeek: 37, email: '' },
  { id: 's9',  name: 'Part-timer',       role: 'Part-time',           department: 'Front Desk', color: '#84cc16', status: 'active',   hoursPerWeek: 20, email: '' },
  { id: 's10', name: 'On Leave',         role: 'Receptionist',        department: 'Front Desk', color: '#f43f5e', status: 'on-leave', hoursPerWeek: 37, email: '' },
]

export const WEEK_DAYS: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const POSITIONS = [
  'Front Desk',
  'Back Office',
  'Phone Duty',
  'Lobby',
  'Admin',
  'Security Desk',
  'Concierge Desk',
  'Training',
  'Cover',
  'Night Audit',
]

// ─── Reception Features ───────────────────────────────────────
export interface Message {
  id: string
  text: string
  user: string
  createdAt: number
}

export interface ChecklistItem {
  text: string
  checked: boolean
}

export interface ShiftTemplate {
  id: string
  name: string
  start: string
  end: string
}

export interface ReportData {
  [fieldId: string]: string
}

export interface Kudo {
  id: number
  from: string
  to: string
  message: string
  timestamp: string
}

export interface Toast {
  id: number
  msg: string
  type: 'info' | 'success' | 'error'
}

export const REPORT_FIELDS: { id: string; label: string; category: 'urgent' | 'important' | 'normal'; placeholder: string }[] = [
  { id: 'incidents',   label: '🚨 Incidents / Alerts',  category: 'urgent',    placeholder: 'Any incidents, emergencies, or urgent matters...' },
  { id: 'handoff',     label: '👋 Handoff Notes',       category: 'important', placeholder: 'Critical information for the next shift...' },
  { id: 'maintenance', label: '🔧 Maintenance Issues',  category: 'important', placeholder: 'Equipment problems, repairs needed...' },
  { id: 'mail',        label: '📦 Mail / Deliveries',   category: 'normal',    placeholder: 'Packages received, mail sorted...' },
  { id: 'supplies',    label: '📋 Supplies',            category: 'normal',    placeholder: 'Inventory status, items restocked...' },
  { id: 'lobby',       label: '🏢 Lobby Status',        category: 'normal',    placeholder: 'Cleanliness, organization, visitor notes...' },
  { id: 'visitors',    label: '👥 Visitor Log',         category: 'normal',    placeholder: 'Notable visitors, meetings, appointments...' },
  { id: 'notes',       label: '📝 General Notes',       category: 'normal',    placeholder: 'Other observations, tasks completed...' },
]

export const REPORT_TEMPLATES: { id: string; label: string; content: ReportData }[] = [
  { id: 'quiet',    label: '😌 Quiet Shift',     content: { incidents: 'No incidents', handoff: 'Routine shift — no urgent items', maintenance: 'No issues', notes: 'Quiet, uneventful shift' } },
  { id: 'busy',     label: '🔥 Busy Shift',      content: { handoff: 'Multiple activities — see notes', visitors: 'High visitor traffic', notes: 'Busy shift with increased activity' } },
  { id: 'incident', label: '⚠️ Incident Report', content: { incidents: '[TIME] — [DESCRIPTION]\n[ACTION TAKEN]\n[FOLLOW-UP NEEDED]', handoff: 'Review incident notes above' } },
]

export const DEFAULT_SHIFT_TEMPLATES: ShiftTemplate[] = [
  { id: 't1', name: 'Early',       start: '07:00', end: '15:00' },
  { id: 't2', name: 'Day',        start: '09:00', end: '17:00' },
  { id: 't3', name: 'Late',       start: '13:00', end: '21:00' },
  { id: 't4', name: 'Evening',    start: '15:00', end: '23:00' },
  { id: 't5', name: 'Night Audit',start: '23:00', end: '07:00' },
]

export const SAMPLE_SHIFTS: Shift[] = [
  { id: 'sh1',  staffId: 's1',  day: 'Mon', startTime: '09:00', endTime: '17:00', position: 'Front Desk' },
  { id: 'sh2',  staffId: 's1',  day: 'Tue', startTime: '09:00', endTime: '17:00', position: 'Front Desk' },
  { id: 'sh3',  staffId: 's1',  day: 'Wed', startTime: '09:00', endTime: '17:00', position: 'Front Desk' },
  { id: 'sh4',  staffId: 's2',  day: 'Mon', startTime: '07:00', endTime: '15:00', position: 'Front Desk' },
  { id: 'sh5',  staffId: 's2',  day: 'Tue', startTime: '07:00', endTime: '15:00', position: 'Front Desk' },
  { id: 'sh6',  staffId: 's2',  day: 'Thu', startTime: '07:00', endTime: '15:00', position: 'Front Desk' },
  { id: 'sh7',  staffId: 's3',  day: 'Mon', startTime: '13:00', endTime: '21:00', position: 'Front Desk' },
  { id: 'sh8',  staffId: 's3',  day: 'Wed', startTime: '13:00', endTime: '21:00', position: 'Front Desk' },
  { id: 'sh9',  staffId: 's3',  day: 'Fri', startTime: '13:00', endTime: '21:00', position: 'Front Desk' },
  { id: 'sh10', staffId: 's4',  day: 'Tue', startTime: '09:00', endTime: '17:00', position: 'Phone Duty' },
  { id: 'sh11', staffId: 's4',  day: 'Thu', startTime: '09:00', endTime: '17:00', position: 'Phone Duty' },
  { id: 'sh12', staffId: 's4',  day: 'Sat', startTime: '09:00', endTime: '15:00', position: 'Front Desk' },
  { id: 'sh13', staffId: 's5',  day: 'Mon', startTime: '07:00', endTime: '15:00', position: 'Front Desk' },
  { id: 'sh14', staffId: 's5',  day: 'Wed', startTime: '07:00', endTime: '15:00', position: 'Lobby'      },
  { id: 'sh15', staffId: 's5',  day: 'Fri', startTime: '07:00', endTime: '15:00', position: 'Front Desk' },
  { id: 'sh16', staffId: 's6',  day: 'Mon', startTime: '23:00', endTime: '07:00', position: 'Night Audit'},
  { id: 'sh17', staffId: 's6',  day: 'Wed', startTime: '23:00', endTime: '07:00', position: 'Night Audit'},
  { id: 'sh18', staffId: 's6',  day: 'Fri', startTime: '23:00', endTime: '07:00', position: 'Night Audit'},
  { id: 'sh19', staffId: 's7',  day: 'Mon', startTime: '09:00', endTime: '17:00', position: 'Concierge Desk' },
  { id: 'sh20', staffId: 's7',  day: 'Tue', startTime: '09:00', endTime: '17:00', position: 'Concierge Desk' },
  { id: 'sh21', staffId: 's7',  day: 'Thu', startTime: '09:00', endTime: '17:00', position: 'Concierge Desk' },
  { id: 'sh22', staffId: 's8',  day: 'Mon', startTime: '09:00', endTime: '17:00', position: 'Admin'      },
  { id: 'sh23', staffId: 's8',  day: 'Wed', startTime: '09:00', endTime: '17:00', position: 'Admin'      },
  { id: 'sh24', staffId: 's8',  day: 'Fri', startTime: '09:00', endTime: '17:00', position: 'Back Office'},
  { id: 'sh25', staffId: 's9',  day: 'Sat', startTime: '09:00', endTime: '15:00', position: 'Front Desk' },
  { id: 'sh26', staffId: 's9',  day: 'Sun', startTime: '09:00', endTime: '15:00', position: 'Front Desk' },
]

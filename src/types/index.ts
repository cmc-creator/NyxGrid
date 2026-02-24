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
  { id: 's1', name: 'Alex Rivera',    role: 'Manager',        department: 'Management', color: '#8b5cf6', status: 'active',   hoursPerWeek: 40, email: 'alex@nyxgrid.io'   },
  { id: 's2', name: 'Jordan Lee',     role: 'Supervisor',     department: 'Management', color: '#6366f1', status: 'active',   hoursPerWeek: 40, email: 'jordan@nyxgrid.io'  },
  { id: 's3', name: 'Casey Morgan',   role: 'Barista',        department: 'Bar',        color: '#0ea5e9', status: 'active',   hoursPerWeek: 32, email: 'casey@nyxgrid.io'   },
  { id: 's4', name: 'Taylor Brooks',  role: 'Barista',        department: 'Bar',        color: '#06b6d4', status: 'active',   hoursPerWeek: 24, email: 'taylor@nyxgrid.io'  },
  { id: 's5', name: 'Sam Nguyen',     role: 'Cook',           department: 'Kitchen',    color: '#f97316', status: 'active',   hoursPerWeek: 40, email: 'sam@nyxgrid.io'     },
  { id: 's6', name: 'Morgan Davis',   role: 'Line Cook',      department: 'Kitchen',    color: '#f59e0b', status: 'active',   hoursPerWeek: 36, email: 'morgan@nyxgrid.io'  },
  { id: 's7', name: 'Riley Chen',     role: 'Server',         department: 'FOH',        color: '#10b981', status: 'active',   hoursPerWeek: 28, email: 'riley@nyxgrid.io'   },
  { id: 's8', name: 'Drew Wilson',    role: 'Server',         department: 'FOH',        color: '#14b8a6', status: 'active',   hoursPerWeek: 32, email: 'drew@nyxgrid.io'    },
  { id: 's9', name: 'Jamie Park',     role: 'Host',           department: 'FOH',        color: '#84cc16', status: 'active',   hoursPerWeek: 20, email: 'jamie@nyxgrid.io'   },
  { id: 's10', name: 'Avery Kim',     role: 'Dishwasher',     department: 'Kitchen',    color: '#f43f5e', status: 'active',   hoursPerWeek: 20, email: 'avery@nyxgrid.io'   },
  { id: 's11', name: 'Chris Okafor',  role: 'Delivery',       department: 'Delivery',   color: '#d946ef', status: 'on-leave', hoursPerWeek: 30, email: 'chris@nyxgrid.io'   },
  { id: 's12', name: 'Dana Flores',   role: 'Part-time',      department: 'FOH',        color: '#ec4899', status: 'active',   hoursPerWeek: 16, email: 'dana@nyxgrid.io'    },
]

export const WEEK_DAYS: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const POSITIONS = [
  'Open',
  'Mid',
  'Close',
  'Bar',
  'Kitchen',
  'FOH',
  'Delivery',
  'Support',
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
  { id: 't1', name: 'Morning',   start: '07:00', end: '15:00' },
  { id: 't2', name: 'Afternoon', start: '15:00', end: '23:00' },
  { id: 't3', name: 'Full Day',  start: '08:00', end: '20:00' },
  { id: 't4', name: 'Mid',       start: '10:00', end: '18:00' },
]

export const SAMPLE_SHIFTS: Shift[] = [
  { id: 'sh1',  staffId: 's1',  day: 'Mon', startTime: '09:00', endTime: '17:00', position: 'Open'    },
  { id: 'sh2',  staffId: 's1',  day: 'Tue', startTime: '09:00', endTime: '17:00', position: 'Open'    },
  { id: 'sh3',  staffId: 's1',  day: 'Wed', startTime: '09:00', endTime: '17:00', position: 'Open'    },
  { id: 'sh4',  staffId: 's2',  day: 'Thu', startTime: '12:00', endTime: '20:00', position: 'Mid'     },
  { id: 'sh5',  staffId: 's2',  day: 'Fri', startTime: '12:00', endTime: '20:00', position: 'Mid'     },
  { id: 'sh6',  staffId: 's3',  day: 'Mon', startTime: '07:00', endTime: '15:00', position: 'Bar'     },
  { id: 'sh7',  staffId: 's3',  day: 'Wed', startTime: '07:00', endTime: '15:00', position: 'Bar'     },
  { id: 'sh8',  staffId: 's3',  day: 'Fri', startTime: '07:00', endTime: '15:00', position: 'Bar'     },
  { id: 'sh9',  staffId: 's4',  day: 'Tue', startTime: '14:00', endTime: '22:00', position: 'Bar'     },
  { id: 'sh10', staffId: 's4',  day: 'Thu', startTime: '14:00', endTime: '22:00', position: 'Bar'     },
  { id: 'sh11', staffId: 's4',  day: 'Sat', startTime: '10:00', endTime: '18:00', position: 'Bar'     },
  { id: 'sh12', staffId: 's5',  day: 'Mon', startTime: '10:00', endTime: '18:00', position: 'Kitchen' },
  { id: 'sh13', staffId: 's5',  day: 'Tue', startTime: '10:00', endTime: '18:00', position: 'Kitchen' },
  { id: 'sh14', staffId: 's5',  day: 'Thu', startTime: '10:00', endTime: '18:00', position: 'Kitchen' },
  { id: 'sh15', staffId: 's5',  day: 'Fri', startTime: '10:00', endTime: '18:00', position: 'Kitchen' },
  { id: 'sh16', staffId: 's6',  day: 'Wed', startTime: '14:00', endTime: '22:00', position: 'Kitchen' },
  { id: 'sh17', staffId: 's6',  day: 'Sat', startTime: '14:00', endTime: '22:00', position: 'Kitchen' },
  { id: 'sh18', staffId: 's6',  day: 'Sun', startTime: '10:00', endTime: '18:00', position: 'Kitchen' },
  { id: 'sh19', staffId: 's7',  day: 'Fri', startTime: '16:00', endTime: '23:00', position: 'FOH'     },
  { id: 'sh20', staffId: 's7',  day: 'Sat', startTime: '16:00', endTime: '23:00', position: 'FOH'     },
  { id: 'sh21', staffId: 's7',  day: 'Sun', startTime: '12:00', endTime: '20:00', position: 'FOH'     },
  { id: 'sh22', staffId: 's8',  day: 'Mon', startTime: '16:00', endTime: '23:00', position: 'FOH'     },
  { id: 'sh23', staffId: 's8',  day: 'Tue', startTime: '16:00', endTime: '23:00', position: 'FOH'     },
  { id: 'sh24', staffId: 's8',  day: 'Wed', startTime: '16:00', endTime: '23:00', position: 'FOH'     },
  { id: 'sh25', staffId: 's9',  day: 'Sat', startTime: '11:00', endTime: '19:00', position: 'FOH'     },
  { id: 'sh26', staffId: 's9',  day: 'Sun', startTime: '11:00', endTime: '19:00', position: 'FOH'     },
  { id: 'sh27', staffId: 's10', day: 'Fri', startTime: '17:00', endTime: '23:00', position: 'Kitchen' },
  { id: 'sh28', staffId: 's10', day: 'Sat', startTime: '17:00', endTime: '23:00', position: 'Kitchen' },
  { id: 'sh29', staffId: 's12', day: 'Sat', startTime: '12:00', endTime: '20:00', position: 'FOH'     },
  { id: 'sh30', staffId: 's12', day: 'Sun', startTime: '12:00', endTime: '20:00', position: 'FOH'     },
]

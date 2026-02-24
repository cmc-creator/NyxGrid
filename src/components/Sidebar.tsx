import { useState } from 'react'
import {
  LayoutDashboard, Calendar, Users, Settings,
  ChevronLeft, ChevronRight, Zap, FileText, MessageSquare,
} from 'lucide-react'
import { useReception } from '../contexts'

interface NavItem {
  icon: React.ReactNode
  label: string
  page: string
}

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
}

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', page: 'dashboard' },
  { icon: <Calendar       size={18} />, label: 'Schedule',  page: 'schedule'  },
  { icon: <Users          size={18} />, label: 'Staff',     page: 'staff'     },
  { icon: <FileText       size={18} />, label: 'Reports',   page: 'reports'   },
  { icon: <MessageSquare  size={18} />, label: 'Chat',      page: 'chat'      },
  { icon: <Settings       size={18} />, label: 'Settings',  page: 'settings'  },
]

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { triggerPanic } = useReception()

  return (
    <aside
      className="sidebar flex flex-col h-full"
      style={{ width: collapsed ? 64 : 220, transition: 'width 0.2s ease', flexShrink: 0 }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: '1px solid var(--border)', minHeight: 64 }}
      >
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: 34, height: 34, background: 'var(--accent)', boxShadow: '0 0 12px var(--accent-glow)' }}
        >
          <Zap size={18} color="var(--accent-text)" fill="var(--accent-text)" />
        </div>
        {!collapsed && (
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>
            NyxGrid
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 pt-3">
        {NAV_ITEMS.map(item => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`sidebar-item w-full text-left ${activePage === item.page ? 'active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <span style={{ color: activePage === item.page ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)', flexShrink: 0 }}>
              {item.icon}
            </span>
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && <span className="sidebar-indicator" />}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="btn-ghost mx-2 mb-2 flex items-center justify-center"
        style={{ padding: '8px', borderRadius: 8 }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Panic / Emergency button */}
      <button
        onClick={triggerPanic}
        title="Emergency Alert"
        style={{
          margin: '0 8px 12px',
          padding: '10px',
          borderRadius: 8,
          border: '1px solid rgba(239,68,68,0.4)',
          background: 'rgba(239,68,68,0.12)',
          color: '#ef4444',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 8,
          fontSize: 12,
          fontWeight: 700,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.22)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
      >
        <span style={{ fontSize: 14 }}>🚨</span>
        {!collapsed && <span>Emergency</span>}
      </button>
    </aside>
  )
}

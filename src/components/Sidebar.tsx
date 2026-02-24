import { useState } from 'react'
import {
  LayoutDashboard, Calendar, Users, Settings,
  ChevronLeft, ChevronRight, Zap,
} from 'lucide-react'

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
  { icon: <Settings       size={18} />, label: 'Settings',  page: 'settings'  },
]

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

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
        className="btn-ghost mx-2 mb-4 flex items-center justify-center"
        style={{ padding: '8px', borderRadius: 8 }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}

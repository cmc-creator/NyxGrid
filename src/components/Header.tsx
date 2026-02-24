import { Bell, Palette, Heart } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface HeaderProps {
  title: string
  onOpenThemes: () => void
  onOpenKudos: () => void
}

export default function Header({ title, onOpenThemes, onOpenKudos }: HeaderProps) {
  const { theme } = useTheme()

  return (
    <header
      className="app-header flex items-center justify-between px-6"
      style={{ height: 64, flexShrink: 0 }}
    >
      <div>
        <h1 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 20, margin: 0, letterSpacing: '-0.02em' }}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Kudos button */}
        <button
          onClick={onOpenKudos}
          className="btn-ghost flex items-center justify-center"
          style={{ padding: 8 }}
          title="Team Kudos Wall"
        >
          <Heart size={16} style={{ color: '#ec4899' }} />
        </button>

        {/* Theme badge */}
        <button
          onClick={onOpenThemes}
          className="flex items-center gap-2 btn-ghost"
          style={{ padding: '6px 12px', fontSize: 12 }}
          title="Change theme"
        >
          <span style={{ fontSize: 15 }}>{theme.emoji}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{theme.name}</span>
          <Palette size={13} style={{ color: 'var(--accent)' }} />
        </button>

        {/* Notification bell */}
        <button
          className="btn-ghost flex items-center justify-center"
          style={{ padding: 8, position: 'relative' }}
          title="Notifications"
        >
          <Bell size={16} />
          <span
            style={{
              position: 'absolute', top: 5, right: 5,
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--accent)', border: '1.5px solid var(--header-bg)',
            }}
          />
        </button>
      </div>
    </header>
  )
}

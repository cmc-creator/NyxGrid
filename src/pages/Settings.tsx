import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { Palette, Moon, Sun, Monitor, Bell, BellOff, LogOut } from 'lucide-react'

export default function Settings() {
  const { theme, setTheme, allThemes } = useTheme()
  const { user, signOut } = useAuth()
  const [chatSound, setChatSound] = useState(() => localStorage.getItem('nyx-chat-sound') !== 'off')

  function toggleSound() {
    const next = !chatSound
    setChatSound(next)
    localStorage.setItem('nyx-chat-sound', next ? 'on' : 'off')
  }

  return (
    <div className="p-6" style={{ color: 'var(--text-primary)', maxWidth: 700 }}>
      {/* Theme section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={18} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Appearance</h2>
        </div>

        <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-secondary)' }}>
          Pick a theme that suits your vibe. Changes apply instantly.
        </p>

        <div className="theme-grid">
          {allThemes.map(t => (
            <button
              key={t.id}
              className={`theme-tile ${theme.id === t.id ? 'selected' : ''}`}
              onClick={() => setTheme(t.id)}
            >
              <div
                className="theme-tile-preview"
                style={{ background: t.preview.bg }}
              >
                {/* Rich preview mockup */}
                <div style={{
                  width: 86, height: 52, borderRadius: 8,
                  background: t.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${t.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  overflow: 'hidden', display: 'flex',
                }}>
                  {/* Sidebar strip */}
                  <div style={{
                    width: 18, height: '100%',
                    background: t.isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.08)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 4, paddingTop: 6,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: t.preview.accent }} />
                    <div style={{ width: 6, height: 3, borderRadius: 1, background: t.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />
                    <div style={{ width: 6, height: 3, borderRadius: 1, background: t.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />
                    <div style={{ width: 6, height: 3, borderRadius: 1, background: t.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />
                  </div>
                  {/* Content area */}
                  <div style={{ flex: 1, padding: '5px 4px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ height: 4, width: '80%', borderRadius: 2, background: t.preview.accent }} />
                    <div style={{ height: 3, width: '100%', borderRadius: 2, background: t.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }} />
                    <div style={{ height: 3, width: '70%', borderRadius: 2, background: t.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }} />
                    <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                      {[t.preview.accent, t.preview.pop].map((c, i) => (
                        <div key={i} style={{ height: 10, flex: 1, borderRadius: 3, background: c, opacity: 0.8 }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="theme-tile-label">
                <span style={{ marginRight: 5 }}>{t.emoji}</span>
                {t.name}
              </div>

              <div className="theme-check">✓</div>
            </button>
          ))}
        </div>

        {/* Dark/Light indicator */}
        <div className="flex gap-3 mt-5">
          <div
            className="flex items-center gap-2 p-3 rounded-lg"
            style={{
              background: theme.isDark ? 'var(--accent-glow)' : 'transparent',
              border: `1px solid ${theme.isDark ? 'var(--accent)' : 'var(--border)'}`,
              flex: 1,
            }}
          >
            <Moon size={16} style={{ color: theme.isDark ? 'var(--accent)' : 'var(--text-muted)' }} />
            <span style={{ fontSize: 13, color: theme.isDark ? 'var(--text-primary)' : 'var(--text-muted)' }}>Dark themes</span>
          </div>
          <div
            className="flex items-center gap-2 p-3 rounded-lg"
            style={{
              background: !theme.isDark ? 'var(--accent-glow)' : 'transparent',
              border: `1px solid ${!theme.isDark ? 'var(--accent)' : 'var(--border)'}`,
              flex: 1,
            }}
          >
            <Sun size={16} style={{ color: !theme.isDark ? 'var(--accent)' : 'var(--text-muted)' }} />
            <span style={{ fontSize: 13, color: !theme.isDark ? 'var(--text-primary)' : 'var(--text-muted)' }}>Light themes</span>
          </div>
        </div>
      </section>

      {/* General */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Monitor size={18} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>General</h2>
        </div>
        <div className="stat-card flex flex-col gap-4">
          {[
            { label: 'Week starts on', value: 'Monday' },
            { label: 'Time format',    value: '24-hour' },
            { label: 'Timezone',       value: 'Auto-detect' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{item.label}</span>
              <button className="btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }}>{item.value}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Notifications</h2>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 600 }}>Chat notification sound</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Play a sound when new chat messages arrive</div>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 9,
                border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                background: chatSound ? 'var(--accent-glow)' : 'transparent',
                borderColor: chatSound ? 'var(--accent)' : 'var(--border)',
                color: chatSound ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {chatSound ? <Bell size={14} /> : <BellOff size={14} />}
              {chatSound ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </section>

      {/* Account */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <LogOut size={18} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Account</h2>
        </div>
        <div className="stat-card flex items-center justify-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--accent)' }} />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-glow)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>
                {(user?.displayName ?? user?.email ?? '?')[0].toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.displayName ?? 'Unknown User'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', border: '1px solid' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </section>
    </div>
  )
}

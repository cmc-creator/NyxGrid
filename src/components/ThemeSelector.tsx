import { X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface ThemeSelectorProps {
  onClose: () => void
}

export default function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const { theme, setTheme, allThemes } = useTheme()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 580 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              Choose a Theme
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              Your preference is saved automatically.
            </p>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 8 }}>
            <X size={16} />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="theme-grid">
          {allThemes.map(t => (
            <button
              key={t.id}
              className={`theme-tile ${theme.id === t.id ? 'selected' : ''}`}
              onClick={() => { setTheme(t.id); }}
              title={t.name}
            >
              {/* Preview swatch */}
              <div
                className="theme-tile-preview"
                style={{ background: t.preview.bg }}
              >
                {/* Mini card mockup */}
                <div style={{
                  width: 80, height: 48, borderRadius: 8,
                  background: t.isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.06)',
                  border: `1px solid ${t.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  display: 'flex', flexDirection: 'column',
                  gap: 4, padding: 8, justifyContent: 'center',
                }}>
                  {/* Accent bar */}
                  <div style={{ height: 4, width: '60%', borderRadius: 2, background: t.preview.accent }} />
                  {/* Text lines */}
                  <div style={{ height: 3, width: '90%', borderRadius: 2, background: t.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />
                  <div style={{ height: 3, width: '70%', borderRadius: 2, background: t.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }} />
                  {/* Dot row */}
                  <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
                    {[t.preview.accent, t.preview.pop, t.preview.bg === '#f0f6fc' ? '#10b981' : '#f59e0b'].map((c, i) => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.9 }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="theme-tile-label">
                <span style={{ marginRight: 4 }}>{t.emoji}</span>
                {t.name}
              </div>

              {/* Check mark */}
              <div className="theme-check">✓</div>
            </button>
          ))}
        </div>

        {/* Currently active */}
        <div
          className="flex items-center gap-2 mt-5 p-3 rounded-lg"
          style={{ background: 'var(--accent-glow)', border: '1px solid var(--border-strong)' }}
        >
          <span style={{ fontSize: 18 }}>{theme.emoji}</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Active: <strong style={{ color: 'var(--accent-light)' }}>{theme.name}</strong>
            {theme.isDark ? ' — dark theme' : ' — light theme'}
          </span>
        </div>
      </div>
    </div>
  )
}

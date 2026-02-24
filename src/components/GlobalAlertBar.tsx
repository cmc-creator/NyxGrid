import { AlertTriangle } from 'lucide-react'
import { useReception } from '../contexts/ReceptionContext'

export default function GlobalAlertBar() {
  const { globalAlert, setGlobalAlert } = useReception()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 20px',
        background: 'rgba(220, 38, 38, 0.12)',
        borderBottom: '1px solid rgba(220, 38, 38, 0.25)',
        flexShrink: 0,
      }}
    >
      <AlertTriangle size={12} style={{ color: '#ef4444', flexShrink: 0 }} />
      <span style={{ color: '#ef4444', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
        Alert
      </span>
      <input
        type="text"
        value={globalAlert}
        onChange={e => setGlobalAlert(e.target.value)}
        placeholder="Broadcast a team-wide notice... (click to edit)"
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontSize: 12,
          fontWeight: 500,
        }}
      />
    </div>
  )
}

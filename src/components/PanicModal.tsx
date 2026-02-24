import { useReception } from '../contexts/ReceptionContext'

export default function PanicModal() {
  const { panicActive, dismissPanic } = useReception()

  if (!panicActive) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 5000,
        background: 'rgba(153, 27, 27, 0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        animation: 'pulseBg 2s ease-in-out infinite',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111', borderRadius: 16, maxWidth: 440, width: '100%',
          border: '3px solid #ef4444', boxShadow: '0 0 60px rgba(239,68,68,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ background: '#dc2626', padding: '20px 24px' }}>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 22, margin: 0 }}>
            🚨 EMERGENCY ALERT ACTIVE
          </h2>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Alert info */}
          <div style={{ background: 'rgba(239,68,68,0.15)', borderRadius: 10, padding: 16, border: '1px solid rgba(239,68,68,0.4)' }}>
            <p style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>Alert Sent</p>
            <div style={{ color: '#fca5a5', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>📍 Location: Facility</span>
              <span>🕐 Time: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Emergency contacts */}
          <div style={{ background: 'rgba(234,179,8,0.1)', borderRadius: 10, padding: 16, border: '1px solid rgba(234,179,8,0.3)' }}>
            <p style={{ color: '#fde047', fontWeight: 700, marginBottom: 8 }}>📞 Emergency Contacts</p>
            <div style={{ color: '#fff', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>Security: <strong>Ext 2222</strong></span>
              <span>Supervisor: <strong>Ext 3333</strong></span>
              <span>Admin on Duty: <strong>Ext 4444</strong></span>
            </div>
          </div>

          <button
            onClick={dismissPanic}
            style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: 16,
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#b91c1c')}
            onMouseLeave={e => (e.currentTarget.style.background = '#dc2626')}
          >
            Close Alert
          </button>
        </div>
      </div>
    </div>
  )
}

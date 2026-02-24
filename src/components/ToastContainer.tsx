import { useToast } from '../contexts/ToastContext'
import { X } from 'lucide-react'

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  if (!toasts.length) return null

  return (
    <div
      style={{
        position: 'fixed', top: 16, right: 16, zIndex: 3000,
        display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            background: toast.type === 'error'
              ? 'linear-gradient(135deg, #be123c, #991b1b)'
              : toast.type === 'success'
              ? 'linear-gradient(135deg, #15803d, #166534)'
              : 'linear-gradient(135deg, var(--accent), var(--accent-dim, #5b21b6))',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            fontWeight: 600,
            minWidth: 240,
            maxWidth: 360,
            animation: 'slideIn 0.25s ease-out',
            border: '1px solid rgba(255,255,255,0.15)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <span style={{ flex: 1 }}>{toast.msg}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 2 }}
          >
            <X size={14} />
          </button>
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, height: 3,
              background: 'rgba(255,255,255,0.35)',
              animation: 'shrinkBar 4s linear forwards',
              width: '100%',
            }}
          />
        </div>
      ))}
    </div>
  )
}

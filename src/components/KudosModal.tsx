import { useState } from 'react'
import { X, Heart } from 'lucide-react'
import { useReception } from '../contexts/ReceptionContext'
import { useToast } from '../contexts/ToastContext'

interface Props { onClose: () => void }

export default function KudosModal({ onClose }: Props) {
  const { kudosWall, addKudo } = useReception()
  const { showToast } = useToast()
  const [to, setTo] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!to.trim() || !message.trim()) return
    addKudo(to.trim(), message.trim())
    showToast('💖 Kudos sent!', 'success')
    setTo('')
    setMessage('')
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-secondary)', borderRadius: 16, maxWidth: 560, width: '100%',
          maxHeight: '88vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          border: '1px solid var(--border)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Heart size={20} style={{ color: '#ec4899' }} fill="#ec4899" />
            Team Kudos Wall
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 8 }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="Who are you appreciating?"
              required
              style={{
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)',
                fontSize: 13, outline: 'none',
              }}
            />
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="What do you want to say?"
              required
              rows={3}
              style={{
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)',
                fontSize: 13, outline: 'none', resize: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#ec4899', border: 'none', borderRadius: 8, padding: '10px 20px',
                color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              Send Kudos 💖
            </button>
          </form>
        </div>

        {/* Wall */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {kudosWall.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0', fontSize: 13 }}>
              No kudos yet — be the first! 💖
            </div>
          ) : kudosWall.map(k => (
            <div
              key={k.id}
              style={{
                background: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(168,85,247,0.08))',
                border: '1px solid rgba(236,72,153,0.25)',
                borderRadius: 10, padding: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#f9a8d4', fontWeight: 700, fontSize: 13 }}>To: {k.to}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                  {new Date(k.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: 13, margin: '0 0 6px' }}>{k.message}</p>
              <span style={{ color: '#ec4899', fontSize: 11 }}>— {k.from}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

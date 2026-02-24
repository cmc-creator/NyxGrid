import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { useReception } from '../contexts/ReceptionContext'

const MOTIVATIONAL_QUOTES = [
  { text: 'You make a difference every single day.', author: 'Your Team' },
  { text: "Crisis doesn't build character, it reveals it.", author: 'Unknown' },
  { text: 'Be the calm in someone\'s storm.', author: 'Unknown' },
  { text: 'Small acts of kindness create ripples of healing.', author: 'Unknown' },
  { text: 'In the middle of difficulty lies opportunity.', author: 'Einstein' },
  { text: 'Caring for others is the highest expression of humanity.', author: 'Unknown' },
]

export default function Chat() {
  const { messages, addMessage } = useReception()
  const [input, setInput] = useState('')
  const [username, setUsername] = useState('YOU')
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)])
  const [showDeescalation, setShowDeescalation] = useState(false)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    addMessage(input.trim(), username || 'YOU')
    setInput('')
  }

  return (
    <div style={{ padding: 24, maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, height: '100%', boxSizing: 'border-box' }}>

      {/* Quote banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(var(--accent-rgb,124,58,237),0.1), rgba(var(--accent-rgb,124,58,237),0.04))',
          border: '1px solid rgba(var(--accent-rgb,124,58,237),0.25)',
          borderRadius: 12, padding: '14px 20px', textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, color: 'var(--text-primary)', fontStyle: 'italic', fontSize: 14 }}>"{quote.text}"</p>
        <p style={{ margin: '4px 0 0', color: 'var(--accent)', fontSize: 12 }}>— {quote.author}</p>
      </div>

      {/* Tools bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowDeescalation(true)}
          className="btn-ghost"
          style={{ fontSize: 12, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          💬 De-escalation Guide
        </button>
      </div>

      {/* Main chat card */}
      <div
        className="themed-card"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 700, fontSize: 15 }}>
            📡 Live Intel Feed
          </h3>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{messages.length} messages</span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 280 }}>
          {messages.map(m => {
            const isSystem = m.user === 'SYSTEM' || m.user === 'INFO'
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isSystem ? 'center' : 'flex-start' }}>
                {!isSystem && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    {m.user}
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 6, textTransform: 'none' }}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </span>
                )}
                <div
                  style={{
                    background: isSystem ? 'transparent' : 'var(--bg-secondary)',
                    border: isSystem ? 'none' : '1px solid var(--border)',
                    borderRadius: isSystem ? 0 : 10,
                    padding: isSystem ? 0 : '8px 14px',
                    color: isSystem ? 'var(--text-muted)' : 'var(--text-primary)',
                    fontSize: isSystem ? 11 : 13,
                    fontStyle: isSystem ? 'italic' : 'normal',
                    maxWidth: '85%',
                  }}
                >
                  {m.text}
                </div>
              </div>
            )
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={username}
              onChange={e => setUsername(e.target.value.toUpperCase())}
              placeholder="Name"
              style={{
                width: 80, background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '9px 10px', color: 'var(--accent)',
                fontSize: 12, fontWeight: 700, outline: 'none', flexShrink: 0,
              }}
            />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Broadcast to the team..."
              style={{
                flex: 1, background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '9px 14px', color: 'var(--text-primary)',
                fontSize: 13, outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn-accent"
              style={{ padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* De-escalation modal */}
      {showDeescalation && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setShowDeescalation(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-secondary)', borderRadius: 16, maxWidth: 560, width: '100%',
              maxHeight: '88vh', overflowY: 'auto', border: '1px solid var(--border)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-secondary)' }}>
              <h2 style={{ margin: 0, color: '#c084fc', fontWeight: 700, fontSize: 18 }}>💬 Crisis De-escalation Guide</h2>
              <button onClick={() => setShowDeescalation(false)} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 10, padding: 16 }}>
                <h3 style={{ color: '#c084fc', margin: '0 0 10px', fontWeight: 700 }}>🎯 Core Principles</h3>
                <ul style={{ color: 'var(--text-primary)', fontSize: 13, paddingLeft: 20, margin: 0, lineHeight: 2 }}>
                  <li>Stay calm — your tone sets the tone</li>
                  <li>Maintain safe distance (arm's length minimum)</li>
                  <li>Use open body language, avoid crossed arms</li>
                  <li>Listen actively, validate feelings</li>
                  <li>Never argue or take things personally</li>
                </ul>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, padding: 16 }}>
                <h3 style={{ color: '#4ade80', margin: '0 0 10px', fontWeight: 700 }}>✅ Calming Phrases</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    "I can see this is really frustrating. Let's work through this together.",
                    "You're right to feel upset. Help me understand what happened.",
                    "I want to help you. Can you tell me more about what you need?",
                  ].map((phrase, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '10px 14px', color: '#bbf7d0', fontSize: 13 }}>
                      "{phrase}"
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: 10, padding: 16 }}>
                <h3 style={{ color: '#fde047', margin: '0 0 10px', fontWeight: 700 }}>⚠️ When to Call for Backup</h3>
                <ul style={{ color: '#fef08a', fontSize: 13, paddingLeft: 20, margin: '0 0 10px', lineHeight: 2 }}>
                  <li>Aggressive body language or threats</li>
                  <li>Any physical contact</li>
                  <li>Your gut says it's unsafe</li>
                </ul>
                <div style={{ background: '#a16207', borderRadius: 6, padding: '8px 14px', textAlign: 'center', color: '#000', fontWeight: 700, fontSize: 13 }}>
                  🆘 Security: Ext 2222
                </div>
              </div>
              <button onClick={() => setShowDeescalation(false)} className="btn-ghost" style={{ fontSize: 13, padding: '10px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

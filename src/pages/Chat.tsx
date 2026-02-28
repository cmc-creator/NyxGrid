import { useState, useEffect, useRef } from 'react'
import { Send, Hash } from 'lucide-react'
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

const MOTIVATIONAL_QUOTES = [
  { text: 'You make a difference every single day.', author: 'Your Team' },
  { text: "Crisis doesn't build character, it reveals it.", author: 'Unknown' },
  { text: "Be the calm in someone's storm.", author: 'Unknown' },
  { text: 'Small acts of kindness create ripples of healing.', author: 'Unknown' },
  { text: 'In the middle of difficulty lies opportunity.', author: 'Einstein' },
  { text: 'Caring for others is the highest expression of humanity.', author: 'Unknown' },
]

const CHANNELS = ['All', 'Front Desk', 'Management', 'Security', 'Concierge', 'Night Shift']

const CHANNEL_COLORS: Record<string, string> = {
  All:         '#8b5cf6',
  'Front Desk':'#0ea5e9',
  Management:  '#f59e0b',
  Security:    '#ef4444',
  Concierge:   '#10b981',
  'Night Shift':'#6366f1',
}

interface FireMessage {
  id: string
  text: string
  user: string
  channel: string
  createdAt: number
  userId?: string
}

export default function Chat() {
  const { user } = useAuth()
  const [messages, setMessages]     = useState<FireMessage[]>([])
  const [input, setInput]           = useState('')
  const [channel, setChannel]       = useState('All')
  const [username, setUsername]     = useState(() => user?.displayName?.split(' ')[0] ?? 'YOU')
  const [showDeescalation, setShowDeescalation] = useState(false)
  const [sending, setSending]       = useState(false)
  const chatEndRef  = useRef<HTMLDivElement>(null)
  const prevCountRef = useRef(0)
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)])

  // Play a subtle beep when someone else sends a new message
  useEffect(() => {
    const prev = prevCountRef.current
    if (messages.length > prev && prev > 0) {
      const lastMsg = messages[messages.length - 1]
      const soundEnabled = localStorage.getItem('nyx-chat-sound') !== 'off'
      if (soundEnabled && lastMsg.userId !== user?.uid) {
        try {
          const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain); gain.connect(ctx.destination)
          osc.type = 'sine'; osc.frequency.value = 880
          gain.gain.setValueAtTime(0.12, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.18)
        } catch { /* ignore AudioContext errors */ }
      }
    }
    prevCountRef.current = messages.length
  }, [messages, user?.uid])

  useEffect(() => {
    if (user?.displayName) setUsername(user.displayName.split(' ')[0])
  }, [user])

  useEffect(() => {
    const q = query(collection(db, 'chatMessages'), orderBy('createdAt', 'asc'), limit(200))
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({
        id: d.id,
        text:    d.data().text    ?? '',
        user:    d.data().user    ?? '?',
        channel: d.data().channel ?? 'All',
        userId:  d.data().userId,
        createdAt: d.data().createdAt?.toMillis?.() ?? Date.now(),
      })))
    }, err => console.error('Chat listener:', err))
    return unsub
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, channel])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput('')
    setSending(true)
    try {
      await addDoc(collection(db, 'chatMessages'), {
        text,
        user:    username || 'YOU',
        userId:  user?.uid ?? null,
        channel: channel,
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      console.error('Failed to send:', err)
    } finally {
      setSending(false)
    }
  }

  const visible = channel === 'All'
    ? messages
    : messages.filter(m => m.channel === channel || m.channel === 'All')

  const unreadByChannel = CHANNELS.reduce((acc, ch) => {
    if (ch === 'All') return acc
    acc[ch] = messages.filter(m => m.channel === ch).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div style={{ padding: 24, maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16, height: '100%', boxSizing: 'border-box' }}>

      {/* Quote banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(124,58,237,0.04))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--text-primary)', fontStyle: 'italic', fontSize: 13 }}>"{quote.text}"</p>
        <p style={{ margin: '3px 0 0', color: 'var(--accent)', fontSize: 11 }}>— {quote.author}</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setShowDeescalation(true)} className="btn-ghost" style={{ fontSize: 12, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
          💬 De-escalation Guide
        </button>
      </div>

      {/* Chat card */}
      <div className="themed-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: 0, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div className="flex items-center gap-2">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block' }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Team Feed</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{visible.length} messages</span>
        </div>

        {/* Channel tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', overflowX: 'auto', flexShrink: 0 }}>
          {CHANNELS.map(ch => {
            const count = ch === 'All' ? 0 : unreadByChannel[ch] ?? 0
            const color = CHANNEL_COLORS[ch] ?? 'var(--accent)'
            return (
              <button key={ch} type="button" onClick={() => setChannel(ch)} style={{
                padding: '9px 14px', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer',
                background: 'none', whiteSpace: 'nowrap',
                color: channel === ch ? color : 'var(--text-muted)',
                borderBottom: channel === ch ? `2px solid ${color}` : '2px solid transparent',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Hash size={10} /> {ch}
                {count > 0 && ch !== channel && (
                  <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 99, background: `${color}22`, color }}>{count}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 240 }}>
          {visible.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 12 }}>
              No messages in {channel === 'All' ? 'any channel' : `#${channel}`} yet. Say something!
            </div>
          )}
          {visible.map(m => {
            const isMe = user?.uid && m.userId === user.uid
            const isSystem = m.user === 'SYSTEM' || m.user === 'INFO'
            const chanColor = CHANNEL_COLORS[m.channel] ?? 'var(--accent)'
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isSystem ? 'center' : isMe ? 'flex-end' : 'flex-start' }}>
                {!isSystem && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: isMe ? 'var(--accent)' : chanColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.user}</span>
                    {m.channel !== 'All' && channel === 'All' && (
                      <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 99, background: `${chanColor}18`, color: chanColor, border: `1px solid ${chanColor}33`, fontWeight: 600 }}>#{m.channel}</span>
                    )}
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 10 }}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                <div style={{
                  background: isSystem ? 'transparent' : isMe ? 'rgba(124,58,237,0.18)' : 'var(--bg-secondary)',
                  border: isSystem ? 'none' : isMe ? '1px solid rgba(124,58,237,0.35)' : '1px solid var(--border)',
                  borderRadius: isSystem ? 0 : isMe ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                  padding: isSystem ? 0 : '9px 14px',
                  color: isSystem ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontSize: isSystem ? 11 : 13,
                  fontStyle: isSystem ? 'italic' : 'normal',
                  maxWidth: '80%',
                  lineHeight: 1.5,
                }}>{m.text}</div>
              </div>
            )
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>
            Posting to <span style={{ color: CHANNEL_COLORS[channel] ?? 'var(--accent)' }}>#{channel}</span>
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={username}
              onChange={e => setUsername(e.target.value.toUpperCase())}
              placeholder="Name"
              style={{ width: 80, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 10px', color: 'var(--accent)', fontSize: 12, fontWeight: 700, outline: 'none', flexShrink: 0 }}
            />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Message #${channel}...`}
              style={{ flex: 1, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 14px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
            />
            <button type="submit" disabled={!input.trim() || sending} className="btn-accent" style={{ padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* De-escalation modal */}
      {showDeescalation && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowDeescalation(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-secondary)', borderRadius: 16, maxWidth: 560, width: '100%', maxHeight: '88vh', overflowY: 'auto', border: '1px solid var(--border)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
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
                  {["I can see this is really frustrating. Let's work through this together.","You're right to feel upset. Help me understand what happened.","I want to help you. Can you tell me more about what you need?"].map((phrase, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '10px 14px', color: '#bbf7d0', fontSize: 13 }}>"{phrase}"</div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: 10, padding: 16 }}>
                <h3 style={{ color: '#fde047', margin: '0 0 10px', fontWeight: 700 }}>⚠️ When to Call for Backup</h3>
                <ul style={{ color: '#fef08a', fontSize: 13, paddingLeft: 20, margin: '0 0 10px', lineHeight: 2 }}>
                  <li>Aggressive body language or threats</li><li>Any physical contact</li><li>Your gut says it's unsafe</li>
                </ul>
                <div style={{ background: '#a16207', borderRadius: 6, padding: '8px 14px', textAlign: 'center', color: '#000', fontWeight: 700, fontSize: 13 }}>🆘 Security: Ext 2222</div>
              </div>
              <button onClick={() => setShowDeescalation(false)} className="btn-ghost" style={{ fontSize: 13, padding: '10px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

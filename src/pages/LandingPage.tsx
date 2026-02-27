import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const FEATURES = [
  {
    icon: '🗓️',
    title: 'Visual Month & Week Views',
    desc: 'Switch between weekly and monthly calendar layouts instantly. See every shift at a glance with color-coded staff chips.',
  },
  {
    icon: '🖱️',
    title: 'Drag & Drop Scheduling',
    desc: 'Drag staff directly from the roster onto any day. Reschedule by dragging chips between dates — no forms, no friction.',
  },
  {
    icon: '⚡',
    title: 'Real-Time Sync',
    desc: 'Powered by Firebase Firestore. Every change appears instantly across every device and browser — no refresh needed.',
  },
  {
    icon: '🚨',
    title: 'Needs Coverage Alerts',
    desc: 'Mark any day as needing coverage with a vivid pulsing alert block. Staff can see exactly where help is required.',
  },
  {
    icon: '👥',
    title: 'Full Staff Management',
    desc: 'Add, edit, and organise your entire team. Track positions, contact details, shift patterns, and employment type.',
  },
  {
    icon: '🎨',
    title: '8 Custom Themes',
    desc: 'Choose from eight carefully crafted colour themes — from midnight dark to clean light — to match your workspace vibe.',
  },
  {
    icon: '💬',
    title: 'Team Chat',
    desc: 'Built-in messaging keeps your team connected without leaving the scheduler. Announcements, DMs, and more.',
  },
  {
    icon: '🏆',
    title: 'Kudos Wall',
    desc: 'Recognise great work publicly. Send kudos to teammates that appear on a shared wall for everyone to celebrate.',
  },
]

const PRICING = [
  {
    name: 'Starter',
    price: 'Free',
    sub: 'forever',
    accent: '#6366f1',
    features: [
      'Up to 10 staff members',
      'Week & month calendar views',
      'Drag & drop scheduling',
      'Real-time sync (1 location)',
      '3 themes',
      'Community support',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    sub: 'per month',
    accent: '#8b5cf6',
    features: [
      'Unlimited staff members',
      'All calendar views incl. day view',
      'Conflict detection & warnings',
      'Staff availability settings',
      'PDF & CSV export',
      'All 8 themes',
      'Priority email support',
    ],
    cta: 'Start 14-Day Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '$49',
    sub: 'per month',
    accent: '#ec4899',
    features: [
      'Everything in Pro',
      'Unlimited locations',
      'Custom branding & logo',
      'Role-based access control',
      'Dedicated onboarding',
      'SLA & phone support',
      'API access',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export default function LandingPage() {
  const { signIn } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn() {
    setError(null)
    setBusy(true)
    try {
      await signIn()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed'
      if (!msg.includes('popup-closed') && !msg.includes('cancelled')) {
        setError(msg)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24, filter: 'drop-shadow(0 0 8px #8b5cf6)' }}>🔮</span>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>
            Nyx<span style={{ color: '#8b5cf6' }}>Grid</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="#features" style={navLinkStyle}>Features</a>
          <a href="#pricing" style={navLinkStyle}>Pricing</a>
          <button
            onClick={handleSignIn}
            disabled={busy}
            style={ctaBtnStyle('#8b5cf6', busy)}
          >
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{
        padding: '100px 40px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* background glow blobs */}
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 400,
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 80, left: '20%',
          width: 300, height: 300,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 60, right: '18%',
          width: 280, height: 280,
          background: 'radial-gradient(ellipse, rgba(236,72,153,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            padding: '5px 16px',
            borderRadius: 99,
            border: '1px solid rgba(139,92,246,0.4)',
            background: 'rgba(139,92,246,0.1)',
            fontSize: 12,
            fontWeight: 600,
            color: '#a78bfa',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 28,
          }}>
            ✦ Staff Scheduling, Evolved
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            margin: '0 0 24px',
            color: '#fff',
          }}>
            The scheduler your<br />
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              team will actually use
            </span>
          </h1>

          <p style={{
            fontSize: 18,
            color: '#94a3b8',
            lineHeight: 1.7,
            maxWidth: 560,
            margin: '0 auto 44px',
          }}>
            NyxGrid is a real-time staff scheduling platform built for speed.
            Drag, drop, and done — shifts organised in seconds, synced everywhere instantly.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleSignIn}
              disabled={busy}
              style={{
                ...ctaBtnStyle('#8b5cf6', busy),
                fontSize: 16,
                padding: '14px 36px',
                borderRadius: 12,
                boxShadow: '0 0 32px rgba(139,92,246,0.35)',
              }}
            >
              {busy ? 'Signing in…' : '🚀  Get Started Free'}
            </button>
            <a href="#features" style={{
              display: 'inline-flex', alignItems: 'center',
              fontSize: 15, padding: '14px 28px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: '#cbd5e1',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.15s',
            }}>
              See features →
            </a>
          </div>

          {error && (
            <div style={{ marginTop: 20, color: '#f87171', fontSize: 13 }}>{error}</div>
          )}

          {/* hero stats strip */}
          <div style={{
            display: 'flex', gap: 0, justifyContent: 'center',
            marginTop: 64,
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: 40,
          }}>
            {[
              { value: '8', label: 'Colour Themes' },
              { value: '∞', label: 'Staff Members' },
              { value: 'Live', label: 'Real-Time Sync' },
              { value: '0s', label: 'Setup Time' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, textAlign: 'center',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                padding: '0 20px',
              }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP PREVIEW MOCKUP ──────────────────────────────── */}
      <section style={{ padding: '0 40px 80px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          maxWidth: 900, width: '100%',
          borderRadius: 20,
          border: '1px solid rgba(139,92,246,0.25)',
          background: 'linear-gradient(160deg, rgba(139,92,246,0.08) 0%, rgba(10,10,15,0.9) 60%)',
          overflow: 'hidden',
          boxShadow: '0 0 80px rgba(139,92,246,0.15), 0 40px 80px rgba(0,0,0,0.5)',
        }}>
          {/* fake app chrome */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {['#ef4444','#f59e0b','#22c55e'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
            <div style={{
              marginLeft: 12, flex: 1,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 6, height: 22,
              display: 'flex', alignItems: 'center', paddingLeft: 10,
              fontSize: 11, color: '#475569',
            }}>
              cmc-creator.github.io/NyxGrid/
            </div>
          </div>
          {/* calendar grid preview */}
          <div style={{ padding: 24 }}>
            {/* mini calendar mockup */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#475569', padding: '0 0 8px' }}>{d}</div>
              ))}
              {MOCK_CALENDAR.map((cell, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10, padding: 8, minHeight: 80,
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  <div style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{cell.day}</div>
                  {cell.chips.map((chip, j) => (
                    <div key={j} style={{
                      background: chip.color,
                      borderRadius: 5, padding: '3px 6px',
                      fontSize: 9, fontWeight: 700, color: '#fff',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{chip.name}</div>
                  ))}
                  {cell.coverage && (
                    <div style={{
                      background: 'rgba(239,68,68,0.15)',
                      border: '1px dashed rgba(239,68,68,0.5)',
                      borderRadius: 5, padding: '3px 6px',
                      fontSize: 9, fontWeight: 700, color: '#f87171',
                      textAlign: 'center',
                    }}>⚠ Needs Coverage</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section id="features" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={sectionBadge}>Features</div>
          <h2 style={sectionH2}>Everything you need to run your team</h2>
          <p style={sectionSub}>
            Built for managers who don't have time to fight with software.
            NyxGrid gets out of your way and lets you schedule.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              padding: '28px 24px',
              transition: 'border-color 0.2s, transform 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(139,92,246,0.4)'
              ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'
              ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
            }}
            >
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section style={{ padding: '80px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={sectionBadge}>How It Works</div>
          <h2 style={sectionH2}>Scheduling in three steps</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {[
            { n: '01', title: 'Add your staff', desc: 'Enter your team members, their positions, contact info, and shift templates once.' },
            { n: '02', title: 'Drag to schedule', desc: 'Open the calendar. Drag names from the roster panel onto the days they\'re working.' },
            { n: '03', title: 'Share instantly', desc: 'Everyone with access sees changes live — no exports, no emails, no spreadsheets.' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.15))',
                border: '1px solid rgba(139,92,246,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 900, color: '#a78bfa',
              }}>{s.n}</div>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>{s.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '80px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={sectionBadge}>Pricing</div>
          <h2 style={sectionH2}>Simple, transparent pricing</h2>
          <p style={sectionSub}>
            No hidden fees. No per-seat surprises. Scale as your team grows.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24, maxWidth: 1000, margin: '0 auto',
        }}>
          {PRICING.map((tier, i) => (
            <div key={i} style={{
              background: tier.highlight
                ? `linear-gradient(160deg, rgba(139,92,246,0.18) 0%, rgba(10,10,15,1) 60%)`
                : 'rgba(255,255,255,0.03)',
              border: tier.highlight
                ? '1px solid rgba(139,92,246,0.5)'
                : '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20,
              padding: '36px 28px',
              display: 'flex', flexDirection: 'column', gap: 0,
              position: 'relative',
              boxShadow: tier.highlight ? '0 0 48px rgba(139,92,246,0.2)' : 'none',
            }}>
              {tier.highlight && (
                <div style={{
                  position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  padding: '4px 16px', borderRadius: 99,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  Most Popular
                </div>
              )}

              {/* tier header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: tier.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  {tier.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
                    {tier.price}
                  </span>
                  <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{tier.sub}</span>
                </div>
              </div>

              {/* divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 24 }} />

              {/* features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {tier.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#94a3b8' }}>
                    <span style={{ color: tier.accent, fontSize: 15, lineHeight: 1, marginTop: 1, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={tier.name === 'Enterprise' ? undefined : handleSignIn}
                disabled={busy && tier.name !== 'Enterprise'}
                style={{
                  width: '100%',
                  padding: '13px 0',
                  borderRadius: 10,
                  border: tier.highlight ? 'none' : `1px solid ${tier.accent}44`,
                  background: tier.highlight
                    ? `linear-gradient(135deg, ${tier.accent}, #6366f1)`
                    : 'transparent',
                  color: tier.highlight ? '#fff' : tier.accent,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                  boxShadow: tier.highlight ? `0 4px 20px ${tier.accent}44` : 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {tier.name === 'Enterprise' ? tier.cta : busy ? 'Signing in…' : tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────── */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 620, margin: '0 auto',
          background: 'linear-gradient(160deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 100%)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 24, padding: '60px 40px',
          boxShadow: '0 0 60px rgba(139,92,246,0.1)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16, filter: 'drop-shadow(0 0 12px #8b5cf6)' }}>🔮</div>
          <h2 style={{ margin: '0 0 12px', fontSize: 30, fontWeight: 900, letterSpacing: '-0.03em', color: '#fff' }}>
            Ready to get organised?
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: 15, color: '#64748b', lineHeight: 1.6 }}>
            Sign in now and start scheduling in under two minutes.
            No credit card required for the free tier.
          </p>
          <button
            onClick={handleSignIn}
            disabled={busy}
            style={{
              ...ctaBtnStyle('#8b5cf6', busy),
              fontSize: 16,
              padding: '14px 44px',
              borderRadius: 12,
              boxShadow: '0 0 32px rgba(139,92,246,0.4)',
            }}
          >
            {busy ? 'Signing in…' : '🚀  Launch NyxGrid'}
          </button>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🔮</span>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>
            Nyx<span style={{ color: '#8b5cf6' }}>Grid</span>
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#334155' }}>
          © {new Date().getFullYear()} NyxGrid · Built with Firebase & React
        </div>
        <button
          onClick={handleSignIn}
          disabled={busy}
          style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
        >
          Sign In →
        </button>
      </footer>
    </div>
  )
}

// ── helpers ──────────────────────────────────────────────────
const navLinkStyle: React.CSSProperties = {
  color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 500,
}

function ctaBtnStyle(accent: string, busy: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '11px 24px', borderRadius: 10,
    border: 'none',
    background: `linear-gradient(135deg, ${accent}, #6366f1)`,
    color: '#fff',
    fontSize: 14, fontWeight: 700,
    cursor: busy ? 'not-allowed' : 'pointer',
    opacity: busy ? 0.7 : 1,
    transition: 'opacity 0.15s',
  }
}

const sectionBadge: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 14px', borderRadius: 99,
  border: '1px solid rgba(139,92,246,0.35)',
  background: 'rgba(139,92,246,0.08)',
  fontSize: 11, fontWeight: 700,
  color: '#a78bfa',
  letterSpacing: '0.07em', textTransform: 'uppercase',
  marginBottom: 20,
}

const sectionH2: React.CSSProperties = {
  margin: '0 0 14px',
  fontSize: 'clamp(24px, 3.5vw, 40px)',
  fontWeight: 900, letterSpacing: '-0.03em', color: '#f1f5f9',
}

const sectionSub: React.CSSProperties = {
  margin: 0,
  fontSize: 15, color: '#64748b', lineHeight: 1.7,
  maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
}

const MOCK_CALENDAR = [
  { day: '3',  chips: [{ name: 'Jamie R.', color: '#8b5cf6' }, { name: 'Alex T.', color: '#06b6d4' }], coverage: false },
  { day: '4',  chips: [{ name: 'Sam W.', color: '#f59e0b' }], coverage: false },
  { day: '5',  chips: [], coverage: true },
  { day: '6',  chips: [{ name: 'Chris L.', color: '#10b981' }, { name: 'Jamie R.', color: '#8b5cf6' }], coverage: false },
  { day: '7',  chips: [{ name: 'Alex T.', color: '#06b6d4' }], coverage: false },
  { day: '8',  chips: [{ name: 'Sam W.', color: '#f59e0b' }], coverage: false },
  { day: '9',  chips: [], coverage: false },
  { day: '10', chips: [{ name: 'Chris L.', color: '#10b981' }], coverage: false },
  { day: '11', chips: [{ name: 'Jamie R.', color: '#8b5cf6' }], coverage: true },
  { day: '12', chips: [{ name: 'Alex T.', color: '#06b6d4' }, { name: 'Sam W.', color: '#f59e0b' }], coverage: false },
  { day: '13', chips: [{ name: 'Chris L.', color: '#10b981' }], coverage: false },
  { day: '14', chips: [], coverage: false },
  { day: '15', chips: [{ name: 'Jamie R.', color: '#8b5cf6' }], coverage: false },
  { day: '16', chips: [{ name: 'Sam W.', color: '#f59e0b' }, { name: 'Alex T.', color: '#06b6d4' }], coverage: false },
]

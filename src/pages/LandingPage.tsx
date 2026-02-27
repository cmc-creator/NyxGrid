import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

/* ─── SVG Icon helper ─────────────────────────────────────── */
function Icon({ d, size = 20, stroke = 'currentColor' }: { d: string; size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const ICON_PATHS = {
  calendar:   'M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z',
  drag:       'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18',
  bolt:       'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  alert:      'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  users:      'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  palette:    'M12 2C6.49 2 2 6.49 2 12c0 5.52 4.49 10 10 10a2.5 2.5 0 0 0 2.5-2.5c0-.61-.23-1.2-.64-1.67-.09-.11-.13-.2-.13-.32 0-.25.2-.46.46-.46H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z',
  message:    'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  trophy:     'M18 2H6v7a6 6 0 0 0 12 0V2zM6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  check:      'M20 6 9 17l-5-5',
  sparkle:    'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
  launch:     'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
}

/* ─── Feature data ────────────────────────────────────────── */
const FEATURES = [
  { icon: 'calendar', title: 'Visual Month & Week Views',   desc: 'Switch between weekly and monthly layouts instantly. See every shift at a glance with colour-coded staff chips.' },
  { icon: 'drag',     title: 'Drag & Drop Scheduling',      desc: 'Drag staff directly from the roster onto any day. Reschedule chips between dates with no forms, no friction.' },
  { icon: 'bolt',     title: 'Real-Time Sync',              desc: 'Powered by Firebase Firestore. Every change appears instantly across every device and browser, no refresh needed.' },
  { icon: 'alert',    title: 'Needs Coverage Alerts',       desc: 'Mark any day as needing coverage with a vivid pulsing alert. Staff can see exactly where help is required.' },
  { icon: 'users',    title: 'Full Staff Management',       desc: 'Add, edit, and organise your entire team. Track positions, contact details, shift patterns, and employment type.' },
  { icon: 'palette',  title: '8 Custom Themes',             desc: 'Choose from eight carefully crafted colour themes, from midnight dark to clean light, to match your vibe.' },
  { icon: 'message',  title: 'Team Chat',                   desc: 'Built-in messaging keeps your team connected without leaving the scheduler. Announcements, DMs, and more.' },
  { icon: 'trophy',   title: 'Kudos Wall',                  desc: 'Recognise great work publicly. Send kudos to teammates on a shared wall for everyone to celebrate.' },
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
      '✦ AI shift suggestions',
      '✦ AI coverage gap detection',
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
      '✦ AI schedule optimisation',
      '✦ AI demand forecasting',
      '✦ AI-generated shift reports',
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
    <div style={{ minHeight: '100vh', background: '#080810', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative' }}>
      {/* dot-grid background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>

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
          <img src="/gridlogo.png" alt="NyxGrid" style={{ width: 360, height: 'auto', display: 'block', margin: '0 auto 40px', objectFit: 'contain', filter: 'drop-shadow(0 0 80px #8b5cf6)' }} />
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
            Staff Scheduling, Evolved
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
            Drag, drop, and done. Shifts organised in seconds, synced everywhere instantly.
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
              {busy ? 'Signing in…' : <><Icon d={ICON_PATHS.arrowRight} size={16} stroke="currentColor" /> Get Started Free</>}
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
              { value: '10', label: 'Free Staff Slots' },
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
              nyxgrid.org
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
          </p>
          <p style={{ ...sectionSub, marginTop: 10 }}>
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
              textAlign: 'center',
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
              <div style={{
                width: 40, height: 40, borderRadius: 10, margin: '0 auto 16px',
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon d={ICON_PATHS[f.icon as keyof typeof ICON_PATHS]} size={18} stroke="#a78bfa" />
              </div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {[
            { n: '01', title: 'Add your staff', desc: 'Enter your team members, their positions, contact info, and shift templates once.' },
            { n: '02', title: 'Drag to schedule', desc: 'Open the calendar. Drag names from the roster panel onto the days they\'re working.' },
            { n: '03', title: 'Share instantly', desc: 'Everyone with access sees changes live. No exports, no emails, no spreadsheets.' },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', gap: 16,
              padding: '0 36px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
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
                {tier.features.map((f, j) => {
                  const isAI = f.startsWith('✦')
                  const label = isAI ? f.slice(2) : f
                  return (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: isAI ? '#e2e8f0' : '#94a3b8', fontWeight: isAI ? 600 : 400 }}>
                      <span style={{ fontSize: 14, lineHeight: 1, marginTop: 1, flexShrink: 0, color: isAI ? '#a78bfa' : tier.accent }}>
                        {isAI ? '✦' : '✓'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                        {label}
                        {isAI && (
                          <span style={{
                            fontSize: 9, fontWeight: 800, letterSpacing: '0.07em',
                            padding: '2px 7px', borderRadius: 99,
                            background: 'linear-gradient(90deg, rgba(139,92,246,0.35), rgba(99,102,241,0.25))',
                            border: '1px solid rgba(139,92,246,0.4)',
                            color: '#a78bfa',
                            textTransform: 'uppercase',
                          }}>AI</span>
                        )}
                      </span>
                    </li>
                  )
                })}
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
          <img src="/gridlogo.png" alt="NyxGrid" style={{ width: 300, height: 'auto', display: 'block', margin: '0 auto 32px', objectFit: 'contain', filter: 'drop-shadow(0 0 50px #8b5cf6)' }} />
          <h2 style={{ margin: '0 0 12px', fontSize: 30, fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', textAlign: 'center' }}>
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
            {busy ? 'Signing in…' : <><Icon d={ICON_PATHS.launch} size={16} stroke="currentColor" /> Launch NyxGrid</>}
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
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>
            Nyx<span style={{ color: '#8b5cf6' }}>Grid</span>™
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#334155', textAlign: 'center' }}>
          NyxGrid™ is a trademark of NyxCollective LLC. &copy; {new Date().getFullYear()} NyxCollective LLC. All rights reserved.
        </div>
        <button
          onClick={handleSignIn}
          disabled={busy}
          style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
        >
          Sign In <Icon d={ICON_PATHS.arrowRight} size={14} stroke="currentColor" />
        </button>
      </footer>
      </div>
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

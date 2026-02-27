import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSignIn() {
    setError(null)
    setBusy(true)
    try {
      await signIn()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed'
      // user cancelled popup — don't show an error
      if (!msg.includes('popup-closed') && !msg.includes('cancelled')) {
        setError(msg)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '48px 40px',
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Logo / brand */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 48,
              marginBottom: 8,
              filter: 'drop-shadow(0 0 12px var(--accent))',
            }}
          >
            🔮
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
            }}
          >
            NyxGrid
          </h1>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 13,
              color: 'var(--text-secondary)',
            }}
          >
            Staff Scheduling Platform
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: 1,
            background: 'var(--border)',
          }}
        />

        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          Sign in with your Google account to access the scheduler.
        </p>

        {/* Google sign-in button */}
        <button
          onClick={handleSignIn}
          disabled={busy}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '12px 20px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: busy ? 'var(--bg-tertiary, var(--bg-secondary))' : 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: 15,
            fontWeight: 600,
            cursor: busy ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            opacity: busy ? 0.7 : 1,
          }}
          onMouseEnter={e => {
            if (!busy) (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)'
          }}
          onMouseLeave={e => {
            if (!busy) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-primary)'
          }}
        >
          {/* Google G logo */}
          {!busy ? (
            <svg width="20" height="20" viewBox="0 0 488 512">
              <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10"/>
            </svg>
          )}
          {busy ? 'Signing in…' : 'Continue with Google'}
        </button>

        {error && (
          <div
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.35)',
              color: '#f87171',
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center', opacity: 0.6 }}>
          Access is restricted to authorized users only.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

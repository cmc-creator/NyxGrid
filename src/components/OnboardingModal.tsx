import { useState } from 'react'
import { Users, Calendar, Zap, X, ChevronRight } from 'lucide-react'

interface Props {
  onNavigate: (page: string) => void
  onClose: () => void
}

const STEPS = [
  {
    Icon: Users,
    title: 'Add your team',
    desc: 'Enter your staff members — names, roles, and badge colours. Takes about two minutes.',
    action: 'Go to Staff',
    page: 'staff',
    color: '#8b5cf6',
  },
  {
    Icon: Calendar,
    title: 'Schedule your first shift',
    desc: 'Drag a staff member from the roster onto any day in the Month view. Changes sync instantly.',
    action: 'Open Schedule',
    page: 'schedule',
    color: '#6366f1',
  },
  {
    Icon: Zap,
    title: "You're live",
    desc: 'Every device, every browser — everyone sees your schedule the moment you update it. No exports, no emails.',
    action: null,
    page: null,
    color: '#10b981',
  },
]

export default function OnboardingModal({ onNavigate, onClose }: Props) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const { Icon } = current

  function handleAction() {
    if (current.page) { onNavigate(current.page); onClose() }
  }

  function handleNext() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 440, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 6 }}><X size={14} /></button>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 99,
              background: i <= step ? 'var(--accent)' : 'var(--bg-tertiary)',
              opacity: i < step ? 0.4 : 1, transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: `${current.color}22`, border: `1px solid ${current.color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Icon size={28} color={current.color} />
        </div>

        <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          {current.title}
        </h2>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {current.desc}
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {current.action && current.page && (
            <button type="button" onClick={handleAction} className="btn-accent" style={{ padding: '10px 22px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              {current.action} <ChevronRight size={14} />
            </button>
          )}
          <button type="button" onClick={handleNext} className={current.action ? 'btn-ghost' : 'btn-accent'} style={{ padding: '10px 22px', fontSize: 14 }}>
            {step === STEPS.length - 1 ? "Let's go!" : 'Skip'}
          </button>
        </div>

        <p style={{ marginTop: 20, fontSize: 11, color: 'var(--text-muted)', opacity: 0.45 }}>
          Step {step + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Plus, X, FileText, CheckSquare, ChevronLeft, ChevronRight, Printer, ClipboardList } from 'lucide-react'
import { useReception } from '../contexts/ReceptionContext'
import { useToast } from '../contexts/ToastContext'
import { REPORT_FIELDS, REPORT_TEMPLATES } from '../types'

export default function Reports() {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [newTask, setNewTask] = useState('')
  const [newTmplName, setNewTmplName] = useState('')
  const [newTmplStart, setNewTmplStart] = useState('09:00')
  const [newTmplEnd, setNewTmplEnd] = useState('17:00')
  const [showHandoff, setShowHandoff] = useState(false)

  function shiftDate(delta: number) {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + delta)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const {
    getReport, setReport,
    getChecklist, setChecklist,
    shiftTemplates, addShiftTemplate, removeShiftTemplate,
  } = useReception()
  const { showToast } = useToast()

  const reportData = getReport(selectedDate)
  const checklist = getChecklist(selectedDate)

  function updateField(fieldId: string, value: string) {
    setReport(selectedDate, { ...reportData, [fieldId]: value })
  }

  function applyTemplate(content: Record<string, string>) {
    setReport(selectedDate, { ...reportData, ...content })
    showToast('Template applied', 'success')
  }

  function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTask.trim()) return
    setChecklist(selectedDate, [...checklist, { text: newTask.trim(), checked: false }])
    setNewTask('')
  }

  function toggleTask(idx: number) {
    const updated = checklist.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item)
    setChecklist(selectedDate, updated)
  }

  function removeTask(idx: number) {
    setChecklist(selectedDate, checklist.filter((_, i) => i !== idx))
  }

  function addTemplate(e: React.FormEvent) {
    e.preventDefault()
    if (!newTmplName.trim()) return
    addShiftTemplate({ name: newTmplName.trim(), start: newTmplStart, end: newTmplEnd })
    setNewTmplName('')
    showToast(`Template "${newTmplName}" added`, 'success')
  }

  const categoryColors: Record<string, { bg: string; border: string }> = {
    urgent:    { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.3)'   },
    important: { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.3)'  },
    normal:    { bg: 'rgba(var(--accent-rgb,124,58,237),0.04)', border: 'var(--border)' },
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 700, fontSize: 22 }}>
            Shift Log
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
            Daily logs, handoff notes, incident reports, and task checklists
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => shiftDate(-1)} className="btn-ghost" style={{ padding: '7px 10px' }} title="Previous day"><ChevronLeft size={14} /></button>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', borderRadius: 8, padding: '8px 12px', fontSize: 13,
                outline: 'none',
              }}
            />
            <button onClick={() => shiftDate(1)} className="btn-ghost" style={{ padding: '7px 10px' }} title="Next day"><ChevronRight size={14} /></button>
          </div>
          <button onClick={() => setShowHandoff(true)} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '7px 12px' }} title="Generate handoff summary">
            <ClipboardList size={13} /> Handoff Summary
          </button>
          <button onClick={() => window.print()} className="btn-ghost no-print" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '7px 12px' }} title="Print">
            <Printer size={13} /> Print
          </button>
        </div>
      </div>

      {/* Quick templates */}
      <div className="themed-card" style={{ padding: 16 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Quick Fill Templates
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {REPORT_TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => applyTemplate(t.content)}
              className="btn-ghost"
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={() => setReport(selectedDate, {})}
            className="btn-ghost"
            style={{ fontSize: 12, padding: '6px 12px', color: 'var(--text-muted)' }}
          >
            🗑 Clear
          </button>
        </div>
      </div>

      {/* Report fields */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
        {REPORT_FIELDS.map(field => {
          const colors = categoryColors[field.category]
          return (
            <div
              key={field.id}
              style={{
                background: colors.bg, border: `1px solid ${colors.border}`,
                borderRadius: 10, padding: 14,
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                <FileText size={12} />
                {field.label}
              </label>
              <textarea
                value={reportData[field.id] ?? ''}
                onChange={e => updateField(field.id, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                style={{
                  width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: 6, padding: '8px 10px', color: 'var(--text-primary)',
                  fontSize: 12, resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Daily Checklist */}
      <div className="themed-card" style={{ padding: 20 }}>
        <h3 style={{ margin: '0 0 14px', color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckSquare size={16} style={{ color: 'var(--accent)' }} />
          Daily Checklist
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
            {checklist.filter(i => i.checked).length}/{checklist.length} done
          </span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {checklist.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>No tasks yet for this day.</p>
          )}
          {checklist.map((item, idx) => (
            <div
              key={idx}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleTask(idx)}
                style={{ accentColor: 'var(--accent)', width: 15, height: 15, cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ flex: 1, fontSize: 13, color: item.checked ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.checked ? 'line-through' : 'none' }}>
                {item.text}
              </span>
              <button
                onClick={() => removeTask(idx)}
                className="btn-ghost"
                style={{ padding: 4, color: 'var(--text-muted)' }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addTask} style={{ display: 'flex', gap: 8 }}>
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="Add a task..."
            style={{
              flex: 1, background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)',
              fontSize: 13, outline: 'none',
            }}
          />
          <button type="submit" className="btn-accent" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Plus size={14} /> Add
          </button>
        </form>
      </div>

      {/* Shift Templates */}
      <div className="themed-card" style={{ padding: 20 }}>
        <h3 style={{ margin: '0 0 14px', color: 'var(--text-primary)', fontWeight: 700, fontSize: 15 }}>
          ⏱ Shift Templates
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {shiftTemplates.map(t => (
            <div
              key={t.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '6px 12px',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>{t.name}</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t.start}–{t.end}</span>
              <button
                onClick={() => removeShiftTemplate(t.id)}
                className="btn-ghost"
                style={{ padding: 2, color: 'var(--text-muted)' }}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={addTemplate} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={newTmplName}
            onChange={e => setNewTmplName(e.target.value)}
            placeholder="Template name"
            style={{
              flex: 1, minWidth: 120, background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
            }}
          />
          <input
            type="time"
            value={newTmplStart}
            onChange={e => setNewTmplStart(e.target.value)}
            style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 10px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
            }}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>→</span>
          <input
            type="time"
            value={newTmplEnd}
            onChange={e => setNewTmplEnd(e.target.value)}
            style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 10px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
            }}
          />
          <button type="submit" className="btn-accent" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Plus size={14} /> Add Template
          </button>
        </form>
      </div>

      {/* Handoff Summary Modal */}
      {showHandoff && (() => {
        const filledFields = REPORT_FIELDS.filter(f => reportData[f.id]?.trim())
        const lines = [
          `=== HANDOFF SUMMARY — ${selectedDate} ===`,
          '',
          ...filledFields.map(f => `[ ${f.label.toUpperCase()} ]\n${reportData[f.id]}`),
          '',
          checklist.length > 0 ? `[ CHECKLIST ]\n${checklist.map(c => `${c.checked ? '\u2713' : '\u25a1'} ${c.text}`).join('\n')}` : '',
        ].filter(l => l !== undefined)
        const summaryText = lines.join('\n')
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowHandoff(false)}>
            <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-secondary)', borderRadius: 16, maxWidth: 580, width: '100%', maxHeight: '88vh', overflowY: 'auto', border: '1px solid var(--border)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Handoff Summary &mdash; {selectedDate}</h2>
                <button onClick={() => setShowHandoff(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>&times;</button>
              </div>
              <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {filledFields.length === 0 && checklist.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No report data entered for this date.</p>
                ) : (
                  <textarea readOnly value={summaryText} rows={16}
                    style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', color: 'var(--text-primary)', fontSize: 12, fontFamily: 'monospace', resize: 'vertical', outline: 'none', lineHeight: 1.7, boxSizing: 'border-box' }}
                  />
                )}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => navigator.clipboard.writeText(summaryText)} className="btn-accent" style={{ fontSize: 12, padding: '8px 16px' }}>&#128203; Copy to Clipboard</button>
                  <button onClick={() => setShowHandoff(false)} className="btn-ghost" style={{ fontSize: 12, padding: '8px 16px' }}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

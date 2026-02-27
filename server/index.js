import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import prisma from './prisma.js'
import { SEED_STAFF, SEED_SHIFTS } from './seed.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())

// ─── Seed on first boot ──────────────────────────────────────
async function seedIfEmpty() {
  const count = await prisma.staffMember.count()
  if (count === 0) {
    console.log('  ⚙  Database empty — seeding sample data...')
    for (const s of SEED_STAFF) {
      await prisma.staffMember.upsert({ where: { id: s.id }, update: {}, create: s })
    }
    for (const sh of SEED_SHIFTS) {
      await prisma.shift.upsert({ where: { id: sh.id }, update: {}, create: sh })
    }
    console.log(`  ✅ Seeded ${SEED_STAFF.length} staff + ${SEED_SHIFTS.length} shifts`)
  }
}

// ─── Staff ───────────────────────────────────────────────────
app.get('/api/staff', async (_req, res) => {
  const staff = await prisma.staffMember.findMany({ orderBy: { name: 'asc' } })
  res.json(staff)
})

app.post('/api/staff', async (req, res) => {
  const { name, role, department, color, phone, email, hoursPerWeek, status } = req.body
  const member = await prisma.staffMember.create({
    data: { name, role, department, color, phone, email, hoursPerWeek, status: status ?? 'active' },
  })
  res.json(member)
})

app.put('/api/staff/:id', async (req, res) => {
  const { name, role, department, color, phone, email, hoursPerWeek, status } = req.body
  try {
    const member = await prisma.staffMember.update({
      where: { id: req.params.id },
      data: { name, role, department, color, phone, email, hoursPerWeek, status },
    })
    res.json(member)
  } catch {
    res.status(404).json({ error: 'Staff member not found' })
  }
})

app.delete('/api/staff/:id', async (req, res) => {
  try {
    await prisma.staffMember.delete({ where: { id: req.params.id } })
    // Cascade: shifts deleted by Prisma relation; clean up calendar assignments too
    await prisma.calendarAssignment.deleteMany({ where: { staffId: req.params.id } })
    res.json({ ok: true })
  } catch {
    res.status(404).json({ error: 'Staff member not found' })
  }
})

// ─── Shifts ──────────────────────────────────────────────────
app.get('/api/shifts', async (_req, res) => {
  const shifts = await prisma.shift.findMany()
  res.json(shifts)
})

app.post('/api/shifts', async (req, res) => {
  const { staffId, day, startTime, endTime, position, note } = req.body
  const shift = await prisma.shift.create({
    data: { staffId, day, startTime, endTime, position, note },
  })
  res.json(shift)
})

app.delete('/api/shifts/:id', async (req, res) => {
  try {
    await prisma.shift.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch {
    res.status(404).json({ error: 'Shift not found' })
  }
})

// ─── Calendar Assignments ────────────────────────────────────
app.get('/api/calendar-assignments', async (_req, res) => {
  const assignments = await prisma.calendarAssignment.findMany()
  res.json(assignments)
})

app.post('/api/calendar-assignments', async (req, res) => {
  const { staffId, date } = req.body
  // Prevent duplicates for non-coverage staff
  if (staffId !== 'needs-coverage') {
    const existing = await prisma.calendarAssignment.findFirst({ where: { staffId, date } })
    if (existing) return res.json(existing)
  }
  const assignment = await prisma.calendarAssignment.create({ data: { staffId, date } })
  res.json(assignment)
})

app.delete('/api/calendar-assignments/:id', async (req, res) => {
  try {
    await prisma.calendarAssignment.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch {
    res.status(404).json({ error: 'Assignment not found' })
  }
})

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }))

// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, async () => {
  await seedIfEmpty()
  console.log(`\n  🟢 NyxGrid API running → http://localhost:${PORT}/api/health\n`)
})

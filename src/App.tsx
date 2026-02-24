import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { SchedulerProvider } from './contexts/SchedulerContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ThemeSelector from './components/ThemeSelector'
import Dashboard from './pages/Dashboard'
import Schedule from './pages/Schedule'
import Staff from './pages/Staff'
import Settings from './pages/Settings'

type Page = 'dashboard' | 'schedule' | 'staff' | 'settings'

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  schedule: 'Weekly Schedule',
  staff: 'Staff Management',
  settings: 'Settings',
}

function AppContent() {
  const [page, setPage] = useState<Page>('dashboard')
  const [showThemes, setShowThemes] = useState(false)

  function renderPage() {
    switch (page) {
      case 'dashboard': return <Dashboard />
      case 'schedule':  return <Schedule />
      case 'staff':     return <Staff />
      case 'settings':  return <Settings />
    }
  }

  return (
    <div className="flex h-full" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar activePage={page} onNavigate={p => setPage(p as Page)} />

      <div className="flex flex-col flex-1 min-w-0">
        <Header
          title={PAGE_TITLES[page]}
          onOpenThemes={() => setShowThemes(true)}
        />

        <main className="flex-1 overflow-y-auto themed-bg">
          {renderPage()}
        </main>
      </div>

      {showThemes && <ThemeSelector onClose={() => setShowThemes(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <SchedulerProvider>
        <AppContent />
      </SchedulerProvider>
    </ThemeProvider>
  )
}

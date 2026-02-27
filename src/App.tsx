import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SchedulerProvider } from './contexts/SchedulerContext'
import { ToastProvider } from './contexts/ToastContext'
import { ReceptionProvider } from './contexts/ReceptionContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ThemeSelector from './components/ThemeSelector'
import GlobalAlertBar from './components/GlobalAlertBar'
import ToastContainer from './components/ToastContainer'
import PanicModal from './components/PanicModal'
import KudosModal from './components/KudosModal'
import Dashboard from './pages/Dashboard'
import Schedule from './pages/Schedule'
import Staff from './pages/Staff'
import Reports from './pages/Reports'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import LandingPage from './pages/LandingPage'

type Page = 'dashboard' | 'schedule' | 'staff' | 'reports' | 'chat' | 'settings'

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  schedule:  'Weekly Schedule',
  staff:     'Staff Management',
  reports:   'Shift Reports',
  chat:      'Team Chat',
  settings:  'Settings',
}

function AppContent() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState<Page>('dashboard')
  const [showThemes, setShowThemes] = useState(false)
  const [showKudos, setShowKudos] = useState(false)

  function renderPage() {
    switch (page) {
      case 'dashboard': return <Dashboard />
      case 'schedule':  return <Schedule />
      case 'staff':     return <Staff />
      case 'reports':   return <Reports />
      case 'chat':      return <Chat />
      case 'settings':  return <Settings />
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ fontSize: 36, animation: 'spin 1s linear infinite', filter: 'drop-shadow(0 0 10px var(--accent))' }}>🔮</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!user) return <LandingPage />

  return (
    <div className="flex h-full" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar activePage={page} onNavigate={p => setPage(p as Page)} />

      <div className="flex flex-col flex-1 min-w-0">
        <GlobalAlertBar />
        <Header
          title={PAGE_TITLES[page]}
          onOpenThemes={() => setShowThemes(true)}
          onOpenKudos={() => setShowKudos(true)}
        />

        <main className="flex-1 overflow-y-auto themed-bg">
          {renderPage()}
        </main>
      </div>

      {showThemes && <ThemeSelector onClose={() => setShowThemes(false)} />}
      {showKudos  && <KudosModal   onClose={() => setShowKudos(false)} />}
      <PanicModal />
      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SchedulerProvider>
          <ToastProvider>
            <ReceptionProvider>
              <AppContent />
            </ReceptionProvider>
          </ToastProvider>
        </SchedulerProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}


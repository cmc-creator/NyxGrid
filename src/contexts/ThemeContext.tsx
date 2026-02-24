import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { THEMES } from '../types'
import type { Theme } from '../types'

interface ThemeContextValue {
  theme: Theme
  setTheme: (id: string) => void
  allThemes: Theme[]
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'nyxgrid-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) ?? 'dark-space'
  })

  const theme = THEMES.find(t => t.id === themeId) ?? THEMES[0]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId)
    localStorage.setItem(STORAGE_KEY, themeId)
  }, [themeId])

  function setTheme(id: string) {
    if (THEMES.some(t => t.id === id)) setThemeId(id)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, allThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}

'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { themes, generateThemeVariables, type Theme } from './index'
import { useTheme } from 'next-themes'

export function ThemeProvider({ children, ...props }: { children: React.ReactNode }) {
  // This prevents the theme from being applied until the page is fully loaded on the client
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // This ensures that no matter what theme is selected, we don't render it until client-side
  // which prevents the hydration mismatch
  if (!mounted) {
    // Return children without any theme application during SSR
    return <>{children}</>
  }

  return (
    <NextThemesProvider
      themes={Object.keys(themes)}
      defaultTheme="system"
      enableSystem
      {...props}
    >
      <ThemeStyles />
      {children}
    </NextThemesProvider>
  )
}

function ThemeStyles() {
  const { theme } = useTheme()
  const currentTheme = themes[theme as keyof typeof themes] || themes.light
  const variables = generateThemeVariables(currentTheme as Theme)

  return (
    <style jsx global>{`
      :root {
        ${Object.entries(variables)
          .map(([key, value]) => `${key}: ${value};`)
          .join('\n')}
      }
    `}</style>
  )
} 
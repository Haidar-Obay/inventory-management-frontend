'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // This prevents the theme from being applied until the page is fully loaded on the client
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // This ensures that no matter what theme is selected, we don't render it until client-side
  // which prevents the hydration mismatch
  return (
    <NextThemesProvider {...props}>
      {mounted ? children : (
        <div style={{ visibility: 'hidden' }}>
          {children}
        </div>
      )}
    </NextThemesProvider>
  )
}

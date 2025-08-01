"use client";

import { useEffect } from 'react';

/**
 * Hook to suppress Next.js scroll focus warnings for fixed/sticky positioned elements
 * This is expected behavior for modals, toasts, and other overlay components
 */
export function useScrollFocusWarning() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Store original console.warn
    const originalWarn = console.warn;

    // Override console.warn to filter out scroll focus warnings
    console.warn = (...args) => {
      const message = args[0];
      
      // Check if this is a scroll focus warning
      if (typeof message === 'string' && 
          message.includes('Skipping auto-scroll behavior due to `position: sticky` or `position: fixed`')) {
        // Suppress this specific warning
        return;
      }
      
      // Pass through all other warnings
      originalWarn.apply(console, args);
    };

    // Cleanup function to restore original console.warn
    return () => {
      console.warn = originalWarn;
    };
  }, []);
} 
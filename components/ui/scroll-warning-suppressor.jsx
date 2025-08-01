"use client";

import { useEffect } from 'react';

/**
 * Client component to suppress Next.js scroll focus warnings
 * This component should be placed early in the component tree
 */
export function ScrollWarningSuppressor() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;

    // Override console.warn to filter scroll focus warnings
    console.warn = (...args) => {
      const message = args[0];
      
      // Check for scroll focus warnings
      if (typeof message === 'string' && 
          (message.includes('Skipping auto-scroll behavior due to `position: sticky`') ||
           message.includes('Skipping auto-scroll behavior due to `position: fixed`'))) {
        // Suppress these warnings as they are expected for modals/toasts
        return;
      }
      
      // Pass through other warnings
      originalWarn.apply(console, args);
    };

    // Also check console.error for similar messages
    console.error = (...args) => {
      const message = args[0];
      
      // Check for scroll focus warnings in error messages
      if (typeof message === 'string' && 
          (message.includes('Skipping auto-scroll behavior due to `position: sticky`') ||
           message.includes('Skipping auto-scroll behavior due to `position: fixed`'))) {
        // Suppress these warnings as they are expected for modals/toasts
        return;
      }
      
      // Pass through other errors
      originalError.apply(console, args);
    };

    // Cleanup function to restore original console methods
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  // This component doesn't render anything
  return null;
} 
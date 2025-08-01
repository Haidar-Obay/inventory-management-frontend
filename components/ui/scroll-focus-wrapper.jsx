"use client";

import React from 'react';

/**
 * Wrapper component for fixed/sticky positioned elements that need scroll focus boundaries
 * This component helps suppress the Next.js warnings about scroll focus behavior
 */
export function ScrollFocusWrapper({ 
  children, 
  className = "", 
  ...props 
}) {
  return (
    <div 
      className={className}
      data-nextjs-scroll-focus-boundary="true"
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Hook to suppress scroll focus warnings in development
 */
export function useSuppressScrollFocusWarnings() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Override console.warn to filter scroll focus warnings
    const originalWarn = console.warn;
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

    return () => {
      console.warn = originalWarn;
    };
  }, []);
} 
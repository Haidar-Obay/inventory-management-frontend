/**
 * Utility to suppress Next.js scroll focus warnings for fixed/sticky positioned elements
 * This is expected behavior for modals, toasts, and other overlay components
 */

export function suppressScrollFocusWarnings() {
  // Only run in development and on client side
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
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

  // Return cleanup function
  return () => {
    console.warn = originalWarn;
    console.error = originalError;
  };
}

// Auto-initialize if this module is imported
if (typeof window !== 'undefined') {
  suppressScrollFocusWarnings();
} 
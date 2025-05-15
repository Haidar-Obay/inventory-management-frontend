import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Default to false (desktop) on the server to ensure consistent initial render
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  
  // Use useEffect to update the value on the client only
  React.useEffect(() => {
    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Set up listener for changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

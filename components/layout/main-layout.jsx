"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocale } from "next-intl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { arSA, enUS } from "date-fns/locale";
import { MUIThemeWrapper } from "@/lib/themes/mui-theme-provider";
import { useScrollFocusWarning } from "@/hooks/useScrollFocusWarning";
import "@/lib/suppress-scroll-warnings";

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined') {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        return null;
      }
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.error("Error setting localStorage:", error);
      }
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing from localStorage:", error);
      }
    }
  }
};

export function MainLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const [isClient, setIsClient] = useState(false);
  const locale = useLocale();
  const dateAdapterLocale = locale === "ar" ? arSA : enUS;

  // Suppress scroll focus warnings for fixed/sticky positioned elements
  useScrollFocusWarning();

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client side after hydration
    if (!isClient) return;

    // Get user role from localStorage
    const storedRole = safeLocalStorage.getItem("userRole") || "user";
    setUserRole(storedRole);

    // Get sidebar state from localStorage
    const sidebarState = safeLocalStorage.getItem("sidebarState");
    if (sidebarState) {
      setIsSidebarCollapsed(sidebarState === "collapsed");
    }

    // Get sidebar visibility from localStorage
    const sidebarVisible = safeLocalStorage.getItem("sidebarVisible");
    if (sidebarVisible !== null) {
      setIsSidebarVisible(sidebarVisible === "true");
    }

    // Get fullscreen state from localStorage
    const fullscreenState = safeLocalStorage.getItem("fullscreenState");
    if (fullscreenState !== null) {
      setIsFullscreen(fullscreenState === "true");
    }
  }, [isClient]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isFullscreen) {
        toggleFullscreen();
      }
    };

    if (isClient) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isClient, isFullscreen]);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    if (isClient) {
      safeLocalStorage.setItem("sidebarState", newState ? "collapsed" : "expanded");
    }
  };

  const hideSidebar = () => {
    setIsSidebarVisible(false);
    if (isClient) {
      safeLocalStorage.setItem("sidebarVisible", "false");
    }
  };

  const showSidebar = () => {
    setIsSidebarVisible(true);
    if (isClient) {
      safeLocalStorage.setItem("sidebarVisible", "true");
    }
  };

  const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    
    // Save fullscreen state to localStorage
    if (isClient) {
      safeLocalStorage.setItem("fullscreenState", newFullscreenState.toString());
    }
    
    // When entering fullscreen, hide both sidebar and header
    // When exiting fullscreen, show sidebar and header
    if (newFullscreenState) {
      // Entering fullscreen - hide sidebar
      setIsSidebarVisible(false);
      if (isClient) {
        safeLocalStorage.setItem("sidebarVisible", "false");
      }
    } else {
      // Exiting fullscreen - show sidebar
      setIsSidebarVisible(true);
      if (isClient) {
        safeLocalStorage.setItem("sidebarVisible", "true");
      }
    }
  };

  const isRTL = locale === "ar";
  const sidebarWidth = isSidebarCollapsed ? "3rem" : "16rem";
  const contentMargin = !isSidebarVisible ? "0" : (isSidebarCollapsed ? "5rem" : "16rem");

  const sidebarStyle = {
    position: "fixed",
    top: 0,
    [isRTL ? "right" : "left"]: 0,
    height: "100vh",
    zIndex: 30,
    width: sidebarWidth,
    transition: "all 0.3s ease-in-out",
  };

  const headerStyle = {
    position: "fixed",
    top: 0,
    left: isRTL ? 0 : (isFullscreen ? 0 : contentMargin),
    right: isRTL ? (isFullscreen ? 0 : contentMargin) : 0,
    zIndex: 20,
    transition: "all 0.3s ease-in-out",
    transform: "translateZ(0)",
    willChange: "left, right",
  };

  const mainContentStyle = {
    marginLeft: isRTL ? 0 : (isFullscreen ? 0 : contentMargin),
    marginRight: isRTL ? (isFullscreen ? 0 : contentMargin) : 0,
    marginTop: isFullscreen ? "0" : "4rem",
    transition: "all 0.3s ease-in-out",
    padding: "0",
    width: isFullscreen ? "100%" : (!isSidebarVisible ? "100%" : `calc(100% - ${contentMargin})`),
    transform: "translateZ(0)",
    willChange: "margin-left, margin-right, width",
  };

  return (
    <MUIThemeWrapper>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={dateAdapterLocale}
      >
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden w-full">
            {isSidebarVisible && (
              <div style={sidebarStyle}>
                <Sidebar
                  userRole={userRole}
                  isCollapsed={isSidebarCollapsed}
                  toggleSidebar={toggleSidebar}
                  isRTL={isRTL}
                />
              </div>
            )}
            <div className="flex flex-col flex-1 w-full">
              {!isFullscreen && (
                <div style={headerStyle} className="bg-background">
                  <Header
                    hideSidebar={hideSidebar}
                    showSidebar={showSidebar}
                    isSidebarVisible={isSidebarVisible}
                    onToggleFullscreen={toggleFullscreen}
                    isFullscreen={isFullscreen}
                  />
                </div>
              )}
              <main
                className="flex-1 overflow-y-auto relative"
                style={mainContentStyle}
              >
                {children}
                
                {/* Fullscreen exit message */}
                {isFullscreen && (
                  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 shadow-lg" data-nextjs-scroll-focus-boundary>
                    <p className="text-sm text-muted-foreground">
                      Press <kbd className="px-2 py-1 text-xs bg-muted rounded border">ESC</kbd> to exit fullscreen
                    </p>
                  </div>
                )}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </LocalizationProvider>
    </MUIThemeWrapper>
  );
}

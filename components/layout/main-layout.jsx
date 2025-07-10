"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocale } from "next-intl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { arSA, enUS } from "date-fns/locale";
import { MUIThemeWrapper } from "@/lib/themes/mui-theme-provider";

export function MainLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [userRole, setUserRole] = useState("user");
  const locale = useLocale();
  const dateAdapterLocale = locale === "ar" ? arSA : enUS;

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Get user role from localStorage
    const storedRole = localStorage.getItem("userRole") || "user";
    setUserRole(storedRole);

    // Get sidebar state from localStorage
    const sidebarState = localStorage.getItem("sidebarState");
    if (sidebarState) {
      setIsSidebarCollapsed(sidebarState === "collapsed");
    }

    // Get sidebar visibility from localStorage
    const sidebarVisible = localStorage.getItem("sidebarVisible");
    if (sidebarVisible !== null) {
      setIsSidebarVisible(sidebarVisible === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarState", newState ? "collapsed" : "expanded");
    }
  };

  const hideSidebar = () => {
    setIsSidebarVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarVisible", "false");
    }
  };

  const showSidebar = () => {
    setIsSidebarVisible(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarVisible", "true");
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
    left: isRTL ? 0 : contentMargin,
    right: isRTL ? contentMargin : 0,
    zIndex: 20,
    transition: "all 0.3s ease-in-out",
    transform: "translateZ(0)",
    willChange: "left, right",
  };

  const mainContentStyle = {
    marginLeft: isRTL ? 0 : contentMargin,
    marginRight: isRTL ? contentMargin : 0,
    marginTop: "4rem",
    transition: "all 0.3s ease-in-out",
    padding: "0",
    width: !isSidebarVisible ? "100%" : `calc(100% - ${contentMargin})`,
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
              <div style={headerStyle} className="bg-background">
                <Header
                  toggleSidebar={toggleSidebar}
                  hideSidebar={hideSidebar}
                  showSidebar={showSidebar}
                  isSidebarVisible={isSidebarVisible}
                />
              </div>
              <main
                className="flex-1 overflow-y-auto"
                style={mainContentStyle}
              >
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </LocalizationProvider>
    </MUIThemeWrapper>
  );
}

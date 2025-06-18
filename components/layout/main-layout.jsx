"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocale } from "next-intl";

export function MainLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const locale = useLocale();

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
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarState", newState ? "collapsed" : "expanded");
    }
  };

  const isRTL = locale === "ar";
  const sidebarWidth = isSidebarCollapsed ? "3rem" : "16rem";
  const contentMargin = isSidebarCollapsed ? "5rem" : "16rem";

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
    direction: isRTL ? "rtl" : "ltr",
  };

  const mainContentStyle = {
    marginLeft: isRTL ? 0 : contentMargin,
    marginRight: isRTL ? contentMargin : 0,
    marginTop: "4rem",
    transition: "all 0.3s ease-in-out",
    padding: "0",
    width: `calc(100% - ${contentMargin})`,
    transform: "translateZ(0)",
    willChange: "margin-left, margin-right, width",
    direction: isRTL ? "rtl" : "ltr",
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <div style={sidebarStyle}>
          <Sidebar
            userRole={userRole}
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            isRTL={isRTL}
          />
        </div>
        <div className="flex flex-col flex-1 w-full">
          <div style={headerStyle} className="bg-background">
            <Header toggleSidebar={toggleSidebar} />
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
  );
}

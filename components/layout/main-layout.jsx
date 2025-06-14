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
  const sidebarStyle = {
    position: "fixed",
    top: 0,
    [isRTL ? "right" : "left"]: 0,
    height: "100vh",
    zIndex: 20,
  };

  const mainContentStyle = {
    marginLeft: isRTL ? 0 : isSidebarCollapsed ? "3rem" : "16rem",
    marginRight: isRTL ? (isSidebarCollapsed ? "3rem" : "16rem") : 0,
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
        <div className="flex flex-col flex-1 w-full" style={mainContentStyle}>
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto w-full p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

import "@/styles/globals.css";
import "@/styles/toast.css";

import { MainLayout } from "@/components/layout/main-layout"

export const metadata = {
  title: "Inventory Management System",
  description: "Inventory Management System for a company to manage their inventory and orders",
}

export default function TenantLayout({ children }) {
  return (
    <div className="h-screen w-full overflow-hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>      
        <MainLayout>{children}</MainLayout>  
    </div>
  )
}
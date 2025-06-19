import "@/styles/globals.css";
import "@/styles/toast.css";
import { MainLayout } from "@/components/layout/main-layout";

export const metadata = {
  title: "Inventory Management System",
  description:
    "Inventory Management System for a company to manage their inventory and orders",
};

export default function TenantLayout({ children }) {
  return (
    <div className="h-screen w-full overflow-hidden">
      <MainLayout>{children}</MainLayout>
    </div>
  );
}

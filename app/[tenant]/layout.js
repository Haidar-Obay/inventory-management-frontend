import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainLayout } from "@/components/layout/main-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Inventory Management System",
  description: "Inventory Management System for a company to manage their inventory and orders",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}

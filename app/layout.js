import { ThemeProvider } from "@/components/theme-provider"
import { SimpleToastProvider } from "@/components/ui/simple-toast";
import { ToastSetup } from "@/components/ui/toast-provider";
import "@/styles/globals.css";
import "@/styles/toast.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata = {
  title: 'Inventory Management System',
  description: 'An inventory management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className}`}>
      <SimpleToastProvider> 
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ToastSetup />
          {children}
      </ThemeProvider>
      </SimpleToastProvider>
      </body>
    </html>
  );
} 
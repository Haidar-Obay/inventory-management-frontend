import "../styles/globals.css";
import "../styles/toast.css";
import { SimpleToastProvider } from "@/components/ui/simple-toast";
import { ToastSetup } from "@/components/ui/toast-provider";

export default function RootLayout({ children }) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <SimpleToastProvider>
            <ToastSetup />
            {children}
          </SimpleToastProvider>
        </body>
      </html>
    );
  }
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, defaultLocale } from "../../i18n";
import { SimpleToastProvider } from "@/components/ui/simple-toast";
import { ToastSetup } from "@/components/ui/toast-provider";
import { ThemeProvider } from "@/lib/themes/theme-provider";
import { MUIThemeWrapper } from "@/lib/themes/mui-theme-provider";
import "@/styles/globals.css";
import "@/styles/toast.css";
import { Inter, Cairo } from "next/font/google";
import { DrawerStackProvider } from "@/components/ui/DrawerStackContext";
import DrawerStackManager from "@/components/ui/DrawerStackManager";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Inventory Management System",
  description: "An inventory management system",
  // Optimize CSS preloading
  other: {
    "preload-css": "true",
  },
};

export default async function LocaleLayout({ children, params }) {
  const { locale: localeParam } = await params;

  // Validate that the incoming `locale` parameter is valid
  let locale = localeParam;
  if (!locales.includes(locale)) {
    locale = defaultLocale;
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html suppressHydrationWarning dir={locale === "ar" ? "rtl" : "ltr"}>
                       <body 
        className={`${inter.variable} ${cairo.variable} ${locale === "ar" ? cairo.className : inter.className}`}
        suppressHydrationWarning
      >
                   <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MUIThemeWrapper>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <SimpleToastProvider>
                <ToastSetup />
                <DrawerStackProvider>
                  <DrawerStackManager />
                  {children}
                </DrawerStackProvider>
              </SimpleToastProvider>
            </NextIntlClientProvider>
          </MUIThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

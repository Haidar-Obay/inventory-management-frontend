import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, defaultLocale } from "../../i18n";
import { SimpleToastProvider } from "@/components/ui/simple-toast";
import { ToastSetup } from "@/components/ui/toast-provider";
import { ThemeProvider } from "@/lib/themes/theme-provider";
import { MUIThemeWrapper } from "@/lib/themes/mui-theme-provider";
import "@/styles/globals.css";
import "@/styles/toast.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Inventory Management System",
  description: "An inventory management system",
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
      <body className={`${inter.variable} ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MUIThemeWrapper>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <SimpleToastProvider>
                <ToastSetup />
                {children}
              </SimpleToastProvider>
            </NextIntlClientProvider>
          </MUIThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, defaultLocale } from "../../i18n";

export default async function LocaleLayout({ children, params: { locale } }) {
  // Validate that the incoming `locale` parameter is valid
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
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}

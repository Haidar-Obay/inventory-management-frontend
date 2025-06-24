"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("sidebar");
  const currentLocale = useLocale();

  const dashboardLinks = [
    {
      href: `/${currentLocale}/main/dashboard/overview`,
      label: t("overview"),
    },
    {
      href: `/${currentLocale}/main/dashboard/analytics`,
      label: t("analytics"),
    },
    {
      href: `/${currentLocale}/main/dashboard/reports`,
      label: t("reports"),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("dashboard")}</h1>
      <ul className="space-y-2">
        {dashboardLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-blue-600 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

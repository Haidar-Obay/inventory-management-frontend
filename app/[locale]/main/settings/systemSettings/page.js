"use client";

import { useTranslations } from "next-intl";

export default function SystemPage() {
  const t = useTranslations("settings");

  return (
    <div className="min-h-screen w-full bg-background p-8">
        <h1 className="text-2xl font-bold mb-6">{t("systemSettings")}</h1>
        <p className="text-gray-600">System settings configuration page.</p>
    </div>
  );
}

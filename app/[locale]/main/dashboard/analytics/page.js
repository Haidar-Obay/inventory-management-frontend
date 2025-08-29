"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Clock } from "lucide-react";

export default function AnalyticsPage() {
  const t = useTranslations("dashboardAnalytics");
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";

  return (
    <div className="min-h-screen w-full bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          className="bg-card rounded-xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t("comingSoon")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("comingSoonDesc")}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

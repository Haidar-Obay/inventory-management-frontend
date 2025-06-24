"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { FileText, BarChart3, Settings, Download, Clock } from "lucide-react";

export default function ReportsPage() {
  const t = useTranslations("dashboardReports");
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";

  const features = [
    {
      icon: FileText,
      title: t("features.inventoryReports"),
      description: t("features.inventoryReportsDesc"),
    },
    {
      icon: BarChart3,
      title: t("features.salesReports"),
      description: t("features.salesReportsDesc"),
    },
    {
      icon: Settings,
      title: t("features.customReports"),
      description: t("features.customReportsDesc"),
    },
    {
      icon: Download,
      title: t("features.exportOptions"),
      description: t("features.exportOptionsDesc"),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {t("description")}
          </motion.p>
        </div>

        <motion.div
          className="bg-card rounded-xl p-8 shadow-sm mb-8"
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

        <motion.div
          className="bg-card rounded-xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            {t("features.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-background rounded-lg p-6 border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Package,
  BarChart3,
  Users,
  Settings,
  AlertCircle,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";

export default function Dashboard() {
  const t = useTranslations("dashboardOverview");
  const features = [
    {
      icon: Package,
      title: t("inventoryTrackingTitle"),
      description: t("inventoryTrackingDesc"),
    },
    {
      icon: BarChart3,
      title: t("analyticsDashboardTitle"),
      description: t("analyticsDashboardDesc"),
    },
    {
      icon: Users,
      title: t("userManagementTitle"),
      description: t("userManagementDesc"),
    },
    {
      icon: Settings,
      title: t("customizableSettingsTitle"),
      description: t("customizableSettingsDesc"),
    },
    {
      icon: AlertCircle,
      title: t("stockAlertsTitle"),
      description: t("stockAlertsDesc"),
    },
    {
      icon: TrendingUp,
      title: t("performanceMetricsTitle"),
      description: t("performanceMetricsDesc"),
    },
    {
      icon: Shield,
      title: t("securityFeaturesTitle"),
      description: t("securityFeaturesDesc"),
    },
    {
      icon: Clock,
      title: t("realTimeUpdatesTitle"),
      description: t("realTimeUpdatesDesc"),
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
            {t("welcomeTitle")}
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {t("welcomeDesc")}
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
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
        </motion.div>

        <motion.div
          className="mt-16 bg-card rounded-xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t("gettingStartedTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {t("step1Title")}
              </h3>
              <p className="text-muted-foreground">{t("step1Desc")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {t("step2Title")}
              </h3>
              <p className="text-muted-foreground">{t("step2Desc")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {t("step3Title")}
              </h3>
              <p className="text-muted-foreground">{t("step3Desc")}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

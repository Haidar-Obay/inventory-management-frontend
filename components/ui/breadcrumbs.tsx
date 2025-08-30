"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("breadcrumbs");
  const tGeneralFiles = useTranslations("generalFiles");
  const tAddressCodes = useTranslations("addressCodes");
  const tSections = useTranslations("sections");
  const tItems = useTranslations("items");
  const tPayment = useTranslations("payment");
  const tCustomers = useTranslations("customers");
  const tSuppliers = useTranslations("suppliers");
  const tSettings = useTranslations("settings");
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Remove locale from segments if present
    const localeIndex = segments.findIndex((seg) => ["en", "ar"].includes(seg));
    const pathSegments =
      localeIndex !== -1 ? segments.slice(localeIndex + 1) : segments;

    // Add home breadcrumb - redirect to dashboard/overview
    // Skip home breadcrumb for profile page to show only "Profile"
    if (!pathSegments.includes("profile")) {
      breadcrumbs.push({
        label: t("home"),
        href: `/${currentLocale}/main/dashboard/overview`,
      });
    }

    // Map path segments to breadcrumb items
    let currentPath = `/${currentLocale}`;
    let skipNext = false;

    // Special handling for profile page - show only "Profile"
    if (pathSegments.includes("profile")) {
      breadcrumbs.push({
        label: t("profile"),
        isActive: true,
      });
      return breadcrumbs;
    }

    // For main sections (settings, dashboard, support), start from their segment
    let startIndex = 0;
    if (pathSegments.includes("settings")) {
      startIndex = pathSegments.indexOf("settings");
    } else if (pathSegments.includes("dashboard")) {
      startIndex = pathSegments.indexOf("dashboard");
    } else if (pathSegments.includes("support")) {
      startIndex = pathSegments.indexOf("support");
    }

    // Build the base path for main section pages
    if (startIndex > 0) {
      currentPath = pathSegments.slice(0, startIndex + 1).join("/");
    }

    for (let i = startIndex; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      if (i > startIndex) {
        currentPath += `/${segment}`;
      }

      // Skip if we're supposed to skip this segment (to avoid duplicates)
      if (skipNext) {
        skipNext = false;
        continue;
      }

      // Map segments to readable labels
      let label = segment;

      // Map main sections
      if (segment === "main") {
        label = t("mainFiles");
        // Skip the next 'mainfiles' segment to avoid duplication
        if (
          i + 1 < pathSegments.length &&
          pathSegments[i + 1] === "mainfiles"
        ) {
          skipNext = true;
        }
      } else if (segment === "mainfiles") {
        label = t("mainFiles");
      } else if (segment === "dashboard") {
        label = t("dashboard");
      } else if (segment === "overview") {
        label = t("overview");
      } else if (segment === "analytics") {
        label = t("analytics");
      } else if (segment === "reports") {
        label = t("reports");
      } else if (segment === "customer") {
        label = t("customer");
      } else if (segment === "addresscodes") {
        label = t("addressCodes");
      } else if (segment === "sections") {
        label = t("sections");
      } else if (segment === "items") {
        label = t("items");
      } else if (segment === "generalfiles") {
        label = t("generalFiles");
      } else if (segment === "settings") {
        label = t("settings");
      } else if (segment === "userManagement") {
        label = t("userManagement");
      } else if (segment === "profile") {
        label = t("profile");
      } else if (segment === "payment") {
        label = t("payment");
      } else if (segment === "supplier") {
        label = t("supplier");
      }

      // Check if this is the last segment (current page)
      const isLast = i === pathSegments.length - 1;

      // Determine if this breadcrumb should be clickable
      // Parent sections without their own pages should not be clickable
      const isParentSection = [
        "main",
        "mainfiles",
        "dashboard",
        "customer",
        "addresscodes",
        "sections",
        "items",
        "generalfiles",
        "settings",
        "userManagement",
        "payment",
        "supplier",
      ].includes(segment);
      const hasTab = searchParams.get("tab") !== null;

      // Only make clickable if it's not a parent section or if it's the last item
      const shouldBeClickable = !isParentSection || isLast;

      breadcrumbs.push({
        label,
        href: shouldBeClickable && !isLast ? currentPath : undefined,
        isActive: isLast,
      });
    }

    // Add tab information if present
    const tab = searchParams.get("tab");
    if (tab !== null) {
      const tabIndex = parseInt(tab);
      let tabLabel = "";

      // Map tab indices to labels based on current page
      if (pathSegments.includes("customer")) {
        const customerTabs = [
          tCustomers("tabs.customerGroups"),
          tCustomers("tabs.salesmen"),
          tCustomers("tabs.customers"),
          tCustomers("tabs.customerMasterLists"),
        ];
        tabLabel = customerTabs[tabIndex] || "";
      } else if (pathSegments.includes("addresscodes")) {
        const addressTabs = [
          tAddressCodes("tabs.countries"), 
          tAddressCodes("tabs.cities"),
          tAddressCodes("tabs.districts"),
          tAddressCodes("tabs.zones"),
        ];
        tabLabel = addressTabs[tabIndex] || "";
      } else if (pathSegments.includes("sections")) {
        const sectionTabs = [
          tSections("tabs.projects"),
          tSections("tabs.costCenters"),
          tSections("tabs.departments"),
          tSections("tabs.trades"),
          tSections("tabs.companyCodes"),
          tSections("tabs.jobs"),
        ];
        tabLabel = sectionTabs[tabIndex] || "";
      } else if (pathSegments.includes("items")) {
        const itemsTabs = [
          tItems("tabs.productLines"),
          tItems("tabs.categories"),
          tItems("tabs.brands"),
          tItems("tabs.items"),
        ];
        tabLabel = itemsTabs[tabIndex] || "";
      } else if (pathSegments.includes("payment")) {
        const paymentTabs = [
          tPayment("tabs.paymentTerms"),
          tPayment("tabs.paymentMethods"),
        ];
        tabLabel = paymentTabs[tabIndex] || "";
      } else if (pathSegments.includes("generalfiles")) {
        const generalFilesTabs = [
          tGeneralFiles("tabs.businessTypes"),
          tGeneralFiles("tabs.salesChannels"),
          tGeneralFiles("tabs.distributionChannels"),
          tGeneralFiles("tabs.mediaChannels"),
        ];
        tabLabel = generalFilesTabs[tabIndex] || "";
      } else if (pathSegments.includes("supplier")) {
        const supplierTabs = [
          tSuppliers("tabs.supplierGroups"),
          tSuppliers("tabs.suppliers"),
        ];
        tabLabel = supplierTabs[tabIndex] || "";
      } else if (pathSegments.includes("userManagement")) {
        const userManagementTabs = [
          tSettings("tabs.userManagement"),
          tSettings("tabs.permission"),
          tSettings("tabs.roleManagement"),
        ];
        tabLabel = userManagementTabs[tabIndex] || "";
      }

      if (tabLabel) {
        breadcrumbs.push({
          label: tabLabel,
          isActive: true,
        });
      }
    }

    return breadcrumbs;
  };

  // Update breadcrumbs when pathname or searchParams change
  useEffect(() => {
    const newBreadcrumbs = generateBreadcrumbs();
    setBreadcrumbs(newBreadcrumbs);
  }, [pathname, searchParams, currentLocale]);

  // Allow single breadcrumbs for profile page
  if (breadcrumbs.length <= 1 && !pathname.includes("profile")) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-1 text-base text-muted-foreground",
        className
      )}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="flex items-center min-w-0">
          {index > 0 && (
            <ChevronRight
              className={cn(
                "h-4 w-4 mx-1 text-muted-foreground/50 flex-shrink-0",
                isRTL ? "rotate-180" : ""
              )}
            />
          )}

          {breadcrumb.href ? (
            <Link
              href={breadcrumb.href}
              className={cn(
                "hover:text-foreground transition-colors duration-200 truncate max-w-20",
                breadcrumb.isActive && "text-foreground font-medium"
              )}
              title={breadcrumb.label}
            >
              {index === 0 ? <Home className="h-4 w-4 flex-shrink-0" /> : breadcrumb.label}
            </Link>
          ) : (
            <span
              className={cn(
                "transition-colors duration-200 truncate max-w-20",
                breadcrumb.isActive && "text-foreground font-medium"
              )}
              title={breadcrumb.label}
            >
              {breadcrumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

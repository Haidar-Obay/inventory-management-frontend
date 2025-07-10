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

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;

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
      } else if (segment === "settings") {
        label = t("settings");
      } else if (segment === "profile") {
        label = t("profile");
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
        "settings",
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
          t("customerGroups"),
          t("salesmen"),
          t("customers"),
        ];
        tabLabel = customerTabs[tabIndex] || "";
      } else if (pathSegments.includes("addresscodes")) {
        const addressTabs = [
          t("countries"),
          t("zones"),
          t("cities"),
          t("districts"),
        ];
        tabLabel = addressTabs[tabIndex] || "";
      } else if (pathSegments.includes("sections")) {
        const sectionTabs = [
          t("projects"),
          t("costCenters"),
          t("departments"),
          t("trades"),
          t("companyCodes"),
          t("jobs"),
        ];
        tabLabel = sectionTabs[tabIndex] || "";
      } else if (pathSegments.includes("items")) {
        const itemsTabs = [
          t("productLines"),
          t("categories"),
          t("brands"),
          t("items"),
        ];
        tabLabel = itemsTabs[tabIndex] || "";
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
  }, [pathname, searchParams, currentLocale, t]);

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
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight
              className={cn(
                "h-4 w-4 mx-1 text-muted-foreground/50",
                isRTL ? "rotate-180" : ""
              )}
            />
          )}

          {breadcrumb.href ? (
            <Link
              href={breadcrumb.href}
              className={cn(
                "hover:text-foreground transition-colors duration-200",
                breadcrumb.isActive && "text-foreground font-medium"
              )}
            >
              {index === 0 ? <Home className="h-4 w-4" /> : breadcrumb.label}
            </Link>
          ) : (
            <span
              className={cn(
                "transition-colors duration-200",
                breadcrumb.isActive && "text-foreground font-medium"
              )}
            >
              {breadcrumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

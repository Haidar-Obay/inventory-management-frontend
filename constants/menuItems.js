import { useTranslations } from "next-intl";

export function useMenuItems() {
  const t = useTranslations("sidebar");
  return {
    [t("dashboard")]: {
      groupIcon: "LayoutDashboard",
      displayType: "popover",
      items: [
        {
          name: t("overview"),
          icon: "Home",
          path: "/tenant/main/dashboard/overview",
          roles: ["admin", "user", "owner"],
        },
        {
          name: t("analytics"),
          icon: "BarChart3",
          path: "/tenant/main/dashboard/analytics",
          roles: ["admin", "user", "owner"],
        },
        {
          name: t("reports"),
          icon: "FileText",
          path: "/tenant/main/dashboard/reports",
          roles: ["admin", "user", "owner"],
        },
      ],
    },
    [t("mainFiles")]: {
      groupIcon: "FolderOpen",
      displayType: "collapsible",
      items: [
        {
          name: t("addressCodes"),
          icon: "MapPin",
          type: "group",
          displayType: "popover",
          roles: ["admin", "owner"],
          items: [
            {
              name: t("countries"),
              icon: "Flag",
              path: "/tenant/main/mainfiles/addresscodes?tab=0",
            },
            {
              name: t("provinces"),
              icon: "Flag",
              path: "/tenant/main/mainfiles/addresscodes?tab=1",
            },
            {
              name: t("cities"),
              icon: "Flag",
              path: "/tenant/main/mainfiles/addresscodes?tab=2",
            },
            {
              name: t("districts"),
              icon: "Flag",
              path: "/tenant/main/mainfiles/addresscodes?tab=3",
            },
          ],
        },
        {
          name: t("sections"),
          icon: "Waypoints",
          type: "group",
          displayType: "popover",
          roles: ["admin", "owner"],
          items: [
            {
              name: t("project"),
              icon: "Presentation",
              path: "/tenant/main/mainfiles/sections?tab=0",
            },
            {
              name: t("costCenter"),
              icon: "HandCoins",
              path: "/tenant/main/mainfiles/sections?tab=1",
            },
            {
              name: t("department"),
              icon: "Building2",
              path: "/tenant/main/mainfiles/sections?tab=2",
            },
            {
              name: t("trades"),
              icon: "Wrench",
              path: "/tenant/main/mainfiles/sections?tab=3",
            },
            {
              name: t("companyCodes"),
              icon: "Building",
              path: "/tenant/main/mainfiles/sections?tab=4",
            },
            {
              name: t("jobs"),
              icon: "Briefcase",
              path: "/tenant/main/mainfiles/sections?tab=5",
            },
          ],
        },
        {
          name: t("items"),
          icon: "ShoppingBasket",
          type: "group",
          displayType: "popover",
          roles: ["admin", "owner"],
          items: [
            {
              name: t("productLines"),
              icon: "PackageSearch",
              path: "/tenant/main/items/product-lines",
            },
            {
              name: t("categories"),
              icon: "ChartBarStacked",
              path: "/tenant/main/items/categories",
            },
            { name: t("brands"), icon: "Tag", path: "main/items/brands" },
            { name: t("items"), icon: "Package", path: "main/items/items" },
          ],
        },
        {
          name: t("customer"),
          icon: "Users",
          type: "group",
          displayType: "popover",
          roles: ["admin", "owner"],
          items: [
            {
              name: t("customerGroup"),
              icon: "UserCog",
              path: "/tenant/main/customer/customer-group",
            },
            {
              name: t("salesmen"),
              icon: "UserCheck",
              path: "/tenant/main/customer/salesmen",
            },
            {
              name: t("customer"),
              icon: "Users",
              path: "main/customer/customer",
            },
          ],
        },
        {
          name: t("supplier"),
          icon: "Truck",
          type: "group",
          displayType: "popover",
          roles: ["admin", "owner"],
          items: [
            {
              name: t("supplierGroup"),
              icon: "Users",
              path: "/tenant/main/supplier/supplier-group",
            },
            {
              name: t("suppliers"),
              icon: "Truck",
              path: "/tenant/main/supplier/suppliers",
            },
          ],
        },
      ],
    },
    [t("generalFiles")]: {
      groupIcon: "FolderOpen",
      displayType: "collapsible",
      items: [],
    },
    [t("settings")]: {
      groupIcon: "Settings",
      displayType: "popover",
      roles: ["admin", "owner"],
      items: [
        {
          name: t("userManagement"),
          icon: "Users",
          path: "/tenant/main/settings/users",
          roles: ["admin"],
        },
        {
          name: t("systemSettings"),
          icon: "Settings",
          path: "/tenant//main/settings/system",
          roles: ["admin", "owner"],
        },
      ],
    },
    [t("support")]: {
      groupIcon: "LifeBuoy",
      displayType: "popover",
      items: [
        {
          name: t("helpCenter"),
          icon: "LifeBuoy",
          path: "/tenant/main/support/help",
          roles: ["admin", "user", "owner"],
        },
        {
          name: t("contactSupport"),
          icon: "Mail",
          path: "/tenant/main/support/contact",
          roles: ["admin", "user", "owner"],
        },
      ],
    },
  };
}

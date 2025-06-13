"use client";

export function useMenuItems(t) {
  return {
    [t("dashboard")]: {
      groupIcon: "LayoutDashboard",
      displayType: "popover",
      items: [
        {
          name: t("overview"),
          icon: "Home",
          path: "/main/dashboard/overview",
          roles: ["admin", "user", "owner"],
        },
        {
          name: t("analytics"),
          icon: "BarChart3",
          path: "/main/dashboard/analytics",
          roles: ["admin", "user", "owner"],
        },
        {
          name: t("reports"),
          icon: "FileText",
          path: "/main/dashboard/reports",
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
          roles: ["admin", "user", "owner"],
          items: [
            {
              name: t("countries"),
              icon: "Flag",
              path: "/main/mainfiles/addresscodes?tab=0",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("provinces"),
              icon: "Flag",
              path: "/main/mainfiles/addresscodes?tab=1",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("cities"),
              icon: "Flag",
              path: "/main/mainfiles/addresscodes?tab=2",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("districts"),
              icon: "Flag",
              path: "/main/mainfiles/addresscodes?tab=3",
              roles: ["admin", "user", "owner"],
            },
          ],
        },
        {
          name: t("sections"),
          icon: "Waypoints",
          type: "group",
          displayType: "popover",
          roles: ["admin", "user", "owner"],
          items: [
            {
              name: t("project"),
              icon: "Presentation",
              path: "/main/mainfiles/sections?tab=0",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("costCenter"),
              icon: "HandCoins",
              path: "/main/mainfiles/sections?tab=1",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("department"),
              icon: "Building2",
              path: "/main/mainfiles/sections?tab=2",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("trades"),
              icon: "Wrench",
              path: "/main/mainfiles/sections?tab=3",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("companyCodes"),
              icon: "Building",
              path: "/main/mainfiles/sections?tab=4",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("jobs"),
              icon: "Briefcase",
              path: "/main/mainfiles/sections?tab=5",
              roles: ["admin", "user", "owner"],
            },
          ],
        },
        {
          name: t("items"),
          icon: "ShoppingBasket",
          type: "group",
          displayType: "popover",
          roles: ["admin", "user", "owner"],
          items: [
            {
              name: t("productLines"),
              icon: "PackageSearch",
              path: "/main/items/product-lines",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("categories"),
              icon: "ChartBarStacked",
              path: "/main/items/categories",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("brands"),
              icon: "Tag",
              path: "main/items/brands",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("items"),
              icon: "Package",
              path: "main/items/items",
              roles: ["admin", "user", "owner"],
            },
          ],
        },
        {
          name: t("customer"),
          icon: "Users",
          type: "group",
          displayType: "popover",
          roles: ["admin", "user", "owner"],
          items: [
            {
              name: t("customerGroup"),
              icon: "UserCog",
              path: "/main/customer/customer-group",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("salesmen"),
              icon: "UserCheck",
              path: "/main/customer/salesmen",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("customer"),
              icon: "Users",
              path: "main/customer/customer",
              roles: ["admin", "user", "owner"],
            },
          ],
        },
        {
          name: t("supplier"),
          icon: "Truck",
          type: "group",
          displayType: "popover",
          roles: ["admin", "user", "owner"],
          items: [
            {
              name: t("supplierGroup"),
              icon: "Users",
              path: "/main/supplier/supplier-group",
              roles: ["admin", "user", "owner"],
            },
            {
              name: t("suppliers"),
              icon: "Truck",
              path: "/rs",
              roles: ["admin", "user", "owner"],
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
      roles: ["admin", "user", "owner"],
      items: [
        {
          name: t("userManagement"),
          icon: "Users",
          path: "/main/settings/users",
          roles: ["admin", "user", "owner"],
        },
        {
          name: t("systemSettings"),
          icon: "Settings",
          path: "/main/settings/system",
          roles: ["admin", "user", "owner"],
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
          path: "/main/support/help",
          roles: ["admin", "user", "owner"],
        },
        {
          name: t("contactSupport"),
          icon: "Mail",
          path: "/main/support/contact",
          roles: ["admin", "user", "owner"],
        },
      ],
    },
  };
}

 "use client";

export function useMenuItems(t) {
  return {
    [t("dashboard")]: {
      key: "dashboard",
      groupIcon: "LayoutDashboard",
      displayType: "collapsible",
      items: [
        {
          key: "overview",
          name: t("overview"),
          icon: "Home",
          path: "/main/dashboard/overview",
          roles: ["admin", "user", "owner"],
        },
        {
          key: "analytics",
          name: t("analytics"),
          icon: "BarChart3",
          path: "/main/dashboard/analytics",
          roles: ["admin", "user", "owner"],
        },
        {
          key: "reports",
          name: t("reports"),
          icon: "FileText",
          path: "/main/dashboard/reports",
          roles: ["admin", "user", "owner"],
        },
      ],
    },
    [t("mainFiles")]: {
      key: "mainFiles",
      groupIcon: "File",
      displayType: "collapsible",
      roles: ["admin", "user", "owner"],
      items: [
        {
          key: "addressCodes",
          name: t("addressCodes"),
          icon: "MapPin",
          type: "group",
          displayType: "popover",
          roles: ["admin", "user", "owner"],
          items: [
            {
              key: "countries",
              name: t("countries"),
              icon: "Flag",
              path: "/main/mainfiles/addresscodes?tab=0",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "cities",
              name: t("cities"),
              icon: "Flag",
              path: "/main/mainfiles/addresscodes?tab=1",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "districts",
              name: t("districts"),
              icon: "Flag",
              path: "/main/mainfiles/addresscodes?tab=2",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "zones",
              name: t("zones"),
              icon: "Flag",
              path: "/main/mainfiles/addresscodes?tab=3",
              roles: ["admin", "user", "owner"],
            },
          ],
        },
        {
          key: "sections",
          name: t("sections"),
          icon: "Waypoints",
          type: "group",
          displayType: "popover",
          roles: ["admin", "user", "owner"],
          items: [
            {
              key: "project",
              name: t("projects"),
              icon: "Presentation",
              path: "/main/mainfiles/sections?tab=0",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "costCenter",
              name: t("costCenters"),
              icon: "HandCoins",
              path: "/main/mainfiles/sections?tab=1",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "department",
              name: t("departments"),
              icon: "Building2",
              path: "/main/mainfiles/sections?tab=2",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "trades",
              name: t("trades"),
              icon: "Wrench",
              path: "/main/mainfiles/sections?tab=3",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "companyCodes",
              name: t("companyCodes"),
              icon: "Building",
              path: "/main/mainfiles/sections?tab=4",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "jobs",
              name: t("jobs"),
              icon: "Briefcase",
              path: "/main/mainfiles/sections?tab=5",
              roles: ["admin", "user", "owner"],
            },
          ],
        },
        {
          key:"generalFiles",
          name:t("generalFiles"),
          icon:"FolderOpen",
          type:"group",
          displayType:"popover",
          roles:["admin","user","owner"],
          items:[{
            key:"businessTypes",
            name:t("businessTypes"),
            icon:"Briefcase",
            path:"/main/mainfiles/generalfiles?tab=0",
            roles:["admin","user","owner"],
          },
          {
            key:"salesChannels",
            name:t("salesChannels"),
            icon:"Route",
            path:"/main/mainfiles/generalfiles?tab=1",
            roles:["admin","user","owner"],
          },
          {
            key:"distributionChannels",
            name:t("distributionChannels"),
            icon:"Truck",
            path:"/main/mainfiles/generalfiles?tab=2",
            roles:["admin","user","owner"],
          },
          {
            key:"mediaChannels",
            name:t("mediaChannels"),
            icon:"Newspaper",
            path:"/main/mainfiles/generalfiles?tab=3",
            roles:["admin","user","owner"],
          },
          ],
        },
        {
          key: "payment",
          name: t("payment"),
          icon: "Briefcase",
          type: "group",
          displayType: "popover",
          roles: ["admin", "user", "owner"],
          items: [
            {
              key: "paymentTerms",
              name: t("paymentTerms"),
              icon: "Tag",
              path: "/main/mainfiles/payment?tab=0",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "paymentMethods",
              name: t("paymentMethods"),
              icon: "Package",
              path: "/main/mainfiles/payment?tab=1",
              roles: ["admin", "user", "owner"],
            },
          ],
        },
        {
          key: "items",
          name: t("items"),
          icon: "ShoppingBasket",
          type: "group",
          displayType: "popover",
          roles: ["admin", "user", "owner"],
          items: [
            {
              key: "productLines",
              name: t("productLines"),
              icon: "PackageSearch",
              path: "/main/mainfiles/items?tab=0",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "categories",
              name: t("categories"),
              icon: "ChartBarStacked",
              path: "/main/mainfiles/items?tab=1",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "brands",
              name: t("brands"),
              icon: "Tag",
              path: "/main/mainfiles/items?tab=2",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "items_inner",
              name: t("items_inner"),
              icon: "Package",
              path: "/main/mainfiles/items?tab=3",
              roles: ["admin", "user", "owner"],
            },
          ],
        },
        {
          key: "customer",
          name: t("customers"),
          icon: "Users",
          type: "group",
          displayType: "popover",
          roles: ["admin", "user", "owner"],
          items: [
            {
              key: "customerGroup",
              name: t("customerGroups"),
              icon: "UserCog",
              path: "/main/mainfiles/customer?tab=0",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "salesmen",
              name: t("salesmen"),
              icon: "UserCheck",
              path: "/main/mainfiles/customer?tab=1",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "customer_inner",
              name: t("customer_inner"),
              icon: "Users",
              path: "/main/mainfiles/customer?tab=2",
              roles: ["admin", "user", "owner"],
            },
          ],
        },
        {
          key: "supplier",
          name: t("suppliers"),
          icon: "Truck",
          type: "group",
          displayType: "popover",
          roles: ["admin", "user", "owner"],
          items: [
            {
              key: "supplierGroup",
              name: t("supplierGroups"),
              icon: "Users",
              path: "/main/supplier/supplier-group",
              roles: ["admin", "user", "owner"],
            },
            {
              key: "supplier_inner",
              name: t("supplier_inner"),
              icon: "Truck",
              path: "/rs",
              roles: ["admin", "user", "owner"],
            },
          ],
        },
      ],
    },
    [t("generalFiles")]: {
      key: "generalFiles",
      groupIcon: "FolderOpen",
      displayType: "collapsible",
      items: [],
    },
    [t("settings")]: {
      key: "settings",
      groupIcon: "Settings",
      displayType: "popover",
      roles: ["admin", "user", "owner"],
      items: [
        {
          key: "userManagement",
          name: t("userManagement"),
          icon: "Users",
          path: "/main/settings/users",
          roles: ["admin", "user", "owner"],
        },
        {
          key: "systemSettings",
          name: t("systemSettings"),
          icon: "Settings",
          path: "/main/settings/system",
          roles: ["admin", "user", "owner"],
        },
      ],
    },
    [t("support")]: {
      key: "support",
      groupIcon: "LifeBuoy",
      displayType: "popover",
      roles: ["admin", "user", "owner"],
      items: [
        {
          key: "helpCenter",
          name: t("helpCenter"),
          icon: "LifeBuoy",
          path: "/main/support/help",
          roles: ["admin", "user", "owner"],
        },
        {
          key: "contactSupport",
          name: t("contactSupport"),
          icon: "Mail",
          path: "/main/support/contact",
          roles: ["admin", "user", "owner"],
        },
      ],
    },
  };
}

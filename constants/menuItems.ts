export const menuItems = {
  dashboard: {
    groupIcon: "LayoutDashboard",
    items: [
      { name: "Overview", icon: "Home", path: "/" },
      { name: "Analytics", icon: "BarChart3", path: "/analytics" },
      { name: "Reports", icon: "FileText", path: "/reports" },
    ],
  },
  management: {
    groupIcon: "Users",
    items: [
      {
        name: "Customers",
        icon: "Users",
        path: "/customers",
        adminOnly: false,
      },
    ],
  },
  settings: {
    groupIcon: "Settings",
    items: [
      {
        name: "General",
        icon: "Settings",
        path: "/settings/general",
        adminOnly: false,
      },
      {
        name: "Notifications",
        icon: "Bell",
        path: "/settings/notifications",
        adminOnly: false,
      },
    ],
  },
  support: {
    groupIcon: "LifeBuoy",
    items: [{ name: "Contact Us", icon: "Mail", path: "/contact" }],
  },
} as const; 
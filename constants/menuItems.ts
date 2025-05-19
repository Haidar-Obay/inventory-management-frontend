export const menuItems = {
  dashboard: {
    groupIcon: "LayoutDashboard",
    displayType: "popover",
    items: [
      { name: "Overview", icon: "Home", path: "/" },
      { name: "Analytics", icon: "BarChart3", path: "/analytics" },
      { name: "Reports", icon: "FileText", path: "/reports" },
    ],
  },
  Main_Files: {
    groupIcon: "File",
    displayType: "collapsible",
    items: [
      {
        name: "Documents",
        icon: "FileText",
        type: "group",
        displayType: "popover",
        items: [
          { name: "Reports", icon: "FileText", path: "/documents/reports" },
          { name: "Contracts", icon: "FileText", path: "/documents/contracts" },
        ]
      },
      {
        name: "Files",
        icon: "File",
        type: "group",
        items: [
          { name: "Images", icon: "File", path: "/files/images" },
          { name: "Videos", icon: "File", path: "/files/videos" },
        ]
      },
    ],
  },
  settings: {
    groupIcon: "Settings",
    displayType: "popover",
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
    displayType: "popover",
    items: [{ name: "Contact Us", icon: "Mail", path: "/contact" }],
  },
} as const; 
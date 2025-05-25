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
    groupIcon: "FolderOpen",
    displayType: "collapsible",
    items: [
      {
        name: "Address Codes",
        icon: "MapPin",
        type: "group",
        displayType: "popover",
        items: [
          { name: "Countries", icon: "Flag", path: "/mainfiles/addresscodes?tab=0" },
          { name: "Cities", icon: "Flag", path: "/mainfiles/addresscodes?tab=2" },
          { name: "Districts", icon: "Flag", path: "/mainfiles/addresscodes?tab=3" },
          { name: "Provinces", icon: "Flag", path: "/mainfiles/addresscodes?tab=1" },
        ]
      },
      {
        name: "Sections",
        icon: "Waypoints",
        type: "group",
        displayType: "popover",
        items: [
          { name: "Project", icon: "Presentation", path: "/sections/project" },
          { name: "Cost Center", icon: "HandCoins", path: "/sections/cost-center" },
          { name: "Department", icon: "Building2", path: "/sections/department" },
        ]
      },
      {
        name: "Items",
        icon: "ShoppingBasket",
        type: "group",
        displayType: "popover",
        items: [
          { name: "Product Lines", icon: "PackageSearch", path: "/items/product-lines" },
          { name: "Categories", icon: "ChartBarStacked", path: "/items/categories" },
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
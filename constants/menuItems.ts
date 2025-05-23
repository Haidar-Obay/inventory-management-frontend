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
          { name: "Countries", icon: "Flag", path: "/addressCodes/countries" },
          { name: "Cities", icon: "Flag", path: "/addressCodes/cities" },
          { name: "Districts", icon: "Flag", path: "/addressCodes/districts" },
          { name: "Provinces", icon: "Flag", path: "/addressCodes/provinces" },
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
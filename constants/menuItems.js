export const menuItems = {
  dashboard: {
    groupIcon: "LayoutDashboard",
    displayType: "popover",
    items: [
      { name: "Overview", icon: "Home", path: "/" ,roles: ["admin", "user", "owner"],},
      { name: "Analytics", icon: "BarChart3", path: "/analytics" ,roles: ["admin", "user", "owner"],},
      { name: "Reports", icon: "FileText", path: "/reports" ,roles: ["admin", "user", "owner"],},
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
        roles: ["admin", "owner"],
        items: [
          { name: "Countries", icon: "Flag", path: "main/mainfiles/addresscodes?tab=0" },
          { name: "Provinces", icon: "Flag", path: "main/mainfiles/addresscodes?tab=1" },
          { name: "Cities", icon: "Flag", path: "main/mainfiles/addresscodes?tab=2" },
          { name: "Districts", icon: "Flag", path: "main/mainfiles/addresscodes?tab=3" },
        ] 
      },
      {
        name: "Sections",
        icon: "Waypoints",
        type: "group",
        displayType: "popover",
        roles: ["admin", "owner"],
        items: [
          { name: "Project", icon: "Presentation", path: "main/sections/project" },
          { name: "Cost Center", icon: "HandCoins", path: "main/sections/cost-center" },
          { name: "Department", icon: "Building2", path: "main/sections/department" },
        ]
      },
      {
        name: "Items",
        icon: "ShoppingBasket",
        type: "group",
        displayType: "popover",
        roles: ["admin", "owner"],
        items: [
          { name: "Product Lines", icon: "PackageSearch", path: "main/items/product-lines" },
          { name: "Categories", icon: "ChartBarStacked", path: "main/items/categories" },
        ]
      },
    ],
  },
  settings: {
    groupIcon: "Settings",
    displayType: "popover",
    roles: ["admin", "owner"],
    items: [
      {
        name: "User Management",
        icon: "Users",
        path: "/main/settings/users",
        roles: ["admin"]
      },
      {
        name: "System Settings",
        icon: "Settings",
        path: "/main/settings/system",
        roles: ["admin", "owner"]
      }
    ],
  },
  support: {
    groupIcon: "LifeBuoy",
    displayType: "popover",
    items: [
      {
        name: "Help Center",
        icon: "LifeBuoy",
        path: "/main/support/help",
        roles: ["admin", "user", "owner"]
      },
      {
        name: "Contact Support",
        icon: "Mail",
        path: "/main/support/contact",
        roles: ["admin", "user", "owner"]
      }
    ],
  },
}; 
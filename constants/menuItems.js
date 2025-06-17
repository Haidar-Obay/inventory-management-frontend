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
          { name: "Project", icon: "Presentation", path: "main/mainfiles/sections?tab=0" },
          { name: "Cost Center", icon: "HandCoins", path: "main/mainfiles/sections?tab=1" },
          { name: "Department", icon: "Building2", path: "main/mainfiles/sections?tab=2" },
          { name: "Trades", icon: "Wrench", path: "main/mainfiles/sections?tab=3" },
          { name: "Company Codes", icon: "Building", path: "main/mainfiles/sections?tab=4" },
          { name: "Jobs", icon: "Briefcase", path: "main/mainfiles/sections?tab=5" },
        ]
      },
      {
        name: "Items",
        icon: "ShoppingBasket",
        type: "group",
        displayType: "popover",
        roles: ["admin", "owner"],
        items: [
          { name: "Product Lines", icon: "PackageSearch", path: "main/mainfiles/items?tab=0" },
          { name: "Categories", icon: "ChartBarStacked", path: "main/mainfiles/items?tab=1" },
          { name: "Brands", icon: "Tag", path: "main/mainfiles/items?tab=2" },
          { name: "Items", icon: "Package", path: "main/mainfiles/items?tab=3" },
        ]
      },
      {
        name: "Customer",
        icon: "Users",
        type: "group",
        displayType: "popover",
        roles: ["admin", "owner"],
        items: [
          { name: "Customer Group", icon: "UserCog", path: "main/customer/customer-group" },
          { name: "Salesmen", icon: "UserCheck", path: "main/customer/salesmen" },
          { name: "Customer", icon: "Users", path: "main/customer/customer" },
        ]
      },
      {
        name: "Supplier",
        icon: "Truck",
        type: "group",
        displayType: "popover",
        roles: ["admin", "owner"],
        items: [
          { name: "Supplier Group", icon: "Users", path: "main/supplier/supplier-group" },
          { name: "Suppliers", icon: "Truck", path: "main/supplier/suppliers" },
        ]
      },
    ],
  },
  General_Files: {
    groupIcon: "FolderOpen",
    displayType: "collapsible",
    items: [],
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
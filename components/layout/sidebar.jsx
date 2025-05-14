"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart3,
  BookMarked,
  ChevronDown,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  Package,
  Settings,
  ShieldAlert,
  ShoppingCart,
  Star,
  Users,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export function Sidebar({ userRole, isCollapsed, toggleSidebar }) {
  const { toast } = useToast()
  const [bookmarks, setBookmarks] = useState([])
  const [activeItem, setActiveItem] = useState("dashboard")
  const [openGroups, setOpenGroups] = useState({
    dashboard: true,
    management: false,
    settings: false,
  })

  useEffect(() => {
    // Load bookmarks from localStorage
    const storedBookmarks = localStorage.getItem("sidebarBookmarks")
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks))
    }
  }, [])

  const toggleBookmark = (item) => {
    let newBookmarks
    if (bookmarks.includes(item)) {
      newBookmarks = bookmarks.filter((b) => b !== item)
      toast({
        title: "Bookmark Removed",
        description: `${item} has been removed from bookmarks`,
        variant: "default",
      })
    } else {
      newBookmarks = [...bookmarks, item]
      toast({
        title: "Bookmark Added",
        description: `${item} has been added to bookmarks`,
        variant: "default",
      })
    }
    setBookmarks(newBookmarks)
    localStorage.setItem("sidebarBookmarks", JSON.stringify(newBookmarks))
  }

  const toggleGroup = (group) => {
    setOpenGroups({
      ...openGroups,
      [group]: !openGroups[group],
    })
  }

  // Define menu items based on user role
  const menuItems = {
    dashboard: [
      { name: "Overview", icon: Home, path: "/" },
      { name: "Analytics", icon: BarChart3, path: "/analytics" },
      { name: "Reports", icon: FileText, path: "/reports" },
    ],
    management: [
      { name: "Users", icon: Users, path: "/users", adminOnly: false },
      { name: "Products", icon: Package, path: "/products", adminOnly: false },
      { name: "Orders", icon: ShoppingCart, path: "/orders", adminOnly: false },
      { name: "Invoices", icon: CreditCard, path: "/invoices", adminOnly: false },
      { name: "Customers", icon: Users, path: "/customers", adminOnly: true },
    ],
    settings: [
      { name: "General", icon: Settings, path: "/settings/general", adminOnly: false },
      { name: "Notifications", icon: Bell, path: "/settings/notifications", adminOnly: false },
      { name: "Security", icon: ShieldAlert, path: "/settings/security", adminOnly: false },
      { name: "System", icon: Settings, path: "/settings/system", adminOnly: true },
    ],
    support: [
      { name: "Help Center", icon: LifeBuoy, path: "/help" },
      { name: "Contact Us", icon: Mail, path: "/contact" },
      { name: "Documentation", icon: FileText, path: "/docs" },
    ],
  }

  // Filter items based on user role
  const filterItemsByRole = (items) => {
    return items.filter((item) => !item.adminOnly || userRole === "admin")
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "bg-primary text-primary-foreground h-screen fixed left-0 top-0 z-20 flex flex-col",
          isCollapsed ? "sidebar-collapsed" : "sidebar-expanded",
        )}
      >
        <div className="flex items-center justify-between h-[var(--header-height)] px-4 border-b border-primary-foreground/10">
          <Link href="/" className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
            <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center text-primary font-bold">D</div>
            {!isCollapsed && <span className="font-bold text-lg">Dashboard</span>}
          </Link>
          {/* Removed the duplicate sidebar toggle button */}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {/* Bookmarks Section */}
          {bookmarks.length > 0 && (
            <div className="mb-4">
              <div className={cn("px-4 mb-2", isCollapsed ? "text-center" : "")}>
                {!isCollapsed && <h3 className="text-sm font-medium">Bookmarks</h3>}
                {isCollapsed && <BookMarked className="h-5 w-5 mx-auto" />}
              </div>
              <ul className="space-y-1">
                {bookmarks.map((bookmark) => {
                  const allItems = [
                    ...menuItems.dashboard,
                    ...menuItems.management,
                    ...menuItems.settings,
                    ...menuItems.support,
                  ]
                  const item = allItems.find((i) => i.name === bookmark)
                  if (!item) return null

                  return (
                    <li key={bookmark}>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.path}
                              className="flex justify-center p-2 mx-2 rounded-md hover:bg-primary-foreground/10"
                            >
                              <item.icon className="h-5 w-5" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">{item.name}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Link
                          href={item.path}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-primary-foreground/10 rounded-md mx-2"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
              <div className="border-t border-primary-foreground/10 my-4"></div>
            </div>
          )}

          {/* Dashboard Group */}
          <Collapsible
            open={openGroups.dashboard}
            onOpenChange={() => !isCollapsed && toggleGroup("dashboard")}
            className="mb-2"
          >
            <div className={cn("px-4 mb-1", isCollapsed ? "text-center" : "")}>
              {!isCollapsed ? (
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 w-full text-sm font-medium hover:bg-primary-foreground/10 p-2 rounded-md">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 ml-auto transition-transform duration-200",
                        openGroups.dashboard ? "rotate-180" : "rotate-0",
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => toggleGroup("dashboard")} className="w-full flex justify-center">
                      <LayoutDashboard className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Dashboard</TooltipContent>
                </Tooltip>
              )}
            </div>
            <CollapsibleContent className={cn("space-y-1 mt-1", isCollapsed && "hidden")}>
              {menuItems.dashboard.map((item) => (
                <div key={item.name} className="flex items-center">
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 hover:bg-primary-foreground/10 rounded-md mx-2 flex-1",
                      activeItem === item.name.toLowerCase() && "bg-primary-foreground/10 font-medium",
                    )}
                    onClick={() => setActiveItem(item.name.toLowerCase())}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                  {!isCollapsed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => toggleBookmark(item.name)}
                    >
                      <Star className={cn("h-4 w-4", bookmarks.includes(item.name) ? "fill-current" : "")} />
                    </Button>
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Management Group */}
          <Collapsible
            open={openGroups.management}
            onOpenChange={() => !isCollapsed && toggleGroup("management")}
            className="mb-2"
          >
            <div className={cn("px-4 mb-1", isCollapsed ? "text-center" : "")}>
              {!isCollapsed ? (
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 w-full text-sm font-medium hover:bg-primary-foreground/10 p-2 rounded-md">
                    <Users className="h-5 w-5" />
                    <span>Management</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 ml-auto transition-transform duration-200",
                        openGroups.management ? "rotate-180" : "rotate-0",
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => toggleGroup("management")} className="w-full flex justify-center">
                      <Users className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Management</TooltipContent>
                </Tooltip>
              )}
            </div>
            <CollapsibleContent className={cn("space-y-1 mt-1", isCollapsed && "hidden")}>
              {filterItemsByRole(menuItems.management).map((item) => (
                <div key={item.name} className="flex items-center">
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 hover:bg-primary-foreground/10 rounded-md mx-2 flex-1",
                      activeItem === item.name.toLowerCase() && "bg-primary-foreground/10 font-medium",
                    )}
                    onClick={() => setActiveItem(item.name.toLowerCase())}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                  {!isCollapsed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => toggleBookmark(item.name)}
                    >
                      <Star className={cn("h-4 w-4", bookmarks.includes(item.name) ? "fill-current" : "")} />
                    </Button>
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Settings Group */}
          <Collapsible
            open={openGroups.settings}
            onOpenChange={() => !isCollapsed && toggleGroup("settings")}
            className="mb-2"
          >
            <div className={cn("px-4 mb-1", isCollapsed ? "text-center" : "")}>
              {!isCollapsed ? (
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 w-full text-sm font-medium hover:bg-primary-foreground/10 p-2 rounded-md">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 ml-auto transition-transform duration-200",
                        openGroups.settings ? "rotate-180" : "rotate-0",
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => toggleGroup("settings")} className="w-full flex justify-center">
                      <Settings className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
              )}
            </div>
            <CollapsibleContent className={cn("space-y-1 mt-1", isCollapsed && "hidden")}>
              {filterItemsByRole(menuItems.settings).map((item) => (
                <div key={item.name} className="flex items-center">
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 hover:bg-primary-foreground/10 rounded-md mx-2 flex-1",
                      activeItem === item.name.toLowerCase() && "bg-primary-foreground/10 font-medium",
                    )}
                    onClick={() => setActiveItem(item.name.toLowerCase())}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                  {!isCollapsed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => toggleBookmark(item.name)}
                    >
                      <Star className={cn("h-4 w-4", bookmarks.includes(item.name) ? "fill-current" : "")} />
                    </Button>
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Support Links */}
          <div className="px-4 mb-1 mt-4">
            {!isCollapsed && <h3 className="text-sm font-medium p-2 bg-primary-foreground/5 rounded-md">Support</h3>}
          </div>
          <ul className="space-y-1 mt-1">
            {menuItems.support.map((item) => (
              <li key={item.name}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.path}
                        className="flex justify-center p-2 mx-2 rounded-md hover:bg-primary-foreground/10"
                      >
                        <item.icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  </Tooltip>
                ) : (
                  <div className="flex items-center">
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 hover:bg-primary-foreground/10 rounded-md mx-2 flex-1",
                        activeItem === item.name.toLowerCase() && "bg-primary-foreground/10 font-medium",
                      )}
                      onClick={() => setActiveItem(item.name.toLowerCase())}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => toggleBookmark(item.name)}
                    >
                      <Star className={cn("h-4 w-4", bookmarks.includes(item.name) ? "fill-current" : "")} />
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-primary-foreground/10 p-4">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              className="w-full text-primary-foreground hover:bg-primary-foreground/10 justify-start"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Log out
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart3,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  File,
  MapPin,
  Flag,
  Waypoints, 
  FolderOpen,
  PackageSearch,
  ChartBarStacked,
  FileText,
  Presentation,
  HandCoins,
  Building2,
  ShoppingBasket,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  Settings,
  Users,
  Bell,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/simple-toast"
import { SidebarItem } from "@/components/layout/SidebarItem"
import { menuItems } from "@/constants/menuItems"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Icon mapping for menu items
const iconMap = {
  Home,
  BarChart3,
  FileText,
  Presentation,
  Waypoints,
  MapPin,
  HandCoins,
  Flag,
  PackageSearch,
  ChartBarStacked,
  Building2,
  File,
  ShoppingBasket,                                                                                         
  Users,
  Settings,
  FolderOpen,
  Bell,
  Mail,
  LayoutDashboard,
  LifeBuoy,
}

// Component for rendering bookmarks section
const BookmarksSection = ({ bookmarks, isCollapsed, clearAllBookmarks, handleNavigation, activeItem, iconMap }) => {
  if (bookmarks.length === 0) return null;

  return (
    <div className="mb-4">
      <div className={cn("px-4 mb-2", isCollapsed ? "text-center" : "")}>
        {!isCollapsed && (
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Bookmarks</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllBookmarks} 
              className="h-6 text-xs text-primary-foreground/70 hover:text-primary-foreground"
            >
              Clear All
            </Button>
          </div>
        )}
        {isCollapsed && <BookMarked className="h-5 w-5 mx-auto" />}
      </div>
      <ul className="space-y-1">
        {bookmarks.map((bookmark) => {
          const allItems = getAllMenuItems();
          const item = allItems.find((i) => i.name === bookmark)
          if (!item) return null

          const Icon = iconMap[item.icon]

          return (
            <li key={bookmark}>
              <SidebarItem
                name={item.name}
                icon={Icon}
                path={item.path}
                isCollapsed={isCollapsed}
                isActive={activeItem === item.name.toLowerCase()}
                onNavigate={handleNavigation}
                isBookmarked={bookmarks.includes(item.name)}
              />
            </li>
          )
        })}
      </ul>
      <div className="border-t border-primary-foreground/10 my-4"></div>
    </div>
  );
};

// Component for rendering a group header
const GroupHeader = ({ groupName, GroupIcon, isCollapsed, groupItems, filterItemsByRole, bookmarks, activeItem, handleNavigation, toggleBookmark, iconMap }) => {
  if (!isCollapsed) {
    return (
      <h3 className="text-[15px] font-medium p-2 bg-primary-foreground/5 rounded-md">
        {groupName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </h3>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full flex justify-center p-2 rounded-md transition-colors duration-200 hover:bg-primary-foreground/20 active:bg-primary-foreground/30">
          <GroupIcon className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        side="right" 
        align="start" 
        className="w-56 p-2 bg-primary text-primary-foreground border-primary-foreground/10 border-l-0 shadow-none"
        sideOffset={11}
        alignOffset={-8}
      >
        <div className="space-y-2">
          <h3 className="text-[15px] font-medium px-2 py-1 bg-primary-foreground/5 rounded-md">
            {groupName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </h3>
          <div className="space-y-1">
            {filterItemsByRole(groupItems).map((item) => {
              if (item.type === "group") {
                return (
                  <div key={item.name} className="space-y-1">
                    <h4 className="text-sm font-medium px-2 py-1 text-primary-foreground/70">
                      {item.name}
                    </h4>
                    {item.items.map((subItem) => {
                      const SubIcon = iconMap[subItem.icon];
                      return (
                        <SidebarItem
                          key={subItem.name}
                          name={subItem.name}
                          icon={SubIcon}
                          path={subItem.path}
                          isCollapsed={false}
                          isBookmarked={bookmarks.includes(subItem.name)}
                          isActive={activeItem === subItem.name.toLowerCase()}
                          onNavigate={handleNavigation}
                          onToggleBookmark={toggleBookmark}
                          padding="px-2"
                        />
                      );
                    })}
                  </div>
                );
              }
              
              const Icon = iconMap[item.icon];
              return (
                <SidebarItem
                  key={item.name}
                  name={item.name}
                  icon={Icon}
                  path={item.path}
                  isCollapsed={false}
                  isBookmarked={bookmarks.includes(item.name)}
                  isActive={activeItem === item.name.toLowerCase()}
                  onNavigate={handleNavigation}
                  onToggleBookmark={toggleBookmark}
                  padding="px-2"
                />
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Component for rendering group items
const GroupItems = ({ groupItems, isCollapsed, activeItem, bookmarks, handleNavigation, toggleBookmark, iconMap }) => {
  if (isCollapsed) return null;

  return (
    <ul className="space-y-1 mt-1">
      {groupItems.map((item) => {
        if (item.type === "group") {
          return (
            <li key={item.name}>
              <NestedGroup
                item={item}
                isCollapsed={isCollapsed}
                activeItem={activeItem}
                bookmarks={bookmarks}
                onNavigate={handleNavigation}
                onToggleBookmark={toggleBookmark}
              />
            </li>
          );
        }
        
        const Icon = iconMap[item.icon];
        return (
          <li key={item.name}>
            <SidebarItem
              name={item.name}
              icon={Icon}
              path={item.path}
              isCollapsed={isCollapsed}
              isBookmarked={bookmarks.includes(item.name)}
              isActive={activeItem === item.name.toLowerCase()}
              onNavigate={handleNavigation}
              onToggleBookmark={toggleBookmark}
              padding="px-8"
            />
          </li>
        );
      })}
    </ul>
  );
};

// Component for rendering nested groups
const NestedGroup = ({ item, isCollapsed, activeItem, bookmarks, onNavigate, onToggleBookmark, padding = "px-8" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = iconMap[item.icon];
  const isPopover = item.displayType === "popover";

  if (isPopover) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 w-full text-[15px] font-medium hover:bg-primary-foreground/10 p-2 rounded-md",
              padding
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.name}</span>
            <ChevronRight className={cn("h-4 w-4 ml-auto transition-transform", 
              isOpen ? "rotate-180" : ""
            )} />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          side="right" 
          align="start" 
          className="w-56 p-2 bg-primary text-primary-foreground border-primary-foreground/10 border-l-0 shadow-none"
          sideOffset={-10}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            setIsOpen(false);
          }}
        >
          <div className="space-y-1">
            {item.items.map((subItem) => {
              const SubIcon = iconMap[subItem.icon];
              return (
                <SidebarItem
                  key={subItem.name}
                  name={subItem.name}
                  icon={SubIcon}
                  path={subItem.path}
                  isCollapsed={false}
                  isBookmarked={bookmarks.includes(subItem.name)}
                  isActive={activeItem === subItem.name.toLowerCase()}
                  onNavigate={() => {
                    onNavigate(subItem.name);
                    setIsOpen(false);
                  }}
                  onToggleBookmark={() => {
                    onToggleBookmark(subItem.name);
                  }}
                  padding="px-2"
                />
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 w-full text-[15px] font-medium hover:bg-primary-foreground/10 p-2 rounded-md",
          padding
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{item.name}</span>
        <ChevronRight className={cn("h-4 w-4 ml-auto transition-transform", isOpen ? "rotate-90" : "")} />
      </button>
      {isOpen && (
        <ul className="space-y-1 mt-1">
          {item.items.map((subItem) => {
            const SubIcon = iconMap[subItem.icon];
            return (
              <li key={subItem.name}>
                <SidebarItem
                  name={subItem.name}
                  icon={SubIcon}
                  path={subItem.path}
                  isCollapsed={isCollapsed}
                  isBookmarked={bookmarks.includes(subItem.name)}
                  isActive={activeItem === subItem.name.toLowerCase()}
                  onNavigate={onNavigate}
                  onToggleBookmark={onToggleBookmark}
                  padding="px-12"
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// Component for rendering support section
const SupportSection = ({ isCollapsed, toggleSidebar, menuItems, bookmarks, activeItem, handleNavigation, toggleBookmark, iconMap }) => {
  return (
    <>
      <div className="border-t border-primary-foreground/10 my-4"></div>
      <div className={cn("px-4 mb-2", isCollapsed && "mb-6")}>
        {!isCollapsed && <h3 className="text-[15px] font-medium p-2 bg-primary-foreground/5 rounded-md">Support</h3>}
        {isCollapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-full flex justify-center p-2 rounded-md transition-colors duration-200 hover:bg-primary-foreground/20 active:bg-primary-foreground/30"
                onClick={() => {
                  if (isCollapsed) toggleSidebar();
                }}
              >
                <LifeBuoy className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Support</TooltipContent>
          </Tooltip>
        )}
      </div>
      
      {!isCollapsed && (
        <ul className="space-y-1 mt-1">
          {menuItems.support.items.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <li key={item.name}>
                <SidebarItem
                  name={item.name}
                  icon={Icon}
                  path={item.path}
                  isCollapsed={isCollapsed}
                  isBookmarked={bookmarks.includes(item.name)}
                  isActive={activeItem === item.name.toLowerCase()}
                  onNavigate={handleNavigation}
                  onToggleBookmark={toggleBookmark}
                  padding="px-8"
                />
              </li>
            )
          })}
        </ul>
      )}
    </>
  );
};

// Helper function to get all menu items
const getAllMenuItems = () => {
  const getAllNestedItems = (items) => {
    return items.reduce((acc, item) => {
      if (item.type === "group" && item.items) {
        return [...acc, ...getAllNestedItems(item.items)];
      }
      return [...acc, item];
    }, []);
  };

  return Object.values(menuItems).flatMap(group => {
    if (group.items) {
      return getAllNestedItems(group.items);
    }
    return [];
  });
};

export function Sidebar({ userRole, isCollapsed, toggleSidebar }) {
  const [bookmarks, setBookmarks] = useState([])
  const [activeItem, setActiveItem] = useState("dashboard")
  const [openGroups, setOpenGroups] = useState({
    dashboard: true,
    management: false,
    settings: false,
    testing: false,
  })

  useEffect(() => {
    // Load bookmarks from localStorage
    const storedBookmarks = localStorage.getItem("sidebarBookmarks")
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks))
    }

    // Initialize openGroups state for all menu categories
    const groupKeys = Object.keys(menuItems).filter(key => key !== 'support');
    const initialOpenGroups = groupKeys.reduce((acc, key) => {
      acc[key] = key === 'dashboard'; // Only dashboard is open by default
      return acc;
    }, {});
    
    setOpenGroups(initialOpenGroups);
  }, [])

  const toggleBookmark = (item) => {
    let newBookmarks
    if (bookmarks.includes(item)) {
      newBookmarks = bookmarks.filter((b) => b !== item)
      toast.info({
        title: "Bookmark Removed",
        description: `${item} has been removed from bookmarks`,
        duration: 3000,
      })
    } else {
      newBookmarks = [...bookmarks, item]
      toast.info({
        title: "Bookmark Added",
        description: `${item} has been added to bookmarks`,
        duration: 3000,
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
    
    // If sidebar is collapsed, expand it when clicking a group
    if (isCollapsed) {
      toggleSidebar();
      
      // Set all groups to closed except the clicked one
      const updatedGroups = {};
      Object.keys(openGroups).forEach(key => {
        updatedGroups[key] = (key === group);
      });
      
      setOpenGroups(updatedGroups);
    }
  }

  const handleNavigation = (itemName) => {
    setActiveItem(itemName.toLowerCase())
    
    // Show navigation toast only in collapsed mode to provide feedback
    if (isCollapsed) {
      toast.info({
        title: "Navigating",
        description: `Going to ${itemName}`,
        duration: 2000,
      })
    }
  }
  
  const handleLogout = () => {
    toast.warning({
      title: "Logging Out",
      description: "You are being logged out of the system",
      duration: 3000,
    })
    // Add actual logout logic here
  }

  const clearAllBookmarks = () => {
    if (bookmarks.length === 0) {
      toast.info({
        title: "No Bookmarks",
        description: "You don't have any bookmarks to clear",
        duration: 3000,
      })
      return
    }
    
    setBookmarks([])
    localStorage.removeItem("sidebarBookmarks")
    toast.info({
      title: "Bookmarks Cleared",
      description: "All your bookmarks have been removed",
      duration: 3000,
    })
  }

  // Filter items based on user role
  const filterItemsByRole = (items) => {
    return items.filter((item) => !item.adminOnly || userRole === "admin")
  }

  return (
    <TooltipProvider delayDuration={600}>
      <aside
        className={cn(
          "bg-primary text-primary-foreground h-screen fixed left-0 top-0 z-20 flex flex-col",
          isCollapsed ? "sidebar-collapsed" : "sidebar-expanded",
        )}
      >
        <div className="flex items-center h-[var(--header-height)] px-4 border-b border-primary-foreground/10">
          <div className={cn(
            "flex items-center",
            isCollapsed ? "justify-center w-full" : "justify-start"
          )}>
            <SidebarTrigger collapsed={isCollapsed ? "true" : "false"} onClick={toggleSidebar} />
            {!isCollapsed && <span className="font-bold pl-2 text-lg">Brain</span>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {/* Bookmarks Section */}
          <BookmarksSection
            bookmarks={bookmarks}
            isCollapsed={isCollapsed}
            clearAllBookmarks={clearAllBookmarks}
            handleNavigation={handleNavigation}
            activeItem={activeItem}
            iconMap={iconMap}
          />

          {/* Dynamic Menu Groups */}
          {Object.entries(menuItems).map(([groupName, groupData], index) => {
            if (groupName === 'support') return null;
            
            const groupItems = groupData.items || groupData;
            const GroupIcon = iconMap[groupData.groupIcon] || LayoutDashboard;
            
            return (
              <div key={groupName}>
                {index > 0 && (
                  <div className="border-t border-primary-foreground/10 my-4"></div>
                )}
                
                <div className={cn("px-4 mb-2", isCollapsed ? "text-center" : "")}>
                  <GroupHeader
                    groupName={groupName}
                    GroupIcon={GroupIcon}
                    isCollapsed={isCollapsed}
                    groupItems={groupItems}
                    filterItemsByRole={filterItemsByRole}
                    bookmarks={bookmarks}
                    activeItem={activeItem}
                    handleNavigation={handleNavigation}
                    toggleBookmark={toggleBookmark}
                    iconMap={iconMap}
                  />
                </div>

                <GroupItems
                  groupItems={filterItemsByRole(groupItems)}
                  isCollapsed={isCollapsed}
                  activeItem={activeItem}
                  bookmarks={bookmarks}
                  handleNavigation={handleNavigation}
                  toggleBookmark={toggleBookmark}
                  iconMap={iconMap}
                />
              </div>
            );
          })}

          {/* Support Section */}
          <SupportSection
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
            menuItems={menuItems}
            bookmarks={bookmarks}
            activeItem={activeItem}
            handleNavigation={handleNavigation}
            toggleBookmark={toggleBookmark}
            iconMap={iconMap}
          />
        </div>
          
        {/* Logout Section */}
        <div className="border-t border-primary-foreground/10 p-4">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={handleLogout}
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
              onClick={handleLogout}
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

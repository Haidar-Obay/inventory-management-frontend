// Sidebar.jsx - Main sidebar navigation component for the app
// - Handles bookmarks, menu groups, navigation, and logout
// - Optimized for performance and maintainability

"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  BarChart3,
  BookMarked,
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
  Tag,
  Package,
  UserCog,
  UserCheck,
  Truck,
  Wrench,
  Building,
  Briefcase,
  Route,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/simple-toast";
import {
  SidebarItem,
  SidebarTooltipItem,
} from "@/components/layout/SidebarItem.jsx";
import { useMenuItems } from "@/constants/menuItems";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createPortal } from "react-dom";

import tenantApiService from "@/API/TenantApiService";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

// ================= ICON MAP =================
// Maps string keys to Lucide icons for menu rendering
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
  Tag,
  Package,
  UserCog,
  UserCheck,
  Truck,
  Wrench,
  Building,
  Briefcase,
  Route,
  Newspaper,
};

// ================= MENU ITEM FLATTENING =================
// Helper to flatten all menu items for easy lookup (memoized)
const useAllMenuItems = (t) => {
  const menuItems = useMenuItems(t);
  return useMemo(() => {
    const getAllNestedItems = (items) => {
      return items.reduce((acc, item) => {
        if (item.type === "group" && item.items) {
          return [...acc, ...getAllNestedItems(item.items)];
        }
        return [...acc, { ...item, uniqueId: item.key }];
      }, []);
    };
    return Object.values(menuItems).flatMap((group) => {
      if (group.items) return getAllNestedItems(group.items);
      return [];
    });
  }, [menuItems]);
};

// ================= PORTAL TOOLTIP =================
// Custom tooltip rendered in a portal for sidebar icons
const PortalTooltip = ({ children, content, isRTL, isVisible }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isVisible && children?.current) {
      const childElement = children.current;
      if (
        childElement &&
        typeof childElement.getBoundingClientRect === "function"
      ) {
        const rect = childElement.getBoundingClientRect();
        const newPosition = {
          top: rect.top + rect.height / 2,
          [isRTL ? "right" : "left"]: isRTL
            ? window.innerWidth - rect.left + 8
            : rect.right + 8,
        };
        setPosition(newPosition);
      }
    }
  }, [isVisible, isRTL, children]);

  if (!isVisible) return null;

  const tooltip = (
    <div
      className="fixed z-[999999] px-2 py-1 text-sm text-primary-foreground bg-primary rounded-md border border-white dark:border-black shadow-lg pointer-events-none whitespace-nowrap"
      style={{
        top: position.top,
        [isRTL ? "right" : "left"]: position[isRTL ? "right" : "left"],
        transform: "translateY(-50%)",
      }}
    >
      {content}
    </div>
  );

  return createPortal(tooltip, document.body);
};

// ================= BOOKMARKS SECTION =================
// Renders the bookmarks area at the top of the sidebar
const BookmarksSection = ({
  bookmarks,
  isCollapsed,
  clearAllBookmarks,
  handleNavigation,
  activeItem,
  iconMap,
  t,
  isRTL,
  onToggleBookmark,
  isExpanded,
  onToggle,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const buttonRef = useRef(null);

  // Use the GetAllMenuItems helper
  const allItems = useAllMenuItems(t);

  if (bookmarks.length === 0) return null;

  return (
    <div>
      <div className={cn("px-4 mb-2", isCollapsed ? "text-center" : "")}>
        {!isCollapsed && (
          <div className="flex items-center justify-between">
            <button
              onClick={onToggle}
              className="flex items-center justify-between w-full text-sm font-medium hover:text-primary-foreground/80 transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <BookMarked
                  className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")}
                />
                <h3 className="text-sm font-medium">{t("bookmarks")}</h3>
              </div>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isRTL ? "rotate-180" : "",
                  isExpanded ? "rotate-90" : ""
                )}
              />
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllBookmarks}
              className="h-6 text-xs text-primary-foreground/70 hover:text-primary-foreground whitespace-nowrap"
            >
              {t("clearAll")}
            </Button>
          </div>
        )}
        {isCollapsed && (
          <div className="relative group">
            <div
              ref={buttonRef}
              className="flex flex-col items-center gap-1"
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              <BookMarked className="h-5 w-5 mx-auto" />
            </div>
            {/* Portal Tooltip */}
            <PortalTooltip
              children={buttonRef}
              content={t("bookmarks")}
              isRTL={isRTL}
              isVisible={tooltipVisible}
            />
          </div>
        )}
      </div>
      <Collapsible open={isExpanded}>
        <CollapsibleContent>
          <ul className="space-y-1">
            {bookmarks.map((bookmarkId) => {
              const item = allItems.find((i) => i.uniqueId === bookmarkId);
              if (!item) return null;

              const Icon = iconMap[item.icon];

              return (
                <li key={bookmarkId}>
                  <SidebarItem
                    name={item.name}
                    icon={Icon}
                    path={item.path}
                    uniqueId={item.uniqueId}
                    isCollapsed={isCollapsed}
                    isActive={activeItem === item.name.toLowerCase()}
                    onNavigate={handleNavigation}
                    onToggleBookmark={onToggleBookmark}
                    isBookmarked={bookmarks.includes(item.uniqueId)}
                    t={t}
                    isRTL={isRTL}
                    className="text-sm"
                  />
                </li>
              );
            })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
      <div className="border-t border-primary-foreground/10 my-4"></div>
    </div>
  );
};

// ================= GROUP HEADER =================
// Renders a group header (collapsible or popover)
const GroupHeader = ({
  groupName,
  GroupIcon,
  isCollapsed,
  groupItems,
  filterItemsByRole,
  bookmarks,
  activeItem,
  handleNavigation,
  toggleBookmark,
  iconMap,
  t,
  isMainFiles = false,
  isRTL,
  isSupport = false,
  isExpanded,
  onToggleGroup,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [nestedPopoverOpen, setNestedPopoverOpen] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const buttonRef = useRef(null);
  const params = useParams();
  const router = useRouter();

  // Get all items with proper uniqueId
  const allItems = useAllMenuItems(t);

  const getFullPath = (path) => {
    if (path.startsWith("/")) {
      return path;
    }
    if (path.startsWith("main")) {
      return `/${path}`;
    }
    return `/${params?.route}/${path}`;
  };

  // Hide tooltip when popover opens
  useEffect(() => {
    if (popoverOpen) {
      setTooltipVisible(false);
    }
  }, [popoverOpen]);

  // Enhanced navigation handler for popovers
  const handlePopoverNavigation = (itemName) => {
    handleNavigation(itemName);
    // Always close popovers when navigating
    setPopoverOpen(false);
    setNestedPopoverOpen(null);
  };

  if (!isCollapsed) {
    return (
      <div className="px-4 mb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onToggleGroup(groupName)}
            className={cn(
              "flex items-center justify-between w-full text-sm font-medium hover:text-primary-foreground/80 transition-colors duration-200",
              isCollapsed ? "" : "h-10"
            )}
          >
            <div className="flex items-center gap-2">
              <GroupIcon className={cn(isCollapsed ? "h-4 w-4" : "h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              <span className={cn("text-sm")}>{groupName}</span>
            </div>
            <ChevronRight
              className={cn(
                isCollapsed ? "h-4 w-4" : "h-4 w-4",
                "transition-transform duration-200",
                isRTL ? "rotate-180" : "",
                isExpanded ? "rotate-90" : ""
              )}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Single button with tooltip and popover */}
      <div className="relative group">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              ref={buttonRef}
              type="button"
              className="w-full flex justify-center p-2 rounded-md transition-colors duration-200 hover:bg-primary-foreground/20 active:bg-primary-foreground/30"
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              <GroupIcon className="h-5 w-5" />
            </button>
          </PopoverTrigger>
                <PopoverContent
        side={isRTL ? "left" : "right"}
        align="start"
        className="w-60 p-1 bg-primary text-primary-foreground border-primary-foreground/10 border-l-0 shadow-none"
        sideOffset={18}
        alignOffset={-8}
      >
            <div className="space-y-1">
              <h3 className="text-sm font-medium px-2 py-1 bg-primary-foreground/5 rounded-md">
                {groupName}
              </h3>
              <div className="space-y-0.5">
                {filterItemsByRole(groupItems).map((item) => {
                  if (item.type === "group") {
                    const ItemIcon = iconMap[item.icon];
                    return (
                      <Popover
                        key={item.name}
                        open={nestedPopoverOpen === item.name}
                        onOpenChange={(open) =>
                          setNestedPopoverOpen(open ? item.name : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <button className="w-full flex items-center justify-between px-2 py-1 text-sm rounded-md hover:bg-primary-foreground/10 transition-colors duration-200">
                            <div className="flex items-center gap-2">
                              {ItemIcon && <ItemIcon className="h-4 w-4" />}
                              <span>{item.name}</span>
                            </div>
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isRTL ? "rotate-180" : "",
                                nestedPopoverOpen === item.name
                                  ? "rotate-90"
                                  : ""
                              )}
                            />
                          </button>
                        </PopoverTrigger>
                                <PopoverContent
          side={isRTL ? "left" : "right"}
          align="start"
          className="w-60 p-1 bg-primary text-primary-foreground border-primary-foreground/10 border-l-0 shadow-none"
          sideOffset={3}
          alignOffset={8}
        >
                          <div className="space-y-0.5">
                            {item.items.map((subItem) => {
                              const SubIcon = iconMap[subItem.icon];
                              // Find the subItem with proper uniqueId from allItems
                              const processedSubItem = allItems.find(
                                (i) =>
                                  i.name === subItem.name &&
                                  i.path === subItem.path
                              );
                              const uniqueId =
                                processedSubItem?.uniqueId || subItem.key;

                              return (
                                <SidebarItem
                                  key={subItem.name}
                                  name={subItem.name}
                                  icon={SubIcon}
                                  path={subItem.path}
                                  uniqueId={uniqueId}
                                  isCollapsed={false}
                                  isBookmarked={bookmarks.includes(uniqueId)}
                                  isActive={
                                    activeItem === subItem.name.toLowerCase()
                                  }
                                  onNavigate={() =>
                                    handlePopoverNavigation(subItem.name)
                                  }
                                  onToggleBookmark={() =>
                                    toggleBookmark(subItem.name)
                                  }
                                  padding="px-2"
                                  className="whitespace-nowrap text-sm"
                                  t={t}
                                  isRTL={isRTL}
                                  compact={true}
                                />
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  }

                  const Icon = iconMap[item.icon];
                  // Find the item with proper uniqueId from allItems
                  const processedItem = allItems.find(
                    (i) => i.name === item.name && i.path === item.path
                  );
                  const uniqueId = processedItem?.uniqueId || item.key;

                  return (
                    <SidebarItem
                      key={item.name}
                      name={item.name}
                      icon={Icon}
                      path={item.path}
                      uniqueId={uniqueId}
                      isCollapsed={false}
                      isBookmarked={bookmarks.includes(uniqueId)}
                      isActive={activeItem === item.name.toLowerCase()}
                      onNavigate={() => handlePopoverNavigation(item.name)}
                      onToggleBookmark={() => toggleBookmark(item.name)}
                      padding="px-2"
                      className="whitespace-nowrap text-sm"
                      t={t}
                      isRTL={isRTL}
                      compact={true}
                    />
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Portal Tooltip */}
        <PortalTooltip
          children={buttonRef}
          content={groupName}
          isRTL={isRTL}
          isVisible={tooltipVisible}
        />
      </div>
    </div>
  );
};

// ================= GROUP ITEMS =================
// Renders the items within a group (collapsible or popover)
const GroupItems = ({
  groupItems,
  isCollapsed,
  activeItem,
  bookmarks,
  handleNavigation,
  toggleBookmark,
  iconMap,
  t,
  isMainFiles = false,
  isRTL,
  isExpanded,
  expandedSubGroups,
  onToggleSubGroup,
}) => {
  if (isCollapsed || !isExpanded) return null;

  // Get all items with proper uniqueId
  const allItems = useAllMenuItems(t);

  return (
    <ul className={cn("mt-1", isCollapsed ? "space-y-1" : "space-y-0.5")}>
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
                t={t}
                isMainFiles={isMainFiles}
                isRTL={isRTL}
                isExpanded={expandedSubGroups[item.key] || false}
                onToggleSubGroup={onToggleSubGroup}
              />
            </li>
          );
        }

        const Icon = iconMap[item.icon];
        // Find the item with proper uniqueId from allItems
        const processedItem = allItems.find(
          (i) => i.name === item.name && i.path === item.path
        );
        const uniqueId = processedItem?.uniqueId || item.key;

        return (
          <li key={item.name}>
            <SidebarItem
              name={item.name}
              icon={Icon}
              path={item.path}
              uniqueId={uniqueId}
              isCollapsed={isCollapsed}
              isBookmarked={bookmarks.includes(uniqueId)}
              isActive={activeItem === item.name.toLowerCase()}
              onNavigate={handleNavigation}
              onToggleBookmark={toggleBookmark}
                                padding={
                    isMainFiles
                      ? isRTL
                        ? "pr-8"
                        : "pl-8"
                      : isRTL
                        ? "pr-20"
                        : "pl-20"
                  }
                  t={t}
                  isRTL={isRTL}
            />
          </li>
        );
      })}
    </ul>
  );
};

// ================= NESTED GROUP =================
// Renders nested groups (submenus)
const NestedGroup = ({
  item,
  isCollapsed,
  activeItem,
  bookmarks,
  onNavigate,
  onToggleBookmark,
  padding = "px-8",
  t,
  isMainFiles = false,
  isRTL,
  isExpanded,
  onToggleSubGroup,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const buttonRef = useRef(null);

  const handlePopoverOpen = (e) => {
    e.preventDefault();
    onToggleSubGroup(item.key || item.name);
    setTooltipVisible(false); // Hide tooltip when popover opens
  };

  const handlePopoverClose = (e) => {
    e.preventDefault();
    onToggleSubGroup(item.key || item.name);
  };

  const handleNavigate = (itemName) => {
    onNavigate(itemName);
    // Always close popovers when navigating
    setPopoverOpen(false);
  };

  // Get all items with proper uniqueId
  const allItems = useAllMenuItems(t);

  const renderPopover = () => (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          ref={buttonRef}
          className={cn(
            "flex items-center justify-between w-full text-[15px] font-medium hover:bg-primary-foreground/10 rounded-md",
            isMainFiles ? "p-2" : "px-6 py-3"
          )}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <span className="text-sm">{item.name}</span>
          </div>
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isRTL ? "rotate-180" : "",
              isExpanded ? "rotate-90" : ""
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="w-60 p-1 bg-primary text-primary-foreground border-primary-foreground/10 border-l-0 shadow-none"
        sideOffset={-3}
        onOpenAutoFocus={handlePopoverOpen}
        onCloseAutoFocus={handlePopoverClose}
      >
        <div className={cn("", isCollapsed ? "space-y-0.5" : "space-y-0.5")}>
          {item.items.map((subItem) => {
            const SubIcon = iconMap[subItem.icon];
            // Find the subItem with proper uniqueId from allItems
            const processedSubItem = allItems.find(
              (i) => i.name === subItem.name && i.path === subItem.path
            );
            const uniqueId = processedSubItem?.uniqueId || subItem.key;

            return (
              <SidebarItem
                key={subItem.name}
                name={subItem.name}
                icon={SubIcon}
                path={subItem.path}
                uniqueId={uniqueId}
                isCollapsed={false}
                isBookmarked={bookmarks.includes(uniqueId)}
                isActive={activeItem === subItem.name.toLowerCase()}
                onNavigate={() => handleNavigate(subItem.name)}
                onToggleBookmark={() => onToggleBookmark(subItem.name)}
                padding={
                  isMainFiles
                    ? isRTL
                      ? "pr-8"
                      : "pl-8"
                    : isRTL
                      ? "pr-20"
                      : "pl-20"
                }
                className="whitespace-nowrap text-sm"
                t={t}
                isRTL={isRTL}
                compact={!isCollapsed}
              />
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );

  const Icon = iconMap[item.icon];
  const isPopover = item.displayType === "popover";

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-1">
        {/* Single button with tooltip and popover */}
        <div className="relative group">
          {isPopover ? (
            renderPopover()
          ) : (
            <button
              ref={buttonRef}
              className="w-full flex justify-center p-2 rounded-md transition-colors duration-200 hover:bg-primary-foreground/20 active:bg-primary-foreground/30"
              onClick={() => onToggleSubGroup(item.key || item.name)}
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              <Icon className="h-5 w-5" />
            </button>
          )}

          {/* Portal Tooltip */}
          <PortalTooltip
            children={buttonRef}
            content={item.name}
            isRTL={isRTL}
            isVisible={tooltipVisible}
          />
        </div>
      </div>
    );
  }

  return isPopover ? (
    renderPopover()
  ) : (
    <div>
      <CollapsibleTrigger
        className={cn("group flex w-full items-center min-w-0", isCollapsed ? "h-12" : "h-8")}
        onClick={() => onToggleSubGroup(item.key || item.name)}
      >
        <div
          className={cn(
            "flex items-center flex-1 h-full rounded-md hover:bg-primary-foreground/10 transition-colors duration-200 min-w-0 overflow-x-auto scrollbar-hide",
            activeItem === item.name.toLowerCase() &&
              "bg-primary-foreground/10 font-medium",
            padding,
            isRTL ? "pr-6" : "pl-6"
          )}
        >
          <Icon
            className={cn(isCollapsed ? "h-4 w-4" : "h-3 w-3", "flex-shrink-0", isRTL ? "ml-2" : "mr-2")}
          />
          <span className={cn("whitespace-nowrap", isCollapsed ? "" : "text-sm")}>{item.name}</span>
        </div>
        <ChevronRight
          className={cn(
            isCollapsed ? "h-4 w-4" : "h-3 w-3",
            "transition-transform flex-shrink-0",
            isRTL ? "rotate-180" : "",
            isExpanded ? "rotate-90" : ""
          )}
        />
      </CollapsibleTrigger>
      {isExpanded && (
        <ul className={cn("mt-1", isCollapsed ? "space-y-1" : "space-y-0.5")}>
          {item.items.map((subItem) => {
            const SubIcon = iconMap[subItem.icon];
            // Find the subItem with proper uniqueId from allItems
            const processedSubItem = allItems.find(
              (i) => i.name === subItem.name && i.path === subItem.path
            );
            const uniqueId = processedSubItem?.uniqueId || subItem.key;

            return (
              <li key={subItem.name}>
                <SidebarItem
                  name={subItem.name}
                  icon={SubIcon}
                  path={subItem.path}
                  uniqueId={uniqueId}
                  isCollapsed={isCollapsed}
                  isBookmarked={bookmarks.includes(uniqueId)}
                  isActive={activeItem === subItem.name.toLowerCase()}
                  onNavigate={onNavigate}
                  onToggleBookmark={onToggleBookmark}
                  padding={
                    isMainFiles
                      ? isRTL
                        ? "pr-8"
                        : "pl-8"
                      : isRTL
                        ? "pr-12"
                        : "pl-12"
                  }
                  t={t}
                  isRTL={isRTL}
                  compact={!isCollapsed}
                  className="text-sm"
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// ================= SIDEBAR MAIN COMPONENT =================
export function Sidebar({ isCollapsed, toggleSidebar, isRTL, ...rest }) {
  // ====== HOOKS & STATE ======
  const t = useTranslations("sidebar");
  const router = useRouter();
  const params = useParams();
  const [bookmarks, setBookmarks] = useState([]);
  const [activeItem, setActiveItem] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedSubGroups, setExpandedSubGroups] = useState({});
  const [userRole, setUserRole] = useState("user");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const logoutButtonRef = useRef(null);
  const menuItems = useMenuItems(t);
  const [isBookmarksExpanded, setIsBookmarksExpanded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  // Memoized all menu items for fast lookup
  const allItems = useAllMenuItems(t);

  // ====== EFFECTS: LOAD STATE FROM LOCALSTORAGE ======
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Load bookmarks from localStorage
    const storedBookmarks = localStorage.getItem("sidebarBookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }

    // Load expanded groups state from localStorage
    const storedExpandedGroups = localStorage.getItem("sidebarExpandedGroups");
    if (storedExpandedGroups) {
      setExpandedGroups(JSON.parse(storedExpandedGroups));
    }

    // Load expanded sub-groups state from localStorage
    const storedExpandedSubGroups = localStorage.getItem(
      "sidebarExpandedSubGroups"
    );
    if (storedExpandedSubGroups) {
      setExpandedSubGroups(JSON.parse(storedExpandedSubGroups));
    }

    // Load bookmarks expanded state from localStorage
    const storedBookmarksExpanded = localStorage.getItem(
      "sidebarBookmarksExpanded"
    );
    if (storedBookmarksExpanded !== null) {
      const parsedValue = JSON.parse(storedBookmarksExpanded);
      setIsBookmarksExpanded(parsedValue);
    } else {
      // If no saved state exists, default to expanded (true) but don't save it yet
      setIsBookmarksExpanded(true);
    }

    // Mark as initialized after loading all states
    setIsInitialized(true);

    // Set default role to "user" if no role is found in cookies
    const getRoleFromCookies = () => {
      const cookies = document.cookie.split(";");
      const roleCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("userRole=")
      );
      if (roleCookie) {
        const role = roleCookie.split("=")[1];
        setUserRole(role);
      } else {
        setUserRole("user"); // Set default role if none found
      }
    };

    getRoleFromCookies();

    // Initialize expandedGroups state for all menu categories if no saved state exists
    if (!storedExpandedGroups) {
      const initialExpandedGroups = {};
      Object.entries(menuItems).forEach(([translatedKey, groupData]) => {
        const languageAgnosticKey = groupData.key || translatedKey;
        initialExpandedGroups[languageAgnosticKey] = true; // Expand all groups by default
      });

      setExpandedGroups(initialExpandedGroups);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          "sidebarExpandedGroups",
          JSON.stringify(initialExpandedGroups)
        );
      }
    }
  }, []);

  // ====== EFFECTS: SAVE STATE TO LOCALSTORAGE ======
  useEffect(() => {
    // Only save after initialization to prevent overwriting during initial load
    if (isInitialized && Object.keys(expandedGroups).length > 0 && typeof window !== 'undefined') {
      localStorage.setItem(
        "sidebarExpandedGroups",
        JSON.stringify(expandedGroups)
      );
    }
  }, [expandedGroups, isInitialized, isRTL]);
  useEffect(() => {
    // Only save after initialization to prevent overwriting during initial load
    if (isInitialized && Object.keys(expandedSubGroups).length > 0 && typeof window !== 'undefined') {
      localStorage.setItem(
        "sidebarExpandedSubGroups",
        JSON.stringify(expandedSubGroups)
      );
    }
  }, [expandedSubGroups, isInitialized, isRTL]);
  useEffect(() => {
    // Only save after initialization to prevent overwriting during initial load
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(
        "sidebarBookmarksExpanded",
        JSON.stringify(isBookmarksExpanded)
      );
    }
  }, [isBookmarksExpanded, isInitialized, isRTL]);

  // ====== HANDLERS (memoized with useCallback) ======
  const toggleBookmark = useCallback((itemName) => {
    const item = allItems.find((i) => i.name === itemName);
    if (!item) return;
    let newBookmarks;
    if (bookmarks.includes(item.uniqueId)) {
      newBookmarks = bookmarks.filter((b) => b !== item.uniqueId);
      toast.info({ title: "info", description: "sidebarInfo", isTranslated: true });
    } else {
      newBookmarks = [...bookmarks, item.uniqueId];
      toast.info({ title: "info", description: "sidebarInfo", isTranslated: true });
    }
    setBookmarks(newBookmarks);
    localStorage.setItem("sidebarBookmarks", JSON.stringify(newBookmarks));
  }, [allItems, bookmarks]);

  const toggleGroup = useCallback((group) => {
    // Find the language-agnostic key for this group
    const groupKey = Object.keys(menuItems).find((key) => key === group);
    const groupData = menuItems[groupKey];
    const languageAgnosticKey = groupData?.key || group;

    const newExpandedGroups = {
      ...expandedGroups,
      [languageAgnosticKey]: !expandedGroups[languageAgnosticKey],
    };
    setExpandedGroups(newExpandedGroups);

    // If sidebar is collapsed, expand it when clicking a group
    if (isCollapsed) {
      toggleSidebar();

      // Set all groups to collapsed except the clicked one
      const updatedGroups = {};
      Object.keys(expandedGroups).forEach((key) => {
        updatedGroups[key] = key === languageAgnosticKey;
      });

      setExpandedGroups(updatedGroups);
    }
  }, [expandedGroups, isCollapsed, menuItems, toggleSidebar]);

  const toggleSubGroup = useCallback((subGroupName) => {
    // Find the language-agnostic key for this sub-group
    // Since subGroupName is the translated name, we need to find the item by name and get its key
    let languageAgnosticKey = subGroupName;

    // Search through all menu items to find the sub-group by its translated name
    Object.values(menuItems).forEach((groupData) => {
      if (groupData.items) {
        groupData.items.forEach((item) => {
          if (item.name === subGroupName && item.key) {
            languageAgnosticKey = item.key;
          }
        });
      }
    });

    const newExpandedSubGroups = {
      ...expandedSubGroups,
      [languageAgnosticKey]: !expandedSubGroups[languageAgnosticKey],
    };
    setExpandedSubGroups(newExpandedSubGroups);
  }, [expandedSubGroups, menuItems]);

  const toggleBookmarks = useCallback(() => {
    const newState = !isBookmarksExpanded;
    setIsBookmarksExpanded(newState);
  }, [isBookmarksExpanded, isRTL]);

  const handleNavigation = useCallback((itemName) => {
    setActiveItem(itemName.toLowerCase());
    const item = allItems.find((i) => i.name === itemName);
    if (item && item.path) {
      const fullPath = item.path.startsWith("/") ? item.path : `/${params?.route}/${item.path}`;
      router.push(fullPath);
    }
  }, [allItems, params?.route, router]);

  const handleLogout = useCallback(async () => {
    try {
      // Get token before making the API call
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("tenant_token="))
        ?.split("=")[1];

      if (!token) {
        // If no token, just clear cookies and redirect
        clearCookies();
        router.push("/login");
        return;
      }

      const response = await tenantApiService("POST", "logout");

      // Clear cookies after successful API call
      clearCookies();

      toast.success({
        title: "success",
        description: "sidebarSuccess",
        isTranslated: true,
      });

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear cookies and redirect
      clearCookies();
      toast.error({
        title: "error",
        description: "sidebarError",
        isTranslated: true,
      });
      router.push("/login");
    }
  }, [router]);

  // Helper function to clear all cookies
  const clearCookies = useCallback(() => {
    document.cookie =
      "tenant_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "tenantName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "tenantId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "tenantEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "tenantPassword=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }, []);

  const clearAllBookmarks = useCallback(() => {
    if (bookmarks.length === 0) {
      toast.info({
        title: "info",
        description: "sidebarInfo",
        isTranslated: true,
      });
      return;
    }

    setBookmarks([]);
    localStorage.removeItem("sidebarBookmarks");
    toast.info({
      title: "info",
      description: "sidebarInfo",
      isTranslated: true,
    });
  }, [bookmarks]);

  // ====== FILTER ITEMS BY ROLE (currently passthrough) ======
  const filterItemsByRole = useCallback((items) => items, []);

  // ====== RENDER ======
  return (
    <TooltipProvider delayDuration={600}>
      <aside
        className={cn(
          "bg-primary text-primary-foreground h-full flex flex-col",
          isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
        )}
      >
        <div className="flex items-center h-[var(--header-height)] px-4 border-b border-primary-foreground/10">
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center w-full" : "justify-start"
            )}
          >
            <SidebarTrigger
              collapsed={isCollapsed ? "true" : "false"}
              onClick={toggleSidebar}
            />
            {!isCollapsed && (
              <span className="font-bold pl-2 text-lg">Brain</span>
            )}
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
            t={t}
            isRTL={isRTL}
            onToggleBookmark={toggleBookmark}
            isExpanded={isBookmarksExpanded}
            onToggle={toggleBookmarks}
          />

          {/* Dynamic Menu Groups */}
          {Object.entries(menuItems).map(([groupName, groupData], index) => {
            const groupItems = groupData.items || groupData;
            const GroupIcon = iconMap[groupData.groupIcon] || LayoutDashboard;
            const isMainFiles = groupName.toLowerCase().includes("mainfiles");
            const isSupport = groupData.groupIcon === "LifeBuoy";

            // Filter items based on role
            const filteredItems = filterItemsByRole(groupItems);

            // Skip rendering if no items are available for this role
            if (filteredItems.length === 0) return null;

            return (
              <div key={groupName}>
                {/* Add separator before support section */}
                {isSupport && (
                  <div className="border-t border-primary-foreground/10 my-4"></div>
                )}
                <div className="mb-4">
                  <GroupHeader
                    groupName={groupName}
                    GroupIcon={GroupIcon}
                    isCollapsed={isCollapsed}
                    groupItems={filteredItems}
                    filterItemsByRole={filterItemsByRole}
                    bookmarks={bookmarks}
                    activeItem={activeItem}
                    handleNavigation={handleNavigation}
                    toggleBookmark={toggleBookmark}
                    iconMap={iconMap}
                    t={t}
                    isMainFiles={isMainFiles}
                    isRTL={isRTL}
                    isSupport={isSupport}
                    isExpanded={expandedGroups[groupData.key || groupName]}
                    onToggleGroup={toggleGroup}
                  />
                  <GroupItems
                    groupItems={filteredItems}
                    isCollapsed={isCollapsed}
                    activeItem={activeItem}
                    bookmarks={bookmarks}
                    handleNavigation={handleNavigation}
                    toggleBookmark={toggleBookmark}
                    iconMap={iconMap}
                    t={t}
                    isMainFiles={isMainFiles}
                    isRTL={isRTL}
                    isExpanded={expandedGroups[groupData.key || groupName]}
                    expandedSubGroups={expandedSubGroups}
                    onToggleSubGroup={toggleSubGroup}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Logout Section */}
        <div className="border-t border-primary-foreground/10 p-4">
          {isCollapsed ? (
            <div className="relative group">
              <Button
                ref={logoutButtonRef}
                variant="ghost"
                size="icon"
                className="w-full text-primary-foreground hover:bg-primary-foreground/10"
                onClick={handleLogout}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <LogOut className="h-5 w-5" />
              </Button>
              {/* Portal Tooltip */}
              <PortalTooltip
                children={logoutButtonRef}
                content={t("logout")}
                isRTL={isRTL}
                isVisible={tooltipVisible}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full text-primary-foreground hover:bg-primary-foreground/10 justify-start"
              onClick={handleLogout}
            >
              <LogOut className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t("logout")}
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
// ================= END SIDEBAR =================

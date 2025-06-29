"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "@/components/layout/SidebarItem";
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
  Tag,
  Package,
  UserCog,
  UserCheck,
  Truck,
  Wrench,
  Building,
  Briefcase,
};

// Helper function to get all menu items
const GetAllMenuItems = (t) => {
  const getAllNestedItems = (items) => {
    return items.reduce((acc, item) => {
      if (item.type === "group" && item.items) {
        return [...acc, ...getAllNestedItems(item.items)];
      }
      // Add a unique identifier that doesn't change with language
      const itemWithId = {
        ...item,
        uniqueId: item.key,
      };
      return [...acc, itemWithId];
    }, []);
  };

  return Object.values(useMenuItems(t)).flatMap((group) => {
    if (group.items) {
      return getAllNestedItems(group.items);
    }
    return [];
  });
};

// Custom Tooltip Component using Portal
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

// Component for rendering bookmarks section
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

  if (bookmarks.length === 0) return null;

  // Use the GetAllMenuItems helper
  const allItems = GetAllMenuItems(t);

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

// Component for rendering a group header
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
  const allItems = GetAllMenuItems(t);

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

  if (!isCollapsed) {
    return (
      <div className="px-4 mb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onToggleGroup(groupName)}
            className="flex items-center justify-between w-full text-sm font-medium hover:text-primary-foreground/80 transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <GroupIcon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              <span>{groupName}</span>
            </div>
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform duration-200",
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
            className="w-48 p-1 bg-primary text-primary-foreground border-primary-foreground/10 border-l-0 shadow-none"
            sideOffset={-2}
            alignOffset={-8}
          >
            <div className="space-y-1">
              <h3 className="text-[15px] font-medium px-2 py-1 bg-primary-foreground/5 rounded-md">
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
                                "h-4 w-4",
                                isRTL ? "rotate-180" : ""
                              )}
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          side={isRTL ? "left" : "right"}
                          align="start"
                          className="w-48 p-1 bg-primary text-primary-foreground border-primary-foreground/10 border-l-0 shadow-none"
                          sideOffset={-1}
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
                                  onNavigate={() => {
                                    handleNavigation(subItem.name);
                                    setPopoverOpen(false);
                                    setNestedPopoverOpen(null);
                                  }}
                                  onToggleBookmark={() =>
                                    toggleBookmark(subItem.name)
                                  }
                                  padding="px-2"
                                  className="whitespace-nowrap"
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
                      onNavigate={() => {
                        handleNavigation(item.name);
                        setPopoverOpen(false);
                      }}
                      onToggleBookmark={() => toggleBookmark(item.name)}
                      padding="px-2"
                      className="whitespace-nowrap"
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

// Component for rendering group items
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
}) => {
  if (isCollapsed || !isExpanded) return null;

  // Get all items with proper uniqueId
  const allItems = GetAllMenuItems(t);

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
                t={t}
                isMainFiles={isMainFiles}
                isRTL={isRTL}
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

// Component for rendering nested groups
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const buttonRef = useRef(null);

  const handlePopoverOpen = (e) => {
    e.preventDefault();
    setIsOpen(true);
    setTooltipVisible(false); // Hide tooltip when popover opens
  };

  const handlePopoverClose = (e) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const handleNavigate = (itemName) => {
    onNavigate(itemName);
    setIsOpen(false);
  };

  // Get all items with proper uniqueId
  const allItems = GetAllMenuItems(t);

  const renderPopover = () => (
    <Popover>
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
            <span>{item.name}</span>
          </div>
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isRTL ? "rotate-180" : "",
              isOpen ? "rotate-90" : ""
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="w-48 p-1 bg-primary text-primary-foreground border-primary-foreground/10 border-l-0 shadow-none"
        sideOffset={-10}
        onOpenAutoFocus={handlePopoverOpen}
        onCloseAutoFocus={handlePopoverClose}
      >
        <div className="space-y-0.5">
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
                      ? "pr-12"
                      : "pl-12"
                }
                className="whitespace-nowrap"
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
              onClick={() => setIsOpen(!isOpen)}
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
        className="group flex w-full items-center h-12 min-w-0"
        onClick={() => setIsOpen(!isOpen)}
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
            className={cn("h-4 w-4 flex-shrink-0", isRTL ? "ml-2" : "mr-2")}
          />
          <span className="whitespace-nowrap">{item.name}</span>
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform flex-shrink-0",
            isRTL ? "rotate-180" : "",
            isOpen ? "rotate-90" : ""
          )}
        />
      </CollapsibleTrigger>
      {isOpen && (
        <ul className="space-y-1 mt-1">
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
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export function Sidebar({ isCollapsed, toggleSidebar, isRTL, ...rest }) {
  const t = useTranslations("sidebar");
  const router = useRouter();
  const params = useParams();
  const [bookmarks, setBookmarks] = useState([]);
  const [activeItem, setActiveItem] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [userRole, setUserRole] = useState("user");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const logoutButtonRef = useRef(null);
  const menuItems = useMenuItems(t);
  const [isBookmarksExpanded, setIsBookmarksExpanded] = useState(true);

  useEffect(() => {
    // Load bookmarks from localStorage
    const storedBookmarks = localStorage.getItem("sidebarBookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }

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

    // Initialize expandedGroups state for all menu categories
    const groupKeys = Object.keys(menuItems);
    const initialExpandedGroups = groupKeys.reduce((acc, key) => {
      acc[key] = true; // Expand all groups by default
      return acc;
    }, {});

    setExpandedGroups(initialExpandedGroups);
  }, []);

  const toggleBookmark = (itemName) => {
    const allItems = GetAllMenuItems(t);
    const item = allItems.find((i) => i.name === itemName);
    if (!item) return;

    let newBookmarks;
    if (bookmarks.includes(item.uniqueId)) {
      newBookmarks = bookmarks.filter((b) => b !== item.uniqueId);
      toast.info({
        title: "info",
        description: "sidebarInfo",
        isTranslated: true,
      });
    } else {
      newBookmarks = [...bookmarks, item.uniqueId];
      toast.info({
        title: "info",
        description: "sidebarInfo",
        isTranslated: true,
      });
    }
    setBookmarks(newBookmarks);
    localStorage.setItem("sidebarBookmarks", JSON.stringify(newBookmarks));
  };

  const toggleGroup = (group) => {
    setExpandedGroups({
      ...expandedGroups,
      [group]: !expandedGroups[group],
    });

    // If sidebar is collapsed, expand it when clicking a group
    if (isCollapsed) {
      toggleSidebar();

      // Set all groups to collapsed except the clicked one
      const updatedGroups = {};
      Object.keys(expandedGroups).forEach((key) => {
        updatedGroups[key] = key === group;
      });

      setExpandedGroups(updatedGroups);
    }
  };

  const toggleBookmarks = () => {
    setIsBookmarksExpanded(!isBookmarksExpanded);
  };

  const handleNavigation = (itemName) => {
    setActiveItem(itemName.toLowerCase());

    // Find the item in the menu items
    const allItems = GetAllMenuItems(t);
    const item = allItems.find((i) => i.name === itemName);

    if (item && item.path) {
      // Get the full path
      const fullPath = item.path.startsWith("/")
        ? item.path
        : `/${params?.route}/${item.path}`;
      router.push(fullPath);
    }

    // Show navigation toast only in collapsed mode to provide feedback
    if (isCollapsed) {
      toast.info({
        title: "info",
        description: "sidebarInfo",
        isTranslated: true,
      });
    }
  };

  const handleLogout = async () => {
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
  };

  // Helper function to clear all cookies
  const clearCookies = () => {
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
  };

  const clearAllBookmarks = () => {
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
  };

  // Filter items based on user role
  const filterItemsByRole = (items) => {
    return items; // Show all items regardless of role
  };

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
                    isExpanded={expandedGroups[groupName]}
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
                    isExpanded={expandedGroups[groupName]}
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

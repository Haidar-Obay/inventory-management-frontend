"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// New component for tooltip items (separate from popover items)
export function SidebarTooltipItem({
  name,
  icon: Icon,
  path,
  isBookmarked,
  isActive,
  onNavigate,
  onToggleBookmark,
  t,
  isRTL,
}) {
  const params = useParams();
  const route = params?.route;

  const getFullPath = () => {
    // If path starts with /, it's an absolute path
    if (path.startsWith("/")) {
      return path;
    }
    // If path starts with mainfiles, add tenant prefix
    if (path.startsWith("main")) {
      return `/${path}`;
    }
    // For other paths, just add tenant prefix
    return `/${route}/${path}`;
  };

  // Use the name directly since it's already translated from the menu items
  const label = name;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col items-center gap-1">
          <Link
            href={getFullPath()}
            className="flex justify-center p-2 mx-2 rounded-md hover:bg-primary-foreground/20 active:bg-primary-foreground/30 transition-colors duration-200"
            onClick={() => onNavigate && onNavigate(name)}
          >
            <Icon className="h-4 w-4" />
          </Link>
          {onToggleBookmark && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "text-primary-foreground hover:bg-transparent focus:ring-0 focus:ring-offset-0 w-6 h-6 flex items-center justify-center transition-opacity duration-200",
                isBookmarked
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
              onClick={() => onToggleBookmark(name)}
              tabIndex={-1}
              style={{ minHeight: 0, padding: 0, margin: 0 }}
            >
              <Star
                className={cn(
                  "h-3 w-3 transition-colors duration-200",
                  isBookmarked
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-primary-foreground/50 hover:text-yellow-400 hover:fill-yellow-400"
                )}
              />
            </Button>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side={isRTL ? "left" : "right"}>{label}</TooltipContent>
    </Tooltip>
  );
}

export function SidebarItem({
  name,
  icon: Icon,
  path,
  isCollapsed,
  isBookmarked,
  isActive,
  onNavigate,
  onToggleBookmark,
  padding = "px-3",
  className,
  t,
  isRTL,
  compact = false,
}) {
  const params = useParams();
  const route = params?.route;

  const getFullPath = () => {
    // If path starts with /, it's an absolute path
    if (path.startsWith("/")) {
      return path;
    }
    // If path starts with mainfiles, add tenant prefix
    if (path.startsWith("main")) {
      return `/${path}`;
    }
    // For other paths, just add tenant prefix
    return `/${route}/${path}`;
  };

  // Use the name directly since it's already translated from the menu items
  const label = name;

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={getFullPath()}
            className="flex justify-center p-2 mx-2 rounded-md hover:bg-primary-foreground/20 active:bg-primary-foreground/30 transition-colors duration-200"
            onClick={() => onNavigate && onNavigate(name)}
          >
            <Icon className="h-4 w-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div
      className={cn(
        "group flex w-full items-center min-w-0",
        compact ? "h-8" : "h-12"
      )}
    >
      <Link
        href={getFullPath()}
        className={cn(
          "flex items-center flex-1 h-full rounded-md hover:bg-primary-foreground/10 transition-colors duration-200 min-w-0 overflow-x-auto scrollbar-hide",
          isActive && "bg-primary-foreground/10 font-medium",
          padding,
          className
        )}
        style={
          isRTL
            ? { paddingRight: compact ? 16 : 24 }
            : { paddingLeft: compact ? 16 : 24 }
        }
        onClick={() => onNavigate && onNavigate(name)}
      >
        <Icon
          className={cn(
            "flex-shrink-0",
            compact ? "h-3 w-3" : "h-4 w-4",
            isRTL ? "ml-2" : "mr-2"
          )}
        />
        <span className={cn("whitespace-nowrap", "text-sm")}>
          {label}
        </span>
      </Link>
      {onToggleBookmark && (
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{ width: compact ? 32 : 40 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-primary-foreground hover:bg-transparent focus:ring-0 focus:ring-offset-0 flex items-center justify-center transition-opacity duration-200",
              compact ? "w-8 h-8" : "w-10 h-10",
              isBookmarked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={() => onToggleBookmark(name)}
            tabIndex={-1}
            style={{ minHeight: 0, padding: 0, margin: 0 }}
          >
            <Star
              className={cn(
                "transition-colors duration-200",
                compact ? "h-3 w-3" : "h-4 w-4",
                isBookmarked
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-primary-foreground/50 hover:text-yellow-400 hover:fill-yellow-400"
              )}
            />
          </Button>
        </div>
      )}
    </div>
  );
}

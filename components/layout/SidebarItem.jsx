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
    <div className="flex w-full items-center h-12">
      <Link
        href={getFullPath()}
        className={cn(
          "flex items-center gap-2 flex-1 h-full rounded-md hover:bg-primary-foreground/10 transition-colors duration-200",
          isActive && "bg-primary-foreground/10 font-medium",
          padding,
          className
        )}
        style={isRTL ? { paddingRight: 24 } : { paddingLeft: 24 }}
        onClick={() => onNavigate && onNavigate(name)}
      >
        <Icon className="h-4 w-4" />
        <span className="whitespace-nowrap">{label}</span>
      </Link>
      {onToggleBookmark && (
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-transparent focus:ring-0 focus:ring-offset-0 group w-10 h-10 flex items-center justify-center"
          onClick={() => onToggleBookmark(name)}
          tabIndex={-1}
          style={{ minHeight: 0, padding: 0, margin: 0 }}
        >
          <Star
            className={cn(
              "h-4 w-4 group-hover:text-yellow-400 group-hover:fill-yellow-400",
              isBookmarked ? "fill-yellow-400 text-yellow-400" : ""
            )}
          />
        </Button>
      )}
    </div>
  );
}

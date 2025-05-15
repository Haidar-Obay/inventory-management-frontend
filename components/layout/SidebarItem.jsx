"use client"

import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

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
}) {
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={path}
            className="flex justify-center p-2 mx-2 rounded-md hover:bg-primary-foreground/20 active:bg-primary-foreground/30 transition-colors duration-200"
            onClick={() => onNavigate && onNavigate(name)}
          >
            <Icon className="h-4 w-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{name}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div className="flex items-center">
      <Link
        href={path}
        className={cn(
          `flex items-center gap-2 ${padding} py-1.5 hover:bg-primary-foreground/10 rounded-md mx-2 flex-1 text-[14px] transition-colors duration-200`,
          isActive && "bg-primary-foreground/10 font-medium",
        )}
        onClick={() => onNavigate && onNavigate(name)}
      >
        <Icon className="h-4 w-4" />
        <span>{name}</span>
      </Link>
      {onToggleBookmark && (
        <Button
          variant="ghost"
          size="icon"
          className="mr-4 text-primary-foreground hover:bg-transparent focus:ring-0 focus:ring-offset-0 group"
          onClick={() => onToggleBookmark(name)}
        >
          <Star className={cn("h-4 w-4 group-hover:text-yellow-400 group-hover:fill-yellow-400", isBookmarked ? "fill-yellow-400 text-yellow-400" : "")} />
        </Button>
      )}
    </div>
  )
} 
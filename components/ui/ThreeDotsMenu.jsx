import { MoreVertical, ZoomIn, ZoomOut } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ThreeDotsMenu({ onZoomIn, onZoomOut, isSidebarVisible }) {
  const t = useTranslations("header");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open settings menu">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{ zIndex: 1000 }} className="!bg-background !opacity-100">
        {isSidebarVisible ? (
          <DropdownMenuItem onClick={onZoomIn} className="!bg-background !opacity-100">
            <ZoomIn className="w-4 h-4 mr-2" />
            {t("zoomIn", { defaultMessage: "Zoom In" })}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onZoomOut} className="!bg-background !opacity-100">
            <ZoomOut className="w-4 h-4 mr-2" />
            {t("zoomOut", { defaultMessage: "Zoom Out" })}
          </DropdownMenuItem>
        )}
        {/* Add more settings here as needed */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 
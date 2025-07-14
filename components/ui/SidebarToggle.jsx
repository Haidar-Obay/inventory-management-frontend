import { PanelLeft, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

export default function SidebarToggle({ onHide, onShow, isSidebarVisible }) {
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";

  const handleClick = () => {
    if (isSidebarVisible) {
      onHide();
    } else {
      onShow();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="h-8 w-8 hover:bg-muted/50 transition-colors"
      aria-label={isSidebarVisible ? "Hide sidebar" : "Show sidebar"}
    >
      {isSidebarVisible ? (
        <PanelLeftClose className="h-4 w-4" />
      ) : (
        <PanelLeft className="h-4 w-4" />
      )}
    </Button>
  );
} 
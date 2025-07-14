import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FullscreenToggle({ onToggleFullscreen, isFullscreen }) {
  const handleClick = () => {
    onToggleFullscreen();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="h-8 w-8 hover:bg-muted/50 transition-colors"
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
    </Button>
  );
} 
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export function useTabLinePosition() {
  const { isCollapsed } = useSidebar();
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Force re-render when sidebar state changes
    setKey((prev) => prev + 1);
  }, [isCollapsed]);

  return {
    key,
    tabStyles: {
      "& .MuiTabs-indicator": {
        transition: "all 0.3s ease-in-out",
        transform: "none",
        willChange: "left, right, width",
      },
      "& .MuiTab-root": {
        transition: "all 0.3s ease-in-out",
        willChange: "transform",
      },
    },
  };
}

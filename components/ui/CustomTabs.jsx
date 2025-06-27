"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useLocale } from "next-intl";

const CustomTabs = ({ value, onChange, children, ...props }) => {
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [layoutKey, setLayoutKey] = useState(0);

  // Function to update indicator position
  const updateIndicatorPosition = () => {
    if (!tabsRef.current) return;

    const tabsContainer = tabsRef.current;
    const activeTab = tabsContainer.querySelector(
      `[role="tab"][aria-selected="true"]`
    );

    if (activeTab) {
      const containerRect = tabsContainer.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      const left = tabRect.left - containerRect.left;
      const width = tabRect.width;

      setIndicatorStyle({
        left: `${left}px`,
        width: `${width}px`,
        position: "absolute",
        bottom: 0,
        height: "2px",
        backgroundColor: "var(--mui-palette-primary-main, #1976d2)",
        transition: "all 0.3s ease-in-out",
        transform: "translateX(0)",
      });
    }
  };

  // Update indicator position when value changes
  useEffect(() => {
    const timer = setTimeout(updateIndicatorPosition, 0);
    return () => clearTimeout(timer);
  }, [value, layoutKey]);

  // Listen for layout changes (sidebar open/close)
  useEffect(() => {
    const handleResize = () => {
      setLayoutKey((prev) => prev + 1);
      setTimeout(updateIndicatorPosition, 100);
    };

    const handleTransitionEnd = () => {
      updateIndicatorPosition();
    };

    window.addEventListener("resize", handleResize);

    // Listen for CSS transitions that might affect layout
    const observer = new ResizeObserver(() => {
      setTimeout(updateIndicatorPosition, 50);
    });

    if (tabsRef.current) {
      observer.observe(tabsRef.current);

      // Listen for transition events on the container
      const container =
        tabsRef.current.closest(".p-4") || tabsRef.current.parentElement;
      if (container) {
        container.addEventListener("transitionend", handleTransitionEnd);
        container.addEventListener("animationend", handleTransitionEnd);
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      const container =
        tabsRef.current?.closest(".p-4") || tabsRef.current?.parentElement;
      if (container) {
        container.removeEventListener("transitionend", handleTransitionEnd);
        container.removeEventListener("animationend", handleTransitionEnd);
      }
    };
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Tabs
        ref={tabsRef}
        key={`custom-tabs-${isRTL ? "rtl" : "ltr"}-${layoutKey}`}
        value={value}
        onChange={onChange}
        sx={{
          "& .MuiTabs-indicator": {
            display: "none", // Hide the default indicator
          },
          "& .MuiTab-root": {
            minHeight: "48px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            "&.Mui-selected": {
              color: "primary.main",
            },
          },
          direction: isRTL ? "rtl" : "ltr",
        }}
        {...props}
      >
        {children}
      </Tabs>
      {/* Custom indicator */}
      <div style={indicatorStyle} />
    </Box>
  );
};

export default CustomTabs;

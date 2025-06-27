import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SidePanelDrawer from "@/components/ui/SidePanelDrawer";
import { ActionToolbar } from "@/components/ui/action-toolbar";
import { useLocale } from "next-intl";

const DynamicDrawer = ({
  isOpen,
  onClose,
  title,
  width = 500,
  zIndex = 1200,
  accordions = [], // Array of accordion configurations
  content = null, // Direct content without accordions
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  onCancel,
  children, // For any additional content
  anchor = "right", // Add anchor prop with default value
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <SidePanelDrawer
      isOpen={isOpen}
      onClose={onClose}
      width={width}
      zIndex={zIndex}
      anchor={anchor}
    >
      <Box className="flex flex-col h-full">
        {/* Header - Fixed at top */}
        <Box
          p={2}
          className="flex-shrink-0 border-b border-border bg-gray-50 dark:bg-muted/50"
        >
          <Typography
            variant="subtitle1"
            className="font-semibold text-gray-800 dark:text-foreground"
          >
            {title}
          </Typography>
        </Box>

        {/* Main Content - Scrollable */}
        <Box
          className="flex-grow overflow-y-scroll bg-background"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "&": {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            },
          }}
        >
          <Box p={3}>
            {/* Render direct content if provided */}
            {content}

            {/* Render accordions if provided and no direct content */}
            {!content &&
              accordions.map((accordion, index) => (
                <Accordion
                  key={index}
                  expanded={accordion.expanded}
                  onChange={accordion.onChange}
                  className="mb-2 bg-gray-50 dark:bg-muted/50 border border-border"
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon className="text-foreground" />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    className="text-foreground"
                  >
                    <Typography className="text-foreground">
                      {accordion.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="bg-background">
                    {accordion.content}
                  </AccordionDetails>
                </Accordion>
              ))}

            {/* Additional content */}
            {children}
          </Box>
        </Box>

        {/* Action Toolbar - Fixed at bottom with buttons beside each other */}
        <Box className="flex-shrink-0 border-t border-border bg-gray-50 dark:bg-muted/50">
          <Box p={3}>
            <div className="flex justify-end items-center gap-3">
              {/* Cancel button - Left side in LTR, Right side in RTL */}
              <div className={isRTL ? "order-2" : "order-1"}>
                <ActionToolbar
                  onCancel={onCancel || onClose}
                  expandDirection="right"
                  className="[&_button]:h-10"
                  storageKey={`drawer-${title}-cancel-action`}
                  dropdownDirection="up"
                />
              </div>

              {/* Save buttons - Right side in LTR, Left side in RTL */}
              <div className={isRTL ? "order-1" : "order-2"}>
                <ActionToolbar
                  onSave={onSave}
                  onSaveAndNew={onSaveAndNew}
                  onSaveAndExit={onSaveAndClose}
                  expandDirection="left"
                  className="[&_button]:h-10"
                  storageKey={`drawer-${title}-save-action`}
                  dropdownDirection="up"
                />
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    </SidePanelDrawer>
  );
};

export default DynamicDrawer;

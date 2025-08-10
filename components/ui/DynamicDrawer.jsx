'use client';

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SidePanelDrawer from "@/components/ui/SidePanelDrawer";
import { ActionToolbar } from "@/components/ui/action-toolbar";
import { useLocale, useTranslations } from "next-intl";
import Portal from "./Portal";
import { Button as CustomButton } from "./table/CustomControls";

const DynamicDrawer = ({
  isOpen,
  onClose,
  title,
  width = 700,
  zIndex = 1200,
  accordions = [], // Array of accordion configurations
  content = null, // Direct content without accordions
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  onCancel,
  children, // For any additional content
  anchor = "right", // Add anchor prop with default value
  showExitConfirmation = true, // New prop to control confirmation dialog
  hasFormData = false, // New prop to check if form has data
  hasDataChanged = false, // New prop to check if data has been modified
  saveLoading = false, // New prop for save loading state
  autoFocus = true, // New prop to control auto focus behavior
  isEdit = false, // New prop to determine if in edit mode
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("common");
  const [showExitDialog, setShowExitDialog] = useState(false);
  const contentRef = useRef(null);

  // Auto focus first input field when drawer opens
  useEffect(() => {
    if (isOpen && autoFocus) {
      // Use setTimeout to ensure the drawer is fully rendered
      const timer = setTimeout(() => {
        if (contentRef.current) {
          // Find the first input field in the content
          const firstInput = contentRef.current.querySelector('input, textarea, select');
          if (firstInput) {
            firstInput.focus();
          }
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoFocus]);

  const handleCancelClick = () => {
    // Only show confirmation if data has changed and confirmation is enabled
    if (showExitConfirmation && hasDataChanged) {
      setShowExitDialog(true);
    } else {
      onCancel ? onCancel() : onClose();
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    onCancel ? onCancel() : onClose();
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);
  };

  const handleDrawerClose = () => {
    // Only show confirmation if data has changed and confirmation is enabled
    if (showExitConfirmation && hasDataChanged) {
      setShowExitDialog(true);
    } else {
      onCancel ? onCancel() : onClose();
    }
  };

  return (
    <>
      <SidePanelDrawer
        isOpen={isOpen}
        onClose={handleDrawerClose}
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
            ref={contentRef}
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
                    onCancel={handleCancelClick}
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
                    onSaveAndNew={isEdit ? undefined : onSaveAndNew}
                    onSaveAndExit={isEdit ? onSaveAndClose : onSaveAndClose}
                    expandDirection="left"
                    className="[&_button]:h-10"
                    storageKey={`drawer-${title}-save-action`}
                    dropdownDirection="up"
                    saveLoading={saveLoading}
                  />
                </div>
              </div>
            </Box>
          </Box>
        </Box>
      </SidePanelDrawer>

      {/* Exit Confirmation Dialog - Using same style as DeleteModal */}
      {showExitDialog && (
        <Portal>
          <div
            className="fixed inset-0 z-[2147483647] pointer-events-auto flex items-center justify-center bg-black/50"
        data-nextjs-scroll-focus-boundary
            onClick={handleCancelExit}
          >
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg border border-border">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">
                  {t("exitConfirmationTitle") || "Exit Confirmation"}
                </h3>
                <button
                  onClick={handleCancelExit}
                  className="rounded-full p-1 hover:bg-muted text-muted-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {t("exitConfirmationMessage") || 
                   "Are you sure you want to exit? Any unsaved changes will be lost."}
                </p>
                <div
                  className="flex justify-end"
                  style={{
                    gap: "0.5rem",
                    flexDirection: isRTL ? "row-reverse" : "row",
                  }}
                >
                  <CustomButton
                    variant="outline"
                    onClick={handleCancelExit}
                    className="border-border"
                  >
                    {t("cancel") || "Cancel"}
                  </CustomButton>
                  <CustomButton
                    variant="destructive"
                    onClick={handleConfirmExit}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {t("exit") || "Exit"}
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default DynamicDrawer;

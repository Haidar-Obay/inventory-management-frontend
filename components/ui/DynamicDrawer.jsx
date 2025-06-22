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
        <Box p={2} className="flex-shrink-0 border-b bg-white">
          <Typography
            variant="subtitle1"
            className="font-semibold text-gray-800"
          >
            {title}
          </Typography>
        </Box>

        {/* Main Content - Scrollable */}
        <Box 
          className="flex-grow overflow-y-scroll"
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '&': {
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
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
                  className="mb-2"
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <Typography>{accordion.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {accordion.content}
                  </AccordionDetails>
                </Accordion>
              ))}

            {/* Additional content */}
            {children}
          </Box>
        </Box>

        {/* Action Toolbar - Fixed at bottom */}
        <Box className="flex-shrink-0 border-t bg-white">
          <Box p={3}>
            <ActionToolbar
              onSave={onSave}
              onSaveAndNew={onSaveAndNew}
              onSaveAndExit={onSaveAndClose}
              onCancel={onCancel || onClose}
              expandDirection="left"
              className="[&_button]:h-10"
              storageKey={`drawer-${title}-last-action`}
              dropdownDirection="up"
            />
          </Box>
        </Box>
      </Box>
    </SidePanelDrawer>
  );
};

export default DynamicDrawer;

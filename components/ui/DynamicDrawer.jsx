import React from 'react';
import { 
  Box, 
  Typography, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SidePanelDrawer from "@/components/ui/SidePanelDrawer";
import { ActionToolbar } from "@/components/ui/action-toolbar";

const DynamicDrawer = ({ 
  isOpen, 
  onClose, 
  title,
  width = 500,
  zIndex = 1200,
  accordions = [], // Array of accordion configurations
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  onCancel,
  children, // For any additional content
}) => {
  return (
    <SidePanelDrawer
      isOpen={isOpen}
      onClose={onClose}
      width={width}
      zIndex={zIndex}
    >
      <Box p={3} className="flex flex-col h-full">
        {/* Header */}
        <Typography 
          variant="h6" 
          className="mb-4 font-semibold text-gray-800 border-b pb-3"
        >
          {title}
        </Typography>

        {/* Main Content */}
        <div className="flex-grow">
          {/* Render accordions if provided */}
          {accordions.map((accordion, index) => (
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
                <Grid container spacing={2}>
                  {accordion.content}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Additional content */}
          {children}
        </div>

        {/* Action Toolbar */}
        <div className="mt-auto pt-4 border-t">
          <ActionToolbar
            onSave={onSave}
            onSaveAndNew={onSaveAndNew}
            onSaveAndExit={onSaveAndClose}
            onCancel={onCancel || onClose}
            expandDirection="left"
            className="[&_button]:h-10"
            storageKey={`drawer-${title}-last-action`}
            dropdownDirection = 'up'
          />
        </div>
      </Box>
    </SidePanelDrawer>
  );
};

export default DynamicDrawer; 
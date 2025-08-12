import React from "react";
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CatalogSection = React.memo(({ isRTL, t }) => {
  return (
    <Accordion 
      disabled={true}
      sx={{ 
        mt: 4,
        opacity: 0.6,
        pointerEvents: 'none',
        '&.Mui-disabled': {
          backgroundColor: 'rgb(249 250 251)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 0
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          cursor: 'default',
          '&:hover': {
            backgroundColor: 'transparent'
          },
          '&.Mui-expanded': {
            minHeight: '48px'
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.disabled' }}>
          {t('management.catalogSection') || 'Catalog'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center' }}>
            {t('management.catalogDisabled') || 'Catalog section is currently disabled'}
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

export default CatalogSection;

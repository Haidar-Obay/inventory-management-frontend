import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";

const SalesmenSection = React.memo(({ formData, onFormDataChange, isRTL, t, salesmen, collectors, supervisors, managers, handleSalesmanSelect, handleCollectorSelect, handleSupervisorSelect, handleManagerSelect, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed]);
  return (
    <Accordion expanded={expanded} onChange={onAccordionChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="salesmen-content"
        id="salesmen-header"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t('management.salesmenAccordion') || 'Salesmen'}
          </Typography>
          {/* Show salesman combobox under header only when collapsed */}
          {!expanded && (
            <Box
              sx={{ mt: 1, width: { xs: '100%', sm: '60%' } }}
              onClick={e => e.stopPropagation()}
              onFocus={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.salesman') || 'Salesman'}
              </Typography>
              <Autocomplete
                fullWidth
                options={salesmen}
                getOptionLabel={option => option ? `${option.name} (${option.code})` : ''}
                value={salesmen.find(s => s.id === formData?.salesman_id) || null}
                onChange={handleSalesmanSelect}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
                onClick={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                sx={{ background: 'background.paper' }}
              />
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Show all comboboxes only when expanded */}
          {expanded && <>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.salesman') || 'Salesman'}
              </Typography>
              <Autocomplete
                fullWidth
                options={salesmen}
                getOptionLabel={option => option ? `${option.name} (${option.code})` : ''}
                value={salesmen.find(s => s.id === formData?.salesman_id) || null}
                onChange={handleSalesmanSelect}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.collector') || 'Collector'}
              </Typography>
              <Autocomplete
                fullWidth
                options={collectors}
                getOptionLabel={option => option ? `${option.name} (${option.code})` : ''}
                value={collectors.find(s => s.id === formData?.collector_id) || null}
                onChange={handleCollectorSelect}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.supervisor') || 'Supervisor'}
              </Typography>
              <Autocomplete
                fullWidth
                options={supervisors}
                getOptionLabel={option => option ? `${option.name} (${option.code})` : ''}
                value={supervisors.find(s => s.id === formData?.supervisor_id) || null}
                onChange={handleSupervisorSelect}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.manager') || 'Manager'}
              </Typography>
              <Autocomplete
                fullWidth
                options={managers}
                getOptionLabel={option => option ? `${option.name} (${option.code})` : ''}
                value={managers.find(s => s.id === formData?.manager_id) || null}
                onChange={handleManagerSelect}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
              />
            </Grid>
          </>}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default SalesmenSection; 
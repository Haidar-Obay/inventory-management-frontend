import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";

const SalesmenSection = React.memo(({ formData, onFormDataChange, isRTL, t, salesmen, collectors, supervisors, managers, handleSalesmanSelect, handleCollectorSelect, handleSupervisorSelect, handleManagerSelect, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed]);

  // Create options with Add button as first option
  const createOptionsWithAdd = (options, type) => {
    const addOption = { id: 'add', name: `${t('management.add') || 'Add'} ${t(`management.${type}`) || type}`, isAddButton: true };
    return [addOption, ...options];
  };

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
            <Box sx={{ mt: 1, width: { xs: '100%', sm: '60%' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.salesman') || 'Salesman'}
              </Typography>
              <Autocomplete
                fullWidth
                options={createOptionsWithAdd(salesmen, 'salesman')}
                getOptionLabel={option => {
                  if (option?.isAddButton) return option.name;
                  return option ? `${option.name} (${option.code})` : '';
                }}
                value={salesmen.find(s => s.id === formData?.salesman_id) || null}
                onChange={(event, newValue) => {
                  if (newValue?.isAddButton) {
                    console.log('Add salesman clicked');
                    return;
                  }
                  handleSalesmanSelect(event, newValue);
                }}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.isAddButton ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                        <AddIcon sx={{ fontSize: '1rem' }} />
                        {option.name}
                      </Box>
                    ) : (
                      `${option.name} (${option.code})`
                    )}
                  </Box>
                )}
                onClick={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
                onKeyDown={e => { if ((e.key === ' ' || e.key === 'Spacebar') && !expanded) { e.preventDefault(); e.stopPropagation(); } }}
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
            <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.salesman') || 'Salesman'}
              </Typography>
              <Autocomplete
                fullWidth
                options={createOptionsWithAdd(salesmen, 'salesman')}
                getOptionLabel={option => {
                  if (option?.isAddButton) return option.name;
                  return option ? `${option.name} (${option.code})` : '';
                }}
                value={salesmen.find(s => s.id === formData?.salesman_id) || null}
                onChange={(event, newValue) => {
                  if (newValue?.isAddButton) {
                    console.log('Add salesman clicked');
                    return;
                  }
                  handleSalesmanSelect(event, newValue);
                }}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.isAddButton ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                        <AddIcon sx={{ fontSize: '1rem' }} />
                        {option.name}
                      </Box>
                    ) : (
                      `${option.name} (${option.code})`
                    )}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.collector') || 'Collector'}
              </Typography>
              <Autocomplete
                fullWidth
                options={createOptionsWithAdd(collectors, 'collector')}
                getOptionLabel={option => {
                  if (option?.isAddButton) return option.name;
                  return option ? `${option.name} (${option.code})` : '';
                }}
                value={collectors.find(s => s.id === formData?.collector_id) || null}
                onChange={(event, newValue) => {
                  if (newValue?.isAddButton) {
                    console.log('Add collector clicked');
                    return;
                  }
                  handleCollectorSelect(event, newValue);
                }}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.isAddButton ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                        <AddIcon sx={{ fontSize: '1rem' }} />
                        {option.name}
                      </Box>
                    ) : (
                      `${option.name} (${option.code})`
                    )}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.supervisor') || 'Supervisor'}
              </Typography>
              <Autocomplete
                fullWidth
                options={createOptionsWithAdd(supervisors, 'supervisor')}
                getOptionLabel={option => {
                  if (option?.isAddButton) return option.name;
                  return option ? `${option.name} (${option.code})` : '';
                }}
                value={supervisors.find(s => s.id === formData?.supervisor_id) || null}
                onChange={(event, newValue) => {
                  if (newValue?.isAddButton) {
                    console.log('Add supervisor clicked');
                    return;
                  }
                  handleSupervisorSelect(event, newValue);
                }}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.isAddButton ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                        <AddIcon sx={{ fontSize: '1rem' }} />
                        {option.name}
                      </Box>
                    ) : (
                      `${option.name} (${option.code})`
                    )}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.manager') || 'Manager'}
              </Typography>
              <Autocomplete
                fullWidth
                options={createOptionsWithAdd(managers, 'manager')}
                getOptionLabel={option => {
                  if (option?.isAddButton) return option.name;
                  return option ? `${option.name} (${option.code})` : '';
                }}
                value={managers.find(s => s.id === formData?.manager_id) || null}
                onChange={(event, newValue) => {
                  if (newValue?.isAddButton) {
                    console.log('Add manager clicked');
                    return;
                  }
                  handleManagerSelect(event, newValue);
                }}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.isAddButton ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                        <AddIcon sx={{ fontSize: '1rem' }} />
                        {option.name}
                      </Box>
                    ) : (
                      `${option.name} (${option.code})`
                    )}
                  </Box>
                )}
              />
            </Grid>
          </>}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default SalesmenSection; 
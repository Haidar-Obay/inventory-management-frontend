import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";
import { useDrawerStack } from "@/components/ui/DrawerStackContext";

const SalesmenSection = React.memo(({ formData, onFormDataChange, isRTL, t, salesmen, collectors, supervisors, managers, handleSalesmanSelect, handleCollectorSelect, handleSupervisorSelect, handleManagerSelect, expanded, onAccordionChange, allCollapsed, setAllCollapsed, setSalesmen }) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed]);

  const { openDrawer } = useDrawerStack();

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
              <Box 
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
              >
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
                      openDrawer({
                        type: "salesman",
                        props: {
                          onSave: (newSalesman) => {
                            if (typeof setSalesmen === 'function') {
                              setSalesmen(prev => [...(Array.isArray(prev) ? prev : []), newSalesman]);
                            }
                            handleSalesmanSelect(event, newSalesman);
                          },
                          type: "salesman"
                        },
                      });
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
                  sx={{ background: 'background.paper' }}
                />
              </Box>
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
                    openDrawer({
                      type: "salesman",
                      props: {
                        onSave: (newSalesman) => {
                          if (typeof setSalesmen === 'function') {
                            setSalesmen(prev => [...(Array.isArray(prev) ? prev : []), newSalesman]);
                          }
                          handleCollectorSelect(event, newSalesman);
                        },
                        type: "salesman"
                      },
                    });
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
                sx={{ background: 'background.paper' }}
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
                    openDrawer({
                      type: "salesman",
                      props: {
                        onSave: (newSalesman) => {
                          if (typeof setSalesmen === 'function') {
                            setSalesmen(prev => [...(Array.isArray(prev) ? prev : []), newSalesman]);
                          }
                          handleSupervisorSelect(event, newSalesman);
                        },
                        type: "salesman"
                      },
                    });
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
                    openDrawer({
                      type: "salesman",
                      props: {
                        onSave: (newSalesman) => {
                          if (typeof setSalesmen === 'function') {
                            setSalesmen(prev => [...(Array.isArray(prev) ? prev : []), newSalesman]);
                          }
                          handleManagerSelect(event, newSalesman);
                        },
                        type: "salesman"
                      },
                    });
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
                    openDrawer({
                      type: "salesman",
                      props: {
                        onSave: (newSalesman) => {
                          if (typeof setSalesmen === 'function') {
                            setSalesmen(prev => [...(Array.isArray(prev) ? prev : []), newSalesman]);
                          }
                          handleManagerSelect(event, newSalesman);
                        },
                        type: "salesman"
                      },
                    });
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
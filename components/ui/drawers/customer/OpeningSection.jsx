import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Button, Box, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";

const OpeningSection = React.memo(({ formData, onFormDataChange, isRTL, t, subscriptionChecked, canAddMultiCurrency, upgradeMessage, openingBalances, handleOpeningBalanceChange, handleAddOpeningBalance, handleRemoveOpeningBalance, currencies, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'var(--muted)' : 'rgb(249 250 251)';
  };

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

  // Default expanded to true if not provided
  const isExpanded = expanded === undefined ? true : expanded;

  return (
    <Accordion 
      expanded={isExpanded} 
      onChange={onAccordionChange}
      sx={{
        backgroundColor: getBackgroundColor(),
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        boxShadow: 'none'
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="opening-content"
        id="opening-header"
        tabIndex={-1}
        sx={{
          backgroundColor: getBackgroundColor(),
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {t('management.opening') || 'Opening'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: getBackgroundColor()
        }}
      >
        {openingBalances.map((entry, idx) => {
          // Filter out currencies already selected in other entries
          const selectedCurrencies = openingBalances.filter((e, i) => i !== idx).map(e => e.currency);
          const availableCurrencies = currencies.filter(c => !selectedCurrencies.includes(c.code));
          return (
            <Grid container spacing={2} key={idx} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Grid item xs={12} md={4} sx={{ minWidth: 250 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.currency') || 'Currency'}
                </Typography>
                <Autocomplete
                  fullWidth
                  options={createOptionsWithAdd(availableCurrencies, 'currency')}
                  getOptionLabel={(option) => {
                    if (option?.isAddButton) return option.name;
                    return option ? `${option.name} (${option.code})` : '';
                  }}
                  value={currencies.find((c) => c.code === entry.currency) || null}
                  onChange={(_, newValue) => {
                    if (newValue?.isAddButton) {
                      return;
                    }
                    handleOpeningBalanceChange(idx, 'currency', newValue?.code || '');
                  }}
                  renderInput={(params) => <RTLTextField {...params} placeholder="" />}
                  renderOption={(props, option) => {
                    const { key, ...rest } = props;
                    return (
                      <Box component="li" key={key} {...rest}>
                        {option.isAddButton ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                            <AddIcon sx={{ fontSize: '1rem' }} />
                            {option.name}
                          </Box>
                        ) : (
                          `${option.name} (${option.code})`
                        )}
                      </Box>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ minWidth: 250 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.openingAmount') || 'Opening Amount'}
                </Typography>
                <RTLTextField
                  value={entry.amount}
                  onChange={e => handleOpeningBalanceChange(idx, 'amount', e.target.value)}
                  type="number"
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ minWidth: 250 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.openingDate') || 'Opening Date'}
                </Typography>
                <RTLTextField
                  value={entry.date}
                  onChange={e => handleOpeningBalanceChange(idx, 'date', e.target.value)}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {canAddMultiCurrency && openingBalances.length > 1 && (
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button color="error" size="small" onClick={() => handleRemoveOpeningBalance(idx)}>
                    {t('management.remove') || 'Remove'}
                  </Button>
                </Grid>
              )}
            </Grid>
          );
        })}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 2 }}>
          {subscriptionChecked && !canAddMultiCurrency && (
            <Typography color="warning.main" sx={{ fontWeight: 500 }}>
              {upgradeMessage}
            </Typography>
          )}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={canAddMultiCurrency ? handleAddOpeningBalance : undefined}
            disabled={!canAddMultiCurrency}
          >
            {t('management.addCurrency') || 'Add Currency'}
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

export default OpeningSection; 
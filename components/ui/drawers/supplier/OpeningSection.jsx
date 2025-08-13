import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Button, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";

const OpeningSection = React.memo(({ 
  formData, 
  onFormDataChange, 
  isRTL, 
  t, 
  subscriptionChecked, 
  canAddMultiCurrency, 
  upgradeMessage, 
  openingBalances, 
  handleOpeningBalanceChange, 
  handleAddOpeningBalance, 
  handleRemoveOpeningBalance, 
  currencies, 
  expanded, 
  onAccordionChange, 
  allCollapsed, 
  setAllCollapsed 
}) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed, expanded, onAccordionChange, setAllCollapsed]);

  // Create options with Add button as first option
  const createOptionsWithAdd = (options, type) => {
    const addOption = { id: 'add', name: `${t('management.add') || 'Add'} ${t(`management.${type}`) || type}`, isAddButton: true };
    return [addOption, ...options];
  };

  // Default expanded to true if not provided
  const isExpanded = expanded === undefined ? true : expanded;

  return (
    <Accordion expanded={isExpanded} onChange={onAccordionChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {t('management.opening') || 'Opening'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {openingBalances.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
            <Typography variant="body2">
              {t('management.noOpeningBalances') || 'No opening balances added yet. Click "Add Currency" to add one.'}
            </Typography>
          </Box>
        ) : (
          openingBalances.map((entry, idx) => {
          // Filter out currencies already selected in other entries
          const selectedCurrencies = openingBalances.filter((e, i) => i !== idx).map(e => e.currency_id);
          const availableCurrencies = currencies.filter(c => !selectedCurrencies.includes(c.id));
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
                  value={currencies.find((c) => c.id === entry.currency_id) || null}
                  onChange={(_, newValue) => {
                    if (newValue?.isAddButton) {
                      return;
                    }
                    handleOpeningBalanceChange(idx, 'currency_id', newValue?.id || '');
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
              <Grid item xs={12} md={3} sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.openingAmount') || 'Opening Amount'}
                </Typography>
                <RTLTextField
                  value={entry.opening_amount}
                  onChange={e => handleOpeningBalanceChange(idx, 'opening_amount', e.target.value)}
                  type="number"
                  placeholder=""
                  inputProps={{ max: 999999999.99, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={3} sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.openingDate') || 'Opening Date'}
                </Typography>
                <RTLTextField
                  value={entry.opening_date}
                  onChange={e => handleOpeningBalanceChange(idx, 'opening_date', e.target.value)}
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
        })
        )}
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

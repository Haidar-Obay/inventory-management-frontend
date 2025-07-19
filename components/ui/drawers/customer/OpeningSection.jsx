import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Button, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";

const OpeningSection = React.memo(({ formData, onFormDataChange, isRTL, t, subscriptionChecked, canAddMultiCurrency, upgradeMessage, openingBalances, handleOpeningBalanceChange, handleAddOpeningBalance, handleRemoveOpeningBalance, currencies, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
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
        aria-controls="opening-content"
        id="opening-header"
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {t('management.opening') || 'Opening'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {subscriptionChecked && !canAddMultiCurrency && (
          <Typography color="warning.main" sx={{ mb: 2 }}>
            {upgradeMessage}
          </Typography>
        )}
        {openingBalances.map((entry, idx) => (
          <Grid container spacing={2} key={idx} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.currency') || 'Currency'}
              </Typography>
              <Autocomplete
                fullWidth
                options={currencies}
                getOptionLabel={(option) => option ? `${option.name} (${option.code})` : ''}
                value={currencies.find((c) => c.code === entry.currency) || null}
                onChange={(_, newValue) => handleOpeningBalanceChange(idx, 'currency', newValue?.code || '')}
                renderInput={(params) => <RTLTextField {...params} placeholder="" />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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
        ))}
        {canAddMultiCurrency && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" size="small" onClick={handleAddOpeningBalance}>
              {t('management.addCurrency') || 'Add Currency'}
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
});

export default OpeningSection; 
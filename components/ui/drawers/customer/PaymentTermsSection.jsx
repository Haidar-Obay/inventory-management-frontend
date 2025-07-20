import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";

const PaymentTermsSection = React.memo(({ formData, onFormDataChange, isRTL, t, paymentTerms, paymentMethods, selectedPaymentTerm, setSelectedPaymentTerm, selectedPaymentMethod, setSelectedPaymentMethod, allowCredit, setAllowCredit, openingBalances, creditLimits, handleCreditLimitChange, acceptCheques, setAcceptCheques, maxCheques, handleMaxChequesChange, paymentDay, setPaymentDay, trackPayment, setTrackPayment, settlementMethod, setSettlementMethod, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
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

  // Determine if any opening currency is selected
  const hasOpeningCurrency = Array.isArray(openingBalances) && openingBalances.some(entry => entry.currency);

  return (
    <Accordion expanded={expanded} onChange={onAccordionChange} TransitionProps={{ timeout: 0 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="payment-terms-content"
        id="payment-terms-header"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t('management.paymentTermsAccordion') || 'Payment Terms'}
          </Typography>
          {/* Show payment term combobox, allow credit checkbox, and credit limit fields under header only when collapsed */}
          {!expanded && (
            <Box sx={{ mt: 1, width: { xs: '100%', sm: '80%' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.paymentTerm') || 'Payment Term'}
              </Typography>
              <Box 
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
              >
                <Autocomplete
                  fullWidth
                  options={createOptionsWithAdd(paymentTerms, 'paymentTerm')}
                  getOptionLabel={option => {
                    if (option?.isAddButton) return option.name;
                    return option ? option.name : '';
                  }}
                  value={paymentTerms.find(pt => pt.id === selectedPaymentTerm) || null}
                  onChange={(_, newValue) => {
                    if (newValue?.isAddButton) {
                      console.log('Add payment term clicked');
                      return;
                    }
                    setSelectedPaymentTerm(newValue?.id || null);
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
                        option.name
                      )}
                    </Box>
                  )}
                  sx={{ background: 'background.paper', mb: 2 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Checkbox
                  checked={allowCredit}
                  onChange={e => setAllowCredit(e.target.checked)}
                  label={t('management.allowCredit') || 'Allow Credit'}
                  isRTL={isRTL}
                  onClick={e => e.stopPropagation()}
                  onFocus={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                  disabled={!hasOpeningCurrency}
                />
              </Box>
              {allowCredit && openingBalances.map((entry, idx) => (
                <Box key={entry.currency + '-credit'} sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                    {t('management.creditLimitPerCurrency') || 'Credit Limit for'} {entry.currency}
                  </Typography>
                  <RTLTextField
                    value={creditLimits[entry.currency] || ''}
                    onChange={e => handleCreditLimitChange(entry.currency, e.target.value)}
                    type="number"
                    placeholder=""
                    onClick={e => e.stopPropagation()}
                    onFocus={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                    sx={{ background: 'background.paper' }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>
          {expanded && <>
            {/* First line: Payment Term and Payment Method */}
            <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.paymentTerm') || 'Payment Term'}
              </Typography>
              <Autocomplete
                fullWidth
                options={createOptionsWithAdd(paymentTerms, 'paymentTerm')}
                getOptionLabel={option => {
                  if (option?.isAddButton) return option.name;
                  return option ? option.name : '';
                }}
                value={paymentTerms.find(pt => pt.id === selectedPaymentTerm) || null}
                onChange={(_, newValue) => {
                  if (newValue?.isAddButton) {
                    console.log('Add payment term clicked');
                    return;
                  }
                  setSelectedPaymentTerm(newValue?.id || null);
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
                      option.name
                    )}
                  </Box>
                )}
                sx={{ background: 'background.paper' }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.paymentMethod') || 'Payment Method'}
              </Typography>
              <Autocomplete
                fullWidth
                options={createOptionsWithAdd(paymentMethods, 'paymentMethod')}
                getOptionLabel={option => {
                  if (option?.isAddButton) return option.name;
                  return option ? option.name : '';
                }}
                value={paymentMethods.find(pm => pm.id === selectedPaymentMethod) || null}
                onChange={(_, newValue) => {
                  if (newValue?.isAddButton) {
                    console.log('Add payment method clicked');
                    return;
                  }
                  setSelectedPaymentMethod(newValue?.id || null);
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
                      option.name
                    )}
                  </Box>
                )}
                sx={{ background: 'background.paper' }}
              />
            </Grid>

            {/* Second line: Allow Credit checkbox and credit limit fields if checked */}
            <Grid item xs={12} md={6} sx={{ minWidth: 800, display: 'flex', alignItems: 'center', gap: 0 }}>
              <Checkbox
                checked={allowCredit}
                onChange={e => setAllowCredit(e.target.checked)}
                label={t('management.allowCredit') || 'Allow Credit'}
                isRTL={isRTL}
                disabled={!hasOpeningCurrency}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ minWidth: 800, display: 'flex', alignItems: 'center', gap: 0}}>
              {allowCredit && openingBalances.map((entry, idx) => (
                <Box key={entry.currency + '-credit'} sx={{ width: '100%' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                    {t('management.creditLimitPerCurrency') || 'Credit Limit for'} {entry.currency}
                  </Typography>
                  <RTLTextField
                    value={creditLimits[entry.currency] || ''}
                    onChange={e => handleCreditLimitChange(entry.currency, e.target.value)}
                    type="number"
                    placeholder=""
                    sx={{ background: 'background.paper', mb: 1 }}
                  />
                </Box>
              ))}
            </Grid>

            {/* Third line: Accept Cheques checkbox and max cheques fields if checked */}
            <Grid item xs={12} md={6} sx={{ minWidth: 800, display: 'flex', alignItems: 'center', gap: 0 }}>
              <Checkbox
                checked={acceptCheques}
                onChange={e => setAcceptCheques(e.target.checked)}
                label={t('management.acceptCheques') || 'Accept Cheques'}
                isRTL={isRTL}
                disabled={!hasOpeningCurrency}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ minWidth: 800, display: 'flex', alignItems: 'center', gap: 0 }}>
              {acceptCheques && openingBalances.map((entry, idx) => (
                <Box key={entry.currency + '-cheques'} sx={{ width: '100%' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                    {t('management.maxNbChequesPerCurrency') || 'Max. Nb. Cheques for'} {entry.currency}
                  </Typography>
                  <RTLTextField
                    value={maxCheques[entry.currency] || ''}
                    onChange={e => handleMaxChequesChange(entry.currency, e.target.value)}
                    type="number"
                    placeholder=""
                    sx={{ background: 'background.paper', mb: 1 }}
                  />
                </Box>
              ))}
            </Grid>

            {/* Fourth line: Payment Day, Track Payment, Settlement Method */}
            <Grid item xs={12} md={4} sx={{ minWidth: 275 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.paymentDay') || 'Payment Day'}
              </Typography>
              <RTLTextField
                value={paymentDay}
                onChange={e => setPaymentDay(e.target.value)}
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ background: 'background.paper' }}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ minWidth: 275 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.trackPayment') || 'Track Payment'}
              </Typography>
              <RTLTextField
                select
                value={trackPayment}
                onChange={e => setTrackPayment(e.target.value)}
                SelectProps={{ native: true }}
                sx={{ background: 'background.paper' }}
              >
                <option value="">{t('management.selectTrackPayment') || 'Select'}</option>
                <option value="yes">{t('management.yes') || 'Yes'}</option>
                <option value="no">{t('management.no') || 'No'}</option>
              </RTLTextField>
            </Grid>
            <Grid item xs={12} md={4} sx={{ minWidth: 275 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.settlementMethod') || 'Settlement Method'}
              </Typography>
              <RTLTextField
                select
                value={settlementMethod}
                onChange={e => setSettlementMethod(e.target.value)}
                SelectProps={{ native: true }}
                sx={{ background: 'background.paper' }}
              >
                <option value="">{t('management.selectSettlementMethod') || 'Select'}</option>
                <option value="fifo">FIFO</option>
                <option value="manual">MANUAL</option>
              </RTLTextField>
            </Grid>
          </>}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default PaymentTermsSection; 
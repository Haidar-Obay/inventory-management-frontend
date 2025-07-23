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

  // Determine if selected payment term has nb_days > 0
  const selectedTerm = paymentTerms.find(pt => pt.id === selectedPaymentTerm);
  const showAllowCreditFields = hasOpeningCurrency && selectedTerm && selectedTerm.nb_days > 0;

  // Effect: If allowCredit is checked but no opening currency, uncheck it
  React.useEffect(() => {
    if (!hasOpeningCurrency && allowCredit) {
      setAllowCredit(false);
    }
  }, [hasOpeningCurrency]);

  // Handler for payment term selection
  const handlePaymentTermChange = (_, newValue) => {
    if (newValue?.isAddButton) {
      console.log('Add payment term clicked');
      return;
    }
    setSelectedPaymentTerm(newValue?.id || null);
    // Only check allowCredit if nb_days > 0 AND hasOpeningCurrency
    if (newValue && newValue.nb_days > 0 && hasOpeningCurrency) {
      setAllowCredit(true);
    } else {
      setAllowCredit(false);
    }
  };

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
          {/* Show payment term combobox and credit fields under header only when collapsed */}
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
                    return option ? option.code || '' : '';
                  }}
                  value={paymentTerms.find(pt => pt.id === selectedPaymentTerm) || null}
                  onChange={handlePaymentTermChange}
                  renderInput={params => <RTLTextField {...params} placeholder="" />}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.isAddButton ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                          <AddIcon sx={{ fontSize: '1rem' }} />
                          {option.name}
                        </Box>
                      ) : (
                        option.code
                      )}
                    </Box>
                  )}
                  sx={{ background: 'background.paper', mb: 2 }}
                />
              </Box>
              {/* Remove allow credit checkbox, only show credit fields if showAllowCreditFields is true */}
              {showAllowCreditFields && openingBalances.map((entry, idx) => (
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
                  return option ? option.code || '' : '';
                }}
                value={paymentTerms.find(pt => pt.id === selectedPaymentTerm) || null}
                onChange={handlePaymentTermChange}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.isAddButton ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                        <AddIcon sx={{ fontSize: '1rem' }} />
                        {option.name}
                      </Box>
                    ) : (
                      option.code
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
                  return option ? option.code || '' : '';
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
                      option.code
                    )}
                  </Box>
                )}
                sx={{ background: 'background.paper' }}
              />
            </Grid>

            {/* Second line: Allow Credit checkbox and credit limit fields if checked */}
            <Grid item xs={12} md={6} sx={{ minWidth: 800, display: 'flex', alignItems: 'center', gap: 0 }}>
              {/* Only show credit limit fields if showAllowCreditFields is true */}
              {showAllowCreditFields && openingBalances.map((entry, idx) => (
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
            {allowCredit && (
              <>
                <Grid item xs={12} md={4} sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                    {t('management.paymentDay') || 'Payment Day'}
                  </Typography>
                  <RTLTextField
                    select
                    fullWidth
                    value={paymentDay}
                    onChange={e => setPaymentDay(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value="">{t('management.selectPaymentDay') || 'Select'}</option>e
                    
                    {[...Array(30)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </RTLTextField>
                </Grid>
                <Grid item xs={12} md={4} sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                    {t('management.settlementMethod') || 'Settlement Method'}
                  </Typography>
                  <RTLTextField
                    select
                    fullWidth
                    value={settlementMethod || 'fifo'}
                    onChange={e => setSettlementMethod(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value="fifo">{t('management.fifo') || 'FIFO'}</option>
                    <option value="manual">{t('management.manual') || 'Manual'}</option>
                  </RTLTextField>
                </Grid>
                <Grid item xs={12} md={4} sx={{ minWidth: 150 , display: 'flex', alignItems: 'center', gap: 0 }}>
                  <Checkbox
                    checked={!!trackPayment}
                    onChange={e => setTrackPayment(e.target.checked)}
                    label={t('management.trackPayment') || 'Track Payment'}
                    isRTL={isRTL}
                  />
                </Grid>
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
              </>
            )}
          </>}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default PaymentTermsSection; 
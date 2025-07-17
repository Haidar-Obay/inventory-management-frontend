import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";

const PaymentTermsSection = React.memo(({ formData, onFormDataChange, isRTL, t, paymentTerms, paymentMethods, selectedPaymentTerm, setSelectedPaymentTerm, selectedPaymentMethod, setSelectedPaymentMethod, allowCredit, setAllowCredit, openingBalances, creditLimits, handleCreditLimitChange, acceptCheques, setAcceptCheques, maxCheques, handleMaxChequesChange, paymentDay, setPaymentDay, trackPayment, setTrackPayment, settlementMethod, setSettlementMethod, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed]);
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
            <Box
              sx={{ mt: 1, width: { xs: '100%', sm: '80%' } }}
              onClick={e => e.stopPropagation()}
              onFocus={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.paymentTerm') || 'Payment Term'}
              </Typography>
              <Autocomplete
                fullWidth
                options={paymentTerms}
                getOptionLabel={option => option ? option.name : ''}
                value={paymentTerms.find(pt => pt.id === selectedPaymentTerm) || null}
                onChange={(_, newValue) => setSelectedPaymentTerm(newValue?.id || null)}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
                onClick={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                sx={{ background: 'background.paper', mb: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Checkbox
                  checked={allowCredit}
                  onChange={e => setAllowCredit(e.target.checked)}
                  label={t('management.allowCredit') || 'Allow Credit'}
                  isRTL={isRTL}
                  onClick={e => e.stopPropagation()}
                  onFocus={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                />
              </Box>
              {allowCredit && openingBalances.map((entry, idx) => (
                <Box key={entry.currency + '-credit'} sx={{ mb: 2 }}>
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
        <Grid container spacing={2}>
          {expanded && <>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.paymentTerm') || 'Payment Term'}
              </Typography>
              <Autocomplete
                fullWidth
                options={paymentTerms}
                getOptionLabel={option => option ? option.name : ''}
                value={paymentTerms.find(pt => pt.id === selectedPaymentTerm) || null}
                onChange={(_, newValue) => setSelectedPaymentTerm(newValue?.id || null)}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.paymentMethod') || 'Payment Method'}
              </Typography>
              <Autocomplete
                fullWidth
                options={paymentMethods}
                getOptionLabel={option => option ? option.name : ''}
                value={paymentMethods.find(pm => pm.id === selectedPaymentMethod) || null}
                onChange={(_, newValue) => setSelectedPaymentMethod(newValue?.id || null)}
                renderInput={params => <RTLTextField {...params} placeholder="" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Checkbox
                checked={allowCredit}
                onChange={e => setAllowCredit(e.target.checked)}
                label={t('management.allowCredit') || 'Allow Credit'}
                isRTL={isRTL}
              />
            </Grid>
            {allowCredit && openingBalances.map((entry, idx) => (
              <Grid item xs={12} md={6} key={entry.currency + '-credit'}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.creditLimitPerCurrency') || 'Credit Limit for'} {entry.currency}
                </Typography>
                <RTLTextField
                  value={creditLimits[entry.currency] || ''}
                  onChange={e => handleCreditLimitChange(entry.currency, e.target.value)}
                  type="number"
                  placeholder=""
                />
              </Grid>
            ))}
            <Grid item xs={12} md={6}>
              <Checkbox
                checked={acceptCheques}
                onChange={e => setAcceptCheques(e.target.checked)}
                label={t('management.acceptCheques') || 'Accept Cheques'}
                isRTL={isRTL}
              />
            </Grid>
            {acceptCheques && openingBalances.map((entry, idx) => (
              <Grid item xs={12} md={6} key={entry.currency + '-cheques'}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.maxNbChequesPerCurrency') || 'Max. Nb. Cheques for'} {entry.currency}
                </Typography>
                <RTLTextField
                  value={maxCheques[entry.currency] || ''}
                  onChange={e => handleMaxChequesChange(entry.currency, e.target.value)}
                  type="number"
                  placeholder=""
                />
              </Grid>
            ))}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.paymentDay') || 'Payment Day'}
              </Typography>
              <RTLTextField
                value={paymentDay}
                onChange={e => setPaymentDay(e.target.value)}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.trackPayment') || 'Track Payment'}
              </Typography>
              <RTLTextField
                select
                value={trackPayment}
                onChange={e => setTrackPayment(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="">{t('management.selectTrackPayment') || 'Select'}</option>
                <option value="yes">{t('management.yes') || 'Yes'}</option>
                <option value="no">{t('management.no') || 'No'}</option>
              </RTLTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.settlementMethod') || 'Settlement Method'}
              </Typography>
              <RTLTextField
                select
                value={settlementMethod}
                onChange={e => setSettlementMethod(e.target.value)}
                SelectProps={{ native: true }}
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
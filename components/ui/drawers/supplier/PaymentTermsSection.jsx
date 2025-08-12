import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";
import { useDrawerStack } from "@/components/ui/DrawerStackContext";

// Configuration for cleaner code
const FIELD_CONFIG = {
  paymentDay: {
    options: Array.from({ length: 30 }, (_, i) => ({ value: i + 1, label: String(i + 1) }))
  },
  settlementMethod: {
    options: [
      { value: "FIFO", label: "FIFO" },
      { value: "Manual", label: "Manual" }
    ]
  }
};

// Reusable components for cleaner code
const AutocompleteField = React.memo(({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder, 
  isRTL, 
  t, 
  type 
}) => {
  const { openDrawer } = useDrawerStack();
  
  const createOptionsWithAdd = (options, type) => {
    const addOption = { 
      id: 'add', 
      name: `${t('management.add') || 'Add'} ${t(`management.${type}`) || type}`, 
      isAddButton: true 
    };
    return [addOption, ...options];
  };

  const handleChange = (_, newValue) => {
    if (newValue?.isAddButton) {
      openDrawer({
        type,
        props: {
          onSave: (newItem) => {
            onChange(null, newItem);
          },
          type
        },
      });
      return;
    }
    onChange(_, newValue);
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
        {label}
      </Typography>
      <Autocomplete
        fullWidth
        options={createOptionsWithAdd(options, type)}
        getOptionLabel={option => {
          if (option?.isAddButton) return option.name;
          return option ? (option.code || option.name || '') : '';
        }}
        value={value}
        onChange={handleChange}
        renderInput={params => <RTLTextField {...params} placeholder={placeholder} />}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.isAddButton ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                <AddIcon sx={{ fontSize: '1rem' }} />
                {option.name}
              </Box>
            ) : (
              option.code || option.name
            )}
          </Box>
        )}
      />
    </Box>
  );
});

const SelectField = React.memo(({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder, 
  isRTL 
}) => (
  <Box>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
      {label}
    </Typography>
    <RTLTextField
      select
      fullWidth
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      SelectProps={{ native: true }}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </RTLTextField>
  </Box>
));

const PaymentTermsSection = React.memo(({
  formData,
  onFormDataChange,
  isRTL,
  t,
  paymentTerms,
  setPaymentTerms,
  paymentMethods,
  setPaymentMethods,
  selectedPaymentTerm,
  setSelectedPaymentTerm,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  allowCredit,
  setAllowCredit,
  openingBalances,
  creditLimits,
  handleCreditLimitChange,
  acceptCheques,
  setAcceptCheques,
  maxCheques,
  handleMaxChequesChange,
  paymentDay,
  setPaymentDay,
  trackPayment,
  setTrackPayment,
  settlementMethod,
  setSettlementMethod,
  expanded,
  onAccordionChange,
  allCollapsed,
  setAllCollapsed,
  userChangedTrackPayment
}) => {
  const { openDrawer } = useDrawerStack();

  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed, expanded, onAccordionChange, setAllCollapsed]);

  // Sync local state with formData for checkboxes
  React.useEffect(() => {
    if (formData) {
      setAllowCredit(formData.allow_credit !== undefined ? formData.allow_credit : false);
      setAcceptCheques(formData.accept_cheques !== undefined ? formData.accept_cheques : false);
    }
  }, [formData?.allow_credit, formData?.accept_cheques, setAllowCredit, setAcceptCheques]);
  
  // Separate useEffect for track payment - only sync on initial load or when user hasn't manually changed it
  React.useEffect(() => {
    if (formData && formData.track_payment !== undefined && !userChangedTrackPayment.current) {
      setTrackPayment(formData.track_payment === 'yes');
    }
  }, [formData?.track_payment, userChangedTrackPayment.current, setTrackPayment]);

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
  }, [hasOpeningCurrency, allowCredit, setAllowCredit]);

  // Handler for payment term selection
  const handlePaymentTermChange = (_, newValue) => {
    if (newValue?.isAddButton) {
      openDrawer({
        type: "paymentTerm",
        props: {
          onSave: (newTerm) => {
            if (typeof setPaymentTerms === 'function') {
              setPaymentTerms(prev => [...(Array.isArray(prev) ? prev : []), newTerm]);
            }
            setSelectedPaymentTerm(newTerm.id);
            onFormDataChange('payment_term_id', newTerm.id);
          },
          type: "paymentTerm"
        },
      });
      return;
    }
    
    setSelectedPaymentTerm(newValue?.id || null);
    onFormDataChange('payment_term_id', newValue?.id || null);
    
    // Automatically set allowCredit based on payment term nb_days and opening currency
    if (newValue && newValue.nb_days > 0 && hasOpeningCurrency) {
      setAllowCredit(true);
      onFormDataChange('allow_credit', true);
    } else {
      setAllowCredit(false);
      onFormDataChange('allow_credit', false);
    }
  };

  // Handler for payment method selection
  const handlePaymentMethodChange = (_, newValue) => {
    if (newValue?.isAddButton) {
      openDrawer({
        type: "paymentMethod",
        props: {
          onSave: (newMethod) => {
            if (typeof setPaymentMethods === 'function') {
              setPaymentMethods(prev => [...(Array.isArray(prev) ? prev : []), newMethod]);
            }
            setSelectedPaymentMethod(newMethod.id);
            onFormDataChange('payment_method_id', newMethod.id);
          },
          type: "paymentMethod"
        },
      });
      return;
    }
    
    setSelectedPaymentMethod(newValue?.id || null);
    onFormDataChange('payment_method_id', newValue?.id || null);
  };

  // Handler for payment day change
  const handlePaymentDayChange = (e) => {
    const newPaymentDay = e.target.value;
    setPaymentDay(newPaymentDay);
    onFormDataChange('payment_day', newPaymentDay);
  };

  // Handler for settlement method change
  const handleSettlementMethodChange = (e) => {
    const newSettlementMethod = e.target.value;
    setSettlementMethod(newSettlementMethod);
    onFormDataChange('settlement_method', newSettlementMethod);
  };

  // Handler for track payment change
  const handleTrackPaymentChange = (checked) => {
    userChangedTrackPayment.current = true;
    setTrackPayment(checked);
    onFormDataChange('track_payment', checked ? 'yes' : 'no');
    
    // If unchecking track payment, also clear settlement method
    if (!checked) {
      setSettlementMethod('');
      onFormDataChange('settlement_method', '');
    }
  };

  // Handler for accept cheques change
  const handleAcceptChequesChange = (checked) => {
    setAcceptCheques(checked);
    onFormDataChange('accept_cheques', checked);
  };

  // Render credit limit fields
  const renderCreditLimitFields = () => {
    if (!showAllowCreditFields) return null;
    
    return openingBalances.map((entry, idx) => (
      <Box key={entry.currency + '-credit'} sx={{ width: '100%' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
          {t('management.creditLimitPerCurrency') || 'Credit Limit for'} {entry.currency}
        </Typography>
        <RTLTextField
          value={creditLimits[entry.currency] || ''}
          onChange={e => handleCreditLimitChange(entry.currency, e.target.value)}
          type="number"
          placeholder=""
          sx={{ mb: 1 }}
        />
      </Box>
    ));
  };

  // Render max cheques fields
  const renderMaxChequesFields = () => {
    if (!acceptCheques) return null;
    
    return openingBalances.map((entry, idx) => (
      <Box key={entry.currency + '-cheques'} sx={{ width: '100%' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
          {t('management.maxNbChequesPerCurrency') || 'Max. Nb. Cheques for'} {entry.currency}
        </Typography>
        <RTLTextField
          value={maxCheques[entry.currency] || ''}
          onChange={e => handleMaxChequesChange(entry.currency, e.target.value)}
          type="number"
          placeholder=""
          sx={{ mb: 1 }}
        />
      </Box>
    ));
  };

  return (
    <Accordion expanded={expanded} onChange={onAccordionChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t('management.paymentTermsAccordion') || 'Payment Terms'}
          </Typography>
          
          {/* Show payment term combobox and credit fields under header only when collapsed */}
          {!expanded && (
            <Box sx={{ mt: 1, width: { xs: '100%', sm: '80%' } }}>
              <Box 
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
              >
                <AutocompleteField
                  label={t('management.paymentTerm') || 'Payment Term'}
                  options={paymentTerms}
                  value={paymentTerms.find(pt => pt.id === selectedPaymentTerm) || null}
                  onChange={handlePaymentTermChange}
                  placeholder=""
                  isRTL={isRTL}
                  t={t}
                  type="paymentTerm"
                />
              </Box>
              
              {/* Show credit fields if conditions are met */}
              {showAllowCreditFields && (
                <Box 
                  onClick={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                  onFocus={e => e.stopPropagation()}
                >
                  {renderCreditLimitFields()}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </AccordionSummary>
      
      <AccordionDetails>
        <Grid container spacing={3}>
          {/* First line: Payment Term and Payment Method */}
          <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
            <AutocompleteField
              label={t('management.paymentTerm') || 'Payment Term'}
              options={paymentTerms}
              value={paymentTerms.find(pt => pt.id === selectedPaymentTerm) || null}
              onChange={handlePaymentTermChange}
              placeholder=""
              isRTL={isRTL}
              t={t}
              type="paymentTerm"
            />
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
            <AutocompleteField
              label={t('management.paymentMethod') || 'Payment Method'}
              options={paymentMethods}
              value={paymentMethods.find(pm => pm.id === selectedPaymentMethod) || null}
              onChange={handlePaymentMethodChange}
              placeholder=""
              isRTL={isRTL}
              t={t}
              type="paymentMethod"
            />
          </Grid>

          {/* Second line: Credit limit fields if conditions are met */}
          {showAllowCreditFields && (
            <Grid item xs={12} md={6} sx={{ minWidth: 800, display: 'flex', alignItems: 'center', gap: 0 }}>
              {renderCreditLimitFields()}
            </Grid>
          )}
          
          {/* Payment Day - visible when opening currency exists and payment term has nb_days > 0 */}
          {showAllowCreditFields && (
            <Grid item xs={12} md={4} sx={{ minWidth: 200 }}>
              <SelectField
                label={t('management.paymentDay') || 'Payment Day'}
                options={FIELD_CONFIG.paymentDay.options}
                value={paymentDay}
                onChange={handlePaymentDayChange}
                placeholder={t('management.selectPaymentDay') || 'Select'}
                isRTL={isRTL}
              />
            </Grid>
          )}

          {/* Track Payment - visible when opening currency exists, payment term has nb_days > 0 */}
          {showAllowCreditFields && (
            <Grid item xs={12} md={4} sx={{ minWidth: 150, display: 'flex', alignItems: 'center', gap: 0 }}>
              <Checkbox
                checked={!!trackPayment}
                onChange={e => handleTrackPaymentChange(e.target.checked)}
                label={t('management.trackPayment') || 'Track Payment'}
                isRTL={isRTL}
              />
            </Grid>
          )}
          
          {/* Settlement Method - visible when opening currency exists, payment term has nb_days > 0, AND track payment is checked */}
          {showAllowCreditFields && trackPayment && (
            <Grid item xs={12} md={4} sx={{ minWidth: 200 }}>
              <SelectField
                label={t('management.settlementMethod') || 'Settlement Method'}
                options={FIELD_CONFIG.settlementMethod.options}
                value={settlementMethod || 'FIFO'}
                onChange={handleSettlementMethodChange}
                placeholder=""
                isRTL={isRTL}
              />
            </Grid>
          )}
          
          {/* Accept Cheques section - always visible */}
          <Grid item xs={12} md={6} sx={{ minWidth: 800, display: 'flex', alignItems: 'center', gap: 0 }}>
            <Checkbox
              checked={acceptCheques}
              onChange={e => handleAcceptChequesChange(e.target.checked)}
              label={t('management.acceptCheques') || 'Accept Cheques'}
              isRTL={isRTL}
              disabled={!hasOpeningCurrency}
            />
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ minWidth: 800, display: 'flex', alignItems: 'center', gap: 0 }}>
            {renderMaxChequesFields()}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default PaymentTermsSection;

"use client";

import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";
import { useDrawerStack } from "@/components/ui/DrawerStackContext";

// Reusable Autocomplete field component
const AutocompleteField = React.memo(({
  label,
  options,
  value,
  onChange,
  onAddNew,
  loading,
  type,
  setterFunction,
  onFormDataChange,
  fieldName,
  isRTL
}) => {
  const { openDrawer } = useDrawerStack();

  // Create options with Add button as first option
  const createOptionsWithAdd = (options, type) => {
    const addOption = { 
      id: 'add', 
      name: `${label} ${type}`, 
      isAddButton: true 
    };
    return [addOption, ...options];
  };

  const handleChange = (event, newValue) => {
    if (newValue?.isAddButton) {
      openDrawer({
        type: type,
        props: {
          onSave: (newItem) => {
            if (typeof setterFunction === 'function') {
              setterFunction(prev => {
                const updated = [...(Array.isArray(prev) ? prev : []), newItem];
                return updated;
              });
            }
            // Select the new item
            onFormDataChange(fieldName, newItem.id);
          },
        },
      });
      return;
    }
    onChange(event, newValue);
  };

  return (
    <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
        {label}
      </Typography>
      <Autocomplete
        fullWidth
        options={createOptionsWithAdd(options, type)}
        getOptionLabel={(option) => option.name || ""}
        value={options.find((item) => item.id === value) || null}
        onChange={handleChange}
        loading={loading}
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
                option.name
              )}
            </Box>
          );
        }}
      />
    </Grid>
  );
});

// Reusable select field component
const SelectField = React.memo(({
  label,
  value,
  onChange,
  options,
  placeholder,
  isRTL
}) => (
  <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
      {label}
    </Typography>
    <RTLTextField
      select
      fullWidth
      value={value || ""}
      onChange={onChange}
      placeholder=""
      SelectProps={{ native: true }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </RTLTextField>
  </Grid>
));

const CategorizeSection = React.memo(({ 
  formData, 
  onFormDataChange, 
  isRTL, 
  t, 
  trades, 
  supplierGroups, 
  businessTypes, 
  loading, 
  handleTradeChange, 
  handleSupplierGroupChange, 
  handleBusinessTypeChange, 
  expanded, 
  onAccordionChange, 
  allCollapsed, 
  setAllCollapsed, 
  setTrades, 
  setSupplierGroups, 
  setBusinessTypes 
}) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed, expanded, onAccordionChange, setAllCollapsed]);

  const { openDrawer } = useDrawerStack();

  // Indicator options
  const indicatorOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" }
  ];

  // Handle supplier group add from collapsed section
  const handleSupplierGroupAdd = (newGroup) => {
    if (typeof setSupplierGroups === 'function') {
      setSupplierGroups(prev => {
        const updated = [...(Array.isArray(prev) ? prev : []), newGroup];
        return updated;
      });
    }
    onFormDataChange('supplier_group_id', newGroup.id);
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={onAccordionChange}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="categorize-content"
        id="categorize-header"
        tabIndex={-1}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t("management.categorize") || "Categorize"}
          </Typography>
          {/* Show supplier group under header only when collapsed */}
          {!expanded && (
            <Box sx={{ mt: 1, width: { xs: '100%', sm: '60%' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.supplierGroup") || "Supplier Group"}
              </Typography>
              <Box 
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
              >
                <Autocomplete
                  options={[{ id: 'add', name: `${t('management.add') || 'Add'} ${t('management.supplierGroup') || 'Supplier Group'}`, isAddButton: true }, ...supplierGroups]}
                  getOptionLabel={(option) => option.name || ""}
                  value={supplierGroups.find((group) => group.id === formData?.supplier_group_id) || null}
                  onChange={(event, newValue) => {
                    if (newValue?.isAddButton) {
                      openDrawer({
                        type: "supplierGroup",
                        props: {
                          onSave: handleSupplierGroupAdd,
                        },
                      });
                      return;
                    }
                    handleSupplierGroupChange(event, newValue);
                  }}
                  loading={loading}
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
                          option.name
                        )}
                      </Box>
                    );
                  }}
                  sx={{ background: 'background.paper' }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Trade Field */}
          <AutocompleteField
            label={t("management.trade") || "Trade"}
            options={trades}
            value={formData?.trade_id}
            onChange={handleTradeChange}
            loading={loading}
            type="trade"
            setterFunction={setTrades}
            onFormDataChange={onFormDataChange}
            fieldName="trade_id"
            isRTL={isRTL}
          />

          {/* Supplier Group Field */}
          <AutocompleteField
            label={t("management.supplierGroup") || "Supplier Group"}
            options={supplierGroups}
            value={formData?.supplier_group_id}
            onChange={handleSupplierGroupChange}
            loading={loading}
            type="supplierGroup"
            setterFunction={setSupplierGroups}
            onFormDataChange={onFormDataChange}
            fieldName="supplier_group_id"
            isRTL={isRTL}
          />

          {/* Business Type Field */}
          <AutocompleteField
            label={t("management.businessType") || "Business Type"}
            options={businessTypes}
            value={formData?.business_type_id}
            onChange={handleBusinessTypeChange}
            loading={loading}
            type="businessType"
            setterFunction={setBusinessTypes}
            onFormDataChange={onFormDataChange}
            fieldName="business_type_id"
            isRTL={isRTL}
          />

          {/* Indicator Field */}
          <SelectField
            label={t("management.indicator") || "Indicator"}
            value={formData?.indicator}
            onChange={(e) => onFormDataChange('indicator', e.target.value)}
            options={indicatorOptions}
            placeholder={t("management.selectIndicator") || "Select Indicator"}
            isRTL={isRTL}
          />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default CategorizeSection;

"use client";

import React from "react";
import { Grid, Typography, Autocomplete, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";
import { useDrawerStack } from "@/components/ui/DrawerStackContext";

// Shared field configuration for better maintainability
export const FIELD_CONFIG = {
  address_line1: { type: "text", required: true, gridProps: { xs: 12, minWidth: 400 } },
  address_line2: { type: "text", required: false, gridProps: { xs: 12, minWidth: 400 } },
  building: { type: "text", required: false, gridProps: { xs: 12, md: 4, minWidth: 250 } },
  block: { type: "text", required: false, gridProps: { xs: 12, md: 4, minWidth: 250 } },
  floor: { type: "text", required: false, gridProps: { xs: 12, md: 4, minWidth: 250 } },
  side: { type: "text", required: false, gridProps: { xs: 12, md: 4, minWidth: 250 } },
  apartment: { type: "text", required: false, gridProps: { xs: 12, md: 6, minWidth: 250 } },
  zip_code: { type: "text", required: false, gridProps: { xs: 12, md: 6, minWidth: 250 } }
};

// Shared location field configuration
export const LOCATION_FIELDS = [
  { field: 'country', label: 'country', minWidth: 350 },
  { field: 'city', label: 'city', minWidth: 350 },
  { field: 'district', label: 'district', minWidth: 350 },
  { field: 'zone', label: 'zone', minWidth: 350 }
];

// Shared field to translation key mapping
export const FIELD_TRANSLATION_MAP = {
  address_line1: 'addressLine1',
  address_line2: 'addressLine2',
  building: 'building',
  block: 'block',
  floor: 'floor',
  side: 'side',
  apartment: 'apartment',
  zip_code: 'zipCode'
};

// Reusable text field component
export const TextField = React.memo(({ 
  field, 
  config, 
  value, 
  onChange, 
  t, 
  isRTL, 
  gridProps = {} 
}) => {
  const { type, required, gridProps: fieldGridProps } = config;
  const translationKey = FIELD_TRANSLATION_MAP[field] || field.replace(/_/g, '');
  const label = t(`management.${translationKey}`) || field.replace(/_/g, ' ');
  
  return (
    <Grid item xs={12} md={3} {...fieldGridProps} {...gridProps}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
        {label} {required && "*"}
      </Typography>
      <RTLTextField
        fullWidth
        value={value || ""}
        onChange={onChange}
        required={required}
      />
    </Grid>
  );
});

// Reusable location field component
export const LocationField = React.memo(({ 
  field, 
  options, 
  value, 
  onChange, 
  onAddNew, 
  t, 
  loading, 
  minWidth 
}) => {
  const { openDrawer } = useDrawerStack();
  
  // Create options with Add button as first option
  const createOptionsWithAdd = (options, type) => {
    const addOption = { 
      id: 'add', 
      name: `${t('management.add') || 'Add'} ${t(`management.${type}`) || type}`, 
      isAddButton: true 
    };
    return [addOption, ...options];
  };

  const handleChange = (event, newValue) => {
    if (newValue?.isAddButton) {
      openDrawer({
        type: field,
        props: {
          onSave: (newItem) => {
            // Add the new item to the state
            onAddNew(newItem);
            // Automatically select the new item in the form
            onChange(newItem.id);
          },
        },
      });
      return;
    }
    onChange(newValue?.id || "");
  };

  const selectedValue = options.find((option) => option.id === value) || null;

  return (
    <Grid item xs={12} md={6} sx={{ minWidth }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'left' }}>
        {t(`management.${field}`) || field.charAt(0).toUpperCase() + field.slice(1)}
      </Typography>
      <Autocomplete
        fullWidth
        options={createOptionsWithAdd(options, field)}
        getOptionLabel={(option) => option.name || ""}
        value={selectedValue}
        onChange={handleChange}
        loading={loading}
        renderInput={(params) => <RTLTextField {...params} placeholder="" />}
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
      />
    </Grid>
  );
});

// Shared utility functions
export const createOptionsWithAdd = (options, type, t) => {
  const addOption = { 
    id: 'add', 
    name: `${t('management.add') || 'Add'} ${t(`management.${type}`) || type}`, 
    isAddButton: true 
  };
  return [addOption, ...options];
};

export const renderLocationFields = (LOCATION_FIELDS, countries, zones, cities, districts, formData, prefix, onChange, onAddNew, t, loading) => {
  return LOCATION_FIELDS.map(({ field, label, minWidth }) => (
    <LocationField
      key={field}
      field={field}
      options={field === 'country' ? countries : field === 'zone' ? zones : field === 'city' ? cities : districts}
      value={formData[`${prefix}_${field}_id`]}
      onChange={onChange(field)}
      onAddNew={onAddNew(field)}
      t={t}
      loading={loading}
      minWidth={minWidth}
    />
  ));
};

export const renderAddressFields = (FIELD_CONFIG, formData, prefix, onChange, t, isRTL) => {
  return Object.entries(FIELD_CONFIG).map(([field, config]) => (
    <TextField
      key={field}
      field={field}
      config={config}
      value={formData[`${prefix}_${field}`]}
      onChange={onChange(field)}
      t={t}
      isRTL={isRTL}
      gridProps={config.gridProps}
    />
  ));
};

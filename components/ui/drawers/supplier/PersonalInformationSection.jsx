"use client";

import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import RTLTextField from "@/components/ui/RTLTextField";

// Field configuration for better maintainability
const FIELD_CONFIG = {
  title: {
    type: "select",
    required: false,
    options: [
      { value: "", label: "Select Title" },
      { value: "Mr.", label: "Mr." },
      { value: "Mrs.", label: "Mrs." },
      { value: "Ms.", label: "Ms." },
      { value: "Dr.", label: "Dr." },
      { value: "Prof.", label: "Prof." }
    ]
  },
  first_name: { type: "text", required: true },
  middle_name: { type: "text", required: false },
  last_name: { type: "text", required: true },
  company_name: { type: "text", required: false },
  phone1: { type: "text", required: true },
  phone2: { type: "text", required: false },
  phone3: { type: "text", required: false }
};

// Field to translation key mapping
const FIELD_TRANSLATION_MAP = {
  title: "title",
  first_name: "firstName",
  middle_name: "middleName",
  last_name: "lastName",
  company_name: "companyName",
  phone1: "phone1",
  phone2: "phone2",
  phone3: "phone3"
};

// Reusable field component
const FormField = React.memo(({ 
  field, 
  config, 
  value, 
  onChange, 
  t, 
  isRTL, 
  gridProps = {} 
}) => {
  const { type, required, options } = config;
  const translationKey = FIELD_TRANSLATION_MAP[field] || field;
  const label = t(`management.${translationKey}`) || field.replace('_', ' ');
  
  if (type === "select") {
    return (
      <Grid item xs={12} sm={6} md={3} sx={{ maxWidth: 100 }} {...gridProps}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
          {label}
        </Typography>
        <RTLTextField
          select
          fullWidth
          value={value || ""}
          onChange={onChange}
          SelectProps={{ native: true }}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.value === "" ? t("management.selectTitle") : option.label}
            </option>
          ))}
        </RTLTextField>
      </Grid>
    );
  }

  return (
    <Grid item xs={12} sm={6} md={3} {...gridProps}>
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

const PersonalInformationSection = React.memo(({
  formData,
  onFormDataChange,
  isRTL,
  t,
  expanded,
  onAccordionChange,
  generateDisplayNameSuggestions,
  handleDisplayNameChange,
  handleFieldChange,
}) => {
  const displayNameSuggestions = generateDisplayNameSuggestions ? generateDisplayNameSuggestions() : [];

  const renderPersonalInfoFields = () => {
    const fields = ['title', 'first_name', 'middle_name', 'last_name'];
    
    return (
      <Grid container spacing={1.5}>
        {fields.map(field => (
          <FormField
            key={field}
            field={field}
            config={FIELD_CONFIG[field]}
            value={formData?.[field]}
            onChange={handleFieldChange(field)}
            t={t}
            isRTL={isRTL}
          />
        ))}
      </Grid>
    );
  };

  const renderContactFields = () => {
    const fields = ['company_name'];
    
    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8} sx={{ minWidth: 350 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
            {t("management.displayName") || "Display Name"}
          </Typography>
          <Autocomplete
            fullWidth
            freeSolo
            options={displayNameSuggestions}
            value={formData?.display_name || ""}
            onChange={handleDisplayNameChange}
            renderInput={(params) => (
              <RTLTextField {...params} />
            )}
          />
        </Grid>
        
        {fields.map(field => (
          <FormField
            key={field}
            field={field}
            config={FIELD_CONFIG[field]}
            value={formData?.[field]}
            onChange={handleFieldChange(field)}
            t={t}
            isRTL={isRTL}
            gridProps={{ xs: 12, md: 6 }}
          />
        ))}
      </Grid>
    );
  };

  const renderPhoneFields = () => {
    const phoneFields = ['phone1', 'phone2', 'phone3'];
    
    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {phoneFields.map(field => (
          <FormField
            key={field}
            field={field}
            config={FIELD_CONFIG[field]}
            value={formData?.[field]}
            onChange={handleFieldChange(field)}
            t={t}
            isRTL={isRTL}
            gridProps={{ xs: 12, sm: 4 }}
          />
        ))}
      </Grid>
    );
  };

  return (
    <Accordion expanded={expanded} onChange={onAccordionChange}>
      <AccordionSummary>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {t("management.personalInformation") || "Personal Information"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {renderPersonalInfoFields()}
        {renderContactFields()}
        {renderPhoneFields()}
      </AccordionDetails>
    </Accordion>
  );
});

export default PersonalInformationSection;

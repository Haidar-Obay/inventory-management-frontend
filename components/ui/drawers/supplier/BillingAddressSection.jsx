"use client";

import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";
import { 
  FIELD_CONFIG, 
  LOCATION_FIELDS, 
  TextField, 
  LocationField,
  renderLocationFields,
  renderAddressFields
} from "./shared/AddressFieldComponents";
import { useAddressManagement } from "./shared/useAddressManagement";

const BillingAddressSection = React.memo(({ 
  formData, 
  onFormDataChange, 
  isRTL, 
  t, 
  countries, 
  setCountries, 
  zones, 
  setZones, 
  cities, 
  setCities, 
  districts, 
  setDistricts, 
  loading, 
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

  // Use custom hook for address management
  const { handleFieldChange, handleLocationChange, handleLocationAdd } = useAddressManagement(
    formData, 
    onFormDataChange, 
    'billing'
  );

  // Create setters object for location management
  const locationSetters = { setCountries, setZones, setCities, setDistricts };

  return (
    <Accordion expanded={expanded} onChange={onAccordionChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="billing-address-content"
        id="billing-address-header"
        tabIndex={-1}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t("management.billingAddress") || "Billing Address"}
          </Typography>
          {/* Show addressLine1 under header only when collapsed */}
          {!expanded && (
            <Box sx={{ mt: 1, width: { xs: '100%', sm: '60%' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.addressLine1") || "Address Line 1"}
              </Typography>
              <RTLTextField
                value={formData?.billing_address_line1 || ""}
                onChange={handleFieldChange('address_line1')}
                placeholder=""
                onClick={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
                onKeyDown={e => { 
                  if ((e.key === ' ' || e.key === 'Spacebar') && !expanded) { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                  } 
                }}
                sx={{ background: 'background.paper' }}
              />
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Location fields */}
          {renderLocationFields(
            LOCATION_FIELDS, 
            countries, 
            zones, 
            cities, 
            districts, 
            formData, 
            'billing', 
            handleLocationChange, 
            (field) => handleLocationAdd(field, locationSetters), 
            t, 
            loading
          )}
          
          {/* Address fields */}
          {renderAddressFields(
            FIELD_CONFIG, 
            formData, 
            'billing', 
            handleFieldChange, 
            t, 
            isRTL
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default BillingAddressSection;

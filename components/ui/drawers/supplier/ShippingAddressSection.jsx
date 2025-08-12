"use client";

import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Button, Box, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";
import { 
  FIELD_CONFIG, 
  LOCATION_FIELDS, 
  FIELD_TRANSLATION_MAP,
  TextField, 
  LocationField,
  renderLocationFields,
  renderAddressFields,
  createOptionsWithAdd
} from "./shared/AddressFieldComponents";
import { useAddressManagement } from "./shared/useAddressManagement";

const ShippingAddressSection = React.memo(({ 
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
  shippingAddresses, 
  setShippingAddresses, 
  handleCopyFromBillingAddress, 
  handleAddShippingAddress, 
  handleRemoveShippingAddress, 
  handleShippingAddressChange, 
  handleCopyToShippingAddress, 
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
  const { handleFieldChange, handleLocationChange, handleLocationAdd, hasAddressData } = useAddressManagement(
    formData, 
    onFormDataChange, 
    'shipping'
  );

  // Create setters object for location management
  const locationSetters = { setCountries, setZones, setCities, setDistricts };

  // Helper to check if at least one field in the main shipping address is filled
  const canAddShippingAddress = () => hasAddressData();

  return (
    <Accordion expanded={expanded} onChange={onAccordionChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="shipping-address-content"
        id="shipping-address-header"
        tabIndex={-1}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t("management.shippingAddress") || "Shipping Address"}
          </Typography>
          {/* Show addressLine1 and copy button under header only when collapsed */}
          {!expanded && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: '80%' } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.addressLine1") || "Address Line 1"}
                </Typography>
                <RTLTextField
                  value={formData?.shipping_address_line1 || ""}
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
              <Button
                variant="outlined"
                size="small"
                onClick={e => { e.stopPropagation(); handleCopyFromBillingAddress(); }}
                sx={{ minWidth: 'auto', px: 2, py: 0.5, fontSize: '0.75rem', textTransform: 'none', whiteSpace: 'nowrap' }}
                tabIndex={-1}
              >
                {t("management.copyFromBillingAddress") || "Copy from Billing Address"}
              </Button>
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {/* Header Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCopyFromBillingAddress}
            sx={{ minWidth: 'auto', px: 2, py: 0.5, fontSize: '0.75rem', textTransform: 'none' }}
            tabIndex={-1}
          >
            {t("management.copyFromBillingAddress") || "Copy from Billing Address"}
          </Button>
        </Box>

        {/* Primary Shipping Address */}
        <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500, color: 'primary.main' }}>
            {t("management.primaryShippingAddress") || "Primary Shipping Address"}
          </Typography>
          <Grid container spacing={2}>
            {/* Location fields */}
            {renderLocationFields(
              LOCATION_FIELDS, 
              countries, 
              zones, 
              cities, 
              districts, 
              formData, 
              'shipping', 
              handleLocationChange, 
              (field) => handleLocationAdd(field, locationSetters), 
              t, 
              loading
            )}
            
            {/* Address fields */}
            {renderAddressFields(
              FIELD_CONFIG, 
              formData, 
              'shipping', 
              handleFieldChange, 
              t, 
              isRTL
            )}
          </Grid>
        </Box>

        {/* Additional Shipping Addresses */}
        {shippingAddresses.map((address, index) => (
          <Box key={address.id} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                {`${t("management.additionalShippingAddress") || "Additional Shipping Address"} ${index + 1}`}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleCopyToShippingAddress(index)}
                  sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                >
                  {t("management.copyFromBillingAddress") || "Copy from Billing Address"}
                </Button>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveShippingAddress(index)}
                  sx={{ color: 'error.main', '&:hover': { backgroundColor: 'error.light', color: 'white' } }}
                >
                  <Typography variant="h6" sx={{ fontSize: '1rem' }}>×</Typography>
                </IconButton>
              </Box>
            </Box>
    
            <Grid container spacing={2}>
              {/* Location fields for additional addresses */}
              {LOCATION_FIELDS.map(({ field, label, minWidth }) => (
                <Grid item xs={12} md={6} sx={{ minWidth }} key={field}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                    {t(`management.${field}`) || field.charAt(0).toUpperCase() + field.slice(1)}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={field === 'country' ? countries : field === 'zone' ? zones : field === 'city' ? cities : districts}
                    getOptionLabel={(option) => option.name || ""}
                    value={field === 'country' ? countries.find(c => c.id === address.country_id) : 
                           field === 'zone' ? zones.find(z => z.id === address.zone_id) :
                           field === 'city' ? cities.find(c => c.id === address.city_id) :
                           districts.find(d => d.id === address.district_id) || null}
                    onChange={(_, newValue) => {
                      const fieldId = `${field}_id`;
                      handleShippingAddressChange(index, fieldId, newValue?.id || "");
                    }}
                    loading={loading}
                    renderInput={(params) => <RTLTextField {...params} placeholder="" />}
                  />
                </Grid>
              ))}
              
              {/* Address fields for additional addresses */}
              {Object.entries(FIELD_CONFIG).map(([field, config]) => (
                <Grid item {...config.gridProps} key={field}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                    {t(`management.${FIELD_TRANSLATION_MAP[field] || field.replace(/_/g, '')}`) || field.replace(/_/g, ' ')}
                  </Typography>
                  <RTLTextField
                    fullWidth
                    value={address[field] || ""}
                    onChange={e => handleShippingAddressChange(index, field, e.target.value)}
                    placeholder=""
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
        
        {/* Add button at the end */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddShippingAddress}
            disabled={!canAddShippingAddress()}
          >
            {t('management.add') || 'Add'}
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

export default ShippingAddressSection;

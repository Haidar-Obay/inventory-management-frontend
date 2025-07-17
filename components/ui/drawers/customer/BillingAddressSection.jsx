import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";

const BillingAddressSection = React.memo(({ formData, onFormDataChange, isRTL, t, countries, zones, cities, districts, loading, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
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
        aria-controls="billing-address-content"
        id="billing-address-header"
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
                onChange={e => onFormDataChange({ ...formData, billing_address_line1: e.target.value })}
                placeholder=""
                // Prevent focus/keyboard from expanding the accordion
                onClick={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
                onKeyDown={e => { if ((e.key === ' ' || e.key === 'Spacebar') && !expanded) { e.preventDefault(); e.stopPropagation(); } }}
                sx={{ background: 'background.paper' }}
              />
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sx={{ minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.country") || "Country"}
            </Typography>
            <Autocomplete
              fullWidth
              options={countries}
              getOptionLabel={(option) => option.name || ""}
              value={countries.find((country) => country.id === formData?.billing_country_id) || null}
              onChange={(event, newValue) => {
                onFormDataChange({
                  ...formData,
                  billing_country_id: newValue?.id || "",
                  billing_zone_id: "",
                  billing_city_id: "",
                  billing_district_id: "",
                });
              }}
              loading={loading}
              renderInput={(params) => <RTLTextField {...params} placeholder="" />}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.zone") || "Zone"}
            </Typography>
            <Autocomplete
              fullWidth
              options={zones}
              getOptionLabel={(option) => option.name || ""}
              value={zones.find((zone) => zone.id === formData?.billing_zone_id) || null}
              onChange={(event, newValue) => {
                onFormDataChange({
                  ...formData,
                  billing_zone_id: newValue?.id || "",
                  billing_city_id: "",
                  billing_district_id: "",
                });
              }}
              loading={loading}
              renderInput={(params) => <RTLTextField {...params} placeholder="" />}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.city") || "City"}
            </Typography>
            <Autocomplete
              fullWidth
              options={cities}
              getOptionLabel={(option) => option.name || ""}
              value={cities.find((city) => city.id === formData?.billing_city_id) || null}
              onChange={(event, newValue) => {
                onFormDataChange({
                  ...formData,
                  billing_city_id: newValue?.id || "",
                  billing_district_id: "",
                });
              }}
              loading={loading}
              renderInput={(params) => <RTLTextField {...params} placeholder="" />}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.district") || "District"}
            </Typography>
            <Autocomplete
              fullWidth
              options={districts}
              getOptionLabel={(option) => option.name || ""}
              value={districts.find((district) => district.id === formData?.billing_district_id) || null}
              onChange={(event, newValue) => {
                onFormDataChange({
                  ...formData,
                  billing_district_id: newValue?.id || "",
                });
              }}
              loading={loading}
              renderInput={(params) => <RTLTextField {...params} placeholder="" />}
            />
          </Grid>
          {/* Address Line 1 inside details, only when expanded */}
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.addressLine1") || "Address Line 1"}
            </Typography>
            <RTLTextField
              value={formData?.billing_address_line1 || ""}
              onChange={e => onFormDataChange({ ...formData, billing_address_line1: e.target.value })}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.addressLine2") || "Address Line 2"}
            </Typography>
            <RTLTextField
              value={formData?.billing_address_line2 || ""}
              onChange={e => onFormDataChange({ ...formData, billing_address_line2: e.target.value })}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.building") || "Building"}
            </Typography>
            <RTLTextField
              value={formData?.billing_building || ""}
              onChange={e => onFormDataChange({ ...formData, billing_building: e.target.value })}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.block") || "Block"}
            </Typography>
            <RTLTextField
              value={formData?.billing_block || ""}
              onChange={e => onFormDataChange({ ...formData, billing_block: e.target.value })}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.side") || "Side"}
            </Typography>
            <RTLTextField
              value={formData?.billing_side || ""}
              onChange={e => onFormDataChange({ ...formData, billing_side: e.target.value })}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.apartment") || "Apartment"}
            </Typography>
            <RTLTextField
              value={formData?.billing_apartment || ""}
              onChange={e => onFormDataChange({ ...formData, billing_apartment: e.target.value })}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.zipCode") || "Zip Code"}
            </Typography>
            <RTLTextField
              value={formData?.billing_zip_code || ""}
              onChange={e => onFormDataChange({ ...formData, billing_zip_code: e.target.value })}
              placeholder=""
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default BillingAddressSection; 
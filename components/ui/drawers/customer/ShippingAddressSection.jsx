import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Button, Box, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";

const ShippingAddressSection = React.memo(({ formData, onFormDataChange, isRTL, t, countries, zones, cities, districts, loading, shippingAddresses, setShippingAddresses, handleCopyFromBillingAddress, handleAddShippingAddress, handleRemoveShippingAddress, handleShippingAddressChange, handleCopyToShippingAddress, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
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
        aria-controls="shipping-address-content"
        id="shipping-address-header"
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
                  onChange={e => onFormDataChange({ ...formData, shipping_address_line1: e.target.value })}
                  placeholder=""
                  onClick={e => e.stopPropagation()}
                  onFocus={e => e.stopPropagation()}
                  onKeyDown={e => { if ((e.key === ' ' || e.key === 'Spacebar') && !expanded) { e.preventDefault(); e.stopPropagation(); } }}
                  sx={{ background: 'background.paper' }}
                />
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={e => { e.stopPropagation(); handleCopyFromBillingAddress(); }}
                sx={{ minWidth: 'auto', px: 2, py: 0.5, fontSize: '0.75rem', textTransform: 'none', whiteSpace: 'nowrap' }}
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
          >
            {t("management.copyFromBillingAddress") || "Copy from Billing Address"}
          </Button>
          <IconButton
            size="small"
            onClick={handleAddShippingAddress}
            sx={{ color: 'primary.main', '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        {/* Primary Shipping Address */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500, color: 'primary.main' }}>
            {t("management.primaryShippingAddress") || "Primary Shipping Address"}
          </Typography>
          <Grid container spacing={2}>
            {/* Country, Zone, City, District, Address fields for primary shipping address */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.country") || "Country"}
              </Typography>
              <Autocomplete
                fullWidth
                options={countries}
                getOptionLabel={(option) => option.name || ""}
                value={countries.find((country) => country.id === formData?.shipping_country_id) || null}
                onChange={(event, newValue) => {
                  onFormDataChange({
                    ...formData,
                    shipping_country_id: newValue?.id || "",
                    shipping_zone_id: "",
                    shipping_city_id: "",
                    shipping_district_id: "",
                  });
                }}
                loading={loading}
                renderInput={(params) => <RTLTextField {...params} placeholder="" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.zone") || "Zone"}
              </Typography>
              <Autocomplete
                fullWidth
                options={zones}
                getOptionLabel={(option) => option.name || ""}
                value={zones.find((zone) => zone.id === formData?.shipping_zone_id) || null}
                onChange={(event, newValue) => {
                  onFormDataChange({
                    ...formData,
                    shipping_zone_id: newValue?.id || "",
                    shipping_city_id: "",
                    shipping_district_id: "",
                  });
                }}
                loading={loading}
                renderInput={(params) => <RTLTextField {...params} placeholder="" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.city") || "City"}
              </Typography>
              <Autocomplete
                fullWidth
                options={cities}
                getOptionLabel={(option) => option.name || ""}
                value={cities.find((city) => city.id === formData?.shipping_city_id) || null}
                onChange={(event, newValue) => {
                  onFormDataChange({
                    ...formData,
                    shipping_city_id: newValue?.id || "",
                    shipping_district_id: "",
                  });
                }}
                loading={loading}
                renderInput={(params) => <RTLTextField {...params} placeholder="" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.district") || "District"}
              </Typography>
              <Autocomplete
                fullWidth
                options={districts}
                getOptionLabel={(option) => option.name || ""}
                value={districts.find((district) => district.id === formData?.shipping_district_id) || null}
                onChange={(event, newValue) => {
                  onFormDataChange({
                    ...formData,
                    shipping_district_id: newValue?.id || "",
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
                value={formData?.shipping_address_line1 || ""}
                onChange={e => onFormDataChange({ ...formData, shipping_address_line1: e.target.value })}
                placeholder=""
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.addressLine2") || "Address Line 2"}
              </Typography>
              <RTLTextField
                value={formData?.shipping_address_line2 || ""}
                onChange={e => onFormDataChange({ ...formData, shipping_address_line2: e.target.value })}
                placeholder=""
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.building") || "Building"}
              </Typography>
              <RTLTextField
                value={formData?.shipping_building || ""}
                onChange={e => onFormDataChange({ ...formData, shipping_building: e.target.value })}
                placeholder=""
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.block") || "Block"}
              </Typography>
              <RTLTextField
                value={formData?.shipping_block || ""}
                onChange={e => onFormDataChange({ ...formData, shipping_block: e.target.value })}
                placeholder=""
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.side") || "Side"}
              </Typography>
              <RTLTextField
                value={formData?.shipping_side || ""}
                onChange={e => onFormDataChange({ ...formData, shipping_side: e.target.value })}
                placeholder=""
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.apartment") || "Apartment"}
              </Typography>
              <RTLTextField
                value={formData?.shipping_apartment || ""}
                onChange={e => onFormDataChange({ ...formData, shipping_apartment: e.target.value })}
                placeholder=""
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.zipCode") || "Zip Code"}
              </Typography>
              <RTLTextField
                value={formData?.shipping_zip_code || ""}
                onChange={e => onFormDataChange({ ...formData, shipping_zip_code: e.target.value })}
                placeholder=""
              />
            </Grid>
          </Grid>
        </Box>
        {/* Additional Shipping Addresses */}
        {shippingAddresses.map((address, index) => (
          <Box key={address.id} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                {t("management.additionalShippingAddress") || "Additional Shipping Address"} {index + 1}
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
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.country") || "Country"}
                </Typography>
                <Autocomplete
                  fullWidth
                  options={countries}
                  getOptionLabel={(option) => option.name || ""}
                  value={countries.find((country) => country.id === address.country_id) || null}
                  onChange={(event, newValue) => {
                    handleShippingAddressChange(index, 'country_id', newValue?.id || "");
                  }}
                  loading={loading}
                  renderInput={(params) => <RTLTextField {...params} placeholder="" />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.zone") || "Zone"}
                </Typography>
                <Autocomplete
                  fullWidth
                  options={zones}
                  getOptionLabel={(option) => option.name || ""}
                  value={zones.find((zone) => zone.id === address.zone_id) || null}
                  onChange={(event, newValue) => {
                    handleShippingAddressChange(index, 'zone_id', newValue?.id || "");
                  }}
                  loading={loading}
                  renderInput={(params) => <RTLTextField {...params} placeholder="" />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.city") || "City"}
                </Typography>
                <Autocomplete
                  fullWidth
                  options={cities}
                  getOptionLabel={(option) => option.name || ""}
                  value={cities.find((city) => city.id === address.city_id) || null}
                  onChange={(event, newValue) => {
                    handleShippingAddressChange(index, 'city_id', newValue?.id || "");
                  }}
                  loading={loading}
                  renderInput={(params) => <RTLTextField {...params} placeholder="" />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.district") || "District"}
                </Typography>
                <Autocomplete
                  fullWidth
                  options={districts}
                  getOptionLabel={(option) => option.name || ""}
                  value={districts.find((district) => district.id === address.district_id) || null}
                  onChange={(event, newValue) => {
                    handleShippingAddressChange(index, 'district_id', newValue?.id || "");
                  }}
                  loading={loading}
                  renderInput={(params) => <RTLTextField {...params} placeholder="" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.addressLine1") || "Address Line 1"}
                </Typography>
                <RTLTextField
                  value={address.address_line1 || ""}
                  onChange={e => handleShippingAddressChange(index, 'address_line1', e.target.value)}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.addressLine2") || "Address Line 2"}
                </Typography>
                <RTLTextField
                  value={address.address_line2 || ""}
                  onChange={e => handleShippingAddressChange(index, 'address_line2', e.target.value)}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.building") || "Building"}
                </Typography>
                <RTLTextField
                  value={address.building || ""}
                  onChange={e => handleShippingAddressChange(index, 'building', e.target.value)}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.block") || "Block"}
                </Typography>
                <RTLTextField
                  value={address.block || ""}
                  onChange={e => handleShippingAddressChange(index, 'block', e.target.value)}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.side") || "Side"}
                </Typography>
                <RTLTextField
                  value={address.side || ""}
                  onChange={e => handleShippingAddressChange(index, 'side', e.target.value)}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.apartment") || "Apartment"}
                </Typography>
                <RTLTextField
                  value={address.apartment || ""}
                  onChange={e => handleShippingAddressChange(index, 'apartment', e.target.value)}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.zipCode") || "Zip Code"}
                </Typography>
                <RTLTextField
                  value={address.zip_code || ""}
                  onChange={e => handleShippingAddressChange(index, 'zip_code', e.target.value)}
                  placeholder=""
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
});

export default ShippingAddressSection; 
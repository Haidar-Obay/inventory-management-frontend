import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";

const CategorizeSection = React.memo(({ formData, onFormDataChange, isRTL, t, trades, companyCodes, customerGroups, businessTypes, salesChannels, distributionChannels, mediaChannels, loading, handleTradeChange, handleCompanyCodeChange, handleCustomerGroupChange, handleBusinessTypeChange, handleSalesChannelChange, handleDistributionChannelChange, handleMediaChannelChange, handleFieldChange, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
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
        aria-controls="categorize-content"
        id="categorize-header"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t("management.categorize") || "Categorize"}
          </Typography>
          {/* Show customer group combobox under header only when collapsed */}
          {!expanded && (
            <Box
              sx={{ mt: 1, width: { xs: '100%', sm: '60%' } }}
              onClick={e => e.stopPropagation()}
              onFocus={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.customerGroup") || "Customer Group"} *
              </Typography>
              <Autocomplete
                fullWidth
                options={customerGroups}
                getOptionLabel={(option) => option.name || ""}
                value={customerGroups.find((group) => group.id === formData?.customer_group_id) || null}
                onChange={handleCustomerGroupChange}
                loading={loading}
                renderInput={(params) => <RTLTextField {...params} placeholder="" />}
                onClick={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                sx={{ background: 'background.paper' }}
              />
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.trade") || "Trade"}
            </Typography>
            <Autocomplete
              fullWidth
              options={trades}
              getOptionLabel={(option) => option.name || ""}
              value={trades.find((trade) => trade.id === formData?.trade_id) || null}
              onChange={handleTradeChange}
              loading={loading}
              renderInput={(params) => <RTLTextField {...params} placeholder="" />}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.companyCode") || "Company Code"}
            </Typography>
            <Autocomplete
              fullWidth
              options={companyCodes}
              getOptionLabel={(option) => option.name || ""}
              value={companyCodes.find((code) => code.id === formData?.company_code_id) || null}
              onChange={handleCompanyCodeChange}
              loading={loading}
              renderInput={(params) => <RTLTextField {...params} placeholder="" />}
            />
          </Grid>
          {/* Customer Group inside details, only when expanded */}
          {expanded && (
            <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.customerGroup") || "Customer Group"} *
              </Typography>
              <Autocomplete
                fullWidth
                options={customerGroups}
                getOptionLabel={(option) => option.name || ""}
                value={customerGroups.find((group) => group.id === formData?.customer_group_id) || null}
                onChange={handleCustomerGroupChange}
                loading={loading}
                renderInput={(params) => <RTLTextField {...params} placeholder="" />}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.businessType") || "Business Type"}
            </Typography>
            <Autocomplete
              fullWidth
              options={businessTypes}
              getOptionLabel={(option) => option.name || ""}
              value={businessTypes.find((type) => type.id === formData?.business_type_id) || null}
              onChange={handleBusinessTypeChange}
              loading={loading}
              renderInput={(params) => <RTLTextField {...params} placeholder="" />}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 275 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.salesChannel") || "Sales Channel"}
            </Typography>
            <Autocomplete
              fullWidth
              options={salesChannels}
              getOptionLabel={(option) => option.name || ""}
              value={salesChannels.find((channel) => channel.id === formData?.sales_channel_id) || null}
              onChange={handleSalesChannelChange}
              loading={loading}
              renderInput={(params) => <RTLTextField {...params} placeholder="" />}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 275 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.distributionChannel") || "Distribution Channel"}
            </Typography>
            <Autocomplete
              fullWidth
              options={distributionChannels}
              getOptionLabel={(option) => option.name || ""}
              value={distributionChannels.find((channel) => channel.id === formData?.distribution_channel_id) || null}
              onChange={handleDistributionChannelChange}
              loading={loading}
              renderInput={(params) => <RTLTextField {...params} placeholder="" />}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 275 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.mediaChannel") || "Media Channel"}
            </Typography>
            <Autocomplete
              fullWidth
              options={mediaChannels}
              getOptionLabel={(option) => option.name || ""}
              value={mediaChannels.find((channel) => channel.id === formData?.media_channel_id) || null}
              onChange={handleMediaChannelChange}
              loading={loading}
              renderInput={(params) => <RTLTextField {...params} placeholder="" />}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 300 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.indicator") || "Indicator"}
            </Typography>
            <RTLTextField
              select
              value={formData?.indicator || ""}
              onChange={handleFieldChange("indicator")}
              placeholder=""
              SelectProps={{ native: true }}
            >
              <option value="">{t("management.selectIndicator") || "Select Indicator"}</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </RTLTextField>
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 300 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.riskCategory") || "Risk Category"}
            </Typography>
            <RTLTextField
              select
              value={formData?.risk_category || ""}
              onChange={handleFieldChange("risk_category")}
              placeholder=""
              SelectProps={{ native: true }}
            >
              <option value="">{t("management.selectRiskCategory") || "Select Risk Category"}</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </RTLTextField>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default CategorizeSection; 
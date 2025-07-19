import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";

const CategorizeSection = React.memo(({ formData, onFormDataChange, isRTL, t, trades, companyCodes, customerGroups, businessTypes, salesChannels, distributionChannels, mediaChannels, loading, handleTradeChange, handleCompanyCodeChange, handleCustomerGroupChange, handleBusinessTypeChange, handleSalesChannelChange, handleDistributionChannelChange, handleMediaChannelChange, handleFieldChange, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed]);

  // Create options with Add button as first option
  const createOptionsWithAdd = (options, type) => {
    const addOption = { id: 'add', name: `${t('management.add') || 'Add'} ${t(`management.${type}`) || type}`, isAddButton: true };
    return [addOption, ...options];
  };

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
          {/* Show trade under header only when collapsed */}
          {!expanded && (
            <Box sx={{ mt: 1, width: { xs: '100%', sm: '60%' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.trade") || "Trade"}
              </Typography>
              <Autocomplete
                options={createOptionsWithAdd(trades, 'trade')}
                getOptionLabel={(option) => option.name || ""}
                value={trades.find((trade) => trade.id === formData?.trade_id) || null}
                onChange={(event, newValue) => {
                  if (newValue?.isAddButton) {
                    console.log('Add trade clicked');
                    return;
                  }
                  handleTradeChange(event, newValue);
                }}
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
          <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.trade") || "Trade"}
            </Typography>
            <Autocomplete
              fullWidth
              options={createOptionsWithAdd(trades, 'trade')}
              getOptionLabel={(option) => option.name || ""}
              value={trades.find((trade) => trade.id === formData?.trade_id) || null}
              onChange={(event, newValue) => {
                if (newValue?.isAddButton) {
                  console.log('Add trade clicked');
                  return;
                }
                handleTradeChange(event, newValue);
              }}
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
          <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.companyCode") || "Company Code"}
            </Typography>
            <Autocomplete
              fullWidth
              options={createOptionsWithAdd(companyCodes, 'companyCode')}
              getOptionLabel={(option) => option.name || ""}
              value={companyCodes.find((code) => code.id === formData?.company_code_id) || null}
              onChange={(event, newValue) => {
                if (newValue?.isAddButton) {
                  console.log('Add company code clicked');
                  return;
                }
                handleCompanyCodeChange(event, newValue);
              }}
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
          {/* Customer Group inside details, only when expanded */}
          {expanded && (
            <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.customerGroup") || "Customer Group"} *
              </Typography>
              <Autocomplete
                fullWidth
                options={createOptionsWithAdd(customerGroups, 'customerGroup')}
                getOptionLabel={(option) => option.name || ""}
                value={customerGroups.find((group) => group.id === formData?.customer_group_id) || null}
                onChange={(event, newValue) => {
                  if (newValue?.isAddButton) {
                    console.log('Add customer group clicked');
                    return;
                  }
                  handleCustomerGroupChange(event, newValue);
                }}
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
          )}
          <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.businessType") || "Business Type"}
            </Typography>
            <Autocomplete
              fullWidth
              options={createOptionsWithAdd(businessTypes, 'businessType')}
              getOptionLabel={(option) => option.name || ""}
              value={businessTypes.find((type) => type.id === formData?.business_type_id) || null}
              onChange={(event, newValue) => {
                if (newValue?.isAddButton) {
                  console.log('Add business type clicked');
                  return;
                }
                handleBusinessTypeChange(event, newValue);
              }}
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
          <Grid item xs={12} md={6} sx={{ minWidth: 275 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.salesChannel") || "Sales Channel"}
            </Typography>
            <Autocomplete
              fullWidth
              options={createOptionsWithAdd(salesChannels, 'salesChannel')}
              getOptionLabel={(option) => option.name || ""}
              value={salesChannels.find((channel) => channel.id === formData?.sales_channel_id) || null}
              onChange={(event, newValue) => {
                if (newValue?.isAddButton) {
                  console.log('Add sales channel clicked');
                  return;
                }
                handleSalesChannelChange(event, newValue);
              }}
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
          <Grid item xs={12} md={6} sx={{ minWidth: 275 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.distributionChannel") || "Distribution Channel"}
            </Typography>
            <Autocomplete
              fullWidth
              options={createOptionsWithAdd(distributionChannels, 'distributionChannel')}
              getOptionLabel={(option) => option.name || ""}
              value={distributionChannels.find((channel) => channel.id === formData?.distribution_channel_id) || null}
              onChange={(event, newValue) => {
                if (newValue?.isAddButton) {
                  console.log('Add distribution channel clicked');
                  return;
                }
                handleDistributionChannelChange(event, newValue);
              }}
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
          <Grid item xs={12} md={6} sx={{ minWidth: 275 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.mediaChannel") || "Media Channel"}
            </Typography>
            <Autocomplete
              fullWidth
              options={createOptionsWithAdd(mediaChannels, 'mediaChannel')}
              getOptionLabel={(option) => option.name || ""}
              value={mediaChannels.find((channel) => channel.id === formData?.media_channel_id) || null}
              onChange={(event, newValue) => {
                if (newValue?.isAddButton) {
                  console.log('Add media channel clicked');
                  return;
                }
                handleMediaChannelChange(event, newValue);
              }}
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
          <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
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
          <Grid item xs={12} md={6} sx={{ minWidth: 375 }}>
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
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </RTLTextField>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default CategorizeSection; 
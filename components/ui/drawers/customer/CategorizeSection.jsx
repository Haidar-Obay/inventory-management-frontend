import React from "react";
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";
import { useDrawerStack } from "@/components/ui/DrawerStackContext";

const CategorizeSection = React.memo(({ formData, onFormDataChange, isRTL, t, trades, companyCodes, customerGroups, businessTypes, salesChannels, distributionChannels, mediaChannels, loading, handleTradeChange, handleCompanyCodeChange, handleCustomerGroupChange, handleBusinessTypeChange, handleSalesChannelChange, handleDistributionChannelChange, handleMediaChannelChange, handleFieldChange, expanded, onAccordionChange, allCollapsed, setAllCollapsed, setTrades, setCompanyCodes, setCustomerGroups, setBusinessTypes, setSalesChannels, setDistributionChannels, setMediaChannels }) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed]);

  const { openDrawer } = useDrawerStack();

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
        tabIndex={-1}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t("management.categorize") || "Categorize"}
          </Typography>
          {/* Show customer group under header only when collapsed */}
          {!expanded && (
            <Box sx={{ mt: 1, width: { xs: '100%', sm: '60%' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                {t("management.customerGroup") || "Customer Group"} *
              </Typography>
              <Box 
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
              >
                <Autocomplete
                  options={createOptionsWithAdd(customerGroups, 'customerGroup')}
                  getOptionLabel={(option) => option.name || ""}
                  value={customerGroups.find((group) => group.id === formData?.customer_group_id) || null}
                  onChange={(event, newValue) => {
                    if (newValue?.isAddButton) {
                      openDrawer({
                        type: "customerGroup",
                        props: {
                          onSave: (newGroup) => {
                            if (typeof setCustomerGroups === 'function') {
                              setCustomerGroups(prev => [...(Array.isArray(prev) ? prev : []), newGroup]);
                            }
                            // Select the new customer group
                            onFormDataChange(prev => ({ ...prev, customer_group_id: newGroup.id }));
                          },
                        },
                      });
                      return;
                    }
                    handleCustomerGroupChange(event, newValue);
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
                  openDrawer({
                    type: "trade",
                    props: {
                      onSave: (newTrade) => {
                        if (typeof setTrades === 'function') {
                          setTrades(prev => [...(Array.isArray(prev) ? prev : []), newTrade]);
                        }
                        // Select the new trade
                        onFormDataChange(prev => ({ ...prev, trade_id: newTrade.id }));
                      },
                    },
                  });
                  return;
                }
                handleTradeChange(event, newValue);
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
                  openDrawer({
                    type: "companyCode",
                    props: {
                      onSave: (newCompanyCode) => {
                        if (typeof setCompanyCodes === 'function') {
                          setCompanyCodes(prev => [...(Array.isArray(prev) ? prev : []), newCompanyCode]);
                        }
                        // Select the new company code
                        onFormDataChange(prev => ({ ...prev, company_code_id: newCompanyCode.id }));
                      },
                    },
                  });
                  return;
                }
                handleCompanyCodeChange(event, newValue);
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
                    openDrawer({
                      type: "customerGroup",
                      props: {
                        onSave: (newGroup) => {
                          if (typeof setCustomerGroups === 'function') {
                            setCustomerGroups(prev => [...(Array.isArray(prev) ? prev : []), newGroup]);
                          }
                          // Select the new customer group
                          onFormDataChange(prev => ({ ...prev, customer_group_id: newGroup.id }));
                        },
                      },
                    });
                    return;
                  }
                  handleCustomerGroupChange(event, newValue);
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
                  openDrawer({
                    type: "businessType",
                    props: {
                      onSave: (newBusinessType) => {
                        if (typeof setBusinessTypes === 'function') {
                          setBusinessTypes(prev => [...(Array.isArray(prev) ? prev : []), newBusinessType]);
                        }
                        // Select the new business type
                        onFormDataChange(prev => ({ ...prev, business_type_id: newBusinessType.id }));
                      },
                    },
                  });
                  return;
                }
                handleBusinessTypeChange(event, newValue);
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
                  openDrawer({
                    type: "salesChannel",
                    props: {
                      onSave: (newSalesChannel) => {
                        if (typeof setSalesChannels === 'function') {
                          setSalesChannels(prev => [...(Array.isArray(prev) ? prev : []), newSalesChannel]);
                        }
                        // Select the new sales channel
                        onFormDataChange(prev => ({ ...prev, sales_channel_id: newSalesChannel.id }));
                      },
                    },
                  });
                  return;
                }
                handleSalesChannelChange(event, newValue);
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
                  openDrawer({
                    type: "distributionChannel",
                    props: {
                      onSave: (newDistributionChannel) => {
                        if (typeof setDistributionChannels === 'function') {
                          setDistributionChannels(prev => [...(Array.isArray(prev) ? prev : []), newDistributionChannel]);
                        }
                        // Select the new distribution channel
                        onFormDataChange(prev => ({ ...prev, distribution_channel_id: newDistributionChannel.id }));
                      },
                    },
                  });
                  return;
                }
                handleDistributionChannelChange(event, newValue);
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
                  openDrawer({
                    type: "mediaChannel",
                    props: {
                      onSave: (newMediaChannel) => {
                        if (typeof setMediaChannels === 'function') {
                          setMediaChannels(prev => [...(Array.isArray(prev) ? prev : []), newMediaChannel]);
                        }
                        // Select the new media channel
                        onFormDataChange(prev => ({ ...prev, media_channel_id: newMediaChannel.id }));
                      },
                    },
                  });
                  return;
                }
                handleMediaChannelChange(event, newValue);
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
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </RTLTextField>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default CategorizeSection; 
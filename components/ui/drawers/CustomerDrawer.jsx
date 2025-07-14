"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Autocomplete,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";
import { getCustomerGroupNames, getSalesmanNames } from "@/API/Customers";
import { getCountries, getZones, getCities, getDistricts } from "@/API/AddressCodes";
import { getTradeNames, getCompanyCodeNames, getBusinessTypeNames, getSalesChannelNames, getDistributionChannelNames, getMediaChannelNames, getSubscriptionStatus } from "@/API/Sections";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { Checkbox } from "@/components/ui/checkbox";

const CustomerDrawer = ({
  isOpen,
  onClose,
  type,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  formData,
  onFormDataChange,
  isEdit = false,
}) => {
  const [customerGroups, setCustomerGroups] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [countries, setCountries] = useState([]);
  const [zones, setZones] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [trades, setTrades] = useState([]);
  const [companyCodes, setCompanyCodes] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [salesChannels, setSalesChannels] = useState([]);
  const [distributionChannels, setDistributionChannels] = useState([]);
  const [mediaChannels, setMediaChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isPrimeUser, setIsPrimeUser] = useState(false);
  const t = useTranslations("customers");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [originalName, setOriginalName] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [searchTerms, setSearchTerms] = useState([]);
  const [newSearchTerm, setNewSearchTerm] = useState("");
  const { addToast } = useSimpleToast();

  // Generate display name suggestions based on name components
  const generateDisplayNameSuggestions = () => {
    const title = formData?.title || "";
    const firstName = formData?.first_name || "";
    const middleName = formData?.middle_name || "";
    const lastName = formData?.last_name || "";
    
    const suggestions = [];
    
    // Add combinations based on available fields
    if (firstName && lastName) {
      suggestions.push(`${firstName} ${lastName}`);
      if (title) suggestions.push(`${title} ${firstName} ${lastName}`);
      if (middleName) {
        suggestions.push(`${firstName} ${middleName} ${lastName}`);
        if (title) suggestions.push(`${title} ${firstName} ${middleName} ${lastName}`);
      }
    }
    
    if (firstName) {
      suggestions.push(firstName);
      if (title) suggestions.push(`${title} ${firstName}`);
    }
    
    if (lastName) {
      suggestions.push(lastName);
      if (title) suggestions.push(`${title} ${lastName}`);
    }
    
    // Add company name if available
    if (formData?.company_name) {
      suggestions.push(formData.company_name);
    }
    
    return suggestions.filter((suggestion, index, array) => 
      array.indexOf(suggestion) === index && suggestion.trim() !== ""
    );
  };

  useEffect(() => {
    if (isOpen) {
      if (type === "customer") {
        fetchDropdownData();
        checkSubscriptionStatus();
      }
    }
  }, [type, isOpen]);

  useEffect(() => {
    if (isOpen && isEdit) {
      setOriginalName(formData?.name || "");
      setOriginalData(JSON.parse(JSON.stringify(formData)));
    }
  }, [isOpen, isEdit]);

  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      const [
        customerGroupsRes, 
        salesmenRes, 
        countriesRes, 
        zonesRes, 
        citiesRes, 
        districtsRes,
        tradesRes,
        companyCodesRes,
        businessTypesRes,
        salesChannelsRes,
        distributionChannelsRes,
        mediaChannelsRes
      ] = await Promise.all([
        getCustomerGroupNames(),
        getSalesmanNames(),
        getCountries(),
        getZones(),
        getCities(),
        getDistricts(),
        getTradeNames(),
        getCompanyCodeNames(),
        getBusinessTypeNames(),
        getSalesChannelNames(),
        getDistributionChannelNames(),
        getMediaChannelNames(),
      ]);
      
      setCustomerGroups(customerGroupsRes.data || []);
      setSalesmen(salesmenRes.data || []);
      setCountries(countriesRes.data || []);
      setZones(zonesRes.data || []);
      setCities(citiesRes.data || []);
      setDistricts(districtsRes.data || []);
      setTrades(tradesRes.data || []);
      setCompanyCodes(companyCodesRes.data || []);
      setBusinessTypes(businessTypesRes.data || []);
      setSalesChannels(salesChannelsRes.data || []);
      setDistributionChannels(distributionChannelsRes.data || []);
      setMediaChannels(mediaChannelsRes.data || []);
      
      // Console log the results
      console.log("Customer Groups:", customerGroupsRes.data);
      console.log("Salesmen:", salesmenRes.data);
      console.log("Countries:", countriesRes.data);
      console.log("Zones:", zonesRes.data);
      console.log("Cities:", citiesRes.data);
      console.log("Districts:", districtsRes.data);
      console.log("Trades:", tradesRes.data);
      console.log("Company Codes:", companyCodesRes.data);
      console.log("Business Types:", businessTypesRes.data);
      console.log("Sales Channels:", salesChannelsRes.data);
      console.log("Distribution Channels:", distributionChannelsRes.data);
      console.log("Media Channels:", mediaChannelsRes.data);
      
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field) => (event) => {
    onFormDataChange({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleCustomerGroupChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      customer_group_id: newValue?.id || "",
    });
  };

  const handleSalesmanChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      salesman_id: newValue?.id || "",
    });
  };

  const handleTradeChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      trade_id: newValue?.id || "",
    });
  };

  const handleCompanyCodeChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      company_code_id: newValue?.id || "",
    });
  };

  const handleBusinessTypeChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      business_type_id: newValue?.id || "",
    });
  };

  const handleSalesChannelChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      sales_channel_id: newValue?.id || "",
    });
  };

  const handleDistributionChannelChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      distribution_channel_id: newValue?.id || "",
    });
  };

  const handleMediaChannelChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      media_channel_id: newValue?.id || "",
    });
  };

  const handleDisplayNameChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      display_name: newValue || "",
    });
  };

  const handleCopyFromBillingAddress = () => {
    onFormDataChange({
      ...formData,
      shipping_country_id: formData?.billing_country_id || "",
      shipping_zone_id: formData?.billing_country_id || "",
      shipping_city_id: formData?.billing_city_id || "",
      shipping_district_id: formData?.billing_district_id || "",
      shipping_address_line1: formData?.billing_address_line1 || "",
      shipping_address_line2: formData?.billing_address_line2 || "",
      shipping_building: formData?.billing_building || "",
      shipping_block: formData?.billing_block || "",
      shipping_side: formData?.billing_side || "",
      shipping_apartment: formData?.billing_apartment || "",
      shipping_zip_code: formData?.billing_zip_code || "",
    });
  };

  const handleAddShippingAddress = () => {
    const newAddress = {
      id: Date.now(), // Temporary ID for new addresses
      country_id: "",
      zone_id: "",
      city_id: "",
      district_id: "",
      address_line1: "",
      address_line2: "",
      building: "",
      block: "",
      side: "",
      apartment: "",
      zip_code: "",
    };
    setShippingAddresses([...shippingAddresses, newAddress]);
  };

  const handleRemoveShippingAddress = (index) => {
    const updatedAddresses = shippingAddresses.filter((_, i) => i !== index);
    setShippingAddresses(updatedAddresses);
  };

  const handleShippingAddressChange = (index, field, value) => {
    const updatedAddresses = [...shippingAddresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value,
    };
    setShippingAddresses(updatedAddresses);
  };

  const handleCopyToShippingAddress = (index) => {
    const updatedAddresses = [...shippingAddresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      country_id: formData?.billing_country_id || "",
      zone_id: formData?.billing_zone_id || "",
      city_id: formData?.billing_city_id || "",
      district_id: formData?.billing_district_id || "",
      address_line1: formData?.billing_address_line1 || "",
      address_line2: formData?.billing_address_line2 || "",
      building: formData?.billing_building || "",
      block: formData?.billing_block || "",
      side: formData?.billing_side || "",
      apartment: formData?.billing_apartment || "",
      zip_code: formData?.billing_zip_code || "",
    };
    setShippingAddresses(updatedAddresses);
  };

  const handleAddSearchTerm = () => {
    if (newSearchTerm.trim() && !searchTerms.includes(newSearchTerm.trim())) {
      setSearchTerms([...searchTerms, newSearchTerm.trim()]);
      setNewSearchTerm("");
    }
  };

  const handleRemoveSearchTerm = (termToRemove) => {
    setSearchTerms(searchTerms.filter(term => term !== termToRemove));
  };

  const handleSearchTermKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSearchTerm();
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const response = await getSubscriptionStatus();
      console.log("Subscription Status Response:", response);
      setSubscriptionStatus(response.data);
      
      // Check if user has prime subscription
      if (response.data && response.data.plan === 'prime') {
        setIsPrimeUser(true);
      } else {
        setIsPrimeUser(false);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      setIsPrimeUser(false);
    }
  };

  function isDataChanged() {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }

  const handleSave = () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: t("noChangesTitle") || "No changes detected",
        description:
          t("noChangesDesc") ||
          "Please modify at least one field before saving.",
      });
      return;
    }
    onSave && onSave();
  };

  const getContent = () => {
    if (!type) return null;

    if (type === "customerGroup") {
      return (
        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
          {/* Left side - Form fields */}
          <Box sx={{ flex: 1 }}>
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.code")} *
                </Typography>
                <RTLTextField
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                  placeholder=""
                />
              </Grid>
              <Grid xs={12} md={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.name")} *
                </Typography>
                <RTLTextField
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                  placeholder=""
                />
              </Grid>
            </Grid>
          </Box>
          
          {/* Right side - Checkbox */}
          <Box sx={{ width: 200, display: 'flex', alignItems: 'flex-start', pt: 2, justifyContent: 'flex-end' }}>
            <Checkbox
              checked={formData?.active !== false}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  active: e.target.checked,
                })
              }
              label={t("management.active")}
              isRTL={isRTL}
            />
          </Box>
        </Box>
      );
    }

    if (type === "salesman") {
      return (
        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
          {/* Left side - Form fields */}
          <Box sx={{ flex: 1 }}>
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.code")} *
                </Typography>
                <RTLTextField
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                  placeholder=""
                />
              </Grid>
              <Grid xs={12} md={6} sx={{ width: "100%" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.name")} *
                </Typography>
                <RTLTextField
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                  placeholder=""
                />
              </Grid>
              <Grid xs={12} sx={{ width: "100%" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.address")}
                </Typography>
                <RTLTextField
                  value={formData?.address || ""}
                  onChange={handleFieldChange("address")}
                  multiline
                  rows={3}
                  placeholder=""
                />
              </Grid>
              <Grid xs={12} md={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.phone1")}
                </Typography>
                <RTLTextField
                  value={formData?.phone1 || ""}
                  onChange={handleFieldChange("phone1")}
                  placeholder=""
                />
              </Grid>
              <Grid xs={12} md={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.phone2")}
                </Typography>
                <RTLTextField
                  value={formData?.phone2 || ""}
                  onChange={handleFieldChange("phone2")}
                  placeholder=""
                />
              </Grid>
              <Grid xs={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.email")}
                </Typography>
                <RTLTextField
                  value={formData?.email || ""}
                  onChange={handleFieldChange("email")}
                  type="email"
                  placeholder=""
                />
              </Grid>
              <Grid xs={12} md={4} sx={{ width: "50%" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.isManager")}
                </Typography>
                <RTLTextField
                  select
                  value={formData?.is_manager === true ? "true" : "false"}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      is_manager: e.target.value === "true",
                    })
                  }
                  SelectProps={{
                    native: true,
                  }}
                  placeholder=""
                >
                  <option value="false">{t("management.no")}</option>
                  <option value="true">{t("management.yes")}</option>
                </RTLTextField>
              </Grid>
              <Grid xs={12} md={4} sx={{ width: "50%" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.isSupervisor")}
                </Typography>
                <RTLTextField
                  select
                  value={formData?.is_supervisor === true ? "true" : "false"}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      is_supervisor: e.target.value === "true",
                    })
                  }
                  SelectProps={{
                    native: true,
                  }}
                  placeholder=""
                >
                  <option value="false">{t("management.no")}</option>
                  <option value="true">{t("management.yes")}</option>
                </RTLTextField>
              </Grid>
              <Grid xs={12} md={4} sx={{ width: "50%" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.isCollector")}
                </Typography>
                <RTLTextField
                  select
                  value={formData?.is_collector === true ? "true" : "false"}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      is_collector: e.target.value === "true",
                    })
                  }
                  SelectProps={{
                    native: true,
                  }}
                  placeholder=""
                >
                  <option value="false">{t("management.no")}</option>
                  <option value="true">{t("management.yes")}</option>
                </RTLTextField>
              </Grid>
              <Grid xs={12} md={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.fixCommission")}
                </Typography>
                <RTLTextField
                  value={formData?.fix_commission || ""}
                  onChange={handleFieldChange("fix_commission")}
                  type="number"
                  placeholder=""
                />
              </Grid>
              <Grid xs={12} md={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.commissionByItem")}
                </Typography>
                <RTLTextField
                  value={formData?.commission_by_item || ""}
                  onChange={handleFieldChange("commission_by_item")}
                  type="number"
                  placeholder=""
                />
              </Grid>
            </Grid>
          </Box>
          
          {/* Right side - Checkbox */}
          <Box sx={{ width: 200, display: 'flex', alignItems: 'flex-start', pt: 2, justifyContent: 'flex-end' }}>
            <Checkbox
              checked={formData?.active !== false}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  active: e.target.checked,
                })
              }
              label={t("management.active")}
              isRTL={isRTL}
            />
          </Box>
        </Box>
      );
    }

    if (type === "customer") {
      const displayNameSuggestions = generateDisplayNameSuggestions();
      
      return (
        <div>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="personal-info-content"
              id="personal-info-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {t("management.personalInformation") || "Personal Information"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.title") || "Title"}
                  </Typography>
                  <RTLTextField
                    select
                    value={formData?.title || ""}
                    onChange={handleFieldChange("title")}
                    placeholder=""
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">
                      {t("management.selectTitle") || "Select Title"}
                    </option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </RTLTextField>
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.firstName") || "First Name"} *
                  </Typography>
                  <RTLTextField
                    value={formData?.first_name || ""}
                    onChange={handleFieldChange("first_name")}
                    required
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.middleName") || "Middle Name"}
                  </Typography>
                  <RTLTextField
                    value={formData?.middle_name || ""}
                    onChange={handleFieldChange("middle_name")}
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.lastName") || "Last Name"} *
                  </Typography>
                  <RTLTextField
                    value={formData?.last_name || ""}
                    onChange={handleFieldChange("last_name")}
                    required
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.displayName") || "Display Name"}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    freeSolo
                    options={displayNameSuggestions}
                    value={formData?.display_name || ""}
                    onChange={handleDisplayNameChange}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.companyName") || "Company Name"}
                  </Typography>
                  <RTLTextField
                    value={formData?.company_name || ""}
                    onChange={handleFieldChange("company_name")}
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.phone1") || "Phone 1"} *
                  </Typography>
                  <RTLTextField
                    value={formData?.phone1 || ""}
                    onChange={handleFieldChange("phone1")}
                    required
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.phone2") || "Phone 2"}
                  </Typography>
                  <RTLTextField
                    value={formData?.phone2 || ""}
                    onChange={handleFieldChange("phone2")}
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.phone3") || "Phone 3"}
                  </Typography>
                  <RTLTextField
                    value={formData?.phone3 || ""}
                    onChange={handleFieldChange("phone3")}
                    placeholder=""
                  />
                </Grid>

              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="billing-address-content"
              id="billing-address-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {t("management.billingAddress") || "Billing Address"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.country") || "Country"}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={countries}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      countries.find(
                        (country) => country.id === formData?.billing_country_id
                      ) || null
                    }
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
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.zone") || "Zone"}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={zones}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      zones.find(
                        (zone) => zone.id === formData?.billing_zone_id
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      onFormDataChange({
                        ...formData,
                        billing_zone_id: newValue?.id || "",
                        billing_city_id: "",
                        billing_district_id: "",
                      });
                    }}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.city") || "City"}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={cities}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      cities.find(
                        (city) => city.id === formData?.billing_city_id
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      onFormDataChange({
                        ...formData,
                        billing_city_id: newValue?.id || "",
                        billing_district_id: "",
                      });
                    }}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.district") || "District"}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={districts}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      districts.find(
                        (district) => district.id === formData?.billing_district_id
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      onFormDataChange({
                        ...formData,
                        billing_district_id: newValue?.id || "",
                      });
                    }}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.addressLine1") || "Address Line 1"}
                  </Typography>
                  <RTLTextField
                    value={formData?.billing_address_line1 || ""}
                    onChange={handleFieldChange("billing_address_line1")}
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.addressLine2") || "Address Line 2"}
                  </Typography>
                  <RTLTextField
                    value={formData?.billing_address_line2 || ""}
                    onChange={handleFieldChange("billing_address_line2")}
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.building") || "Building"}
                  </Typography>
                  <RTLTextField
                    value={formData?.billing_building || ""}
                    onChange={handleFieldChange("billing_building")}
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.block") || "Block"}
                  </Typography>
                  <RTLTextField
                    value={formData?.billing_block || ""}
                    onChange={handleFieldChange("billing_block")}
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.side") || "Side"}
                  </Typography>
                  <RTLTextField
                    value={formData?.billing_side || ""}
                    onChange={handleFieldChange("billing_side")}
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.apartment") || "Apartment"}
                  </Typography>
                  <RTLTextField
                    value={formData?.billing_apartment || ""}
                    onChange={handleFieldChange("billing_apartment")}
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.zipCode") || "Zip Code"}
                  </Typography>
                  <RTLTextField
                    value={formData?.billing_zip_code || ""}
                    onChange={handleFieldChange("billing_zip_code")}
                    placeholder=""
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="shipping-address-content"
              id="shipping-address-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {t("management.shippingAddress") || "Shipping Address"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Header Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCopyFromBillingAddress}
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                  }}
                >
                  {t("management.copyFromBillingAddress") || "Copy from Billing Address"}
                </Button>
                <IconButton
                  size="small"
                  onClick={handleAddShippingAddress}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                    },
                  }}
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
                  <Grid xs={12} md={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.country") || "Country"}
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={countries}
                      getOptionLabel={(option) => option.name || ""}
                      value={
                        countries.find(
                          (country) => country.id === formData?.shipping_country_id
                        ) || null
                      }
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
                      renderInput={(params) => (
                        <RTLTextField {...params} placeholder="" />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.zone") || "Zone"}
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={zones}
                      getOptionLabel={(option) => option.name || ""}
                      value={
                        zones.find(
                          (zone) => zone.id === formData?.shipping_zone_id
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        onFormDataChange({
                          ...formData,
                          shipping_zone_id: newValue?.id || "",
                          shipping_city_id: "",
                          shipping_district_id: "",
                        });
                      }}
                      loading={loading}
                      renderInput={(params) => (
                        <RTLTextField {...params} placeholder="" />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.city") || "City"}
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={cities}
                      getOptionLabel={(option) => option.name || ""}
                      value={
                        cities.find(
                          (city) => city.id === formData?.shipping_city_id
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        onFormDataChange({
                          ...formData,
                          shipping_city_id: newValue?.id || "",
                          shipping_district_id: "",
                        });
                      }}
                      loading={loading}
                      renderInput={(params) => (
                        <RTLTextField {...params} placeholder="" />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.district") || "District"}
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={districts}
                      getOptionLabel={(option) => option.name || ""}
                      value={
                        districts.find(
                          (district) => district.id === formData?.shipping_district_id
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        onFormDataChange({
                          ...formData,
                          shipping_district_id: newValue?.id || "",
                        });
                      }}
                      loading={loading}
                      renderInput={(params) => (
                        <RTLTextField {...params} placeholder="" />
                      )}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.addressLine1") || "Address Line 1"}
                    </Typography>
                    <RTLTextField
                      value={formData?.shipping_address_line1 || ""}
                      onChange={handleFieldChange("shipping_address_line1")}
                      placeholder=""
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.addressLine2") || "Address Line 2"}
                    </Typography>
                    <RTLTextField
                      value={formData?.shipping_address_line2 || ""}
                      onChange={handleFieldChange("shipping_address_line2")}
                      placeholder=""
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.building") || "Building"}
                    </Typography>
                    <RTLTextField
                      value={formData?.shipping_building || ""}
                      onChange={handleFieldChange("shipping_building")}
                      placeholder=""
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.block") || "Block"}
                    </Typography>
                    <RTLTextField
                      value={formData?.shipping_block || ""}
                      onChange={handleFieldChange("shipping_block")}
                      placeholder=""
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.side") || "Side"}
                    </Typography>
                    <RTLTextField
                      value={formData?.shipping_side || ""}
                      onChange={handleFieldChange("shipping_side")}
                      placeholder=""
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.apartment") || "Apartment"}
                    </Typography>
                    <RTLTextField
                      value={formData?.shipping_apartment || ""}
                      onChange={handleFieldChange("shipping_apartment")}
                      placeholder=""
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.zipCode") || "Zip Code"}
                    </Typography>
                    <RTLTextField
                      value={formData?.shipping_zip_code || ""}
                      onChange={handleFieldChange("shipping_zip_code")}
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
                        sx={{
                          fontSize: '0.75rem',
                          textTransform: 'none',
                        }}
                      >
                        {t("management.copyFromBillingAddress") || "Copy from Billing Address"}
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveShippingAddress(index)}
                        sx={{
                          color: 'error.main',
                          '&:hover': {
                            backgroundColor: 'error.light',
                            color: 'white',
                          },
                        }}
                      >
                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>×</Typography>
                      </IconButton>
                    </Box>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("management.country") || "Country"}
                      </Typography>
                      <Autocomplete
                        fullWidth
                        options={countries}
                        getOptionLabel={(option) => option.name || ""}
                        value={
                          countries.find(
                            (country) => country.id === address.country_id
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleShippingAddressChange(index, 'country_id', newValue?.id || "");
                        }}
                        loading={loading}
                        renderInput={(params) => (
                          <RTLTextField {...params} placeholder="" />
                        )}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("management.zone") || "Zone"}
                      </Typography>
                      <Autocomplete
                        fullWidth
                        options={zones}
                        getOptionLabel={(option) => option.name || ""}
                        value={
                          zones.find(
                            (zone) => zone.id === address.zone_id
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleShippingAddressChange(index, 'zone_id', newValue?.id || "");
                        }}
                        loading={loading}
                        renderInput={(params) => (
                          <RTLTextField {...params} placeholder="" />
                        )}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("management.city") || "City"}
                      </Typography>
                      <Autocomplete
                        fullWidth
                        options={cities}
                        getOptionLabel={(option) => option.name || ""}
                        value={
                          cities.find(
                            (city) => city.id === address.city_id
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleShippingAddressChange(index, 'city_id', newValue?.id || "");
                        }}
                        loading={loading}
                        renderInput={(params) => (
                          <RTLTextField {...params} placeholder="" />
                        )}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("management.district") || "District"}
                      </Typography>
                      <Autocomplete
                        fullWidth
                        options={districts}
                        getOptionLabel={(option) => option.name || ""}
                        value={
                          districts.find(
                            (district) => district.id === address.district_id
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleShippingAddressChange(index, 'district_id', newValue?.id || "");
                        }}
                        loading={loading}
                        renderInput={(params) => (
                          <RTLTextField {...params} placeholder="" />
                        )}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("management.addressLine1") || "Address Line 1"}
                      </Typography>
                      <RTLTextField
                        value={address.address_line1 || ""}
                        onChange={(e) => handleShippingAddressChange(index, 'address_line1', e.target.value)}
                        placeholder=""
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("management.addressLine2") || "Address Line 2"}
                      </Typography>
                      <RTLTextField
                        value={address.address_line2 || ""}
                        onChange={(e) => handleShippingAddressChange(index, 'address_line2', e.target.value)}
                        placeholder=""
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("management.building") || "Building"}
                      </Typography>
                      <RTLTextField
                        value={address.building || ""}
                        onChange={(e) => handleShippingAddressChange(index, 'building', e.target.value)}
                        placeholder=""
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("management.block") || "Block"}
                      </Typography>
                      <RTLTextField
                        value={address.block || ""}
                        onChange={(e) => handleShippingAddressChange(index, 'block', e.target.value)}
                        placeholder=""
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("management.side") || "Side"}
                      </Typography>
                      <RTLTextField
                        value={address.side || ""}
                        onChange={(e) => handleShippingAddressChange(index, 'side', e.target.value)}
                        placeholder=""
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("management.apartment") || "Apartment"}
                      </Typography>
                      <RTLTextField
                        value={address.apartment || ""}
                        onChange={(e) => handleShippingAddressChange(index, 'apartment', e.target.value)}
                        placeholder=""
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("management.zipCode") || "Zip Code"}
                      </Typography>
                      <RTLTextField
                        value={address.zip_code || ""}
                        onChange={(e) => handleShippingAddressChange(index, 'zip_code', e.target.value)}
                        placeholder=""
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="business-info-content"
              id="business-info-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {t("management.businessInformation") || "Business Information"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.fileNumber") || "File Number"}
                  </Typography>
                  <RTLTextField
                    value={formData?.file_number || ""}
                    onChange={handleFieldChange("file_number")}
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.barcode") || "Barcode"}
                  </Typography>
                  <RTLTextField
                    value={formData?.barcode || ""}
                    onChange={handleFieldChange("barcode")}
                    placeholder=""
                  />
                </Grid>
                <Grid xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.searchTerms") || "Search Terms"}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <RTLTextField
                        value={newSearchTerm}
                        onChange={(e) => setNewSearchTerm(e.target.value)}
                        onKeyPress={handleSearchTermKeyPress}
                        placeholder={t("management.addSearchTerm") || "Add search term..."}
                        sx={{ flexGrow: 1 }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleAddSearchTerm}
                        disabled={!newSearchTerm.trim()}
                        sx={{
                          minWidth: 'auto',
                          px: 2,
                          py: 0.5,
                          fontSize: '0.75rem',
                          textTransform: 'none',
                        }}
                      >
                        {t("management.add") || "Add"}
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {searchTerms.map((term, index) => (
                        <Chip
                          key={index}
                          label={term}
                          onDelete={() => handleRemoveSearchTerm(term)}
                          color="primary"
                          variant="outlined"
                          sx={{
                            '& .MuiChip-deleteIcon': {
                              color: 'error.main',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="categorize-content"
              id="categorize-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {t("management.categorize") || "Categorize"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.trade") || "Trade"}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={trades}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      trades.find(
                        (trade) => trade.id === formData?.trade_id
                      ) || null
                    }
                    onChange={handleTradeChange}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.companyCode") || "Company Code"}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={companyCodes}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      companyCodes.find(
                        (code) => code.id === formData?.company_code_id
                      ) || null
                    }
                    onChange={handleCompanyCodeChange}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.customerGroup") || "Customer Group"} *
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={customerGroups}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      customerGroups.find(
                        (group) => group.id === formData?.customer_group_id
                      ) || null
                    }
                    onChange={handleCustomerGroupChange}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.businessType") || "Business Type"}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={businessTypes}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      businessTypes.find(
                        (type) => type.id === formData?.business_type_id
                      ) || null
                    }
                    onChange={handleBusinessTypeChange}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.salesChannel") || "Sales Channel"}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={salesChannels}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      salesChannels.find(
                        (channel) => channel.id === formData?.sales_channel_id
                      ) || null
                    }
                    onChange={handleSalesChannelChange}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.distributionChannel") || "Distribution Channel"}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={distributionChannels}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      distributionChannels.find(
                        (channel) => channel.id === formData?.distribution_channel_id
                      ) || null
                    }
                    onChange={handleDistributionChannelChange}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.mediaChannel") || "Media Channel"}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={mediaChannels}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      mediaChannels.find(
                        (channel) => channel.id === formData?.media_channel_id
                      ) || null
                    }
                    onChange={handleMediaChannelChange}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.indicator") || "Indicator"}
                  </Typography>
                  <RTLTextField
                    select
                    value={formData?.indicator || ""}
                    onChange={handleFieldChange("indicator")}
                    placeholder=""
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">
                      {t("management.selectIndicator") || "Select Indicator"}
                    </option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </RTLTextField>
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.riskCategory") || "Risk Category"}
                  </Typography>
                  <RTLTextField
                    select
                    value={formData?.risk_category || ""}
                    onChange={handleFieldChange("risk_category")}
                    placeholder=""
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">
                      {t("management.selectRiskCategory") || "Select Risk Category"}
                    </option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </RTLTextField>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="opening-content"
              id="opening-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {t("management.opening") || "Opening"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.subscriptionStatus") || "Subscription Status"}
                  </Typography>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: isPrimeUser ? 'success.main' : 'warning.main',
                    borderRadius: 1,
                    backgroundColor: isPrimeUser ? 'success.light' : 'warning.light'
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {isPrimeUser 
                        ? t("management.primeUser") || "Prime User - Multiple Currencies Available"
                        : t("management.standardUser") || "Standard User - Limited Features"
                      }
                    </Typography>
                  </Box>
                </Grid>
                
                {isPrimeUser && (
                  <Grid xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("management.multipleCurrencies") || "Multiple Currencies"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t("management.primeFeature") || "Prime feature: You can add multiple currencies for this customer."}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </div>
      );
    }

    // Default fields for other types
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid xs={12}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("management." + type + "Name")} *
          </Typography>
          <RTLTextField
            fullWidth
            value={formData?.name || ""}
            onChange={handleFieldChange("name")}
            required
            placeholder=""
          />
        </Grid>
      </Grid>
    );
  };

  if (!type) return null;

  const getTitle = () => {
    if (isEdit) {
      return `${t("management.edit")} ${t(`management.${type}`)}${originalName ? ` / ${originalName}` : ""}`;
    } else {
      return t(`management.add${type.charAt(0).toUpperCase() + type.slice(1)}`);
    }
  };

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      content={getContent()}
      onSave={handleSave}
      onSaveAndNew={onSaveAndNew}
      onSaveAndClose={onSaveAndClose}
      anchor={isRTL ? "left" : "right"}
    />
  );
};

export default CustomerDrawer;

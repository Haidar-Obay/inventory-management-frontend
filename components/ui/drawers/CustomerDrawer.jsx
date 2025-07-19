"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,  
} from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";
import { getCustomerGroupNames, getSalesmen } from "@/API/Customers";
import { getCountries, getZones, getCities, getDistricts } from "@/API/AddressCodes";
import { getTradeNames, getCompanyCodeNames, getBusinessTypeNames, getSalesChannelNames, getDistributionChannelNames, getMediaChannelNames, getPaymentTerms, getPaymentMethods } from "@/API/Sections";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { Checkbox } from "@/components/ui/checkbox";

import { getCurrencies, getSubscriptionStatus } from '@/API/Currency';
import dynamic from 'next/dynamic';

const LoadingSkeleton = () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#888',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      zIndex: 10,
      width: '100%',
      pointerEvents: 'none',
      background: 'transparent'
    }}
  >
    <span
      style={{
        display: 'inline-block',
        width: 48,
        height: 48,
        border: '5px solid #eee',
        borderTop: '5px solid #1976d2',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    Loading customer details...
  </div>
);

const PersonalInformationSection = dynamic(() => import('./customer/PersonalInformationSection'));
const BillingAddressSection = dynamic(() => import('./customer/BillingAddressSection'));
const ShippingAddressSection = dynamic(() => import('./customer/ShippingAddressSection'));
const BusinessInformationSection = dynamic(() => import('./customer/BusinessInformationSection'));
const CategorizeSection = dynamic(() => import('./customer/CategorizeSection'));
const SalesmenSection = dynamic(() => import('./customer/SalesmenSection'));
const PaymentTermsSection = dynamic(() => import('./customer/PaymentTermsSection'));
const OpeningSection = dynamic(() => import('./customer/OpeningSection'));
const MoreOptionsSection = dynamic(() => import('./customer/MoreOptionsSection'));
const PricingSection = dynamic(() => import('./customer/PricingSection'));
const TaxesSection = dynamic(() => import('./customer/TaxesSection'));
const ContactsSection = dynamic(() => import('./customer/ContactsSection'));
const RoutingSection = dynamic(() => import('./customer/RoutingSection'));
const AttachmentsSection = dynamic(() => import('./customer/AttachmentsSection'));
const MessageSection = dynamic(() => import('./customer/MessageSection'));
const CustomerGroupSection = dynamic(() => import('./customerGroup/CustomerGroupSection'));
const SalesmanSection = dynamic(() => import('./salesmen/SalesmanSection'));

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
  const t = useTranslations("customers");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [originalName, setOriginalName] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [searchTerms, setSearchTerms] = useState([]);
  const [newSearchTerm, setNewSearchTerm] = useState("");
  const { addToast } = useSimpleToast();
  const [currencies, setCurrencies] = useState([]);
  const [openingBalances, setOpeningBalances] = useState([{ currency: '', amount: '', date: '' }]);
  const [canAddMultiCurrency, setCanAddMultiCurrency] = useState(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [allowCredit, setAllowCredit] = useState(false);
  const [creditLimits, setCreditLimits] = useState({});
  const [acceptCheques, setAcceptCheques] = useState(false);
  const [maxCheques, setMaxCheques] = useState({});
  const [paymentDay, setPaymentDay] = useState('');
  const [trackPayment, setTrackPayment] = useState('');
  const [settlementMethod, setSettlementMethod] = useState('');
  const [active, setActive] = useState(true);
  const [blackListed, setBlackListed] = useState(false);
  const [oneTimeAccount, setOneTimeAccount] = useState(false);
  const [specialAccount, setSpecialAccount] = useState(false);
  const [posCustomer, setPosCustomer] = useState(false);
  const [freeDeliveryCharge, setFreeDeliveryCharge] = useState(false);
  const [printInvoiceLanguage, setPrintInvoiceLanguage] = useState('en');
  const [sendInvoice, setSendInvoice] = useState('email');
  const [notes, setNotes] = useState('');
  const [priceChoice, setPriceChoice] = useState('');
  const [priceList, setPriceList] = useState('');
  const [globalDiscount, setGlobalDiscount] = useState('');
  const [discountClass, setDiscountClass] = useState('');
  const [markup, setMarkup] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [message, setMessage] = useState("");
  const [showMessageField, setShowMessageField] = useState(false);
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  // Add this effect to expand OpeningSection by default when opening the drawer for a customer
  React.useEffect(() => {
    if (isOpen && type === 'customer') {
      setExpandedSections(prev => ({ ...prev, opening: true }));
    }
  }, [isOpen, type]);

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
        mediaChannelsRes,
        paymentTermsRes,
        paymentMethodsRes
      ] = await Promise.all([
        getCustomerGroupNames(),
        getSalesmen(),
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
        getPaymentTerms(),
        getPaymentMethods()
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
      setPaymentTerms(paymentTermsRes.data || []);
      setPaymentMethods(paymentMethodsRes.data || []);
      
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
      console.log("Payment Terms:", paymentTermsRes.data);
      console.log("Payment Methods:", paymentMethodsRes.data);
      
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch currencies and subscription status on open
  useEffect(() => {
    if (isOpen) {
      getCurrencies().then((data) => {
        // If the response is an array, set it directly
        setCurrencies(Array.isArray(data) ? data : (data.data || []));
      });
      getSubscriptionStatus().then((data) => {
        const canMulti = data?.data?.can_add_multiple_currencies;
        setCanAddMultiCurrency(!!canMulti);
        setSubscriptionChecked(true);
        if (!canMulti) {
          setUpgradeMessage('Upgrade to Prime to add multi currency.');
        } else {
          setUpgradeMessage('');
        }
      });
    }
  }, [isOpen]);

  // Fetch payment terms and methods on open
  useEffect(() => {
    if (isOpen) {
      getPaymentTerms().then((res) => setPaymentTerms(res.data || []));
      getPaymentMethods().then((res) => setPaymentMethods(res.data || []));
    }
  }, [isOpen]);

  const handleFieldChange = useCallback((field) => (event) => {
    onFormDataChange({
      ...formData,
      [field]: event.target.value,
    });
  }, [formData, onFormDataChange]);

  const handleCustomerGroupChange = useCallback((event, newValue) => {
    onFormDataChange({
      ...formData,
      customer_group_id: newValue?.id || "",
    });
  }, [formData, onFormDataChange]);

  const handleSalesmanChange = useCallback((event, newValue) => {
    onFormDataChange({
      ...formData,
      salesman_id: newValue?.id || "",
    });
  }, [formData, onFormDataChange]);

  const handleTradeChange = useCallback((event, newValue) => {
    onFormDataChange({
      ...formData,
      trade_id: newValue?.id || "",
    });
  }, [formData, onFormDataChange]);

  const handleCompanyCodeChange = useCallback((event, newValue) => {
    onFormDataChange({
      ...formData,
      company_code_id: newValue?.id || "",
    });
  }, [formData, onFormDataChange]);

  const handleBusinessTypeChange = useCallback((event, newValue) => {
    onFormDataChange({
      ...formData,
      business_type_id: newValue?.id || "",
    });
  }, [formData, onFormDataChange]);

  const handleSalesChannelChange = useCallback((event, newValue) => {
    onFormDataChange({
      ...formData,
      sales_channel_id: newValue?.id || "",
    });
  }, [formData, onFormDataChange]);

  const handleDistributionChannelChange = useCallback((event, newValue) => {
    onFormDataChange({
      ...formData,
      distribution_channel_id: newValue?.id || "",
    });
  }, [formData, onFormDataChange]);

  const handleMediaChannelChange = useCallback((event, newValue) => {
    onFormDataChange({
      ...formData,
      media_channel_id: newValue?.id || "",
    });
  }, [formData, onFormDataChange]);

  const handleDisplayNameChange = useCallback((event, newValue) => {
    onFormDataChange({
      ...formData,
      display_name: newValue || "",
    });
  }, [formData, onFormDataChange]);

  const handleCopyFromBillingAddress = useCallback(() => {
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
  }, [formData, onFormDataChange]);

  const handleAddShippingAddress = useCallback(() => {
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
    setShippingAddresses((prev) => [...prev, newAddress]);
  }, []);

  const handleRemoveShippingAddress = useCallback((index) => {
    setShippingAddresses((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleShippingAddressChange = useCallback((index, field, value) => {
    setShippingAddresses((prev) => {
      const updatedAddresses = [...prev];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value,
    };
      return updatedAddresses;
    });
  }, []);

  const handleCopyToShippingAddress = useCallback((index) => {
    setShippingAddresses((prev) => {
      const updatedAddresses = [...prev];
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
      return updatedAddresses;
    });
  }, [formData]);

  const handleAddSearchTerm = useCallback(() => {
    if (newSearchTerm.trim() && !searchTerms.includes(newSearchTerm.trim())) {
      setSearchTerms((prev) => [...prev, newSearchTerm.trim()]);
      setNewSearchTerm("");
    }
  }, [newSearchTerm, searchTerms]);

  const handleRemoveSearchTerm = useCallback((termToRemove) => {
    setSearchTerms((prev) => prev.filter(term => term !== termToRemove));
  }, []);

  const handleSearchTermKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSearchTerm();
    }
  }, [handleAddSearchTerm]);

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

  const handleOpeningBalanceChange = useCallback((index, field, value) => {
    setOpeningBalances((prev) => {
      const updated = [...prev];
    updated[index][field] = value;
      return updated;
    });
  }, []);

  const handleAddOpeningBalance = useCallback(() => {
    setOpeningBalances((prev) => [...prev, { currency: '', amount: '', date: '' }]);
  }, []);

  const handleRemoveOpeningBalance = useCallback((index) => {
    setOpeningBalances((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleCreditLimitChange = useCallback((currencyCode, value) => {
    setCreditLimits((prev) => ({ ...prev, [currencyCode]: value }));
  }, []);
  const handleMaxChequesChange = useCallback((currencyCode, value) => {
    setMaxCheques((prev) => ({ ...prev, [currencyCode]: value }));
  }, []);

  // Handler functions for salesmen roles
  const handleSalesmanSelect = useCallback((event, newValue) => {
    onFormDataChange({ ...formData, salesman_id: newValue?.id || '' });
  }, [formData, onFormDataChange]);
  const handleCollectorSelect = useCallback((event, newValue) => {
    onFormDataChange({ ...formData, collector_id: newValue?.id || '' });
  }, [formData, onFormDataChange]);
  const handleSupervisorSelect = useCallback((event, newValue) => {
    onFormDataChange({ ...formData, supervisor_id: newValue?.id || '' });
  }, [formData, onFormDataChange]);
  const handleManagerSelect = useCallback((event, newValue) => {
    onFormDataChange({ ...formData, manager_id: newValue?.id || '' });
  }, [formData, onFormDataChange]);

  // Filtering logic for active salesmen and roles
  const activeSalesmen = salesmen.filter(s => s.active);
  const collectors = activeSalesmen.filter(s => s.is_collector);
  const supervisors = activeSalesmen.filter(s => s.is_supervisor);
  const managers = activeSalesmen.filter(s => s.is_manager);

  const handleAccordionChange = (section) => (event, isExpanded) => {
    setExpandedSections((prev) => ({ ...prev, [section]: isExpanded }));
  };

  const handleCloseAll = () => {
    setAllCollapsed(true);
    setExpandedSections({});
  };

  const getContent = () => {
    if (!type) return null;

    if (type === "customerGroup") {
      return (
        <CustomerGroupSection
          formData={formData}
          onFormDataChange={onFormDataChange}
          isRTL={isRTL}
          t={t}
          handleFieldChange={handleFieldChange}
        />
      );
    }

    if (type === "salesman") {
      return (
        <SalesmanSection
          formData={formData}
          onFormDataChange={onFormDataChange}
          isRTL={isRTL}
          t={t}
          handleFieldChange={handleFieldChange}
        />
      );
    }

    if (type === "customer") {
      return (
        <Suspense fallback={<LoadingSkeleton />}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Left Column - Accordions */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <PersonalInformationSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                generateDisplayNameSuggestions={generateDisplayNameSuggestions}
                handleDisplayNameChange={handleDisplayNameChange}
                handleFieldChange={handleFieldChange}
                expanded={!!expandedSections.personalInformation}
                onAccordionChange={handleAccordionChange('personalInformation')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <BillingAddressSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                countries={countries}
                zones={zones}
                cities={cities}
                districts={districts}
                loading={loading}
                expanded={!!expandedSections.billingAddress}
                onAccordionChange={handleAccordionChange('billingAddress')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <ShippingAddressSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                countries={countries}
                zones={zones}
                cities={cities}
                districts={districts}
                loading={loading}
                shippingAddresses={shippingAddresses}
                setShippingAddresses={setShippingAddresses}
                handleCopyFromBillingAddress={handleCopyFromBillingAddress}
                handleAddShippingAddress={handleAddShippingAddress}
                handleRemoveShippingAddress={handleRemoveShippingAddress}
                handleShippingAddressChange={handleShippingAddressChange}
                handleCopyToShippingAddress={handleCopyToShippingAddress}
                expanded={!!expandedSections.shippingAddress}
                onAccordionChange={handleAccordionChange('shippingAddress')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <BusinessInformationSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                searchTerms={searchTerms}
                newSearchTerm={newSearchTerm}
                setNewSearchTerm={setNewSearchTerm}
                handleAddSearchTerm={handleAddSearchTerm}
                handleRemoveSearchTerm={handleRemoveSearchTerm}
                handleSearchTermKeyPress={handleSearchTermKeyPress}
                expanded={!!expandedSections.businessInformation}
                onAccordionChange={handleAccordionChange('businessInformation')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <CategorizeSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                trades={trades}
                companyCodes={companyCodes}
                customerGroups={customerGroups}
                businessTypes={businessTypes}
                salesChannels={salesChannels}
                distributionChannels={distributionChannels}
                mediaChannels={mediaChannels}
                loading={loading}
                handleTradeChange={handleTradeChange}
                handleCompanyCodeChange={handleCompanyCodeChange}
                handleCustomerGroupChange={handleCustomerGroupChange}
                handleBusinessTypeChange={handleBusinessTypeChange}
                handleSalesChannelChange={handleSalesChannelChange}
                handleDistributionChannelChange={handleDistributionChannelChange}
                handleMediaChannelChange={handleMediaChannelChange}
                handleFieldChange={handleFieldChange}
                expanded={!!expandedSections.categorize}
                onAccordionChange={handleAccordionChange('categorize')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <OpeningSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                subscriptionChecked={subscriptionChecked}
                canAddMultiCurrency={canAddMultiCurrency}
                upgradeMessage={upgradeMessage}
                openingBalances={openingBalances}
                handleOpeningBalanceChange={handleOpeningBalanceChange}
                handleAddOpeningBalance={handleAddOpeningBalance}
                handleRemoveOpeningBalance={handleRemoveOpeningBalance}
                currencies={currencies}
                expanded={!!expandedSections.opening}
                onAccordionChange={handleAccordionChange('opening')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <SalesmenSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                salesmen={salesmen}
                collectors={collectors}
                supervisors={supervisors}
                managers={managers}
                handleSalesmanSelect={handleSalesmanSelect}
                handleCollectorSelect={handleCollectorSelect}
                handleSupervisorSelect={handleSupervisorSelect}
                handleManagerSelect={handleManagerSelect}
                expanded={!!expandedSections.salesmen}
                onAccordionChange={handleAccordionChange('salesmen')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <PaymentTermsSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                paymentTerms={paymentTerms}
                paymentMethods={paymentMethods}
                selectedPaymentTerm={selectedPaymentTerm}
                setSelectedPaymentTerm={setSelectedPaymentTerm}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                allowCredit={allowCredit}
                setAllowCredit={setAllowCredit}
                openingBalances={openingBalances}
                creditLimits={creditLimits}
                handleCreditLimitChange={handleCreditLimitChange}
                acceptCheques={acceptCheques}
                setAcceptCheques={setAcceptCheques}
                maxCheques={maxCheques}
                handleMaxChequesChange={handleMaxChequesChange}
                paymentDay={paymentDay}
                setPaymentDay={setPaymentDay}
                trackPayment={trackPayment}
                setTrackPayment={setTrackPayment}
                settlementMethod={settlementMethod}
                setSettlementMethod={setSettlementMethod}
                expanded={!!expandedSections.paymentTerms}
                onAccordionChange={handleAccordionChange('paymentTerms')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <MoreOptionsSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                active={active}
                setActive={setActive}
                blackListed={blackListed}
                setBlackListed={setBlackListed}
                oneTimeAccount={oneTimeAccount}
                setOneTimeAccount={setOneTimeAccount}
                specialAccount={specialAccount}
                setSpecialAccount={setSpecialAccount}
                posCustomer={posCustomer}
                setPosCustomer={setPosCustomer}
                freeDeliveryCharge={freeDeliveryCharge}
                setFreeDeliveryCharge={setFreeDeliveryCharge}
                printInvoiceLanguage={printInvoiceLanguage}
                setPrintInvoiceLanguage={setPrintInvoiceLanguage}
                sendInvoice={sendInvoice}
                setSendInvoice={setSendInvoice}
                notes={notes}
                setNotes={setNotes}
                expanded={!!expandedSections.moreOptions}
                onAccordionChange={handleAccordionChange('moreOptions')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <PricingSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                priceChoice={priceChoice}
                setPriceChoice={setPriceChoice}
                priceList={priceList}
                setPriceList={setPriceList}
                globalDiscount={globalDiscount}
                setGlobalDiscount={setGlobalDiscount}
                discountClass={discountClass}
                setDiscountClass={setDiscountClass}
                markup={markup}
                setMarkup={setMarkup}
                markdown={markdown}
                setMarkdown={setMarkdown}
                expanded={!!expandedSections.pricing}
                onAccordionChange={handleAccordionChange('pricing')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <TaxesSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                handleFieldChange={handleFieldChange}
                expanded={!!expandedSections.taxes}
                onAccordionChange={handleAccordionChange('taxes')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <ContactsSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                handleFieldChange={handleFieldChange}
                expanded={!!expandedSections.contacts}
                onAccordionChange={handleAccordionChange('contacts')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <RoutingSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                salesmen={salesmen}
                handleFieldChange={handleFieldChange}
                expanded={!!expandedSections.routing}
                onAccordionChange={handleAccordionChange('routing')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              <AttachmentsSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                t={t}
              />
              <MessageSection
                showMessageField={showMessageField}
                setShowMessageField={setShowMessageField}
                message={message}
                setMessage={setMessage}
                isRTL={isRTL}
                t={t}
              />
            </Box>

            {/* Right Column - Checkboxes */}
            <Box
              sx={{
                position: 'sticky',
                top: 24,
                height: 'fit-content',
                width: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                zIndex: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.quickOptions') || 'Quick Options'}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Checkbox
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                  label={t('management.active') || 'Active'}
                  isRTL={isRTL}
                />
                
                <Checkbox
                  checked={blackListed}
                  onChange={e => setBlackListed(e.target.checked)}
                  label={t('management.blackListed') || 'Black Listed'}
                  isRTL={isRTL}
                />
                
                <Checkbox
                  checked={oneTimeAccount}
                  onChange={e => setOneTimeAccount(e.target.checked)}
                  label={t('management.oneTimeAccount') || 'One Time Account'}
                  isRTL={isRTL}
                />
                
                <Checkbox
                  checked={specialAccount}
                  onChange={e => setSpecialAccount(e.target.checked)}
                  label={t('management.specialAccount') || 'Special Account'}
                  isRTL={isRTL}
                />
                
                <Checkbox
                  checked={posCustomer}
                  onChange={e => setPosCustomer(e.target.checked)}
                  label={t('management.posCustomer') || 'POS Customer'}
                  isRTL={isRTL}
                />
                
                <Checkbox
                  checked={freeDeliveryCharge}
                  onChange={e => setFreeDeliveryCharge(e.target.checked)}
                  label={t('management.freeDeliveryCharge') || 'Free Delivery Charge'}
                  isRTL={isRTL}
                />
              </Box>
            </Box>
          </Box>
        </Suspense>
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
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>{`${t("management.edit")} ${t(`management.${type}`)}${originalName ? ` / ${originalName}` : ""}`}</span>
          <Button size="small" variant="outlined" onClick={handleCloseAll} sx={{ ml: 2 }}>
            {t('management.closeAll') || 'Close All'}
          </Button>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>{t(`management.add${type.charAt(0).toUpperCase() + type.slice(1)}`)}</span>
          <Button size="small" variant="outlined" onClick={handleCloseAll} sx={{ ml: 2 }}>
            {t('management.closeAll') || 'Close All'}
          </Button>
        </Box>
      );
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
      width={1200}
    />
  );
};

export default CustomerDrawer;

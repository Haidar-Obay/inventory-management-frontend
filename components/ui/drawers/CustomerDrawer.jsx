"use client";

import React, { useState, useEffect, useCallback, Suspense, useMemo, useRef } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,  
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";
import { 
  getCustomerGroupNames, 
  getSalesmen, 
  createCustomer, 
  editCustomer, 
  createSalesman, 
  editSalesman, 
  createCustomerGroup, 
  editCustomerGroup 
} from "@/API/Customers";
import { getCountries, getZones, getCities, getDistricts } from "@/API/AddressCodes";
import { getTradeNames, getCompanyCodeNames, getBusinessTypes, getSalesChannelNames, getDistributionChannelNames, getMediaChannelNames, getPaymentTerms, getPaymentMethods } from "@/API/Sections";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useTabNavigation } from "@/hooks/useTabNavigation";

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
// const RoutingSection = dynamic(() => import('./customer/RoutingSection'));
const AttachmentsSection = dynamic(() => import('./customer/AttachmentsSection'));
const MessageSection = dynamic(() => import('./customer/MessageSection'));
const SalesmanSection = dynamic(() => import('./customer/SalesmenSection'));

const CustomerDrawer = React.memo(({
  isOpen,
  onClose,
  type,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  formData,
  onFormDataChange,
  isEdit = false,
  saveLoading = false,
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
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const theme = useTheme();
  const isRTL = locale === "ar";
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'rgb(16 20 29)' : 'rgb(249 250 251)';
  };
  
  const { getTabIndex } = useTabNavigation();
  const [originalName, setOriginalName] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [contacts, setContacts] = useState([]);
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

  // Initialize tab navigation for accordion expansion only
  const tabNavigation = useTabNavigation(expandedSections, setExpandedSections);

  // Track if user has manually changed track payment
  const userChangedTrackPayment = useRef(false);

  // Reset userChangedTrackPayment flag when loading a new customer
  useEffect(() => {
    if (formData?.id) {
      userChangedTrackPayment.current = false;
    }
  }, [formData?.id]);

  // Sync local state with formData for checkboxes, opening balances, and payment settings
  useEffect(() => {
    if (formData) {
      setActive(formData.active !== undefined ? formData.active : true);
      setBlackListed(formData.black_listed !== undefined ? formData.black_listed : false);
      setOneTimeAccount(formData.one_time_account !== undefined ? formData.one_time_account : false);
      setSpecialAccount(formData.special_account !== undefined ? formData.special_account : false);
      setPosCustomer(formData.pos_customer !== undefined ? formData.pos_customer : false);
      setFreeDeliveryCharge(formData.free_delivery_charge !== undefined ? formData.free_delivery_charge : false);
      
      // Sync opening balances from formData
      if (formData.opening_balances_form && formData.opening_balances_form.length > 0) {
        setOpeningBalances(formData.opening_balances_form);
      } else {
        setOpeningBalances([{ currency: '', amount: '', date: '' }]);
      }
      
      // Sync payment settings from formData
      setAllowCredit(formData.allow_credit !== undefined ? formData.allow_credit : false);
      setAcceptCheques(formData.accept_cheques !== undefined ? formData.accept_cheques : false);
      setPaymentDay(formData.payment_day || '');
      
      setSettlementMethod(formData.settlement_method || '');
      
      // Sync payment terms and methods - set the selected values
      if (formData.payment_term_id) {
        setSelectedPaymentTerm(formData.payment_term_id);
      }
      if (formData.payment_method_id) {
        setSelectedPaymentMethod(formData.payment_method_id);
      }
      
      // Sync pricing settings
      setPriceChoice(formData.price_choice || '');
      setPriceList(formData.price_list || '');
      setGlobalDiscount(formData.global_discount ?? '');
      setDiscountClass(formData.discount_class ?? '');
      // Prefer new keys; fallback to legacy percentage keys
      setMarkup(
        formData.markup !== undefined && formData.markup !== null && formData.markup !== ''
          ? formData.markup
          : (formData.markup_percentage ?? '')
      );
      setMarkdown(
        formData.markdown !== undefined && formData.markdown !== null && formData.markdown !== ''
          ? formData.markdown
          : (formData.markdown_percentage ?? '')
      );
      
      // Sync credit limits
      if (formData.credit_limits && formData.credit_limits.length > 0) {
        console.log('CustomerDrawer: Processing credit_limits from formData:', formData.credit_limits);
        const creditLimitsMap = {};
        formData.credit_limits.forEach(limit => {
          const currencyKey = limit.currency_code || limit.currency_id;
          const limitValue = limit.credit_limit || limit.limit_amount || limit.amount;
          creditLimitsMap[currencyKey] = limitValue;
          console.log(`CustomerDrawer: Mapping ${currencyKey} -> ${limitValue}`, limit);
        });
        console.log('CustomerDrawer: Final creditLimitsMap:', creditLimitsMap);
        setCreditLimits(creditLimitsMap);
      }
      
      // Sync cheque limits
      if (formData.cheque_limits && formData.cheque_limits.length > 0) {
        const chequeLimitsMap = {};
        formData.cheque_limits.forEach(limit => {
          chequeLimitsMap[limit.currency_code || limit.currency_id] = limit.max_cheques || limit.amount;
        });
        setMaxCheques(chequeLimitsMap);
      }
      
      // Sync shipping addresses - first address becomes primary, rest become additional
      if (formData.shipping_addresses && Array.isArray(formData.shipping_addresses) && formData.shipping_addresses.length > 0) {
        // First address becomes primary (individual fields are already set)
        // Remaining addresses become additional
        const additionalAddresses = formData.shipping_addresses.slice(1);
        setShippingAddresses(additionalAddresses);
      } else {
        setShippingAddresses([]);
      }
      
      // Sync contacts
      if (formData.contacts && Array.isArray(formData.contacts)) {
        setContacts(formData.contacts);
      } else {
        setContacts([]);
      }
      
      // Sync search terms
      if (formData.search_terms) {
        let searchTermsArray = [];
        
        if (Array.isArray(formData.search_terms)) {
          searchTermsArray = formData.search_terms;
        } else if (typeof formData.search_terms === 'string') {
          // Handle different string formats
          let termsString = formData.search_terms;
          
          // Remove brackets and quotes if present
          termsString = termsString.replace(/^\[|\]$/g, ''); // Remove [ and ]
          termsString = termsString.replace(/"/g, ''); // Remove quotes
          termsString = termsString.replace(/'/g, ''); // Remove single quotes
          
          // Split by comma and clean up
          searchTermsArray = termsString
            .split(',')
            .map(term => term.trim())
            .filter(term => term && term !== '');
        }
        
        setSearchTerms(searchTermsArray);
      }
      
      // Sync message and showMessageField
      setMessage(formData.message || '');
      setShowMessageField(formData.showMessageField || false);
    } else {
      setSearchTerms([]);
    }
  }, [formData]);

  // Separate useEffect for trackPayment - only sync when track_payment specifically changes
  useEffect(() => {
    if (formData && formData.track_payment !== undefined && !userChangedTrackPayment.current) {
      setTrackPayment(formData.track_payment || '');
    }
  }, [formData?.track_payment, userChangedTrackPayment.current]);

  // Sync shippingAddresses back to formData when it changes
  const shippingAddressesRef = useRef();
  useEffect(() => {
    // Only sync if shippingAddresses actually changed and is different from formData
    const currentFormAddresses = formData?.shipping_addresses || [];
    const currentShippingAddresses = shippingAddresses || [];
    
    // Check if shippingAddresses actually changed
    const hasChanged = shippingAddressesRef.current !== JSON.stringify(currentShippingAddresses);
    
    if (hasChanged) {
      shippingAddressesRef.current = JSON.stringify(currentShippingAddresses);
      
      // Only update if different from formData
      if (JSON.stringify(currentFormAddresses) !== JSON.stringify(currentShippingAddresses)) {
        onFormDataChange(prevFormData => ({
          ...prevFormData,
          shipping_addresses: currentShippingAddresses
        }));
      }
    }
  }, [shippingAddresses, onFormDataChange]);

  // Sync openingBalances back to formData when it changes
  const openingBalancesRef = useRef();
  useEffect(() => {
    // Only sync if openingBalances actually changed and is different from formData
    const currentFormOpeningBalances = formData?.opening_balances_form || [];
    const currentOpeningBalances = openingBalances || [];
    
    // Check if openingBalances actually changed
    const hasChanged = openingBalancesRef.current !== JSON.stringify(currentOpeningBalances);
    
    if (hasChanged) {
      openingBalancesRef.current = JSON.stringify(currentOpeningBalances);
      
      // Only update if different from formData
      if (JSON.stringify(currentFormOpeningBalances) !== JSON.stringify(currentOpeningBalances)) {
        onFormDataChange(prevFormData => ({
          ...prevFormData,
          opening_balances_form: currentOpeningBalances
        }));
      }
    }
  }, [openingBalances, onFormDataChange]);





  // Open Personal Information and Opening sections by default when opening customer drawer
  useEffect(() => {
    if (isOpen && type === "customer") {
      setExpandedSections(prev => {
        // Only set if not already set (preserve user toggling)
        const updates = {};
        if (prev.personalInformation === undefined) {
          updates.personalInformation = true;
        }
        if (prev.opening === undefined) {
          updates.opening = true;
        }
        return { ...prev, ...updates };
      });
    }
  }, [isOpen, type]);

  // Memoized display name suggestions to prevent recalculation
  const displayNameSuggestions = useMemo(() => {
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
  }, [formData?.title, formData?.first_name, formData?.middle_name, formData?.last_name, formData?.company_name]);

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
      
      // Initialize search terms from form data
      if (formData?.search_terms) {
        let searchTermsArray = [];
        
        if (Array.isArray(formData.search_terms)) {
          searchTermsArray = formData.search_terms;
        } else if (typeof formData.search_terms === 'string') {
          // Handle different string formats
          let termsString = formData.search_terms;
          
          // Remove brackets and quotes if present
          termsString = termsString.replace(/^\[|\]$/g, ''); // Remove [ and ]
          termsString = termsString.replace(/"/g, ''); // Remove quotes
          termsString = termsString.replace(/'/g, ''); // Remove single quotes
          
          // Split by comma and clean up
          searchTermsArray = termsString
            .split(',')
            .map(term => term.trim())
            .filter(term => term && term !== '');
        }
        
        setSearchTerms(searchTermsArray);
      } else {
        setSearchTerms([]);
      }
    }
  }, [isOpen, isEdit, formData]);

  // Function to check if data has changed from original state
  function isDataChanged() {
    // In add mode, if originalData is empty (which it should be), 
    // we only want to show confirmation if formData has meaningful data
    if (!isEdit) {
      // Helper function to clean data for comparison
      const cleanData = (data) => {
        if (!data || typeof data !== 'object') return {};
        
        const cleaned = {};
        Object.keys(data).forEach(key => {
          const value = data[key];
          
          // Skip null, undefined, empty strings, empty arrays, and empty objects
          if (value === null || value === undefined || value === '') return;
          if (Array.isArray(value) && value.length === 0) return;
          if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return;
          
          // Skip the 'active' field if it's in its default state (true)
          // This prevents the confirmation dialog from appearing when only the default active state is present
          if (key === 'active' && value === true) return;
          
          cleaned[key] = value;
        });
        
        return cleaned;
      };
      
      const cleanedFormData = cleanData(formData);
      // In add mode, originalData should be empty, so if cleanedFormData is also empty, no changes
      return Object.keys(cleanedFormData).length > 0;
    }
    
    // In edit mode, compare with original data
    const cleanData = (data) => {
      if (!data || typeof data !== 'object') return {};
      
      const cleaned = {};
      Object.keys(data).forEach(key => {
        const value = data[key];
        
        // Skip null, undefined, empty strings, empty arrays, and empty objects
        if (value === null || value === undefined || value === '') return;
        if (Array.isArray(value) && value.length === 0) return;
        if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return;
        
        cleaned[key] = value;
      });
      
      return cleaned;
    };
    
    const cleanedFormData = cleanData(formData);
    const cleanedOriginalData = cleanData(originalData);
    
    // Special handling for active field in edit mode
    // If the active field has changed from its original value, include it in the comparison
    if (formData.active !== originalData.active) {
      cleanedFormData.active = formData.active;
      cleanedOriginalData.active = originalData.active;
    }
    
    return JSON.stringify(cleanedFormData) !== JSON.stringify(cleanedOriginalData);
  }

  // Always auto-generate display_name from title, first_name, middle_name, last_name
  const autoDisplayName = useMemo(() => {
    if (type === 'customer') {
      const { title = '', first_name = '', middle_name = '', last_name = '' } = formData || {};
      return [title, first_name, middle_name, last_name].filter(Boolean).join(' ').replace(/  +/g, ' ').trim();
    }
    return '';
  }, [type, formData?.title, formData?.first_name, formData?.middle_name, formData?.last_name]);

  useEffect(() => {
    if (type === 'customer' && autoDisplayName && formData?.display_name !== autoDisplayName) {
      onFormDataChange(prev => ({ ...prev, display_name: autoDisplayName }));
    }
  }, [autoDisplayName, type, onFormDataChange]);

  const fetchDropdownData = useCallback(async () => {
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
        getBusinessTypes(),
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
      setBusinessTypes(businessTypesRes.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch currencies and subscription status on open
  useEffect(() => {
    if (isOpen) {
      getCurrencies().then((data) => {
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

  // Only fetch payment methods once on mount
  useEffect(() => {
    getPaymentTerms().then((res) => setPaymentTerms(res.data || []));
    getPaymentMethods().then((res) => setPaymentMethods(res.data || []));
  }, []);

  // Optimized handleFieldChange - doesn't depend on formData to prevent re-renders
  const handleFieldChange = useCallback((field) => (event) => {
    onFormDataChange((prevFormData) => ({
      ...prevFormData,
      [field]: event.target.value,
    }));
  }, [onFormDataChange]);

  const handleCustomerGroupChange = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({
      ...prevFormData,
      customer_group_id: newValue?.id || "",
    }));
  }, [onFormDataChange]);

  const handleSalesmanChange = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({
      ...prevFormData,
      salesman_id: newValue?.id || "",
    }));
  }, [onFormDataChange]);

  const handleTradeChange = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({
      ...prevFormData,
      trade_id: newValue?.id || "",
    }));
  }, [onFormDataChange]);

  const handleCompanyCodeChange = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({
      ...prevFormData,
      company_code_id: newValue?.id || "",
    }));
  }, [onFormDataChange]);

  const handleBusinessTypeChange = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({
      ...prevFormData,
      business_type_id: newValue?.id || "",
    }));
  }, [onFormDataChange]);

  const handleSalesChannelChange = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({
      ...prevFormData,
      sales_channel_id: newValue?.id || "",
    }));
  }, [onFormDataChange]);

  const handleDistributionChannelChange = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({
      ...prevFormData,
      distribution_channel_id: newValue?.id || "",
    }));
  }, [onFormDataChange]);

  const handleMediaChannelChange = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({
      ...prevFormData,
      media_channel_id: newValue?.id || "",
    }));
  }, [onFormDataChange]);

  
  const handleDisplayNameChange = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({
      ...prevFormData,
      display_name: newValue || "",
    }));
  }, [onFormDataChange]);

  const handleCopyFromBillingAddress = useCallback(() => {
    onFormDataChange((prevFormData) => ({
      ...prevFormData,
      shipping_country_id: prevFormData?.billing_country_id || "",
      shipping_zone_id: prevFormData?.billing_zone_id || "",
      shipping_city_id: prevFormData?.billing_city_id || "",
      shipping_district_id: prevFormData?.billing_district_id || "",
      shipping_address_line1: prevFormData?.billing_address_line1 || "",
      shipping_address_line2: prevFormData?.billing_address_line2 || "",
      shipping_building: prevFormData?.billing_building || "",
      shipping_block: prevFormData?.billing_block || "",
      shipping_side: prevFormData?.billing_side || "",
      shipping_apartment: prevFormData?.billing_apartment || "",
      shipping_zip_code: prevFormData?.billing_zip_code || "",
    }));
  }, [onFormDataChange]);

  const handleAddShippingAddress = useCallback(() => {
    const newAddress = {
      id: Date.now(),
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

  // Contact handlers
  const handleAddContact = useCallback(() => {
    const newContact = {
      id: Date.now(),
      title: "",
      name: "",
      work_phone: "",
      mobile: "",
      position: "",
      extension: "",
      is_primary: false,  // Add is_primary field for additional contacts
    };
    setContacts((prev) => [...prev, newContact]);
  }, []);

  const handleRemoveContact = useCallback((index) => {
    setContacts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleContactChange = useCallback((index, field, value) => {
    setContacts((prev) => {
      const updatedContacts = [...prev];
      updatedContacts[index] = {
        ...updatedContacts[index],
        [field]: value,
      };
      return updatedContacts;
    });
  }, []);

  const handleAddSearchTerm = useCallback(() => {
    if (newSearchTerm.trim() && !searchTerms.includes(newSearchTerm.trim())) {
      const newSearchTerms = [...searchTerms, newSearchTerm.trim()];
      setSearchTerms(newSearchTerms);
      onFormDataChange(prev => ({ ...prev, search_terms: newSearchTerms }));
      setNewSearchTerm("");
    }
  }, [newSearchTerm, searchTerms, onFormDataChange]);

  const handleRemoveSearchTerm = useCallback((termToRemove) => {
    const newSearchTerms = searchTerms.filter(term => term !== termToRemove);
    setSearchTerms(newSearchTerms);
    onFormDataChange(prev => ({ ...prev, search_terms: newSearchTerms }));
  }, [searchTerms, onFormDataChange]);

  const handleSearchTermKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSearchTerm();
    }
  }, [handleAddSearchTerm]);

  const handleSave = useCallback(async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: t("noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    try {
      let response;
      if (type === "customer") {
        if (isEdit) {
          response = await editCustomer(formData.id, formData);
        } else {
          response = await createCustomer(formData);
        }
      } else if (type === "salesman") {
        if (isEdit) {
          response = await editSalesman(formData.id, formData);
        } else {
          response = await createSalesman(formData);
        }
      } else if (type === "customerGroup") {
        if (isEdit) {
          response = await editCustomerGroup(formData.id, formData);
        } else {
          response = await createCustomerGroup(formData);
        }
      }
      
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
        // Update originalData with the current formData to ensure proper change detection
        if (isEdit) {
          setOriginalData(JSON.parse(JSON.stringify(formData)));
        }
        onSave && onSave(response.data);
        onClose && onClose();
      } else {
        addToast({
          type: "error",
          title: tToast("error"),
          description: response?.message || tToast(isEdit ? "updateError" : "createError"),
          duration: 3000,
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: error.message || tToast(isEdit ? "updateError" : "createError"),
        duration: 3000,
      });
    }
  }, [isEdit, isDataChanged, type, formData, onSave, onClose, addToast, tToast, t]);

  const handleSaveAndNew = useCallback(async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: t("noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    try {
      let response;
      if (type === "customer") {
        if (isEdit) {
          response = await editCustomer(formData.id, formData);
        } else {
          response = await createCustomer(formData);
        }
      } else if (type === "salesman") {
        if (isEdit) {
          response = await editSalesman(formData.id, formData);
        } else {
          response = await createSalesman(formData);
        }
      } else if (type === "customerGroup") {
        if (isEdit) {
          response = await editCustomerGroup(formData.id, formData);
        } else {
          response = await createCustomerGroup(formData);
        }
      }
      
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
        onSaveAndNew && onSaveAndNew(response.data);
      } else {
        addToast({
          type: "error",
          title: tToast("error"),
          description: response?.message || tToast(isEdit ? "updateError" : "createError"),
          duration: 3000,
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: error.message || tToast(isEdit ? "updateError" : "createError"),
        duration: 3000,
      });
    }
  }, [isEdit, isDataChanged, type, formData, onSaveAndNew, addToast, tToast, t]);

  const handleSaveAndClose = useCallback(async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: t("noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    try {
      let response;
      if (type === "customer") {
        if (isEdit) {
          response = await editCustomer(formData.id, formData);
        } else {
          response = await createCustomer(formData);
        }
      } else if (type === "salesman") {
        if (isEdit) {
          response = await editSalesman(formData.id, formData);
        } else {
          response = await createSalesman(formData);
        }
      } else if (type === "customerGroup") {
        if (isEdit) {
          response = await editCustomerGroup(formData.id, formData);
        } else {
          response = await createCustomerGroup(formData);
        }
      }
      
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
        // Update originalData with the current formData to ensure proper change detection
        if (isEdit) {
          setOriginalData(JSON.parse(JSON.stringify(formData)));
        }
        onSaveAndClose && onSaveAndClose(response.data);
        onClose && onClose();
      } else {
        addToast({
          type: "error",
          title: tToast("error"),
          description: response?.message || tToast(isEdit ? "updateError" : "createError"),
          duration: 3000,
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: error.message || tToast(isEdit ? "updateError" : "createError"),
        duration: 3000,
      });
    }
  }, [isEdit, isDataChanged, type, formData, onSaveAndClose, onClose, addToast, tToast, t]);

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
    // Also update the form data to ensure credit limits are saved
    onFormDataChange((prevFormData) => ({ 
      ...prevFormData, 
      creditLimits: { ...prevFormData.creditLimits, [currencyCode]: value }
    }));
  }, [onFormDataChange]);
  
  const handleMaxChequesChange = useCallback((currencyCode, value) => {
    setMaxCheques((prev) => ({ ...prev, [currencyCode]: value }));
    // Also update the form data to ensure max cheques are saved
    onFormDataChange((prevFormData) => ({ 
      ...prevFormData, 
      maxCheques: { ...prevFormData.maxCheques, [currencyCode]: value }
    }));
  }, [onFormDataChange]);

  // Handler functions for salesmen roles
  const handleSalesmanSelect = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({ ...prevFormData, salesman_id: newValue?.id || '' }));
  }, [onFormDataChange]);
  
  const handleCollectorSelect = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({ ...prevFormData, collector_id: newValue?.id || '' }));
  }, [onFormDataChange]);
  
  const handleSupervisorSelect = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({ ...prevFormData, supervisor_id: newValue?.id || '' }));
  }, [onFormDataChange]);
  
  const handleManagerSelect = useCallback((event, newValue) => {
    onFormDataChange((prevFormData) => ({ ...prevFormData, manager_id: newValue?.id || '' }));
  }, [onFormDataChange]);

  // Memoized filtering logic for active salesmen and roles
  const activeSalesmen = useMemo(() => salesmen.filter(s => s.active), [salesmen]);
  const collectors = useMemo(() => activeSalesmen.filter(s => s.is_collector), [activeSalesmen]);
  const supervisors = useMemo(() => activeSalesmen.filter(s => s.is_supervisor), [activeSalesmen]);
  const managers = useMemo(() => activeSalesmen.filter(s => s.is_manager), [activeSalesmen]);

  const handleAccordionChange = useCallback((section) => (event, isExpanded) => {
    setExpandedSections((prev) => ({ ...prev, [section]: isExpanded }));
  }, []);

  const handleCloseAll = useCallback(() => {
    setAllCollapsed(true);
    setExpandedSections({});
  }, []);

  // Memoized content to prevent unnecessary re-renders
  const content = useMemo(() => {
    if (!type) return null;

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
                generateDisplayNameSuggestions={() => displayNameSuggestions}
                handleDisplayNameChange={handleDisplayNameChange}
                handleFieldChange={handleFieldChange}
                expanded={!!expandedSections.personalInformation}
                onAccordionChange={handleAccordionChange('personalInformation')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
                tabNavigation={tabNavigation}
                sectionId="personalInformation"
              />
              <BillingAddressSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                countries={countries}
                setCountries={setCountries}
                zones={zones}
                setZones={setZones}
                cities={cities}
                setCities={setCities}
                districts={districts}
                setDistricts={setDistricts}
                loading={loading}
                expanded={!!expandedSections.billingAddress}
                onAccordionChange={handleAccordionChange('billingAddress')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
                tabNavigation={tabNavigation}
                sectionId="billingAddress"
              />
              <ShippingAddressSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                countries={countries}
                setCountries={setCountries}
                zones={zones}
                setZones={setZones}
                cities={cities}
                setCities={setCities}
                districts={districts}
                setDistricts={setDistricts}
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
                tabNavigation={tabNavigation}
                sectionId="shippingAddress"
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
                setTrades={setTrades}
                setCompanyCodes={setCompanyCodes}
                setCustomerGroups={setCustomerGroups}
                setBusinessTypes={setBusinessTypes}
                setSalesChannels={setSalesChannels}
                setDistributionChannels={setDistributionChannels}
                setMediaChannels={setMediaChannels}
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
                setSalesmen={setSalesmen}
              />
              <PaymentTermsSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                isRTL={isRTL}
                t={t}
                paymentTerms={paymentTerms}
                setPaymentTerms={setPaymentTerms}
                paymentMethods={paymentMethods}
                setPaymentMethods={setPaymentMethods}
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
                userChangedTrackPayment={userChangedTrackPayment}
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
                printInvoiceLanguage={formData.print_invoice_language || 'English'}
                setPrintInvoiceLanguage={(value) => onFormDataChange(prev => ({ ...prev, print_invoice_language: value }))}
                sendInvoice={formData.send_invoice || 'email'}
                setSendInvoice={(value) => onFormDataChange(prev => ({ ...prev, send_invoice: value }))}
                notes={formData.notes || ''}
                setNotes={(value) => onFormDataChange(prev => ({ ...prev, notes: value }))}
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
                setPriceChoice={(value) => {
                  setPriceChoice(value);
                  onFormDataChange(prev => ({ ...prev, price_choice: value }));
                }}
                priceList={priceList}
                setPriceList={(value) => {
                  setPriceList(value);
                  onFormDataChange(prev => ({ ...prev, price_list: value }));
                }}
                globalDiscount={globalDiscount}
                setGlobalDiscount={(value) => {
                  setGlobalDiscount(value);
                  const num = value === '' || value === null || value === undefined ? '' : Number(value);
                  onFormDataChange(prev => ({ ...prev, global_discount: num }));
                }}
                discountClass={discountClass}
                setDiscountClass={(value) => {
                  setDiscountClass(value);
                  onFormDataChange(prev => ({ ...prev, discount_class: value }));
                }}
                markup={markup}
                setMarkup={(value) => {
                  setMarkup(value);
                  const num = value === '' || value === null || value === undefined ? '' : Number(value);
                  onFormDataChange(prev => ({ ...prev, markup: num }));
                }}
                markdown={markdown}
                setMarkdown={(value) => {
                  setMarkdown(value);
                  const num = value === '' || value === null || value === undefined ? '' : Number(value);
                  onFormDataChange(prev => ({ ...prev, markdown: num }));
                }}
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
                contacts={contacts}
                setContacts={setContacts}
                handleAddContact={handleAddContact}
                handleRemoveContact={handleRemoveContact}
                handleContactChange={handleContactChange}
                expanded={!!expandedSections.contacts}
                onAccordionChange={handleAccordionChange('contacts')}
                allCollapsed={allCollapsed}
                setAllCollapsed={setAllCollapsed}
              />
              {/* <RoutingSection
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
              /> */}
              <AttachmentsSection
                formData={formData}
                onFormDataChange={onFormDataChange}
                t={t}
              />
              <MessageSection
                showMessageField={formData.showMessageField || false}
                setShowMessageField={(value) => onFormDataChange(prev => ({ ...prev, showMessageField: value }))}
                message={formData.message || ''}
                setMessage={(value) => onFormDataChange(prev => ({ ...prev, message: value }))}
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
                backgroundColor: getBackgroundColor(),
                borderRadius: 0,
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
                  onChange={e => {
                    setActive(e.target.checked);
                    onFormDataChange({ ...formData, active: e.target.checked });
                  }}
                  label={t('management.active') || 'Active'}
                  isRTL={isRTL}
                />
                
                <Checkbox
                  checked={blackListed}
                  onChange={e => {
                    setBlackListed(e.target.checked);
                    onFormDataChange({ ...formData, black_listed: e.target.checked });
                  }}
                  label={t('management.blackListed') || 'Black Listed'}
                  isRTL={isRTL}
                />
                
                <Checkbox
                  checked={oneTimeAccount}
                  onChange={e => {
                    setOneTimeAccount(e.target.checked);
                    onFormDataChange({ ...formData, one_time_account: e.target.checked });
                  }}
                  label={t('management.oneTimeAccount') || 'One Time Account'}
                  isRTL={isRTL}
                />
                
                <Checkbox
                  checked={specialAccount}
                  onChange={e => {
                    setSpecialAccount(e.target.checked);
                    onFormDataChange({ ...formData, special_account: e.target.checked });
                  }}
                  label={t('management.specialAccount') || 'Special Account'}
                  isRTL={isRTL}
                />
                
                <Checkbox
                  checked={posCustomer}
                  onChange={e => {
                    setPosCustomer(e.target.checked);
                    onFormDataChange({ ...formData, pos_customer: e.target.checked });
                  }}
                  label={t('management.posCustomer') || 'POS Customer'}
                  isRTL={isRTL}
                />
                
                <Checkbox
                  checked={freeDeliveryCharge}
                  onChange={e => {
                    setFreeDeliveryCharge(e.target.checked);
                    onFormDataChange({ ...formData, free_delivery_charge: e.target.checked });
                  }}
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
              autoFocus
            />
          </Grid>
      </Grid>
    );
  }, [
    type,
    formData,
    onFormDataChange,
    isRTL,
    t,
    displayNameSuggestions,
    handleDisplayNameChange,
    handleFieldChange,
    countries,
    zones,
    cities,
    districts,
    loading,
    shippingAddresses,
    handleCopyFromBillingAddress,
    handleAddShippingAddress,
    handleRemoveShippingAddress,
    handleShippingAddressChange,
    handleCopyToShippingAddress,
    searchTerms,
    newSearchTerm,
    handleAddSearchTerm,
    handleRemoveSearchTerm,
    handleSearchTermKeyPress,
    trades,
    companyCodes,
    customerGroups,
    businessTypes,
    salesChannels,
    distributionChannels,
    mediaChannels,
    handleTradeChange,
    handleCompanyCodeChange,
    handleCustomerGroupChange,
    handleBusinessTypeChange,
    handleSalesChannelChange,
    handleDistributionChannelChange,
    handleMediaChannelChange,
    subscriptionChecked,
    canAddMultiCurrency,
    upgradeMessage,
    openingBalances,
    handleOpeningBalanceChange,
    handleAddOpeningBalance,
    handleRemoveOpeningBalance,
    currencies,
    salesmen,
    collectors,
    supervisors,
    managers,
    handleSalesmanSelect,
    handleCollectorSelect,
    handleSupervisorSelect,
    handleManagerSelect,
    paymentTerms,
    setPaymentTerms,
    paymentMethods,
    setPaymentMethods,
    selectedPaymentTerm,
    setSelectedPaymentTerm,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    allowCredit,
    setAllowCredit,
    creditLimits,
    handleCreditLimitChange,
    acceptCheques,
    setAcceptCheques,
    maxCheques,
    handleMaxChequesChange,
    paymentDay,
    setPaymentDay,
    trackPayment,
    setTrackPayment,
    settlementMethod,
    setSettlementMethod,
    active,
    setActive,
    blackListed,
    setBlackListed,
    oneTimeAccount,
    setOneTimeAccount,
    specialAccount,
    setSpecialAccount,
    posCustomer,
    setPosCustomer,
    freeDeliveryCharge,
    setFreeDeliveryCharge,


    priceChoice,
    setPriceChoice,
    priceList,
    setPriceList,
    globalDiscount,
    setGlobalDiscount,
    discountClass,
    setDiscountClass,
    markup,
    setMarkup,
    markdown,
    setMarkdown,
    contacts,
    handleAddContact,
    handleRemoveContact,
    handleContactChange,
    expandedSections,
    handleAccordionChange,
    allCollapsed,
    setAllCollapsed,
    showMessageField,
    setShowMessageField,
    message,
    setMessage,
    getBackgroundColor
  ]);

  if (!type) return null;

  const getTitle = () => {
    if (isEdit) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>{`${t("management.edit")} ${t(`management.${type}`)}${originalName ? ` / ${originalName}` : ""}`}</span>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={handleCloseAll} sx={{ ml: 2 }} tabIndex={-1}>
              {t('management.closeAll') || 'Close All'}
            </Button>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>{t(`management.add${type.charAt(0).toUpperCase() + type.slice(1)}`)}</span>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={handleCloseAll} sx={{ ml: 2 }} tabIndex={-1}>
              {t('management.closeAll') || 'Close All'}
            </Button>
          </Box>
        </Box>
      );
    }
  };

  // Check if form has data
  const hasFormData = () => {
    // Check if any form field has data, excluding default values
    return formData && (
      formData.first_name ||
      formData.last_name ||
      formData.display_name ||
      formData.company_name ||
      formData.phone1 ||
      formData.phone2 ||
      formData.phone3 ||
      formData.work_phone ||
      formData.mobile ||
      formData.position ||
      formData.extension ||
      formData.title ||
      formData.middle_name ||
      formData.file_number ||
      formData.barcode ||
      formData.billing_address_line1 ||
      formData.billing_address_line2 ||
      formData.billing_building ||
      formData.billing_block ||
      formData.billing_floor ||
      formData.billing_side ||
      formData.billing_apartment ||
      formData.billing_zip_code ||
      formData.billing_country_id ||
      formData.billing_zone_id ||
      formData.billing_city_id ||
      formData.billing_district_id ||
      formData.customer_group_id ||
      formData.trade_id ||
      formData.company_code_id ||
      formData.business_type_id ||
      formData.sales_channel_id ||
      formData.distribution_channel_id ||
      formData.media_channel_id ||
      formData.indicator ||
      formData.risk_category ||
      formData.salesman_id ||
      formData.collector_id ||
      formData.supervisor_id ||
      formData.manager_id ||
      formData.routing_type ||
      formData.routing_day_of_week ||
      formData.routing_first_day ||
      formData.routing_second_day ||
      formData.routing_day_of_month ||
      formData.price_choice ||
      formData.price_list ||
      formData.global_discount ||
      formData.discount_class ||
      formData.markup ||
      formData.markdown ||
      formData.selected_payment_term ||
      formData.selected_payment_method ||
      formData.allow_credit ||
      formData.accept_cheques ||
      formData.payment_day ||
      formData.track_payment ||
      formData.settlement_method ||
      formData.print_invoice_language ||
      formData.send_invoice ||
      formData.notes ||
      formData.message ||
      formData.attachments?.length > 0 ||
      formData.opening_balances?.some(balance => 
        balance.currency || balance.amount || balance.date
      ) ||
      formData.credit_limits && Object.values(formData.credit_limits).some(limit => limit) ||
      formData.max_cheques && Object.values(formData.max_cheques).some(cheque => cheque) ||
      formData.contacts?.some(contact => 
        contact.title || contact.name || contact.work_phone || contact.mobile || contact.position || contact.extension
      ) ||
      formData.search_terms?.length > 0 ||
      // Check other fields excluding default values
      Object.entries(formData).some(([key, value]) => {
        // Skip default values and empty arrays/objects
        if (key === 'active' || key === 'subscription_checked' || key === 'can_add_multi_currency') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return false;
        return value && value.toString().trim() !== "";
      })
    );
  };

  return (
    <>
      <DynamicDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={getTitle()}
        content={content}
        onSave={handleSave}
        onSaveAndNew={handleSaveAndNew}
        onSaveAndClose={handleSaveAndClose}
        anchor={isRTL ? "left" : "right"}
        width={1200}
        hasDataChanged={isDataChanged()}
        saveLoading={saveLoading}
        isEdit={isEdit}
      />

    </>
  );
});

export default CustomerDrawer;

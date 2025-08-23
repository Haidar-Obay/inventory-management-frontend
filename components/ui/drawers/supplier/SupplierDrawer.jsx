"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { createSupplier, editSupplier } from "@/API/Suppliers";
import { getCountries, getZones, getCities, getDistricts } from "@/API/AddressCodes";
import { getTrades, getBusinessTypes, getPaymentTerms, getPaymentMethods } from "@/API/Sections";
import { getSupplierGroups } from "@/API/Suppliers";
import { getCurrencies, getSubscriptionStatus } from "@/API/Currency";
import { Checkbox } from "@/components/ui/checkbox";
import PersonalInformationSection from "./PersonalInformationSection";
import BillingAddressSection from "./BillingAddressSection";
import ShippingAddressSection from "./ShippingAddressSection";
import BusinessInformationSection from "./BusinessInformationSection";
import CategorizeSection from "./CategorizeSection";
import OpeningSection from "./OpeningSection";
import PaymentTermsSection from "./PaymentTermsSection";
import TaxesSection from "./TaxesSection";
import ContactsSection from "./ContactsSection";
import AttachmentsSection from "./AttachmentsSection";
import MessageSection from "./MessageSection";
import NotesSection from "./NotesSection";
import CatalogSection from "./CatalogSection";
import { useShippingAddresses } from "./shared/useAddressManagement";

// Helper function to map backend address structure to frontend form fields
const mapAddressesFromBackend = (backendData) => {
  const mapped = {};
  
  // Map primary billing address
  if (backendData.primary_billing_address) {
    const addr = backendData.primary_billing_address;
    mapped.billing_country_id = addr.country_id || "";
    mapped.billing_city_id = addr.city_id || "";
    mapped.billing_district_id = addr.district_id || "";
    mapped.billing_zone_id = addr.zone_id || "";
    mapped.billing_address_line1 = addr.address_line1 || "";
    mapped.billing_address_line2 = addr.address_line2 || "";
    mapped.billing_building = addr.building || "";
    mapped.billing_block = addr.block || "";
    mapped.billing_floor = addr.floor || "";
    mapped.billing_side = addr.side || "";
    mapped.billing_apartment = addr.apartment || "";
    mapped.billing_zip_code = addr.zip_code || "";
  }
  
  // Map primary shipping address
  if (backendData.primary_shipping_address) {
    const addr = backendData.primary_shipping_address;
    mapped.shipping_country_id = addr.country_id || "";
    mapped.shipping_city_id = addr.city_id || "";
    mapped.shipping_district_id = addr.district_id || "";
    mapped.shipping_zone_id = addr.zone_id || "";
    mapped.shipping_address_line1 = addr.address_line1 || "";
    mapped.shipping_address_line2 = addr.address_line2 || "";
    mapped.shipping_building = addr.building || "";
    mapped.shipping_block = addr.block || "";
    mapped.shipping_floor = addr.floor || "";
    mapped.shipping_side = addr.side || "";
    mapped.shipping_apartment = addr.apartment || "";
    mapped.shipping_zip_code = addr.zip_code || "";
  }
  
  // Map shipping addresses array
  if (backendData.shipping_addresses && Array.isArray(backendData.shipping_addresses)) {
    mapped.shipping_addresses = backendData.shipping_addresses.map(addr => ({
      id: addr.id,
      country_id: addr.country_id || "",
      city_id: addr.city_id || "",
      district_id: addr.district_id || "",
      zone_id: addr.zone_id || "",
      address_line1: addr.address_line1 || "",
      address_line2: addr.address_line2 || "",
      building: addr.building || "",
      block: addr.block || "",
      floor: addr.floor || "",
      side: addr.side || "",
      apartment: addr.apartment || "",
      zip_code: addr.zip_code || "",
      address_name: addr.pivot?.address_name || "",
      notes: addr.pivot?.notes || "",
      is_primary: addr.pivot?.is_primary || false
    }));
  }
  
  return mapped;
};

// Constants
const INITIAL_FORM_DATA = {
  // ID field for edit mode (undefined for new suppliers)
  id: undefined,
  
  // Personal info fields
  title: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  display_name: "",
  company_name: "",
  phone1: "",
  phone2: "",
  phone3: "",
  active: true,
  foreign: false,
  // Billing address fields
  billing_country_id: "",
  billing_city_id: "",
  billing_district_id: "",
  billing_zone_id: "",
  billing_address_line1: "",
  billing_address_line2: "",
  billing_building: "",
  billing_block: "",
  billing_floor: "",
  billing_side: "",
  billing_apartment: "",
  billing_zip_code: "",
  // Shipping address fields
  shipping_country_id: "",
  shipping_city_id: "",
  shipping_district_id: "",
  shipping_zone_id: "",
  shipping_address_line1: "",
  shipping_address_line2: "",
  shipping_building: "",
  shipping_block: "",
  shipping_floor: "",
  shipping_side: "",
  shipping_apartment: "",
  shipping_zip_code: "",
  // Additional shipping addresses
  shipping_addresses: [],
  // Business information fields
  file_number: "",
  barcode: "",
  search_terms: [],
  // Categorize fields
  trade_id: "",
  supplier_group_id: "",
  business_type_id: "",
  indicator: "",
  // Opening balance fields
  opening_balances: [],
     // Payment terms fields
   payment_term_id: "",
   payment_method_id: "",
   allow_credit: false,
   credit_limits: [],
   accept_cheques: false,
   max_cheques: [],
   payment_day: "",
   track_payment: "no",
   settlement_method: "FIFO",
  // Taxes fields
  taxable: false,
  taxed_from_date: "",
  taxed_till_date: "",
  subjected_to_tax: false,
  added_tax: "",
  // Contacts fields
  work_phone: "",
  mobile: "",
  position: "",
  extension: "",
  contacts: [],
  // Attachments field
  attachments: [],
  // Message fields
  showMessageField: false,
  add_message: false,
  message: "",
  // Notes field
  notes: ""
};

const SupplierDrawer = React.memo(({
  isOpen,
  onClose,
  type,
  formData: externalFormData,
  isEdit = false,
  onSave,
  initialLoading = false,
}) => {
  const t = useTranslations("suppliers");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { addToast } = useSimpleToast();

  // State
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [originalData, setOriginalData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [autoGenerateDisplayName, setAutoGenerateDisplayName] = useState(true);
  
  // Location data state
  const [countries, setCountries] = useState([]);
  const [zones, setZones] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  
  // Categorize data state
  const [trades, setTrades] = useState([]);
  const [supplierGroups, setSupplierGroups] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [categorizeLoading, setCategorizeLoading] = useState(false);
  
  // Opening balance state
  const [currencies, setCurrencies] = useState([]);
  const [subscriptionChecked, setSubscriptionChecked] = useState(true);
  const [canAddMultiCurrency, setCanAddMultiCurrency] = useState(true);
  const [openingBalances, setOpeningBalances] = useState([{ currency: '', amount: '', date: '' }]);
  
     // Payment terms state
   const [paymentTerms, setPaymentTerms] = useState([]);
   const [paymentMethods, setPaymentMethods] = useState([]);
   const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
   const [allowCredit, setAllowCredit] = useState(false);
   const [creditLimits, setCreditLimits] = useState([]);
   const [acceptCheques, setAcceptCheques] = useState(false);
   const [maxCheques, setMaxCheques] = useState([]);
   const [paymentDay, setPaymentDay] = useState("");
   const [trackPayment, setTrackPayment] = useState(false);
   const [settlementMethod, setSettlementMethod] = useState("FIFO");
   const [userChangedTrackPayment] = useState({ current: false });
  
  // Accordion state management
  const [expandedSections, setExpandedSections] = useState({});
  const [allCollapsed, setAllCollapsed] = useState(false);

  // Shipping addresses management using custom hook
  const {
    shippingAddresses,
    setShippingAddresses,
    handleAddShippingAddress,
    handleRemoveShippingAddress,
    handleShippingAddressChange,
    handleCopyToShippingAddress,
    handleCopyFromBillingAddress
  } = useShippingAddresses(formData, setFormData);

  // Business information state
  const [searchTerms, setSearchTerms] = useState([]);
  const [newSearchTerm, setNewSearchTerm] = useState("");
  
  // Contacts state
  const [contacts, setContacts] = useState([]);

  // Quick options state
  const [active, setActive] = useState(true);
  const [foreign, setForeign] = useState(false);

    // Initialize form data when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (isEdit && externalFormData) {
        // Map backend response data to frontend form structure
        const mappedData = {
          ...INITIAL_FORM_DATA,
          // Include the ID for edit mode
          id: externalFormData.id,
          
          // Personal info fields
          title: externalFormData.title || "",
          first_name: externalFormData.first_name || "",
          middle_name: externalFormData.middle_name || "",
          last_name: externalFormData.last_name || "",
          display_name: externalFormData.display_name || "",
          company_name: externalFormData.company_name || "",
          phone1: externalFormData.phone1 || "",
          phone2: externalFormData.phone2 || "",
          phone3: externalFormData.phone3 || "",
          
          // Business info fields
          file_number: externalFormData.file_number || "",
          barcode: externalFormData.barcode || "",
          search_terms: externalFormData.search_terms || [],
          
          // Categorize fields - extract IDs from nested objects
          trade_id: externalFormData.trade?.id || "",
          supplier_group_id: externalFormData.supplier_group?.id || "",
          business_type_id: externalFormData.business_type?.id || "",
          indicator: externalFormData.indicator || "",
          
          // Payment terms fields - extract IDs from nested objects
          payment_term_id: externalFormData.payment_term?.id || "",
          payment_method_id: externalFormData.payment_method?.id || "",
          payment_day: externalFormData.payment_day || "",
          track_payment: externalFormData.track_payment || "no",
          settlement_method: externalFormData.settlement_method || "FIFO",
          accept_cheques: externalFormData.accept_cheques || false,
          
          // Tax fields
          taxable: externalFormData.taxable || false,
          taxed_from_date: externalFormData.taxed_from_date || "",
          taxed_till_date: externalFormData.taxed_till_date || "",
          subjected_to_tax: externalFormData.subjected_to_tax || false,
          added_tax: externalFormData.added_tax || "",
          
          // Message fields
          add_message: externalFormData.add_message || false,
          message: externalFormData.message || "",
          
          // Notes
          notes: externalFormData.notes || "",
          
          // Quick options
          active: externalFormData.active || true,
          foreign: externalFormData.is_foreign || false,
          
          // Map addresses from backend structure
          ...mapAddressesFromBackend(externalFormData),
        };
        
        setFormData(mappedData);
        setOriginalData(JSON.parse(JSON.stringify(mappedData)));
        setAutoGenerateDisplayName(false); // Don't auto-generate for edit mode initially
        
        // Initialize search terms
        if (mappedData.search_terms && Array.isArray(mappedData.search_terms)) {
          setSearchTerms(mappedData.search_terms);
        } else {
          setSearchTerms([]);
        }
        
        // Initialize contacts
        if (externalFormData.contacts && Array.isArray(externalFormData.contacts)) {
          setContacts(externalFormData.contacts);
        } else {
          setContacts([]);
        }
        
                  // Initialize opening balances
          if (externalFormData.opening_balances && Array.isArray(externalFormData.opening_balances) && externalFormData.opening_balances.length > 0) {
            // Map backend format to frontend format
            const mappedOpeningBalances = externalFormData.opening_balances.map(balance => ({
              currency: balance.currency_id || '',
              amount: balance.opening_amount || '',
              date: balance.opening_date || ''
            }));
            setOpeningBalances(mappedOpeningBalances);
          } else {
            setOpeningBalances([{ currency: '', amount: '', date: '' }]);
          }
        
        // Initialize payment terms state
        setSelectedPaymentTerm(mappedData.payment_term_id || null);
        setSelectedPaymentMethod(mappedData.payment_method_id || null);
        setAllowCredit(externalFormData.allow_credit || false);
        // Map credit_limits from backend to frontend format
        if (externalFormData.credit_limits && Array.isArray(externalFormData.credit_limits)) {
          const mappedCreditLimits = externalFormData.credit_limits.map(limit => ({
            currency_id: limit.currency_id || '',
            credit_limit: limit.credit_limit || '',
            notes: limit.notes || null
          }));
          setCreditLimits(mappedCreditLimits);
        } else {
          setCreditLimits([]);
        }
        setAcceptCheques(mappedData.accept_cheques || false);
        // Map cheque_limits from backend to frontend format
        if (externalFormData.cheque_limits && Array.isArray(externalFormData.cheque_limits)) {
          const mappedChequeLimits = externalFormData.cheque_limits.map(cheque => ({
            currency_id: cheque.currency_id || '',
            max_cheques: cheque.max_cheques || '',
            notes: cheque.notes || null
          }));
          setMaxCheques(mappedChequeLimits);
        } else {
          setMaxCheques([]);
        }
        setPaymentDay(mappedData.payment_day || "");
        setTrackPayment(mappedData.track_payment === 'yes');
        setSettlementMethod(mappedData.settlement_method || "FIFO");
      } else {
        setFormData(INITIAL_FORM_DATA);
        setOriginalData(INITIAL_FORM_DATA);
        setAutoGenerateDisplayName(true);
        setSearchTerms([]);
        setContacts([]);
        setOpeningBalances([{ currency: '', amount: '', date: '' }]);
        setSelectedPaymentTerm(null);
        setSelectedPaymentMethod(null);
        setAllowCredit(false);
        setCreditLimits([]);
        setAcceptCheques(false);
        setMaxCheques([]);
        setPaymentDay("");
        setTrackPayment(false);
        setSettlementMethod("FIFO");
      }
      
      // Initialize accordion sections as collapsed
      setExpandedSections({
        personalInfo: true,  // Personal info stays expanded
        billingAddress: false, // Billing address starts collapsed
        shippingAddress: false, // Shipping address starts collapsed
        businessInfo: false, // Business info starts collapsed
        categorize: false, // Categorize starts collapsed
        opening: false, // Opening starts collapsed
        paymentTerms: false, // Payment terms starts collapsed
        taxes: false, // Taxes starts collapsed
        contacts: false, // Contacts starts collapsed
        message: false // Message starts collapsed
      });
      setAllCollapsed(false);
    }
  }, [isOpen, isEdit, externalFormData]);

  // Handle accordion section changes
  const handleAccordionChange = useCallback((section) => (event, isExpanded) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: isExpanded
    }));
  }, []);

  // Handle collapse all
  const handleCollapseAll = useCallback(() => {
    setExpandedSections({
      personalInfo: false,
      billingAddress: false,
      shippingAddress: false,
      businessInfo: false,
      categorize: false,
      opening: false,
      paymentTerms: false,
      taxes: false,
      contacts: false,
      message: false
    });
    setAllCollapsed(true);
  }, []);

  // Fetch location data
  const fetchLocationData = useCallback(async () => {
    try {
      setLocationLoading(true);
      const [countriesRes, zonesRes, citiesRes, districtsRes] = await Promise.all([
        getCountries(),
        getZones(),
        getCities(),
        getDistricts()
      ]);
      
      setCountries(countriesRes.data || []);
      setZones(zonesRes.data || []);
      setCities(citiesRes.data || []);
      setDistricts(districtsRes.data || []);
    } catch (error) {
      // Handle error silently or show toast if needed
    } finally {
      setLocationLoading(false);
    }
  }, []);

  // Fetch categorize data
  const fetchCategorizeData = useCallback(async () => {
    try {
      setCategorizeLoading(true);
      const [tradesData, supplierGroupsData, businessTypesData] = await Promise.all([
        getTrades(),
        getSupplierGroups(),
        getBusinessTypes()
      ]);

      if (tradesData?.status) setTrades(tradesData.data || []);
      if (supplierGroupsData?.status) setSupplierGroups(supplierGroupsData.data || []);
      if (businessTypesData?.status) setBusinessTypes(businessTypesData.data || []);
    } catch (error) {
      // Handle error silently or show toast if needed
    } finally {
      setCategorizeLoading(false);
    }
  }, []);

  // Fetch currencies and subscription status
  const fetchCurrencies = useCallback(async () => {
    try {
      const [currenciesData, subscriptionData] = await Promise.all([
        getCurrencies(),
        getSubscriptionStatus()
      ]);
      
      setCurrencies(Array.isArray(currenciesData) ? currenciesData : (currenciesData.data || []));
      
      if (subscriptionData?.data) {
        const canMulti = subscriptionData.data.can_add_multiple_currencies;
        setCanAddMultiCurrency(canMulti);
        setSubscriptionChecked(true);
      }
    } catch (error) {
      // Handle error silently or show toast if needed
    }
  }, []);

  // Fetch payment terms and methods
  const fetchPaymentData = useCallback(async () => {
    try {
      const [paymentTermsData, paymentMethodsData] = await Promise.all([
        getPaymentTerms(),
        getPaymentMethods()
      ]);
      
      setPaymentTerms(paymentTermsData.data || []);
      setPaymentMethods(paymentMethodsData.data || []);
    } catch (error) {
      // Handle error silently or show toast if needed
    }
  }, []);

  // Fetch location data when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchLocationData();
    }
  }, [isOpen, fetchLocationData]);

  // Fetch categorize data when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchCategorizeData();
    }
  }, [isOpen, fetchCategorizeData]);

  // Fetch currencies when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchCurrencies();
    }
  }, [isOpen, fetchCurrencies]);

  // Fetch payment data when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchPaymentData();
    }
  }, [isOpen, fetchPaymentData]);

  // Form handlers
  const handleFormDataChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If user manually changes display name, disable auto-generation
    if (field === 'display_name') {
      setAutoGenerateDisplayName(false);
    }
  }, []);

  // Categorize handlers
  const handleTradeChange = useCallback((event, newValue) => {
    handleFormDataChange('trade_id', newValue?.id || "");
  }, [handleFormDataChange]);

  const handleSupplierGroupChange = useCallback((event, newValue) => {
    handleFormDataChange('supplier_group_id', newValue?.id || "");
  }, [handleFormDataChange]);

  const handleBusinessTypeChange = useCallback((event, newValue) => {
    handleFormDataChange('business_type_id', newValue?.id || "");
  }, [handleFormDataChange]);

  // Additional form handlers
  const handleFieldChange = useCallback((field) => (event) => {
    const value = event.target.value;
    handleFormDataChange(field, value);
    
    // Re-enable auto-generation when name fields are changed
    if (['title', 'first_name', 'middle_name', 'last_name'].includes(field)) {
      setAutoGenerateDisplayName(true);
    }
  }, [handleFormDataChange]);

  const handleDisplayNameChange = useCallback((event, newValue) => {
    handleFormDataChange("display_name", newValue || "");
    setAutoGenerateDisplayName(false); // Disable auto-generation when user manually changes
  }, [handleFormDataChange]);

  // Auto-generate display name when name fields change
  useEffect(() => {
    if (autoGenerateDisplayName) {
      const { title, first_name, middle_name, last_name } = formData;
      let generatedName = "";
      
      if (first_name && last_name) {
        generatedName = `${first_name} ${last_name}`;
        if (title) {
          generatedName = `${title} ${generatedName}`;
        }
        if (middle_name) {
          generatedName = `${first_name} ${middle_name} ${last_name}`;
          if (title) {
            generatedName = `${title} ${first_name} ${middle_name} ${last_name}`;
          }
        }
      } else if (first_name) {
        generatedName = first_name;
        if (title) {
          generatedName = `${title} ${first_name}`;
        }
      } else if (last_name) {
        generatedName = last_name;
        if (title) {
          generatedName = `${title} ${last_name}`;
        }
      }
      
      if (generatedName && generatedName !== formData.display_name) {
        setFormData(prev => ({
          ...prev,
          display_name: generatedName
        }));
      }
    }
  }, [formData.title, formData.first_name, formData.middle_name, formData.last_name, autoGenerateDisplayName, formData.display_name]);

  // Sync shipping addresses when they change
  useEffect(() => {
    if (shippingAddresses.length > 0) {
      // First address becomes primary shipping address
      const primaryAddress = shippingAddresses[0];
      const updatedFormData = {
        ...formData,
        shipping_country_id: primaryAddress.country_id || "",
        shipping_zone_id: primaryAddress.zone_id || "",
        shipping_city_id: primaryAddress.city_id || "",
        shipping_district_id: primaryAddress.district_id || "",
        shipping_address_line1: primaryAddress.address_line1 || "",
        shipping_address_line2: primaryAddress.address_line2 || "",
        shipping_building: primaryAddress.building || "",
        shipping_block: primaryAddress.block || "",
        shipping_floor: primaryAddress.floor || "",
        shipping_side: primaryAddress.side || "",
        shipping_apartment: primaryAddress.apartment || "",
        shipping_zip_code: primaryAddress.zip_code || "",
        shipping_addresses: shippingAddresses
      };
      setFormData(updatedFormData);
    }
  }, [shippingAddresses, formData]);

  // Sync search terms when they change
  useEffect(() => {
    if (searchTerms.length > 0) {
      setFormData(prev => ({
        ...prev,
        search_terms: searchTerms
      }));
    }
  }, [searchTerms]);

  // Sync contacts when they change
  useEffect(() => {
    if (contacts.length > 0) {
      setFormData(prev => ({
        ...prev,
        contacts: contacts
      }));
    }
  }, [contacts]);

  // Sync opening balances when they change
  useEffect(() => {
    // Filter out entries without currency and ensure notes field is always null
    const validOpeningBalances = openingBalances
      .filter(balance => balance.currency && balance.currency !== '')
      .map(balance => ({
        currency_id: balance.currency,
        opening_amount: balance.amount,
        opening_date: balance.date,
        notes: null
      }));
    
    setFormData(prev => ({
      ...prev,
      opening_balances: validOpeningBalances
    }));
  }, [openingBalances]);

  // Sync payment terms state when they change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      payment_term_id: selectedPaymentTerm,
      payment_method_id: selectedPaymentMethod,
      allow_credit: allowCredit,
      credit_limits: creditLimits,
      accept_cheques: acceptCheques,
      max_cheques: maxCheques,
      payment_day: paymentDay,
      track_payment: trackPayment ? 'yes' : 'no',
      settlement_method: settlementMethod
    }));
  }, [selectedPaymentTerm, selectedPaymentMethod, allowCredit, creditLimits, acceptCheques, maxCheques, paymentDay, trackPayment, settlementMethod]);

  // Sync checkbox states with formData
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      active: active,
      foreign: foreign,
      is_foreign: foreign, // Add backend field mapping
      add_message: formData.showMessageField // Add backend field mapping
    }));
  }, [active, foreign, formData.showMessageField]);

  // Business information handlers
  const handleAddSearchTerm = useCallback(() => {
    if (newSearchTerm.trim() && !searchTerms.includes(newSearchTerm.trim())) {
      const newSearchTerms = [...searchTerms, newSearchTerm.trim()];
      setSearchTerms(newSearchTerms);
      setFormData(prev => ({ ...prev, search_terms: newSearchTerms }));
      setNewSearchTerm("");
    }
  }, [newSearchTerm, searchTerms]);

  const handleRemoveSearchTerm = useCallback((termToRemove) => {
    const newSearchTerms = searchTerms.filter(term => term !== termToRemove);
    setSearchTerms(newSearchTerms);
    setFormData(prev => ({ ...prev, search_terms: newSearchTerms }));
  }, [searchTerms]);

  const handleSearchTermKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSearchTerm();
    }
  }, [handleAddSearchTerm]);
   
   // Contact handlers
   const handleAddContact = useCallback(() => {
     const newContact = {
       id: Date.now(), // Temporary ID for new contacts
       title: "",
       name: "",
       work_phone: "",
       mobile: "",
       position: "",
       extension: "",
       is_primary: false  // Add is_primary field for additional contacts
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
         [field]: value
       };
       return updatedContacts;
     });
   }, []);

  // Opening balance handlers
  const handleOpeningBalanceChange = useCallback((index, field, value) => {
    setOpeningBalances(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const handleAddOpeningBalance = useCallback(() => {
    setOpeningBalances(prev => [...prev, { currency: '', amount: '', date: '' }]);
  }, []);

  const handleRemoveOpeningBalance = useCallback((index) => {
    setOpeningBalances(prev => prev.filter((_, i) => i !== index));
  }, []);

     // Payment terms handlers
   const handleCreditLimitChange = useCallback((currencyId, value) => {
     setCreditLimits(prev => {
       const existing = prev.find(cl => cl.currency_id === currencyId);
       if (existing) {
         return prev.map(cl => 
           cl.currency_id === currencyId 
             ? { ...cl, credit_limit: value }
             : cl
         );
       } else {
         return [...prev, { currency_id: currencyId, credit_limit: value, notes: null }];
       }
     });
   }, []);
 
   const handleMaxChequesChange = useCallback((currencyId, value) => {
     setMaxCheques(prev => {
       const existing = prev.find(cl => cl.currency_id === currencyId);
       if (existing) {
         return prev.map(cl => 
           cl.currency_id === currencyId 
             ? { ...cl, max_cheques: value }
             : cl
         );
       } else {
         return [...prev, { currency_id: currencyId, max_cheques: value, notes: null }];
       }
     });
   }, []);

  // Display name suggestions
  const displayNameSuggestions = useMemo(() => {
    const { title, first_name, middle_name, last_name, company_name } = formData;
    const suggestions = [];

    if (first_name && last_name) {
      suggestions.push(`${first_name} ${last_name}`);
      if (title) suggestions.push(`${title} ${first_name} ${last_name}`);
      if (middle_name) {
        suggestions.push(`${first_name} ${middle_name} ${last_name}`);
        if (title) suggestions.push(`${title} ${first_name} ${middle_name} ${last_name}`);
      }
    }

    if (first_name) {
      suggestions.push(first_name);
      if (title) suggestions.push(`${title} ${first_name}`);
    }

    if (last_name) {
      suggestions.push(last_name);
      if (title) suggestions.push(`${title} ${last_name}`);
    }

    if (company_name) {
      suggestions.push(company_name);
    }

    return suggestions.filter((suggestion, index, array) => 
      array.indexOf(suggestion) === index && suggestion.trim() !== ""
    );
  }, [formData.title, formData.first_name, formData.middle_name, formData.last_name, formData.company_name]);

  // Data change detection
  const hasDataChanged = useCallback(() => {
    if (!isEdit) {
      return Object.values(formData).some(value => 
        value !== "" && value !== true && value !== null && value !== undefined
      );
    }
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData, isEdit]);

  // Title generation
  const getTitle = useCallback(() => {
    if (isEdit) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>{`${t("management.edit")} ${t("management.supplier")}${formData.display_name ? ` / ${formData.display_name}` : ""}`}</span>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={handleCollapseAll} sx={{ ml: 2 }} tabIndex={-1}>
              {t('management.closeAll') || 'Close All'}
            </Button>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>{t("management.addSupplier")}</span>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={handleCollapseAll} sx={{ ml: 2 }} tabIndex={-1}>
              {t('management.closeAll') || 'Close All'}
            </Button>
          </Box>
        </Box>
      );
    }
  }, [isEdit, formData.display_name, t, handleCollapseAll]);

  // Toast helpers
  const showErrorToast = useCallback((message) => {
    addToast({
      type: "error",
      title: tToast("error"),
      description: message,
      duration: 3000,
    });
  }, [addToast, tToast]);

  const showSuccessToast = useCallback((message) => {
    addToast({
      type: "success",
      title: tToast("success"),
      description: message,
      duration: 3000,
    });
  }, [addToast, tToast]);

  // Core save logic
  const performSave = useCallback(async (onSuccess) => {
    if (isEdit && !hasDataChanged()) {
      showErrorToast("Please modify at least one field before saving.");
      return;
    }

    if (saveLoading) return;

    try {
      setSaveLoading(true);
      
                     // Process form data before sending to backend
                const processedFormData = {
          ...formData,
          // Ensure display_name is properly set
          display_name: formData.display_name || `${formData.first_name || ''} ${formData.last_name || ''}`.trim() || 'Supplier',
                              // Handle opening balances - send empty array if no valid entries
            opening_balances: (() => {
              const validBalances = openingBalances.filter(balance => 
                balance.currency && balance.currency !== '' && 
                balance.amount && balance.amount !== ''
              ) || [];
              
              return validBalances.map(balance => ({
                currency_id: parseInt(balance.currency),
                opening_amount: parseFloat(balance.amount),
                opening_date: balance.date || null,
                notes: null
              }));
            })(),
                 // Handle credit limits - send empty array if no valid entries
         credit_limits: (() => {
           const validLimits = creditLimits.filter(limit => 
             limit.currency_id && limit.currency_id !== '' && 
             limit.credit_limit && limit.credit_limit !== ''
           ) || [];
           
                    return validLimits.map(limit => ({
           currency_id: parseInt(limit.currency_id),
           credit_limit: parseFloat(limit.credit_limit),
           notes: limit.notes || null
         }));
         })(),
                 // Handle max cheques - send empty array if no valid entries
         // Backend expects cheque_limits instead of max_cheques
         cheque_limits: (() => {
           console.log('Processing maxCheques:', maxCheques);
           const validCheques = maxCheques.filter(cheque => 
             cheque.currency_id && cheque.currency_id !== '' && 
             cheque.max_cheques && cheque.max_cheques !== ''
           ) || [];
           console.log('Valid cheques:', validCheques);
           
           return validCheques.map(cheque => ({
             currency_id: parseInt(cheque.currency_id),
             max_cheques: parseInt(cheque.max_cheques),
             notes: cheque.notes || null
           }));
         })(),
        // Convert other numeric fields
        trade_id: formData.trade_id ? parseInt(formData.trade_id) : null,
        supplier_group_id: formData.supplier_group_id ? parseInt(formData.supplier_group_id) : null,
        business_type_id: formData.business_type_id ? parseInt(formData.business_type_id) : null,
        payment_term_id: formData.payment_term_id ? parseInt(formData.payment_term_id) : null,
        payment_method_id: formData.payment_method_id ? parseInt(formData.payment_method_id) : null,
        payment_day: formData.payment_day ? parseInt(formData.payment_day) : null,
        added_tax: formData.added_tax ? parseFloat(formData.added_tax) : null,
        // Convert location IDs
        billing_country_id: formData.billing_country_id ? parseInt(formData.billing_country_id) : null,
        billing_city_id: formData.billing_city_id ? parseInt(formData.billing_city_id) : null,
        billing_district_id: formData.billing_district_id ? parseInt(formData.billing_district_id) : null,
        billing_zone_id: formData.billing_zone_id ? parseInt(formData.billing_zone_id) : null,
        shipping_country_id: formData.shipping_country_id ? parseInt(formData.shipping_country_id) : null,
        shipping_city_id: formData.shipping_city_id ? parseInt(formData.shipping_city_id) : null,
        shipping_district_id: formData.shipping_district_id ? parseInt(formData.shipping_district_id) : null,
        shipping_zone_id: formData.shipping_zone_id ? parseInt(formData.shipping_zone_id) : null,
                 // Process shipping addresses
         shipping_addresses: formData.shipping_addresses?.map(address => ({
           ...address,
           country_id: address.country_id ? parseInt(address.country_id) : null,
           city_id: address.city_id ? parseInt(address.city_id) : null,
           district_id: address.district_id ? parseInt(address.district_id) : null,
           zone_id: address.zone_id ? parseInt(address.zone_id) : null
         })) || [],
         // Map frontend field names to backend field names
         is_foreign: formData.foreign,
         
         // Remove frontend-specific fields that backend doesn't expect
         foreign: undefined,
         showMessageField: undefined,
         
         // Ensure required fields are present
         name: formData.display_name || `${formData.first_name || ''} ${formData.last_name || ''}`.trim() || 'Supplier',
         phone: formData.phone1 || '',
         address: formData.billing_address_line1 || ''
       };

             

       let response;

       if (isEdit) {
         console.log('Edit mode - ID:', processedFormData.id, 'Type:', typeof processedFormData.id);
         console.log('FormData ID:', formData.id, 'Type:', typeof formData.id);
         console.log('Original externalFormData ID:', externalFormData?.id, 'Type:', typeof externalFormData?.id);
         response = await editSupplier(processedFormData.id, processedFormData);
       } else {
         response = await createSupplier(processedFormData);
       }

      if (response && response.status) {
        showSuccessToast(tToast(isEdit ? "updateSuccess" : "createSuccess"));
        
        if (isEdit) {
          setOriginalData(JSON.parse(JSON.stringify(formData)));
        }
        
        onSuccess(response.data);
      } else {
        showErrorToast(response?.message || tToast(isEdit ? "updateError" : "createError"));
      }
    } catch (error) {
      showErrorToast(error.message || tToast(isEdit ? "updateError" : "createError"));
    } finally {
      setSaveLoading(false);
    }
  }, [formData, isEdit, hasDataChanged, saveLoading, showErrorToast, showSuccessToast, tToast, editSupplier, createSupplier]);

  // Save handlers
  const handleSave = useCallback(async () => {
    await performSave((responseData) => {
      // Call onSave prop to update parent component
      if (onSave) {
        onSave(responseData);
      }
    });
  }, [performSave, onSave]);

  const handleSaveAndNew = useCallback(async () => {
    await performSave((responseData) => {
      // Call onSave prop to update parent component
      if (onSave) {
        onSave(responseData);
      }
      
      if (!isEdit) {
        setFormData(INITIAL_FORM_DATA);
        setOriginalData(INITIAL_FORM_DATA);
        setAutoGenerateDisplayName(true);
      }
    });
  }, [performSave, onSave, isEdit]);

  const handleSaveAndClose = useCallback(async () => {
    await performSave((responseData) => {
      // Call onSave prop to update parent component
      if (onSave) {
        onSave(responseData);
      }
      onClose();
    });
  }, [performSave, onSave, onClose]);

  // Content
  const content = (
    <Box sx={{ p: 2, position: 'relative', minHeight: 200 }}>
      {initialLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            pointerEvents: 'none',
            color: '#888'
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
          <style>{`@keyframes spin {0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
          Loading supplier details...
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left Column - Main Sections */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <PersonalInformationSection
            formData={formData}
            onFormDataChange={handleFormDataChange}
            isRTL={isRTL}
            t={t}
            expanded={expandedSections.personalInfo}
            onAccordionChange={handleAccordionChange('personalInfo')}
            generateDisplayNameSuggestions={() => displayNameSuggestions}
            handleDisplayNameChange={handleDisplayNameChange}
            handleFieldChange={handleFieldChange}
          />
          
          <BillingAddressSection
            formData={formData}
            onFormDataChange={handleFormDataChange}
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
            loading={locationLoading}
            expanded={expandedSections.billingAddress}
            onAccordionChange={handleAccordionChange('billingAddress')}
            allCollapsed={allCollapsed}
            setAllCollapsed={setAllCollapsed}
          />

          <ShippingAddressSection
            formData={formData}
            onFormDataChange={handleFormDataChange}
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
            loading={locationLoading}
            shippingAddresses={shippingAddresses}
            setShippingAddresses={setShippingAddresses}
            handleCopyFromBillingAddress={handleCopyFromBillingAddress}
            handleAddShippingAddress={handleAddShippingAddress}
            handleRemoveShippingAddress={handleRemoveShippingAddress}
            handleShippingAddressChange={handleShippingAddressChange}
            handleCopyToShippingAddress={handleCopyToShippingAddress}
            expanded={expandedSections.shippingAddress}
            onAccordionChange={handleAccordionChange('shippingAddress')}
            allCollapsed={allCollapsed}
            setAllCollapsed={setAllCollapsed}
          />

          <BusinessInformationSection
            formData={formData}
            onFormDataChange={handleFormDataChange}
            isRTL={isRTL}
            t={t}
            searchTerms={searchTerms}
            newSearchTerm={newSearchTerm}
            setNewSearchTerm={setNewSearchTerm}
            handleAddSearchTerm={handleAddSearchTerm}
            handleRemoveSearchTerm={handleRemoveSearchTerm}
            handleSearchTermKeyPress={handleSearchTermKeyPress}
            expanded={expandedSections.businessInfo}
            onAccordionChange={handleAccordionChange('businessInfo')}
            allCollapsed={allCollapsed}
            setAllCollapsed={setAllCollapsed}
          />

          <CategorizeSection
            formData={formData}
            onFormDataChange={handleFormDataChange}
            isRTL={isRTL}
            t={t}
            trades={trades}
            supplierGroups={supplierGroups}
            businessTypes={businessTypes}
            loading={categorizeLoading}
            handleTradeChange={handleTradeChange}
            handleSupplierGroupChange={handleSupplierGroupChange}
            handleBusinessTypeChange={handleBusinessTypeChange}
            expanded={expandedSections.categorize}
            onAccordionChange={handleAccordionChange('categorize')}
            allCollapsed={allCollapsed}
            setAllCollapsed={setAllCollapsed}
            setTrades={setTrades}
            setSupplierGroups={setSupplierGroups}
            setBusinessTypes={setBusinessTypes}
          />
          
          <OpeningSection
            formData={formData}
            onFormDataChange={handleFormDataChange}
            isRTL={isRTL}
            t={t}
            subscriptionChecked={subscriptionChecked}
            canAddMultiCurrency={canAddMultiCurrency}
            upgradeMessage="Upgrade your subscription to add multiple currencies"
            openingBalances={openingBalances}
            handleOpeningBalanceChange={handleOpeningBalanceChange}
            handleAddOpeningBalance={handleAddOpeningBalance}
            handleRemoveOpeningBalance={handleRemoveOpeningBalance}
            currencies={currencies}
            expanded={expandedSections.opening}
            onAccordionChange={handleAccordionChange('opening')}
            allCollapsed={allCollapsed}
            setAllCollapsed={setAllCollapsed}
          />
          
                     <PaymentTermsSection
             formData={formData}
             onFormDataChange={handleFormDataChange}
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
             expanded={expandedSections.paymentTerms}
             onAccordionChange={handleAccordionChange('paymentTerms')}
             allCollapsed={allCollapsed}
             setAllCollapsed={setAllCollapsed}
             userChangedTrackPayment={userChangedTrackPayment}
             currencies={currencies}
           />
          
          <TaxesSection
            formData={formData}
            onFormDataChange={handleFormDataChange}
            isRTL={isRTL}
            t={t}
            expanded={expandedSections.taxes}
            onAccordionChange={handleAccordionChange('taxes')}
            allCollapsed={allCollapsed}
            setAllCollapsed={setAllCollapsed}
          />

          <ContactsSection
            formData={formData}
            onFormDataChange={handleFormDataChange}
            isRTL={isRTL}
            t={t}
            contacts={contacts}
            handleAddContact={handleAddContact}
            handleRemoveContact={handleRemoveContact}
            handleContactChange={handleContactChange}
            expanded={expandedSections.contacts}
            onAccordionChange={handleAccordionChange('contacts')}
            allCollapsed={allCollapsed}
            setAllCollapsed={setAllCollapsed}
          />

          <CatalogSection
            isRTL={isRTL}
            t={t}
          />

          <NotesSection
            notes={formData.notes || ''}
            onNotesChange={(value) => handleFormDataChange('notes', value)}
            isRTL={isRTL}
            t={t}
          />

          <AttachmentsSection
            formData={formData}
            onFormDataChange={handleFormDataChange}
            isRTL={isRTL}
            t={t}
          />

          <MessageSection
            showMessageField={formData.showMessageField || false}
            setShowMessageField={(value) => {
              handleFormDataChange('showMessageField', value);
              handleFormDataChange('add_message', value); // Sync with backend field
            }}
            message={formData.message || ''}
            setMessage={(value) => handleFormDataChange('message', value)}
            isRTL={isRTL}
            t={t}
            expanded={expandedSections.message}
            onAccordionChange={handleAccordionChange('message')}
            allCollapsed={allCollapsed}
            setAllCollapsed={setAllCollapsed}
          />
        </Box>

        {/* Right Column - Quick Options */}
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
            backgroundColor: 'rgb(249 250 251)',
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
                handleFormDataChange('active', e.target.checked);
              }}
              label={t('management.active') || 'Active'}
              isRTL={isRTL}
            />
            
            <Checkbox
              checked={foreign}
              onChange={e => {
                setForeign(e.target.checked);
                handleFormDataChange('foreign', e.target.checked);
              }}
              label={t('management.foreign') || 'Foreign'}
              isRTL={isRTL}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      content={content}
      onSave={handleSave}
      onSaveAndNew={handleSaveAndNew}
      onSaveAndClose={handleSaveAndClose}
      anchor="right"
      width={1200}
      hasDataChanged={hasDataChanged()}
      saveLoading={saveLoading}
      isEdit={isEdit}
    />
  );
});

export default SupplierDrawer;

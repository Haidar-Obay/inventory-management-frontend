import { useState, useCallback } from 'react';

// Custom hook for managing address-related state and handlers
export const useAddressManagement = (formData, onFormDataChange, prefix) => {
  // Handle text field changes
  const handleFieldChange = useCallback((field) => (event) => {
    onFormDataChange(`${prefix}_${field}`, event.target.value);
  }, [onFormDataChange, prefix]);

  // Handle location field changes
  const handleLocationChange = useCallback((field) => (value) => {
    onFormDataChange(`${prefix}_${field}_id`, value);
  }, [onFormDataChange, prefix]);

  // Handle location add
  const handleLocationAdd = useCallback((field, setters) => (newItem) => {
    const { setCountries, setZones, setCities, setDistricts } = setters;
    
    if (field === 'country') setCountries(prev => [...prev, newItem]);
    if (field === 'zone') setZones(prev => [...prev, newItem]);
    if (field === 'city') setCities(prev => [...prev, newItem]);
    if (field === 'district') setDistricts(prev => [...prev, newItem]);
  }, []);

  // Check if address has any filled fields
  const hasAddressData = useCallback(() => {
    const fields = [
      formData?.[`${prefix}_country_id`],
      formData?.[`${prefix}_zone_id`],
      formData?.[`${prefix}_city_id`],
      formData?.[`${prefix}_district_id`],
      formData?.[`${prefix}_address_line1`],
      formData?.[`${prefix}_address_line2`],
      formData?.[`${prefix}_building`],
      formData?.[`${prefix}_block`],
      formData?.[`${prefix}_floor`],
      formData?.[`${prefix}_side`],
      formData?.[`${prefix}_apartment`],
      formData?.[`${prefix}_zip_code`],
    ];
    return fields.some(val => val && val.toString().trim() !== '');
  }, [formData, prefix]);

  return {
    handleFieldChange,
    handleLocationChange,
    handleLocationAdd,
    hasAddressData
  };
};

// Custom hook for managing shipping addresses
export const useShippingAddresses = (formData, setFormData) => {
  const [shippingAddresses, setShippingAddresses] = useState([]);

  // Add new shipping address
  const handleAddShippingAddress = useCallback(() => {
    const newAddress = {
      id: Date.now(), // Temporary ID
      country_id: "",
      zone_id: "",
      city_id: "",
      district_id: "",
      address_line1: "",
      address_line2: "",
      building: "",
      block: "",
      floor: "",
      side: "",
      apartment: "",
      zip_code: ""
    };
    setShippingAddresses(prev => [...prev, newAddress]);
  }, []);

  // Remove shipping address
  const handleRemoveShippingAddress = useCallback((index) => {
    setShippingAddresses(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Update shipping address field
  const handleShippingAddressChange = useCallback((index, field, value) => {
    setShippingAddresses(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Copy billing address to shipping address
  const handleCopyToShippingAddress = useCallback((index) => {
    setShippingAddresses(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        country_id: formData.billing_country_id || "",
        zone_id: formData.billing_zone_id || "",
        city_id: formData.billing_city_id || "",
        district_id: formData.billing_district_id || "",
        address_line1: formData.billing_address_line1 || "",
        address_line2: formData.billing_address_line2 || "",
        building: formData.billing_building || "",
        block: formData.billing_block || "",
        floor: formData.billing_floor || "",
        side: formData.billing_side || "",
        apartment: formData.billing_apartment || "",
        zip_code: formData.billing_zip_code || ""
      };
      return updated;
    });
  }, [formData]);

  // Copy from billing address to primary shipping
  const handleCopyFromBillingAddress = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      shipping_country_id: prev.billing_country_id || "",
      shipping_zone_id: prev.billing_zone_id || "",
      shipping_city_id: prev.billing_city_id || "",
      shipping_district_id: prev.billing_district_id || "",
      shipping_address_line1: prev.billing_address_line1 || "",
      shipping_address_line2: prev.billing_address_line2 || "",
      shipping_building: prev.billing_building || "",
      shipping_block: prev.billing_block || "",
      shipping_floor: prev.billing_floor || "",
      shipping_side: prev.billing_side || "",
      shipping_apartment: prev.billing_apartment || "",
      shipping_zip_code: prev.billing_zip_code || ""
    }));
  }, [setFormData]);

  return {
    shippingAddresses,
    setShippingAddresses,
    handleAddShippingAddress,
    handleRemoveShippingAddress,
    handleShippingAddressChange,
    handleCopyToShippingAddress,
    handleCopyFromBillingAddress
  };
};

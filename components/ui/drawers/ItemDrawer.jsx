"use client";

import React, { useState, useEffect } from "react";
import { Grid, TextField, Autocomplete, Typography, Box } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useSimpleToast } from "@/components/ui/simple-toast";

import { getCategoryNames } from "@/API/Items";
import { getBrandNames } from "@/API/Items";
import { useTranslations, useLocale } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";

const ItemDrawer = ({
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
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("items");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [originalName, setOriginalName] = useState("");
  const [originalData, setOriginalData] = useState({});
  const { addToast } = useSimpleToast();

  useEffect(() => {
    if (isOpen) {
      if (type === "category") {
        fetchCategoryNames();
      } else if (type === "brand") {
        fetchBrandNames();
      } else if (type === "item") {
        fetchAllOptions();
      }
    }
  }, [type, isOpen]);

  useEffect(() => {
    if (isOpen && isEdit) {
      setOriginalName(formData?.name || "");
      setOriginalData(JSON.parse(JSON.stringify(formData)));
    }
  }, [isOpen, isEdit]);

  const fetchCategoryNames = async () => {
    try {
      setLoading(true);
      const response = await getCategoryNames();
      setCategoryOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching category names:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandNames = async () => {
    try {
      setLoading(true);
      const response = await getBrandNames();
      setBrandOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching brand names:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOptions = async () => {
    await Promise.all([fetchCategoryNames(), fetchBrandNames()]);
  };

  const handleFieldChange = (field) => (event) => {
    onFormDataChange({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleProductLineChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      product_line_id: newValue?.id || "",
      product_line_name: newValue?.name || "",
    });
  };

  const handleCategoryChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      category_id: newValue?.id || "",
      category_name: newValue?.name || "",
    });
  };

  const handleBrandChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      brand_id: newValue?.id || "",
      brand_name: newValue?.name || "",
    });
  };

  function isDataChanged() {
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
    const cleanedOriginalData = cleanData(originalData);
    
    return JSON.stringify(cleanedFormData) !== JSON.stringify(cleanedOriginalData);
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
    if (type === "productLine") {
      return (
        <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Left side - Form fields */}
            <Box sx={{ flex: 1 }}>
              <Grid container spacing={2}>
                <Grid sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
                <Grid sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
            <Box sx={{ width: 200, display: 'flex', alignItems: 'flex-start', pt: 4.5, justifyContent: 'flex-end' }}>
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
        </Box>
      );
    }

    if (type === "category") {
      return (
        <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Left side - Form fields */}
            <Box sx={{ flex: 1 }}>
              <Grid container spacing={2}>
                <Grid sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }} md={6}>
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
                <Grid sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }} md={6}>
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
                <Grid xs={12} sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.subCategoryOf")}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={categoryOptions}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      categoryOptions.find(
                        (c) => c.id === formData?.sub_category_of
                      ) || null
                    }
                    onChange={(e, newValue) =>
                      onFormDataChange({
                        ...formData,
                        sub_category_of: newValue?.id || "",
                      })
                    }
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            
            {/* Right side - Checkbox */}
            <Box sx={{ width: 200, display: 'flex', alignItems: 'flex-start', pt: 4.5, justifyContent: 'flex-end' }}>
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
        </Box>
      );
    }

    if (type === "brand") {
      return (
        <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Left side - Form fields */}
            <Box sx={{ flex: 1 }}>
              <Grid container spacing={2}>
                <Grid xs={12} md={6} sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
                <Grid xs={12} md={6} sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
                <Grid xs={12} sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.subBrandOf")}
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={brandOptions}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      brandOptions.find((b) => b.id === formData?.sub_brand_of) ||
                      null
                    }
                    onChange={(e, newValue) =>
                      onFormDataChange({
                        ...formData,
                        sub_brand_of: newValue?.id || "",
                      })
                    }
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            
            {/* Right side - Checkbox */}
            <Box sx={{ width: 200, display: 'flex', alignItems: 'flex-start', pt: 4.5, justifyContent: 'flex-end' }}>
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
        </Box>
      );
    }

    if (type === "item") {
      return (
        <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
          <Box sx={{ display: 'flex', gap: 2 }}>
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
                    autoFocus
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
                <Grid xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.productLine")} *
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={productLineOptions}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      productLineOptions.find(
                        (p) => p.id === formData?.product_line_id
                      ) || null
                    }
                    onChange={handleProductLineChange}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" required />
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
                    {t("management.category")} *
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={categoryOptions}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      categoryOptions.find((c) => c.id === formData?.category_id) ||
                      null
                    }
                    onChange={handleCategoryChange}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" required />
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
                    {t("management.brand")} *
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={brandOptions}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      brandOptions.find((b) => b.id === formData?.brand_id) || null
                    }
                    onChange={handleBrandChange}
                    loading={loading}
                    renderInput={(params) => (
                      <RTLTextField {...params} placeholder="" required />
                    )}
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
        </Box>
      );
    }

    return null;
  };

  if (!type) return null;

  const getDrawerWidth = (type) => {
    if (type === "productLine") return 500;
    if (type === "category") return 500;
    if (type === "brand") return 500;
    if (type === "item") return 500;
    return 500; // default
  };

  const getTitle = () => {
    if (isEdit) {
      return `${t("management.edit")} ${t(`management.${type}`)}${originalName ? ` / ${originalName}` : ""}`;
    } else {
      return t(`management.add${type.charAt(0).toUpperCase() + type.slice(1)}`);
    }
  };

  // Check if form has data
  const hasFormData = () => {
    // Check if any form field has data, excluding default values
    return formData && (
      formData.name ||
      formData.code ||
      formData.description ||
      formData.price ||
      formData.cost ||
      formData.category_id ||
      formData.brand_id ||
      formData.unit_id ||
      formData.tax_id ||
      formData.supplier_id ||
      formData.min_stock ||
      formData.max_stock ||
      formData.reorder_point ||
      formData.sku ||
      formData.barcode ||
      formData.weight ||
      formData.dimensions ||
      formData.notes ||
      formData.attachments?.length > 0 ||
      // Check other fields excluding default values
      Object.entries(formData).some(([key, value]) => {
        // Skip default values
        if (key === 'active' || key === 'is_service') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return false;
        return value && value.toString().trim() !== "";
      })
    );
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
      width={getDrawerWidth(type)}
      hasDataChanged={isDataChanged()}
    />
  );
};

export default ItemDrawer;

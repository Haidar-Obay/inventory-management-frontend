"use client";

import React, { useState, useEffect } from "react";
import { Grid, TextField, Autocomplete, Typography, Box, useTheme } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useSimpleToast } from "@/components/ui/simple-toast";

import { 
  createProductLine, 
  editProductLine, 
  createCategory, 
  editCategory, 
  createBrand, 
  editBrand,
  createItem,
  editItem
} from "@/API/Items";
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
  saveLoading: externalSaveLoading = false,
  categoryOptions = [],
  brandOptions = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [internalSaveLoading, setInternalSaveLoading] = useState(false);
  const t = useTranslations("items");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const theme = useTheme();
  const isRTL = locale === "ar";
  const [originalName, setOriginalName] = useState("");
  const [originalData, setOriginalData] = useState({});
  const { addToast } = useSimpleToast();

  // Check if we're in dark mode
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'rgb(16 20 29)' : 'rgb(249 250 251)';
  };

  // Use external saveLoading if provided, otherwise use internal
  const saveLoading = externalSaveLoading || internalSaveLoading;

  useEffect(() => {
    if (isOpen) {
      // No additional data fetching needed for simplified item form
    }
  }, [type, isOpen]);

  useEffect(() => {
    if (isOpen && isEdit) {
      setOriginalName(formData?.name || "");
      setOriginalData(JSON.parse(JSON.stringify(formData)));
    }
  }, [isOpen, isEdit]);







  const handleFieldChange = (field) => (event) => {
    let value = event.target.value;
    
    // Handle number fields
    if (field === "price") {
      value = value === "" ? "" : parseFloat(value) || 0;
    }
    
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };



  function isDataChanged() {
    // In add mode, we want to show confirmation if formData has meaningful data beyond defaults
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
          
          // Skip default values that are always present
          if (key === 'active' && value === true) return;
          if (key === 'subcategory_of' && value === '') return;
          if (key === 'sub_brand_of' && value === '') return;
          
          cleaned[key] = value;
        });
        
        return cleaned;
      };
      
      const cleanedFormData = cleanData(formData);
      // In add mode, if cleanedFormData is empty, no meaningful changes
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
    
    const hasChanges = JSON.stringify(cleanedFormData) !== JSON.stringify(cleanedOriginalData);
    
    return hasChanges;
  }

  const handleSave = async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: t("items.noChangesTitle") || "No changes detected",
        description: t("items.noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    if (saveLoading) return; // Prevent multiple saves
    
    try {
      setInternalSaveLoading(true);
      
      // Handle internally (like other drawers)
      let response;
      if (type === "productLine") {
        if (isEdit) {
          response = await editProductLine(formData.id, formData);
        } else {
          response = await createProductLine(formData);
        }
      } else if (type === "category") {
        if (isEdit) {
          response = await editCategory(formData.id, formData);
        } else {
          response = await createCategory(formData);
        }
      } else if (type === "brand") {
        if (isEdit) {
          response = await editBrand(formData.id, formData);
        } else {
          response = await createBrand(formData);
        }
      } else if (type === "item") {
        if (isEdit) {
          response = await editItem(formData.id, formData);
        } else {
          response = await createItem(formData);
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
        // Don't close the drawer - let user continue editing
        // onClose && onClose(); // Removed this line
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
    } finally {
      setInternalSaveLoading(false);
    }
  };

  const handleSaveAndNew = async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: t("items.noChangesTitle") || "No changes detected",
        description: t("items.noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    if (saveLoading) return; // Prevent multiple saves
    
    try {
      setInternalSaveLoading(true);
      
      // Handle internally (like other drawers)
      let response;
      if (type === "productLine") {
        if (isEdit) {
          response = await editProductLine(formData.id, formData);
        } else {
          response = await createProductLine(formData);
        }
      } else if (type === "category") {
        if (isEdit) {
          response = await editCategory(formData.id, formData);
        } else {
          response = await createCategory(formData);
        }
      } else if (type === "brand") {
        if (isEdit) {
          response = await editBrand(formData.id, formData);
        } else {
          response = await createBrand(formData);
        }
      } else if (type === "item") {
        if (isEdit) {
          response = await editItem(formData.id, formData);
        } else {
          response = await createItem(formData);
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
    } finally {
      setInternalSaveLoading(false);
    }
  };

  const handleSaveAndClose = async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: t("items.noChangesTitle") || "No changes detected",
        description: t("items.noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    if (saveLoading) return; // Prevent multiple saves
    
    try {
      setInternalSaveLoading(true);
      
      // Handle internally (like other drawers)
      let response;
      if (type === "productLine") {
        if (isEdit) {
          response = await editProductLine(formData.id, formData);
        } else {
          response = await createProductLine(formData);
        }
      } else if (type === "category") {
        if (isEdit) {
          response = await editCategory(formData.id, formData);
        } else {
          response = await createCategory(formData);
        }
      } else if (type === "brand") {
        if (isEdit) {
          response = await editBrand(formData.id, formData);
        } else {
          response = await createBrand(formData);
        }
      } else if (type === "item") {
        if (isEdit) {
          response = await editItem(formData.id, formData);
        } else {
          response = await createItem(formData);
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
    } finally {
      setInternalSaveLoading(false);
    }
  };

  const getContent = () => {
    if (type === "productLine") {
      return (
        <Box 
          sx={{
            p: 4,
            backgroundColor: getBackgroundColor(),
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 1
          }}
        >
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
                checked={Boolean(formData?.active)}
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
        <Box 
          sx={{
            p: 4,
            backgroundColor: getBackgroundColor(),
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 1
          }}
        >
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
                checked={Boolean(formData?.active)}
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
        <Box 
          sx={{
            p: 4,
            backgroundColor: getBackgroundColor(),
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 1
          }}
        >
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
                checked={Boolean(formData?.active)}
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
        <Box 
          sx={{
            p: 4,
            backgroundColor: getBackgroundColor(),
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 1
          }}
        >
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
                    {t("management.price")} *
                  </Typography>
                  <TextField
                    value={formData?.price !== undefined && formData?.price !== null ? (formData.price === 0 ? "0" : String(formData.price)) : ""}
                    onChange={handleFieldChange("price")}
                    required
                    placeholder=""
                    type="number"
                    inputProps={{ min: 0, step: "0.01" }}
                    fullWidth
                    size="small"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
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
      formData.price ||
      // Check other fields excluding default values
      Object.entries(formData).some(([key, value]) => {
        // Skip default values
        if (key === 'is_service') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return false;
        return value && value.toString().trim() !== "";
      })
    );
  };

  // Check if data has changed from original state
  const hasDataChanged = isDataChanged();

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      content={getContent()}
      onSave={handleSave}
      onSaveAndNew={handleSaveAndNew}
      onSaveAndClose={handleSaveAndClose}
      anchor={isRTL ? "left" : "right"}
      width={getDrawerWidth(type)}
      hasDataChanged={hasDataChanged}
      saveLoading={saveLoading}
      isEdit={isEdit}
    />
  );
};

export default ItemDrawer;

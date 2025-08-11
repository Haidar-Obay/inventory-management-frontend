import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, useTheme } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";
import {
  createCountry, createZone, createCity, createDistrict,
  editCountry, editZone, editCity, editDistrict
} from "@/API/AddressCodes";

const AddressCodeDrawer = ({
  isOpen,
  onClose,
  type,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  formData: externalFormData,
  onFormDataChange: externalOnFormDataChange,
  isEdit = false,
  saveLoading: externalSaveLoading = false,
}) => {
  const t = useTranslations("addressCodes");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const theme = useTheme();
  const isRTL = locale === "ar";
  const [originalName, setOriginalName] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [internalSaveLoading, setInternalSaveLoading] = useState(false);
  const { addToast } = useSimpleToast();

  // Check if we're in dark mode
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'rgb(16 20 29)' : 'rgb(249 250 251)';
  };

  // Use external saveLoading if provided, otherwise use internal
  const saveLoading = externalSaveLoading || internalSaveLoading;

  // Internal state fallback
  const [internalFormData, setInternalFormData] = useState({ name: "" });
  const formData = externalFormData !== undefined ? externalFormData : internalFormData;
  const onFormDataChange = externalOnFormDataChange !== undefined ? externalOnFormDataChange : setInternalFormData;

  useEffect(() => {
    if (isOpen && isEdit) {
      setOriginalName(formData?.name || "");
      setOriginalData(JSON.parse(JSON.stringify(formData)));
    }
    // Reset internal state when opening for new entry
    if (isOpen && !isEdit && !externalFormData) {
      setInternalFormData({ name: "" });
    }
  }, [isOpen, isEdit]);

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

  const handleNameChange = (event) => {
    onFormDataChange({
      ...formData,
      name: event.target.value,
    });
  };

  const getContent = () => {
    if (!type) return null;

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
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t(`management.${type}Name`)} *
            </Typography>
            <RTLTextField
              value={formData?.name || ""}
              onChange={handleNameChange}
              required
              placeholder=""
              autoFocus
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  if (!type) return null;

  const getDrawerWidth = (type) => {
    if (type === "zone") return 450;
    if (type === "country") return 450;
    if (type === "city") return 450;
    if (type === "district") return 450;
    return 450; // default
  };

  const getTitle = () => {
    if (isEdit) {
      return `${t("management.edit")} ${t(`management.${type}`)}${originalName ? ` / ${originalName}` : ""}`;
    } else {
      return t(`management.add${type.charAt(0).toUpperCase() + type.slice(1)}`);
    }
  };

  // Backend logic for POST/PUT
  const handleSave = async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: t("noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    if (saveLoading) return; // Prevent multiple saves
    
    try {
      setInternalSaveLoading(true);
      let response;
      
      // Prepare data with type information
      const dataToSend = {
        ...formData,
        type: type // Include the type to help backend distinguish between address code types
      };
      
      if (isEdit) {
        if (type === "country") response = await editCountry(formData.id, dataToSend);
        if (type === "zone") response = await editZone(formData.id, dataToSend);
        if (type === "city") response = await editCity(formData.id, dataToSend);
        if (type === "district") response = await editDistrict(formData.id, dataToSend);
      } else {
        if (type === "country") response = await createCountry(dataToSend);
        if (type === "zone") response = await createZone(dataToSend);
        if (type === "city") response = await createCity(dataToSend);
        if (type === "district") response = await createDistrict(dataToSend);
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

  // Save and New
  const handleSaveAndNew = async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: t("noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    if (saveLoading) return; // Prevent multiple saves
    
    try {
      setInternalSaveLoading(true);
      let response;
      
      // Prepare data with type information
      const dataToSend = {
        ...formData,
        type: type // Include the type to help backend distinguish between address code types
      };
      
      if (isEdit) {
        if (type === "country") response = await editCountry(formData.id, dataToSend);
        if (type === "zone") response = await editZone(formData.id, dataToSend);
        if (type === "city") response = await editCity(formData.id, dataToSend);
        if (type === "district") response = await editDistrict(formData.id, dataToSend);
      } else {
        if (type === "country") response = await createCountry(dataToSend);
        if (type === "zone") response = await createZone(dataToSend);
        if (type === "city") response = await createCity(dataToSend);
        if (type === "district") response = await createDistrict(dataToSend);
      }
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
        if (onSaveAndNew) onSaveAndNew(response.data);
        // Reset form for new entry
        setInternalFormData({ name: "" });
        setOriginalData({});
        setOriginalName("");
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

  // Save and Close
  const handleSaveAndClose = async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: t("noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    if (saveLoading) return; // Prevent multiple saves
    
    try {
      setInternalSaveLoading(true);
      let response;
      
      // Prepare data with type information
      const dataToSend = {
        ...formData,
        type: type // Include the type to help backend distinguish between address code types
      };
      
      if (isEdit) {
        if (type === "country") response = await editCountry(formData.id, dataToSend);
        if (type === "zone") response = await editZone(formData.id, dataToSend);
        if (type === "city") response = await editCity(formData.id, dataToSend);
        if (type === "district") response = await editDistrict(formData.id, dataToSend);
      } else {
        if (type === "country") response = await createCountry(dataToSend);
        if (type === "zone") response = await createZone(dataToSend);
        if (type === "city") response = await createCity(dataToSend);
        if (type === "district") response = await createDistrict(dataToSend);
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
        if (onSaveAndClose) onSaveAndClose(response.data);
        if (onClose) onClose();
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

export default AddressCodeDrawer;

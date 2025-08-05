import React, { useState, useEffect } from "react";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import { Grid, Typography, Box } from "@mui/material";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { createCustomerGroup, editCustomerGroup } from "@/API/Customers";

const CustomerGroupDrawer = ({
  isOpen,
  onClose,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  editData,
  saveLoading: externalSaveLoading = false,
}) => {
  const t = useTranslations("customers");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { addToast } = useSimpleToast();
  const [formData, setFormData] = useState({ active: true });
  const [originalData, setOriginalData] = useState({});
  const [originalName, setOriginalName] = useState("");
  const [internalSaveLoading, setInternalSaveLoading] = useState(false);
  const isEdit = !!editData;

  // Use external saveLoading if provided, otherwise use internal
  const saveLoading = externalSaveLoading || internalSaveLoading;

  useEffect(() => {
    if (isOpen) {
      if (isEdit && editData) {
        setFormData(editData);
        setOriginalData(JSON.parse(JSON.stringify(editData)));
        setOriginalName(editData?.name || editData?.code || "");
      } else {
        setFormData({ active: true });
        setOriginalData({});
        setOriginalName("");
      }
    }
  }, [isOpen, isEdit, editData]);

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

  const handleFieldChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

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
      if (isEdit) {
        response = await editCustomerGroup(formData.id, formData);
      } else {
        response = await createCustomerGroup(formData);
      }
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
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
      // Handle specific error cases for user-friendly messages
      let errorMessage = tToast(isEdit ? "updateError" : "createError");
      
      if (error.message) {
        if (error.message.includes("code_unique") || error.message.includes("customer_groups_code_unique")) {
          errorMessage = "The code has already been taken.";
        } else if (error.message.includes("name_unique") || error.message.includes("customer_groups_name_unique")) {
          errorMessage = "The name has already been taken.";
        } else if (error.message.includes("duplicate key")) {
          errorMessage = "This record already exists.";
        } else {
          errorMessage = error.message;
        }
      }
      
      addToast({
        type: "error",
        title: tToast("error"),
        description: errorMessage,
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
      if (isEdit) {
        response = await editCustomerGroup(formData.id, formData);
      } else {
        response = await createCustomerGroup(formData);
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
        setFormData({ active: true });
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
      // Handle specific error cases for user-friendly messages
      let errorMessage = tToast(isEdit ? "updateError" : "createError");
      
      if (error.message) {
        if (error.message.includes("code_unique") || error.message.includes("customer_groups_code_unique")) {
          errorMessage = "The code has already been taken.";
        } else if (error.message.includes("name_unique") || error.message.includes("customer_groups_name_unique")) {
          errorMessage = "The name has already been taken.";
        } else if (error.message.includes("duplicate key")) {
          errorMessage = "This record already exists.";
        } else {
          errorMessage = error.message;
        }
      }
      
      addToast({
        type: "error",
        title: tToast("error"),
        description: errorMessage,
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
      if (isEdit) {
        response = await editCustomerGroup(formData.id, formData);
      } else {
        response = await createCustomerGroup(formData);
      }
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
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
      // Handle specific error cases for user-friendly messages
      let errorMessage = tToast(isEdit ? "updateError" : "createError");
      
      if (error.message) {
        if (error.message.includes("code_unique") || error.message.includes("customer_groups_code_unique")) {
          errorMessage = "The code has already been taken.";
        } else if (error.message.includes("name_unique") || error.message.includes("customer_groups_name_unique")) {
          errorMessage = "The name has already been taken.";
        } else if (error.message.includes("duplicate key")) {
          errorMessage = "This record already exists.";
        } else {
          errorMessage = error.message;
        }
      }
      
      addToast({
        type: "error",
        title: tToast("error"),
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setInternalSaveLoading(false);
    }
  };

  const hasFormData = (formData?.name && formData.name.trim() !== "") || (formData?.code && formData.code.trim() !== "");

  // Get title with name for edit mode
  const getTitle = () => {
    if (isEdit) {
      return `${t("management.editCustomerGroup")}${originalName ? ` / ${originalName}` : ""}`;
    } else {
      return t("management.addCustomerGroup");
    }
  };

  const content = (
    <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left side - Form fields */}
        <Box sx={{ flex: 1 }}>
          <Grid container spacing={2}>
            <Grid xs={12} md={6} sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
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
            <Grid xs={12} md={6} sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
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
            onChange={e => setFormData({ ...formData, active: e.target.checked })}
            label={t("management.active")}
            isRTL={isRTL}
          />
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
      anchor={isRTL ? "left" : "right"}
      width={500}
      hasDataChanged={isDataChanged()}
      saveLoading={saveLoading}
    />
  );
};

export default CustomerGroupDrawer; 
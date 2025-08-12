import React, { useState, useEffect } from "react";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import { Grid, Typography, Box, useTheme } from "@mui/material";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { createSalesman, editSalesman } from "@/API/Customers";

const SalesmanDrawer = ({
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
  const theme = useTheme();
  const isRTL = locale === "ar";
  const { addToast } = useSimpleToast();
  const [formData, setFormData] = useState({ active: true });
  const [originalData, setOriginalData] = useState({});
  const [originalName, setOriginalName] = useState("");
  const [internalSaveLoading, setInternalSaveLoading] = useState(false);
  const isEdit = !!editData;

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
        response = await editSalesman(formData.id, formData);
      } else {
        response = await createSalesman(formData);
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
      if (isEdit) {
        response = await editSalesman(formData.id, formData);
      } else {
        response = await createSalesman(formData);
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
      if (isEdit) {
        response = await editSalesman(formData.id, formData);
      } else {
        response = await createSalesman(formData);
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

  const hasFormData = (formData?.name && formData.name.trim() !== "") || (formData?.code && formData.code.trim() !== "");

  // Get title with name for edit mode
  const getTitle = () => {
    if (isEdit) {
      return `${t("management.editSalesman")}${originalName ? ` / ${originalName}` : ""}`;
    } else {
      return t("management.addSalesman");
    }
  };

  const content = (
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
            {/* Code */}
            <Grid xs={12} sx={{ minWidth: 350, gridColumn: 'span 12' }}>
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
            
            {/* Name */}
            <Grid xs={12} sx={{ minWidth: 350, gridColumn: 'span 12' }}>
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
            
            {/* Email */}
            <Grid xs={12} sx={{ minWidth: 350, gridColumn: 'span 12' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
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
            
            {/* Phone1 */}
            <Grid xs={12} sx={{ minWidth: 350, gridColumn: 'span 12' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
              >
                {t("management.phone1")}
              </Typography>
              <RTLTextField
                value={formData?.phone1 || ""}
                onChange={handleFieldChange("phone1")}
                placeholder=""
              />
            </Grid>
            
            {/* Phone2 */}
            <Grid xs={12} sx={{ minWidth: 350, gridColumn: 'span 12' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
              >
                {t("management.phone2")}
              </Typography>
              <RTLTextField
                value={formData?.phone2 || ""}
                onChange={handleFieldChange("phone2")}
                placeholder=""
              />
            </Grid>
            
            {/* Address */}
            <Grid xs={12} sx={{ minWidth: 350, gridColumn: 'span 12' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
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
            
            {/* isManager */}
            <Grid xs={12} sx={{ minWidth: 350, gridColumn: 'span 12' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
              >
                {t("management.isManager")}
              </Typography>
              <RTLTextField
                select
                value={formData?.is_manager === true ? "true" : "false"}
                onChange={e => setFormData({ ...formData, is_manager: e.target.value === "true" })}
                SelectProps={{ native: true }}
                placeholder=""
              >
                <option value="false">{t("management.no")}</option>
                <option value="true">{t("management.yes")}</option>
              </RTLTextField>
            </Grid>
            
            {/* isSupervisor */}
            <Grid xs={12} sx={{ minWidth: 350, gridColumn: 'span 12' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
              >
                {t("management.isSupervisor")}
              </Typography>
              <RTLTextField
                select
                value={formData?.is_supervisor === true ? "true" : "false"}
                onChange={e => setFormData({ ...formData, is_supervisor: e.target.value === "true" })}
                SelectProps={{ native: true }}
                placeholder=""
              >
                <option value="false">{t("management.no")}</option>
                <option value="true">{t("management.yes")}</option>
              </RTLTextField>
            </Grid>
            
            {/* isCollector */}
            <Grid xs={12} sx={{ minWidth: 350, gridColumn: 'span 12' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
              >
                {t("management.isCollector")}
              </Typography>
              <RTLTextField
                select
                value={formData?.is_collector === true ? "true" : "false"}
                onChange={e => setFormData({ ...formData, is_collector: e.target.value === "true" })}
                SelectProps={{ native: true }}
                placeholder=""
              >
                <option value="false">{t("management.no")}</option>
                <option value="true">{t("management.yes")}</option>
              </RTLTextField>
            </Grid>
            
            {/* fixCommission */}
            <Grid xs={12} sx={{ minWidth: 350, gridColumn: 'span 12' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
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
            
            {/* commissionByItem */}
            <Grid xs={12} sx={{ minWidth: 350, gridColumn: 'span 12' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
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
        <Box sx={{ width: 100, display: 'flex', alignItems: 'flex-start', pt: 4.5, justifyContent: 'flex-end' }}>
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
      width={550}
      hasDataChanged={isDataChanged()}
      saveLoading={saveLoading}
      isEdit={isEdit}
    />
  );
};

export default SalesmanDrawer; 
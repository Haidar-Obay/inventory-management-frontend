"use client";

import React, { useState, useEffect } from "react";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import { Grid, Typography, Box, useTheme } from "@mui/material";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";

const RoleDrawer = ({
  isOpen,
  onClose,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  editData,
  saveLoading: externalSaveLoading = false,
}) => {
  const t = useTranslations("settings");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const theme = useTheme();
  const isRTL = locale === "ar";
  const { addToast } = useSimpleToast();
  
  const [formData, setFormData] = useState({ 
    name: "", 
    code: "", 
    description: "", 
    active: true,
    permissions: []
  });
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
        setFormData({ 
          name: "", 
          code: "", 
          description: "", 
          active: true,
          permissions: []
        });
        setOriginalData({});
        setOriginalName("");
      }
    }
  }, [isOpen, isEdit, editData]);

  function isDataChanged() {
    if (!isEdit) {
      return formData.name || formData.code || formData.description;
    }
    
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      addToast({
        title: tToast("error"),
        message: t("roleNameAndCodeRequired"),
        type: "error",
        duration: 3000,
      });
      return;
    }

    setInternalSaveLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(formData);
      }
      
      addToast({
        title: tToast("success"),
        message: isEdit ? t("roleUpdatedSuccessfully") : t("roleCreatedSuccessfully"),
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      addToast({
        title: tToast("error"),
        message: t("roleSaveError"),
        type: "error",
        duration: 3000,
      });
    } finally {
      setInternalSaveLoading(false);
    }
  };

  const handleSaveAndNew = async () => {
    await handleSave();
    if (onSaveAndNew) {
      onSaveAndNew();
    }
  };

  const handleSaveAndClose = async () => {
    await handleSave();
    if (onSaveAndClose) {
      onSaveAndClose();
    }
  };

  const getContent = () => (
    <Box sx={{ p: 2, backgroundColor: getBackgroundColor() }}>
      <Grid container spacing={3}>
        {/* Role Name */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" className="mb-2 font-medium">
            {t("roleName")} *
          </Typography>
          <RTLTextField
            fullWidth
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder={t("enterRoleName")}
            variant="outlined"
            size="small"
            dir={isRTL ? "rtl" : "ltr"}
          />
        </Grid>

        {/* Role Code */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" className="mb-2 font-medium">
            {t("roleCode")} *
          </Typography>
          <RTLTextField
            fullWidth
            value={formData.code}
            onChange={(e) => handleInputChange("code", e.target.value)}
            placeholder={t("enterRoleCode")}
            variant="outlined"
            size="small"
            dir={isRTL ? "rtl" : "ltr"}
          />
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" className="mb-2 font-medium">
            {t("description")}
          </Typography>
          <RTLTextField
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder={t("enterRoleDescription")}
            variant="outlined"
            size="small"
            dir={isRTL ? "rtl" : "ltr"}
          />
        </Grid>

        {/* Active Status */}
        <Grid item xs={12}>
          <Box className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onChange={(e) => handleInputChange("active", e.target.checked)}
            />
            <label htmlFor="active" className="text-sm font-medium">
              {t("active")}
            </label>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const getTitle = () => {
    if (isEdit) {
      return `${t("editRole")}${originalName ? ` / ${originalName}` : ""}`;
    } else {
      return t("addRole");
    }
  };

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
      width={500}
      hasDataChanged={isDataChanged()}
      saveLoading={saveLoading}
      isEdit={isEdit}
    />
  );
};

export default RoleDrawer;

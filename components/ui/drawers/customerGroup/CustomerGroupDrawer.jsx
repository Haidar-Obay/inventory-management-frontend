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
  editData,
}) => {
  const t = useTranslations("customers");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { addToast } = useSimpleToast();
  const [formData, setFormData] = useState({ active: true });
  const [originalData, setOriginalData] = useState({});
  const isEdit = !!editData;

  useEffect(() => {
    if (isOpen) {
      if (isEdit && editData) {
        setFormData(editData);
        setOriginalData(JSON.parse(JSON.stringify(editData)));
      } else {
        setFormData({ active: true });
        setOriginalData({});
      }
    }
  }, [isOpen, isEdit, editData]);

  function isDataChanged() {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
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
    try {
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
  };

  const hasFormData = (formData?.name && formData.name.trim() !== "") || (formData?.code && formData.code.trim() !== "");

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
            checked={formData?.active !== false}
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
      title={isEdit ? t("management.editCustomerGroup") : t("management.addCustomerGroup")}
      content={content}
      onSave={handleSave}
      anchor={isRTL ? "left" : "right"}
      width={500}
      hasFormData={hasFormData}
    />
  );
};

export default CustomerGroupDrawer; 
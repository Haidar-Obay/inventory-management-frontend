import React, { useState, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";
import {
  createPaymentTerm,
  editPaymentTerm,
  createPaymentMethod,
  editPaymentMethod,
} from "@/API/Payment";

const PaymentDrawer = ({
  isOpen,
  onClose,
  type, // 'paymentTerm' or 'paymentMethod'
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  isEdit = false,
  initialData = null,
}) => {
  const t = useTranslations("payment");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [originalName, setOriginalName] = useState("");
  const [originalData, setOriginalData] = useState({});
  const { addToast } = useSimpleToast();

  // Local form state only
  const [formData, setFormData] = useState({ code: "", name: "", nb_days: 0, active: true, is_credit_card: false, is_online_payment: false });

  useEffect(() => {
    if (isOpen && isEdit && initialData) {
      setOriginalName(initialData?.code || "");
      setOriginalData(JSON.parse(JSON.stringify(initialData)));
      setFormData({ ...initialData });
    }
    // Reset local state when opening for new entry
    if (isOpen && !isEdit) {
      setFormData({ code: "", name: "", nb_days: 0, active: true, is_credit_card: false, is_online_payment: false });
      setOriginalName("");
      setOriginalData({});
    }
  }, [isOpen, isEdit, initialData]);

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

  const handleCodeChange = (event) => {
    setFormData({
      ...formData,
      code: event.target.value,
    });
  };

  const handleNameChange = (event) => {
    setFormData({
      ...formData,
      name: event.target.value,
    });
  };

  const handleNbDaysChange = (event) => {
    setFormData({
      ...formData,
      nb_days: Number(event.target.value),
    });
  };

  const handleActiveChange = (e) => {
    setFormData({
      ...formData,
      active: e.target.checked,
    });
  };

  const handleIsCreditCardChange = (e) => {
    setFormData({
      ...formData,
      is_credit_card: e.target.checked,
    });
  };
  const handleIsOnlinePaymentChange = (e) => {
    setFormData({
      ...formData,
      is_online_payment: e.target.checked,
    });
  };

  const getContent = () => {
    if (!type) return null;
    return (
      <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Left side - Form fields */}
          <Box sx={{ flex: 1 }}>
            <Grid container spacing={2}>
              <Grid item sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
                >
                  {t("code")} *
                </Typography>
                <RTLTextField
                  value={formData?.code || ""}
                  onChange={handleCodeChange}
                  required
                  placeholder=""
                  autoFocus
                />
              </Grid>
              <Grid item sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
                >
                  {t("name")} *
                </Typography>
                <RTLTextField
                  value={formData?.name || ""}
                  onChange={handleNameChange}
                  required
                  placeholder=""
                />
              </Grid>
              {type === "paymentTerm" && (
                <Grid item sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
                  >
                    {t("nbOfDays")} *
                  </Typography>
                  <RTLTextField
                    type="number"
                    value={formData?.nb_days || 0}
                    onChange={handleNbDaysChange}
                    required
                    placeholder=""
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
          
          {/* Right side - Checkboxes */}
          <Box sx={{ width: 200, display: 'flex', alignItems: 'flex-start', pt: 4.5, justifyContent: 'flex-end' }}>
            {type === "paymentTerm" && (
              <Checkbox 
                checked={formData?.active !== false}
                onChange={handleActiveChange}
                label={t("active")}
                isRTL={isRTL}
              />
            )}
            {type === "paymentMethod" && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Checkbox
                  checked={formData?.active !== false}
                  onChange={handleActiveChange}
                  label={t("active")}
                  isRTL={isRTL}
                />
                <Checkbox
                  checked={formData?.is_credit_card !== false}
                  onChange={handleIsCreditCardChange}
                  label={t("isCreditCard")}
                  isRTL={isRTL}
                />
                <Checkbox
                  checked={formData?.is_online_payment !== false}
                  onChange={handleIsOnlinePaymentChange}
                  label={t("isOnlinePayment")}
                  isRTL={isRTL}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  if (!type) return null;

  const getDrawerWidth = (type) => {
    if (type === "paymentTerm") return 500;
    if (type === "paymentMethod") return 550;
    return 500;
  };

  const getTitle = () => {
    if (isEdit) {
      return `${t("edit")} ${t(type === "paymentTerm" ? "paymentTerms" : "paymentMethods")}${originalName ? ` / ${originalName}` : ""}`;
    } else {
      return `${t("add")} ${t(type === "paymentTerm" ? "paymentTerms" : "paymentMethods")}`;
    }
  };

  // Backend logic for POST/PUT
  const handleSave = async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: t("noChangesDesc") || "Please modify at least one field before saving.",
        duration: 5000,
      });
      return;
    }
    try {
      let response;
      if (type === "paymentTerm") {
        if (isEdit) response = await editPaymentTerm(formData.id, { ...formData, nb_days: Number(formData.nb_days) || 0 });
        else response = await createPaymentTerm({ ...formData, nb_days: Number(formData.nb_days) || 0 });
      } else if (type === "paymentMethod") {
        if (isEdit) response = await editPaymentMethod(formData.id, {
          ...formData,
          active: !!formData.active,
          is_credit_card: !!formData.is_credit_card,
          is_online_payment: !!formData.is_online_payment,
        });
        else response = await createPaymentMethod({
          ...formData,
          active: !!formData.active,
          is_credit_card: !!formData.is_credit_card,
          is_online_payment: !!formData.is_online_payment,
        });
      }
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 5000,
        });
        if (onSave) onSave(response.data);
        if (onClose) onClose();
      } else {
        addToast({
          type: "error",
          title: tToast("error"),
          description: response?.message || tToast(isEdit ? "updateError" : "createError"),
          duration: 5000,
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: error.message || tToast(isEdit ? "updateError" : "createError"),
        duration: 5000,
      });
    }
  };

  // Save and New
  const handleSaveAndNew = async () => {
    try {
      let response;
      if (type === "paymentTerm") {
        response = await createPaymentTerm({ ...formData, nb_days: Number(formData.nb_days) || 0 });
      } else if (type === "paymentMethod") {
        response = await createPaymentMethod({
          ...formData,
          active: !!formData.active,
          is_credit_card: !!formData.is_credit_card,
          is_online_payment: !!formData.is_online_payment,
        });
      }
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast("createSuccess"),
        });
        if (onSaveAndNew) onSaveAndNew(response.data);
        setFormData({ code: "", name: "", nb_days: 0, active: false, is_credit_card: false, is_online_payment: false });
      } else {
        addToast({
          type: "error",
          title: tToast("error"),
          description: response?.message || tToast("createError"),
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: error.message || tToast("createError"),
      });
    }
  };

  // Save and Close
  const handleSaveAndClose = async () => {
    try {
      let response;
      if (type === "paymentTerm") {
        response = await createPaymentTerm({ ...formData, nb_days: Number(formData.nb_days) || 0 });
      } else if (type === "paymentMethod") {
        response = await createPaymentMethod({
          ...formData,
          active: !!formData.active,
          is_credit_card: !!formData.is_credit_card,
          is_online_payment: !!formData.is_online_payment,
        });
      }
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast("createSuccess"),
        });
        if (onSaveAndClose) onSaveAndClose(response.data);
        if (onClose) onClose();
      } else {
        addToast({
          type: "error",
          title: tToast("error"),
          description: response?.message || tToast("createError"),
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: error.message || tToast("createError"),
      });
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
    />
  );
};

export default PaymentDrawer; 
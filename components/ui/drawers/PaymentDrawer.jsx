import React, { useState, useEffect } from "react";
import { Grid, Typography, Checkbox, FormControlLabel, Box } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
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
  const [formData, setFormData] = useState({ code: "", name: "", nb_days: 0, active: false, is_credit_card: false, is_online_payment: false });

  useEffect(() => {
    if (isOpen && isEdit && initialData) {
      setOriginalName(initialData?.code || "");
      setOriginalData(JSON.parse(JSON.stringify(initialData)));
      setFormData({ ...initialData });
    }
    // Reset local state when opening for new entry
    if (isOpen && !isEdit) {
      setFormData({ code: "", name: "", nb_days: 0, active: false, is_credit_card: false, is_online_payment: false });
      setOriginalName("");
      setOriginalData({});
    }
  }, [isOpen, isEdit, initialData]);

  function isDataChanged() {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
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

  const handleActiveChange = (event) => {
    setFormData({
      ...formData,
      active: !!event.target.checked,
    });
  };

  const handleIsCreditCardChange = (event) => {
    setFormData({
      ...formData,
      is_credit_card: !!event.target.checked,
    });
  };
  const handleIsOnlinePaymentChange = (event) => {
    setFormData({
      ...formData,
      is_online_payment: !!event.target.checked,
    });
  };

  const getContent = () => {
    if (!type) return null;
    return (
      <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
            />
          </Grid>
          <Grid item xs={12}>
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
            <Grid container item xs={12} spacing={2} alignItems="center">
              <Grid item xs={6}>
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
              <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formData?.active}
                      onChange={handleActiveChange}
                      color="primary"
                    />
                  }
                  label={t("active")}
                  labelPlacement={isRTL ? "start" : "end"}
                  sx={{ justifyContent: isRTL ? "flex-end" : "flex-start", m: 0 }}
                />
              </Grid>
            </Grid>
          )}
          {type === "paymentMethod" && (
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 3, gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!formData?.is_credit_card}
                    onChange={handleIsCreditCardChange}
                    color="primary"
                  />
                }
                label={t("isCreditCard")}
                labelPlacement={isRTL ? "start" : "end"}
                sx={{ justifyContent: isRTL ? "flex-end" : "flex-start", m: 0 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!formData?.is_online_payment}
                    onChange={handleIsOnlinePaymentChange}
                    color="primary"
                  />
                }
                label={t("isOnlinePayment")}
                labelPlacement={isRTL ? "start" : "end"}
                sx={{ justifyContent: isRTL ? "flex-end" : "flex-start", m: 0 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!formData?.active}
                    onChange={handleActiveChange}
                    color="primary"
                  />
                }
                label={t("active")}
                labelPlacement={isRTL ? "start" : "end"}
                sx={{ justifyContent: isRTL ? "flex-end" : "flex-start", m: 0 }}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  if (!type) return null;

  const getDrawerWidth = () => 450;

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

  // Check if form has data
  const hasFormData = (formData?.code && formData.code.trim() !== "") || (formData?.name && formData.name.trim() !== "") || (formData?.nb_days !== undefined && formData?.nb_days !== null && formData.nb_days !== 0);

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
      width={getDrawerWidth()}
      hasFormData={hasFormData}
    />
  );
};

export default PaymentDrawer; 
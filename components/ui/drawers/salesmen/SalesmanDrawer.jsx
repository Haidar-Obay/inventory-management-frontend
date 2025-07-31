import React, { useState, useEffect } from "react";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import { Grid, Typography, Box } from "@mui/material";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { createSalesman, editSalesman } from "@/API/Customers";

const SalesmanDrawer = ({
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
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
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
        <Grid xs={12} md={6}>
          <Checkbox
            checked={formData?.active !== false}
            onChange={e => setFormData({ ...formData, active: e.target.checked })}
            label={t("management.active")}
            isRTL={isRTL}
          />
        </Grid>
        <Grid xs={12} md={6} sx={{ width: "100%" }}>
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
        <Grid xs={12} md={6} sx={{ width: "100%" }}>
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
        <Grid xs={12} sx={{ width: "100%" }}>
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
        <Grid xs={12} md={6}>
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
        <Grid xs={12} md={6}>
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
        <Grid xs={12} md={4} sx={{ width: "50%" }}>
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
        <Grid xs={12} md={4} sx={{ width: "50%" }}>
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
        <Grid xs={12} md={4} sx={{ width: "50%" }}>
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
        <Grid xs={12} md={6}>
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
        <Grid xs={12} md={6}>
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
  );

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t("management.editSalesman") : t("management.addSalesman")}
      content={content}
      onSave={handleSave}
      anchor={isRTL ? "left" : "right"}
      width={800}
      hasFormData={hasFormData}
    />
  );
};

export default SalesmanDrawer; 
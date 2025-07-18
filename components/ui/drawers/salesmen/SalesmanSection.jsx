import React from "react";
import { Grid, Typography } from "@mui/material";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";

const SalesmanSection = React.memo(function SalesmanSection({ formData, onFormDataChange, isRTL, t, handleFieldChange }) {
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
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
          onChange={e => onFormDataChange({ ...formData, active: e.target.checked })}
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
      <Grid xs={12}>
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
          onChange={e => onFormDataChange({ ...formData, is_manager: e.target.value === "true" })}
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
          onChange={e => onFormDataChange({ ...formData, is_supervisor: e.target.value === "true" })}
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
          onChange={e => onFormDataChange({ ...formData, is_collector: e.target.value === "true" })}
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
  );
});

export default SalesmanSection; 
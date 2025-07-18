import React from "react";
import { Grid, Typography } from "@mui/material";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";

const CustomerGroupSection = React.memo(function CustomerGroupSection({ formData, onFormDataChange, isRTL, t, handleFieldChange }) {
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
      <Grid xs={12} md={6}>
        <Checkbox
          checked={formData?.active !== false}
          onChange={e => onFormDataChange({ ...formData, active: e.target.checked })}
          label={t("management.active")}
          isRTL={isRTL}
        />
      </Grid>
    </Grid>
  );
});

export default CustomerGroupSection; 
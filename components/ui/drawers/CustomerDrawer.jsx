"use client";

import React, { useState, useEffect } from "react";
import { Grid, Autocomplete, Typography } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";
import { getCustomerGroupNames, getSalesmanNames } from "@/API/Customers";

const CustomerDrawer = ({
  isOpen,
  onClose,
  type,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  formData,
  onFormDataChange,
  isEdit = false,
}) => {
  const [customerGroups, setCustomerGroups] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("customers");
  const locale = useLocale();
  const isRTL = locale === "ar";

  useEffect(() => {
    if (isOpen) {
      if (type === "customer") {
        fetchDropdownData();
      }
    }
  }, [type, isOpen]);

  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      const [customerGroupsRes, salesmenRes] = await Promise.all([
        getCustomerGroupNames(),
        getSalesmanNames(),
      ]);
      setCustomerGroups(customerGroupsRes.data || []);
      setSalesmen(salesmenRes.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field) => (event) => {
    onFormDataChange({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleCustomerGroupChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      customer_group_id: newValue?.id || "",
    });
  };

  const handleSalesmanChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      salesman_id: newValue?.id || "",
    });
  };

  const getContent = () => {
    if (!type) return null;

    if (type === "customerGroup") {
      return (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.active")}
            </Typography>
            <RTLTextField
              select
              value={formData?.active === false ? "false" : "true"}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  active: e.target.value === "true",
                })
              }
              SelectProps={{
                native: true,
              }}
              placeholder=""
            >
              <option value="true">{t("management.yes")}</option>
              <option value="false">{t("management.no")}</option>
            </RTLTextField>
          </Grid>
        </Grid>
      );
    }

    if (type === "salesman") {
      return (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.active")}
            </Typography>
            <RTLTextField
              select
              value={formData?.active === false ? "false" : "true"}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  active: e.target.value === "true",
                })
              }
              SelectProps={{
                native: true,
              }}
              placeholder=""
            >
              <option value="true">{t("management.yes")}</option>
              <option value="false">{t("management.no")}</option>
            </RTLTextField>
          </Grid>
          <Grid item xs={12} md={6} sx={{ width: "100%" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.phone1")}
            </Typography>
            <RTLTextField
              value={formData?.phone1 || ""}
              onChange={handleFieldChange("phone1")}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.phone2")}
            </Typography>
            <RTLTextField
              value={formData?.phone2 || ""}
              onChange={handleFieldChange("phone2")}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12} md={4} sx={{ width: "50%" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.isManager")}
            </Typography>
            <RTLTextField
              select
              value={formData?.is_manager === true ? "true" : "false"}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  is_manager: e.target.value === "true",
                })
              }
              SelectProps={{
                native: true,
              }}
              placeholder=""
            >
              <option value="false">{t("management.no")}</option>
              <option value="true">{t("management.yes")}</option>
            </RTLTextField>
          </Grid>
          <Grid item xs={12} md={4} sx={{ width: "50%" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.isSupervisor")}
            </Typography>
            <RTLTextField
              select
              value={formData?.is_supervisor === true ? "true" : "false"}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  is_supervisor: e.target.value === "true",
                })
              }
              SelectProps={{
                native: true,
              }}
              placeholder=""
            >
              <option value="false">{t("management.no")}</option>
              <option value="true">{t("management.yes")}</option>
            </RTLTextField>
          </Grid>
          <Grid item xs={12} md={4} sx={{ width: "50%" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.isCollector")}
            </Typography>
            <RTLTextField
              select
              value={formData?.is_collector === true ? "true" : "false"}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  is_collector: e.target.value === "true",
                })
              }
              SelectProps={{
                native: true,
              }}
              placeholder=""
            >
              <option value="false">{t("management.no")}</option>
              <option value="true">{t("management.yes")}</option>
            </RTLTextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.commissionPercent")}
            </Typography>
            <RTLTextField
              value={formData?.commission_percent || ""}
              onChange={handleFieldChange("commission_percent")}
              type="number"
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.commissionByTurnover")}
            </Typography>
            <RTLTextField
              value={formData?.commission_by_turnover || ""}
              onChange={handleFieldChange("commission_by_turnover")}
              type="number"
              placeholder=""
            />
          </Grid>
        </Grid>
      );
    }

    if (type === "customer") {
      return (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.phone1")}
            </Typography>
            <RTLTextField
              value={formData?.phone1 || ""}
              onChange={handleFieldChange("phone1")}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.phone2")}
            </Typography>
            <RTLTextField
              value={formData?.phone2 || ""}
              onChange={handleFieldChange("phone2")}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.fax")}
            </Typography>
            <RTLTextField
              value={formData?.fax || ""}
              onChange={handleFieldChange("fax")}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
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
          <Grid item xs={12}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.website")}
            </Typography>
            <RTLTextField
              value={formData?.website || ""}
              onChange={handleFieldChange("website")}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.taxNumber")}
            </Typography>
            <RTLTextField
              value={formData?.tax_number || ""}
              onChange={handleFieldChange("tax_number")}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.taxOffice")}
            </Typography>
            <RTLTextField
              value={formData?.tax_office || ""}
              onChange={handleFieldChange("tax_office")}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.customerGroup")}
            </Typography>
            <Autocomplete
              fullWidth
              options={customerGroups}
              getOptionLabel={(option) => option.name || ""}
              value={
                customerGroups.find(
                  (group) => group.id === formData?.customer_group_id
                ) || null
              }
              onChange={handleCustomerGroupChange}
              loading={loading}
              renderInput={(params) => (
                <RTLTextField {...params} placeholder="" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.salesman")}
            </Typography>
            <Autocomplete
              fullWidth
              options={salesmen}
              getOptionLabel={(option) => option.name || ""}
              value={
                salesmen.find(
                  (salesman) => salesman.id === formData?.salesman_id
                ) || null
              }
              onChange={handleSalesmanChange}
              loading={loading}
              renderInput={(params) => (
                <RTLTextField {...params} placeholder="" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.active")}
            </Typography>
            <RTLTextField
              select
              value={formData?.active === false ? "false" : "true"}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  active: e.target.value === "true",
                })
              }
              SelectProps={{
                native: true,
              }}
              placeholder=""
            >
              <option value="true">{t("management.yes")}</option>
              <option value="false">{t("management.no")}</option>
            </RTLTextField>
          </Grid>
        </Grid>
      );
    }

    // Default fields for other types
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("management." + type + "Name")} *
          </Typography>
          <RTLTextField
            fullWidth
            value={formData?.name || ""}
            onChange={handleFieldChange("name")}
            required
            placeholder=""
          />
        </Grid>
      </Grid>
    );
  };

  if (!type) return null;

  const getTitle = () => {
    if (isEdit) {
      const itemName = formData?.name || "";
      return `${t("management.edit")} ${t(`management.${type}`)}${itemName ? ` / ${itemName}` : ""}`;
    } else {
      return t(`management.add${type.charAt(0).toUpperCase() + type.slice(1)}`);
    }
  };

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      content={getContent()}
      onSave={onSave}
      onSaveAndNew={onSaveAndNew}
      onSaveAndClose={onSaveAndClose}
      anchor={isRTL ? "left" : "right"}
    />
  );
};

export default CustomerDrawer;

"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Autocomplete,
} from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";
import {
  getCustomerGroupNames,
  getSalesmanNames,
} from "@/API/Customers";

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
  const [expandedAccordion, setExpandedAccordion] = useState("panel1");
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

  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpandedAccordion(newExpanded ? panel : false);
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

  const getPluralType = (type) => {
    if (!type) return "";

    switch (type) {
      case "customerGroup":
        return "customerGroups";
      case "salesman":
        return "salesmen";
      case "customer":
        return "customers";
      default:
        return type + "s";
    }
  };

  const getAccordionContent = () => {
    if (!type) return [];

    if (type === "customerGroup") {
      return [
        {
          title: isEdit
            ? t("management.editCustomerGroup")
            : t("management.addCustomerGroup"),
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.code")}
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.name")}
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  select
                  label={t("management.active")}
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
                >
                  <option value="true">{t("management.yes")}</option>
                  <option value="false">{t("management.no")}</option>
                </RTLTextField>
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    if (type === "salesman") {
      return [
        {
          title: isEdit
            ? t("management.editSalesman")
            : t("management.addSalesman"),
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.code")}
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  select
                  label={t("management.active")}
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
                >
                  <option value="true">{t("management.yes")}</option>
                  <option value="false">{t("management.no")}</option>
                </RTLTextField>
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "100%" }}>
                <RTLTextField
                  label={t("management.name")}
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
              <Grid item xs={12} sx={{ width: "100%" }}>
                <RTLTextField
                  label={t("management.address")}
                  value={formData?.address || ""}
                  onChange={handleFieldChange("address")}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.phone1")}
                  value={formData?.phone1 || ""}
                  onChange={handleFieldChange("phone1")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.phone2")}
                  value={formData?.phone2 || ""}
                  onChange={handleFieldChange("phone2")}
                />
              </Grid>
              <Grid item xs={12}>
                <RTLTextField
                  label={t("management.email")}
                  value={formData?.email || ""}
                  onChange={handleFieldChange("email")}
                  type="email"
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ width: "50%" }}>
                <RTLTextField
                  select
                  label={t("management.isManager")}
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
                >
                  <option value="false">{t("management.no")}</option>
                  <option value="true">{t("management.yes")}</option>
                </RTLTextField>
              </Grid>
              <Grid item xs={12} md={4} sx={{ width: "50%" }}>
                <RTLTextField
                  select
                  label={t("management.isSupervisor")}
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
                >
                  <option value="false">{t("management.no")}</option>
                  <option value="true">{t("management.yes")}</option>
                </RTLTextField>
              </Grid>
              <Grid item xs={12} md={4} sx={{ width: "50%" }}>
                <RTLTextField
                  select
                  label={t("management.isCollector")}
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
                >
                  <option value="false">{t("management.no")}</option>
                  <option value="true">{t("management.yes")}</option>
                </RTLTextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.fixCommission")}
                  value={formData?.fix_commission || ""}
                  onChange={handleFieldChange("fix_commission")}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.commissionPercent")}
                  value={formData?.commission_percent || ""}
                  onChange={handleFieldChange("commission_percent")}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.commissionByItem")}
                  value={formData?.commission_by_item || ""}
                  onChange={handleFieldChange("commission_by_item")}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.commissionByTurnover")}
                  value={formData?.commission_by_turnover || ""}
                  onChange={handleFieldChange("commission_by_turnover")}
                  type="number"
                />
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    if (type === "customer") {
      return [
        {
          title: isEdit
            ? t("management.editCustomer")
            : t("management.addCustomer"),
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.code")}
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.name")}
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <RTLTextField
                  label={t("management.address")}
                  value={formData?.address || ""}
                  onChange={handleFieldChange("address")}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.phone1")}
                  value={formData?.phone1 || ""}
                  onChange={handleFieldChange("phone1")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.phone2")}
                  value={formData?.phone2 || ""}
                  onChange={handleFieldChange("phone2")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.fax")}
                  value={formData?.fax || ""}
                  onChange={handleFieldChange("fax")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.email")}
                  value={formData?.email || ""}
                  onChange={handleFieldChange("email")}
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <RTLTextField
                  label={t("management.website")}
                  value={formData?.website || ""}
                  onChange={handleFieldChange("website")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.taxNumber")}
                  value={formData?.tax_number || ""}
                  onChange={handleFieldChange("tax_number")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.taxOffice")}
                  value={formData?.tax_office || ""}
                  onChange={handleFieldChange("tax_office")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                    <RTLTextField
                      {...params}
                      label={t("management.customerGroup")}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                    <RTLTextField
                      {...params}
                      label={t("management.salesman")}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  select
                  label={t("management.active")}
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
                >
                  <option value="true">{t("management.yes")}</option>
                  <option value="false">{t("management.no")}</option>
                </RTLTextField>
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    // Default fields for other types
    return [
      {
        title: isEdit
          ? t("management.edit" + type.charAt(0).toUpperCase() + type.slice(1))
          : t("management.add" + type.charAt(0).toUpperCase() + type.slice(1)),
        expanded: expandedAccordion === "panel1",
        onChange: handleAccordionChange("panel1"),
        content: (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RTLTextField
                fullWidth
                label={t("management." + type + "Name")}
                value={formData?.name || ""}
                onChange={handleFieldChange("name")}
                required
              />
            </Grid>
          </Grid>
        ),
      },
    ];
  };

  const pluralType = getPluralType(type);
  const title = isEdit
    ? t(
        "management.edit" +
          pluralType.charAt(0).toUpperCase() +
          pluralType.slice(1)
      )
    : t(
        "management.add" +
          pluralType.charAt(0).toUpperCase() +
          pluralType.slice(1)
      );

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      accordions={getAccordionContent()}
      onSave={onSave}
      onSaveAndNew={onSaveAndNew}
      onSaveAndClose={onSaveAndClose}
      anchor={isRTL ? "left" : "right"}
    />
  );
};

export default CustomerDrawer; 
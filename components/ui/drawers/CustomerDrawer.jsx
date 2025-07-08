"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Autocomplete,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";
import { getCustomerGroupNames, getSalesmanNames } from "@/API/Customers";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [originalName, setOriginalName] = useState("");
  const [originalData, setOriginalData] = useState({});
  const { addToast } = useSimpleToast();

  useEffect(() => {
    if (isOpen) {
      if (type === "customer") {
        fetchDropdownData();
      }
    }
  }, [type, isOpen]);

  useEffect(() => {
    if (isOpen && isEdit) {
      setOriginalName(formData?.name || "");
      setOriginalData(JSON.parse(JSON.stringify(formData)));
    }
  }, [isOpen, isEdit]);

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

  function isDataChanged() {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }

  const handleSave = () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: t("noChangesTitle") || "No changes detected",
        description:
          t("noChangesDesc") ||
          "Please modify at least one field before saving.",
      });
      return;
    }
    onSave && onSave();
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
            <Checkbox
              checked={formData?.active !== false}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  active: e.target.checked,
                })
              }
              label={t("management.active")}
              isRTL={isRTL}
            />
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
            <Checkbox
              checked={formData?.active !== false}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  active: e.target.checked,
                })
              }
              label={t("management.active")}
              isRTL={isRTL}
            />
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
        <div>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="personal-info-content"
              id="personal-info-header"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {t("management.personalInformation") || "Personal Information"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.title") || "Title"}
                  </Typography>
                  <RTLTextField
                    select
                    value={formData?.title || ""}
                    onChange={handleFieldChange("title")}
                    placeholder=""
                  >
                    <option value="">
                      {t("management.selectTitle") || "Select Title"}
                    </option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
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
                    {t("management.firstName") || "First Name"} *
                  </Typography>
                  <RTLTextField
                    value={formData?.first_name || ""}
                    onChange={handleFieldChange("first_name")}
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
                    {t("management.lastName") || "Last Name"} *
                  </Typography>
                  <RTLTextField
                    value={formData?.last_name || ""}
                    onChange={handleFieldChange("last_name")}
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
                    {t("management.displayName") || "Display Name"}
                  </Typography>
                  <RTLTextField
                    value={formData?.display_name || ""}
                    onChange={handleFieldChange("display_name")}
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
                    {t("management.companyName") || "Company Name"}
                  </Typography>
                  <RTLTextField
                    value={formData?.company_name || ""}
                    onChange={handleFieldChange("company_name")}
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.phone1") || "Phone 1"} *
                  </Typography>
                  <RTLTextField
                    value={formData?.phone1 || ""}
                    onChange={handleFieldChange("phone1")}
                    required
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.phone2") || "Phone 2"}
                  </Typography>
                  <RTLTextField
                    value={formData?.phone2 || ""}
                    onChange={handleFieldChange("phone2")}
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("management.phone3") || "Phone 3"}
                  </Typography>
                  <RTLTextField
                    value={formData?.phone3 || ""}
                    onChange={handleFieldChange("phone3")}
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
                    {t("management.customerGroup") || "Customer Group"} *
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
              </Grid>
            </AccordionDetails>
          </Accordion>
        </div>
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
      return `${t("management.edit")} ${t(`management.${type}`)}${originalName ? ` / ${originalName}` : ""}`;
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
      onSave={handleSave}
      onSaveAndNew={onSaveAndNew}
      onSaveAndClose={onSaveAndClose}
      anchor={isRTL ? "left" : "right"}
    />
  );
};

export default CustomerDrawer;

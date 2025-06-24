"use client";

import React, { useState, useEffect } from "react";
import { Grid, TextField, Autocomplete, Typography } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { getProductLineNames } from "@/API/Items";
import { getCategoryNames } from "@/API/Items";
import { getBrandNames } from "@/API/Items";
import { useTranslations, useLocale } from "next-intl";

const ItemDrawer = ({
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
  const [productLineOptions, setProductLineOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("items");
  const locale = useLocale();
  const isRTL = locale === "ar";

  useEffect(() => {
    if (isOpen) {
      if (type === "productLine") {
        fetchProductLineNames();
      } else if (type === "category") {
        fetchCategoryNames();
      } else if (type === "brand") {
        fetchBrandNames();
      } else if (type === "item") {
        fetchAllOptions();
      }
    }
  }, [type, isOpen]);

  const fetchProductLineNames = async () => {
    try {
      setLoading(true);
      const response = await getProductLineNames();
      setProductLineOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching product line names:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryNames = async () => {
    try {
      setLoading(true);
      const response = await getCategoryNames();
      setCategoryOptions(response.data || []);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching category names:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandNames = async () => {
    try {
      setLoading(true);
      const response = await getBrandNames();
      setBrandOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching brand names:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOptions = async () => {
    await Promise.all([
      fetchProductLineNames(),
      fetchCategoryNames(),
      fetchBrandNames(),
    ]);
  };

  const handleFieldChange = (field) => (event) => {
    onFormDataChange({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleProductLineChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      product_line_id: newValue?.id || "",
      product_line_name: newValue?.name || "",
    });
  };

  const handleCategoryChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      category_id: newValue?.id || "",
      category_name: newValue?.name || "",
    });
  };

  const handleBrandChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      brand_id: newValue?.id || "",
      brand_name: newValue?.name || "",
    });
  };

  const getContent = () => {
    if (type === "productLine") {
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

    if (type === "category") {
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
          <Grid item xs={12} sx={{ width: "53%" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.subCategoryOf")}
            </Typography>
            <Autocomplete
              fullWidth
              options={categoryOptions}
              getOptionLabel={(option) => option.name || ""}
              value={
                categoryOptions.find(
                  (c) => c.id === formData?.sub_category_of
                ) || null
              }
              onChange={(e, newValue) =>
                onFormDataChange({
                  ...formData,
                  sub_category_of: newValue?.id || "",
                })
              }
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

    if (type === "brand") {
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
          <Grid item xs={12} sx={{ width: "53%" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.subBrandOf")}
            </Typography>
            <Autocomplete
              fullWidth
              options={brandOptions}
              getOptionLabel={(option) => option.name || ""}
              value={
                brandOptions.find((b) => b.id === formData?.sub_brand_of) ||
                null
              }
              onChange={(e, newValue) =>
                onFormDataChange({
                  ...formData,
                  sub_brand_of: newValue?.id || "",
                })
              }
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

    if (type === "item") {
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
              {t("management.productLine")} *
            </Typography>
            <Autocomplete
              fullWidth
              options={productLineOptions}
              getOptionLabel={(option) => option.name || ""}
              value={
                productLineOptions.find(
                  (p) => p.id === formData?.product_line_id
                ) || null
              }
              onChange={handleProductLineChange}
              loading={loading}
              renderInput={(params) => (
                <RTLTextField {...params} placeholder="" required />
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
              {t("management.category")} *
            </Typography>
            <Autocomplete
              fullWidth
              options={categoryOptions}
              getOptionLabel={(option) => option.name || ""}
              value={
                categoryOptions.find((c) => c.id === formData?.category_id) ||
                null
              }
              onChange={handleCategoryChange}
              loading={loading}
              renderInput={(params) => (
                <RTLTextField {...params} placeholder="" required />
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
              {t("management.brand")} *
            </Typography>
            <Autocomplete
              fullWidth
              options={brandOptions}
              getOptionLabel={(option) => option.name || ""}
              value={
                brandOptions.find((b) => b.id === formData?.brand_id) || null
              }
              onChange={handleBrandChange}
              loading={loading}
              renderInput={(params) => (
                <RTLTextField {...params} placeholder="" required />
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

    return null;
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

export default ItemDrawer;

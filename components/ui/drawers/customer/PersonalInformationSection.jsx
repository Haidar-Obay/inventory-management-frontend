"use client"

import React from "react"
import { Grid, Typography, Autocomplete, Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import RTLTextField from "@/components/ui/RTLTextField"

const PersonalInformationSection = React.memo(
  ({
    formData,
    onFormDataChange,
    isRTL,
    t,
    generateDisplayNameSuggestions,
    handleDisplayNameChange,
    handleFieldChange,
    expanded,
    onAccordionChange,
    allCollapsed,
    setAllCollapsed,
  }) => {
    React.useEffect(() => {
      if (allCollapsed && expanded) {
        onAccordionChange(null, false)
        setAllCollapsed(false)
      }
    }, [allCollapsed])

    const displayNameSuggestions = generateDisplayNameSuggestions ? generateDisplayNameSuggestions() : []

    return (
      <Accordion expanded={true}>
        <AccordionSummary
          // Remove expandIcon to prevent toggling
          aria-controls="personal-info-content"
          id="personal-info-header"
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t("management.personalInformation") || "Personal Information"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
  {/* Row 1: Title / First Name / Middle Name / Last Name */}
  <Grid container spacing={1.5}>
    <Grid item xs={12} sm={6} md={3} sx={{ maxWidth: 100 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
        {t("management.title") || "Title"}
      </Typography>
      <RTLTextField
        select
        fullWidth
        value={formData?.title || ""}
        onChange={handleFieldChange("title")}
        SelectProps={{ native: true }}
      >
        <option value="">{t("management.selectTitle") || "Title"}</option>
        <option value="Mr.">Mr.</option>
        <option value="Mrs.">Mrs.</option>
        <option value="Ms.">Ms.</option>
        <option value="Dr.">Dr.</option>
        <option value="Prof.">Prof.</option>
      </RTLTextField>
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
        {t("management.firstName") || "First Name"} *
      </Typography>
      <RTLTextField
        fullWidth
        value={formData?.first_name || ""}
        onChange={handleFieldChange("first_name")}
        required
      />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
        {t("management.middleName") || "Middle Name"}
      </Typography>
      <RTLTextField
        fullWidth
        value={formData?.middle_name || ""}
        onChange={handleFieldChange("middle_name")}
      />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
        {t("management.lastName") || "Last Name"} *
      </Typography>
      <RTLTextField
        fullWidth
        value={formData?.last_name || ""}
        onChange={handleFieldChange("last_name")}
        required
      />
    </Grid>
  </Grid>

  {/* Row 2: Display Name / Company Name */}
  <Grid container spacing={2} sx={{ mt: 2 }}>
    <Grid item xs={12} md={8} sx={{ minWidth: 350 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
        {t("management.displayName") || "Display Name"}
      </Typography>
      <Autocomplete
        fullWidth
        freeSolo
        options={displayNameSuggestions}
        value={formData?.display_name || ""}
        onChange={handleDisplayNameChange}
        renderInput={(params) => <RTLTextField {...params} />}
      />
    </Grid>

    <Grid item xs={12} md={6}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
        {t("management.companyName") || "Company Name"}
      </Typography>
      <RTLTextField
        fullWidth
        value={formData?.company_name || ""}
        onChange={handleFieldChange("company_name")}
      />
    </Grid>
  </Grid>

  {/* Row 3: Phone 1 / Phone 2 / Phone 3 */}
  <Grid container spacing={2} sx={{ mt: 2 }}>
    <Grid item xs={12} sm={4}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
        {t("management.phone1") || "Phone 1"} *
      </Typography>
      <RTLTextField
        fullWidth
        value={formData?.phone1 || ""}
        onChange={handleFieldChange("phone1")}
        required
      />
    </Grid>

    <Grid item xs={12} sm={4}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
        {t("management.phone2") || "Phone 2"}
      </Typography>
      <RTLTextField
        fullWidth
        value={formData?.phone2 || ""}
        onChange={handleFieldChange("phone2")}
      />
    </Grid>

    <Grid item xs={12} sm={4}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
        {t("management.phone3") || "Phone 3"}
      </Typography>
      <RTLTextField
        fullWidth
        value={formData?.phone3 || ""}
        onChange={handleFieldChange("phone3")}
      />
    </Grid>
  </Grid>
</AccordionDetails>

      </Accordion>
    )
  },
)

export default PersonalInformationSection

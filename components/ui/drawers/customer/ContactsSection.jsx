import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";

const ContactsSection = React.memo(({ formData, onFormDataChange, isRTL, t, handleFieldChange, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed]);
  return (
    <Accordion expanded={expanded} onChange={onAccordionChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="contacts-content"
        id="contacts-header"
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {t('management.contactsAccordion') || 'Contacts'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.contactTitle') || 'Title'}
            </Typography>
            <RTLTextField
              value={formData?.title || ''}
              InputProps={{ readOnly: true }}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.contactName') || 'Name'}
            </Typography>
            <RTLTextField
              value={[
                formData?.first_name,
                formData?.middle_name,
                formData?.last_name
              ].filter(Boolean).join(' ')}
              InputProps={{ readOnly: true }}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.workPhone') || 'Work Phone'}
            </Typography>
            <RTLTextField
              value={formData?.work_phone || ''}
              onChange={handleFieldChange('work_phone')}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.mobile') || 'Mobile'}
            </Typography>
            <RTLTextField
              value={formData?.mobile || ''}
              onChange={handleFieldChange('mobile')}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.position') || 'Position/Role'}
            </Typography>
            <RTLTextField
              value={formData?.position || ''}
              onChange={handleFieldChange('position')}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.extension') || 'Extension'}
            </Typography>
            <RTLTextField
              value={formData?.extension || ''}
              onChange={handleFieldChange('extension')}
              placeholder=""
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default ContactsSection; 
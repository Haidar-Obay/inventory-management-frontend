import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Box, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";

const ContactsSection = React.memo(({ formData, onFormDataChange, isRTL, t, handleFieldChange, contacts, setContacts, handleAddContact, handleRemoveContact, handleContactChange, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
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
        {/* Primary Contact */}
        <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500, color: 'primary.main' }}>
            {t('management.primaryContact') || 'Primary Contact'}
          </Typography>
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
        </Box>

        {/* Additional Contacts */}
        {contacts.map((contact, index) => (
          <Box key={contact.id} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                {t('management.additionalContact') || 'Additional Contact'} {index + 1}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleRemoveContact(index)}
                sx={{ color: 'error.main', '&:hover': { backgroundColor: 'error.light', color: 'white' } }}
              >
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>×</Typography>
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.contactTitle') || 'Title'}
                </Typography>
                <RTLTextField
                  value={contact.title || ''}
                  onChange={e => handleContactChange(index, 'title', e.target.value)}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.contactName') || 'Name'}
                </Typography>
                <RTLTextField
                  value={contact.name || ''}
                  onChange={e => handleContactChange(index, 'name', e.target.value)}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.workPhone') || 'Work Phone'}
                </Typography>
                <RTLTextField
                  value={contact.work_phone || ''}
                  onChange={e => handleContactChange(index, 'work_phone', e.target.value)}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.mobile') || 'Mobile'}
                </Typography>
                <RTLTextField
                  value={contact.mobile || ''}
                  onChange={e => handleContactChange(index, 'mobile', e.target.value)}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.position') || 'Position/Role'}
                </Typography>
                <RTLTextField
                  value={contact.position || ''}
                  onChange={e => handleContactChange(index, 'position', e.target.value)}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.extension') || 'Extension'}
                </Typography>
                <RTLTextField
                  value={contact.extension || ''}
                  onChange={e => handleContactChange(index, 'extension', e.target.value)}
                  placeholder=""
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        {/* Add button at the end */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <IconButton
            size="small"
            onClick={handleAddContact}
            sx={{ color: 'primary.main', '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

export default ContactsSection; 
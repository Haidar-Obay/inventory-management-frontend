import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";

const MoreOptionsSection = React.memo(({ formData, onFormDataChange, isRTL, t, active, setActive, blackListed, setBlackListed, oneTimeAccount, setOneTimeAccount, specialAccount, setSpecialAccount, posCustomer, setPosCustomer, freeDeliveryCharge, setFreeDeliveryCharge, printInvoiceLanguage, setPrintInvoiceLanguage, sendInvoice, setSendInvoice, notes, setNotes, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
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
        aria-controls="more-options-content"
        id="more-options-header"
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {t('management.moreOptionsAccordion') || 'More Options'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sx={{ minWidth: 250 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.printInvoiceLanguage') || 'Print Invoice Language'}
            </Typography>
            <RTLTextField
              select
              value={printInvoiceLanguage}
              onChange={e => setPrintInvoiceLanguage(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="ar">{t('management.arabic') || 'Arabic'}</option>
              <option value="en">{t('management.english') || 'English'}</option>
            </RTLTextField>
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 250 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.sendInvoice') || 'Send Invoice'}
            </Typography>
            <RTLTextField
              select
              value={sendInvoice}
              onChange={e => setSendInvoice(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="email">{t('management.email') || 'Email'}</option>
              <option value="sms">{t('management.sms') || 'SMS'}</option>
              <option value="whatsapp">{t('management.whatsapp') || 'WhatsApp'}</option>
              <option value="all">{t('management.all') || 'All'}</option>
            </RTLTextField>
          </Grid>
          <Grid item xs={12} sx={{ minWidth: 550 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.notes') || 'Notes'}
            </Typography>
            <RTLTextField
              value={notes}
              onChange={e => setNotes(e.target.value)}
              multiline
              rows={3}
              placeholder=""
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default MoreOptionsSection; 
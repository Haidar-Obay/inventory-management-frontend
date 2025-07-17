import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";

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
          <Grid item xs={12} md={6}>
            <Checkbox
              checked={active}
              onChange={e => setActive(e.target.checked)}
              label={t('management.active') || 'Active'}
              isRTL={isRTL}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Checkbox
              checked={blackListed}
              onChange={e => setBlackListed(e.target.checked)}
              label={t('management.blackListed') || 'Black Listed'}
              isRTL={isRTL}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Checkbox
              checked={oneTimeAccount}
              onChange={e => setOneTimeAccount(e.target.checked)}
              label={t('management.oneTimeAccount') || 'One Time Account'}
              isRTL={isRTL}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Checkbox
              checked={specialAccount}
              onChange={e => setSpecialAccount(e.target.checked)}
              label={t('management.specialAccount') || 'Special Account'}
              isRTL={isRTL}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Checkbox
              checked={posCustomer}
              onChange={e => setPosCustomer(e.target.checked)}
              label={t('management.posCustomer') || 'POS Customer'}
              isRTL={isRTL}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Checkbox
              checked={freeDeliveryCharge}
              onChange={e => setFreeDeliveryCharge(e.target.checked)}
              label={t('management.freeDeliveryCharge') || 'Free Delivery Charge'}
              isRTL={isRTL}
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12}>
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
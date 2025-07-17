import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";

const PricingSection = React.memo(({ formData, onFormDataChange, isRTL, t, priceChoice, setPriceChoice, priceList, setPriceList, globalDiscount, setGlobalDiscount, discountClass, setDiscountClass, markup, setMarkup, markdown, setMarkdown, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
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
        aria-controls="pricing-content"
        id="pricing-header"
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {t('management.pricingAccordion') || 'Pricing'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.priceChoice') || 'Price Choice'}
            </Typography>
            <RTLTextField
              select
              value={priceChoice}
              onChange={e => setPriceChoice(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">{t('management.selectPriceChoice') || 'Select'}</option>
              <option value="PRICE1">PRICE1</option>
              <option value="PRICE2">PRICE2</option>
              <option value="PRICE3">PRICE3</option>
              <option value="PRICE4">PRICE4</option>
              <option value="PRICE5">PRICE5</option>
              <option value="PRICE6">PRICE6</option>
              <option value="LAST_INVOICE_PRICE">{t('management.lastInvoicePrice') || 'Last Invoice Price'}</option>
            </RTLTextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.priceList') || 'Price List'}
            </Typography>
            <RTLTextField
              value={priceList}
              onChange={e => setPriceList(e.target.value)}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.globalDiscount') || 'Global Discount'}
            </Typography>
            <RTLTextField
              value={globalDiscount}
              onChange={e => setGlobalDiscount(e.target.value)}
              type="number"
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.discountClass') || 'Discount Class'}
            </Typography>
            <RTLTextField
              select
              value={discountClass}
              onChange={e => setDiscountClass(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">{t('management.selectDiscountClass') || 'Select'}</option>
              <option value="silver">{t('management.silver') || 'Silver'}</option>
              <option value="gold">{t('management.gold') || 'Gold'}</option>
              <option value="platinum">{t('management.platinum') || 'Platinum'}</option>
            </RTLTextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.markup') || 'Markup'}
            </Typography>
            <RTLTextField
              value={markup}
              onChange={e => setMarkup(e.target.value)}
              type="number"
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.markdown') || 'Markdown'}
            </Typography>
            <RTLTextField
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              type="number"
              placeholder=""
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default PricingSection; 
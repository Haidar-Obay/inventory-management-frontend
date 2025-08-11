import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Box, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";

const PricingSection = React.memo(({ formData, onFormDataChange, isRTL, t, priceChoice, setPriceChoice, priceList, setPriceList, globalDiscount, setGlobalDiscount, discountClass, setDiscountClass, markup, setMarkup, markdown, setMarkdown, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'var(--muted)' : 'rgb(249 250 251)';
  };

  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed]);
  return (
    <Accordion 
      expanded={expanded} 
      onChange={onAccordionChange}
      sx={{
        backgroundColor: getBackgroundColor(),
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        boxShadow: 'none'
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="pricing-content"
        id="pricing-header"
        sx={{
          backgroundColor: getBackgroundColor(),
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
        // tabIndex={-1}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t('management.pricingAccordion') || 'Pricing'}
          </Typography>
          {/* Show price choice under header only when collapsed */}
         
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: getBackgroundColor()
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sx={{ minWidth: 400 }}>
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
              <option value="PRICE1">price1</option>
              <option value="PRICE2">price2</option>
              <option value="PRICE3">price3</option>
              <option value="PRICE4">price4</option>
              <option value="PRICE5">price5</option>
              <option value="PRICE6">price6</option>
              <option value="LAST_INVOICE_PRICE">{t('management.lastInvoicePrice') || 'Last Invoice Price'}</option>
            </RTLTextField>
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 400 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.priceList') || 'Price List'}
            </Typography>
            <RTLTextField
              value={priceList}
              onChange={e => setPriceList(e.target.value)}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 400 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.discount') || 'Discount'}
            </Typography>
            <RTLTextField
              value={globalDiscount}
              onChange={e => setGlobalDiscount(e.target.value)}
              type="number"
              inputProps={{ step: '0.01' }}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 400 }}>
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
              <option value="Silver">{t('management.silver') || 'Silver'}</option>
              <option value="Gold">{t('management.gold') || 'Gold'}</option>
              <option value="Platinum">{t('management.platinum') || 'Platinum'}</option>
            </RTLTextField>
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 400 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.markup') || 'Markup'}
            </Typography>
            <RTLTextField
              value={markup}
              onChange={e => setMarkup(e.target.value)}
              type="number"
              inputProps={{ step: '0.01' }}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 400 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.markdown') || 'Markdown'}
            </Typography>
            <RTLTextField
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              type="number"
              inputProps={{ step: '0.01' }}
              placeholder=""
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default PricingSection; 
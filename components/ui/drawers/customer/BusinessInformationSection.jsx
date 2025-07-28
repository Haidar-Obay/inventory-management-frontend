import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Box, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";

const BusinessInformationSection = React.memo(({ formData, onFormDataChange, isRTL, t, searchTerms, newSearchTerm, setNewSearchTerm, handleAddSearchTerm, handleRemoveSearchTerm, handleSearchTermKeyPress, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed]);

  // Ref for the add search term input
  const addSearchTermInputRef = React.useRef(null);
  // Focus input when newSearchTerm is cleared (after add)
  React.useEffect(() => {
    if (newSearchTerm === "" && addSearchTermInputRef.current) {
      addSearchTermInputRef.current.focus();
    }
  }, [newSearchTerm]);

  return (
    <Accordion expanded={expanded} onChange={onAccordionChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="business-info-content"
        id="business-info-header"
        tabIndex={-1}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t("management.businessInformation") || "Business Information"}
          </Typography>
          {/* Show file number under header only when collapsed */}
          {!expanded && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: '80%' } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                  {t("management.fileNumber") || "File Number"}
                </Typography>
                <RTLTextField
                  value={formData?.file_number || ""}
                  onChange={e => onFormDataChange({ ...formData, file_number: e.target.value })}
                  placeholder=""
                  onClick={e => e.stopPropagation()}
                  onFocus={e => e.stopPropagation()}
                  onKeyDown={e => { if ((e.key === ' ' || e.key === 'Spacebar') && !expanded) { e.preventDefault(); e.stopPropagation(); } }}
                  sx={{ background: 'background.paper' }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sx={{ minWidth: 400  }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.fileNumber") || "File Number"}
            </Typography>
            <RTLTextField
              value={formData?.file_number || ""}
              onChange={e => onFormDataChange({ ...formData, file_number: e.target.value })}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 400 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.barcode") || "Barcode"}
            </Typography>
            <RTLTextField
              value={formData?.barcode || ""}
              onChange={e => onFormDataChange({ ...formData, barcode: e.target.value })}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} sx={{ minWidth: 400 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.searchTerms") || "Search Terms"}
            </Typography>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <RTLTextField
                  value={newSearchTerm}
                  onChange={e => setNewSearchTerm(e.target.value)}
                  onKeyPress={handleSearchTermKeyPress}
                  placeholder={t("management.addSearchTerm") || "Add search term..."}
                  sx={{ flexGrow: 1 }}
                  inputRef={addSearchTermInputRef}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleAddSearchTerm}
                  disabled={!newSearchTerm.trim()}
                  sx={{ fontSize: '0.75rem', textTransform: 'none', borderRadius: 1, height: '36px' }}
                >
                  {t("management.add") || "Add"}
                </Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {searchTerms && searchTerms.map((term, index) => (
                  <span key={index} style={{ border: '1px solid #1976d2', borderRadius: 16, padding: '2px 12px', color: '#1976d2', display: 'flex', alignItems: 'center', marginRight: 8 }}>
                    {term}
                    <button
                      type="button"
                      onClick={() => handleRemoveSearchTerm(term)}
                      style={{ marginLeft: 8, color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default BusinessInformationSection; 
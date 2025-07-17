import React from "react";
import { Typography, Button, Box } from "@mui/material";

const AttachmentsSection = React.memo(({ formData, onFormDataChange, t }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
        {t('management.attachmentsSection') || 'Attachments'}
      </Typography>
      <input
        type="file"
        multiple
        onChange={e => {
          const files = Array.from(e.target.files || []);
          onFormDataChange({
            ...formData,
            attachments: [...(formData.attachments || []), ...files],
          });
        }}
      />
      <Box sx={{ mt: 2 }}>
        {formData.attachments && formData.attachments.length > 0 ? (
          <ul>
            {formData.attachments.map((file, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{file.name || (typeof file === 'string' ? file : t('management.attachment'))}</span>
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    const updated = [...formData.attachments];
                    updated.splice(idx, 1);
                    onFormDataChange({ ...formData, attachments: updated });
                  }}
                >
                  {t('management.removeAttachment') || 'Remove'}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('management.noAttachments') || 'No attachments uploaded.'}
          </Typography>
        )}
      </Box>
    </Box>
  );
});

export default AttachmentsSection; 
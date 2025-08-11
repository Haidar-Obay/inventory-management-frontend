import React, { useState, useCallback, useMemo } from "react";
import { 
  Typography, 
  Button, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  useTheme
} from "@mui/material";
import RTLTextField from "@/components/ui/RTLTextField";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";

const AttachmentsSection = React.memo(({ formData, onFormDataChange, t }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'var(--muted)' : 'rgb(249 250 251)';
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Memoized file type detection
  const getFileIcon = useCallback((file) => {
    const type = file.type;
    if (type.startsWith('image/')) return <ImageIcon />;
    if (type === 'application/pdf') return <PictureAsPdfIcon />;
    if (type.startsWith('text/')) return <DescriptionIcon />;
    return <InsertDriveFileIcon />;
  }, []);

  const getFileTypeColor = useCallback((file) => {
    const type = file.type;
    if (type.startsWith('image/')) return 'success';
    if (type === 'application/pdf') return 'error';
    if (type.startsWith('text/')) return 'info';
    return 'default';
  }, []);

  // Memoized file size formatting
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Memoized attachments list
  const attachments = useMemo(() => formData.attachments || [], [formData.attachments]);

  const handleFileUpload = useCallback((files) => {
    const fileArray = Array.from(files);
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 50);

    const newAttachments = fileArray.map(file => ({
      file, // Keep the original file object for preview
      file_name: file.name, // File name
      file_path: '', // Will be set by backend after upload
      file_type: file.type, // MIME type
      file_size: file.size, // File size in bytes
      description: '', // User can add description
      is_public: true, // Default to public as requested
      id: Date.now() + Math.random(),
      uploadDate: new Date().toISOString()
    }));
    
    setTimeout(() => {
      onFormDataChange({
        ...formData,
        attachments: [...attachments, ...newAttachments],
      });
      setUploadProgress(0);
    }, 500);
  }, [formData, attachments, onFormDataChange]);

  const handleRemoveAttachment = useCallback((index) => {
    const updated = [...attachments];
    updated.splice(index, 1);
    onFormDataChange({ ...formData, attachments: updated });
  }, [attachments, formData, onFormDataChange]);

  const handleDescriptionChange = useCallback((index, description) => {
    const updated = [...attachments];
    updated[index] = { ...updated[index], description };
    onFormDataChange({ ...formData, attachments: updated });
  }, [attachments, formData, onFormDataChange]);

  const handlePreview = useCallback((attachment) => {
    setPreviewFile(attachment);
    setPreviewOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewOpen(false);
    setPreviewFile(null);
  }, []);

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const renderPreview = useCallback(() => {
    if (!previewFile) return null;

    const file = previewFile.file;
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    const isText = file.type.startsWith('text/');

    return (
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getFileIcon(file)}
            {file.name}
          </Typography>
          <Chip 
            label={formatFileSize(file.size)} 
            size="small" 
            color={getFileTypeColor(file)}
          />
        </Box>
        
        {isImage && (
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '400px', 
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          />
        )}
        {isPDF && (
          <iframe
            src={URL.createObjectURL(file)}
            width="100%"
            height="500px"
            title={file.name}
            style={{ border: 'none', borderRadius: '8px' }}
          />
        )}
        {isText && (
          <Paper sx={{ 
            maxHeight: '400px', 
            overflow: 'auto', 
            p: 2, 
            textAlign: 'left',
            bgcolor: 'background.paper'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {file.name}
            </pre>
          </Paper>
        )}
        {!isImage && !isPDF && !isText && (
          <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Preview not available for this file type
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              File: {file.name} ({file.type})
            </Typography>
          </Box>
        )}
      </Box>
    );
  }, [previewFile, getFileIcon, getFileTypeColor, formatFileSize]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
        {t('management.attachmentsSection') || 'Attachments'}
      </Typography>
      
      {/* File Upload Area */}
      <Box 
        sx={{ 
          mb: 3,
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          bgcolor: dragActive ? 'primary.light' : getBackgroundColor(),
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.light'
          }
        }}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Box sx={{ cursor: 'pointer' }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t('management.uploadAttachment') || 'Upload Attachment'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('management.dragDropFiles') || 'Drag and drop files here, or click to select'}
            </Typography>
          </Box>
        </label>
      </Box>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" sx={{ mt: 1 }}>
            {t('management.uploading') || 'Uploading...'} {uploadProgress}%
          </Typography>
        </Box>
      )}

      {/* Attachments List */}
      <Box sx={{ mt: 2 }}>
        {attachments.length > 0 ? (
          <Grid container spacing={2}>
            {attachments.map((attachment, idx) => (
              <Grid item xs={12} key={attachment.id || idx}>
                <Paper 
                  elevation={1}
                  sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      elevation: 3,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                      {getFileIcon(attachment.file)}
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': { color: 'primary.main' },
                            fontWeight: 500
                          }}
                          onClick={() => handlePreview(attachment)}
                        >
                          {attachment.file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(attachment.file.size)} • {attachment.file.type}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handlePreview(attachment)}
                        sx={{ color: 'primary.main' }}
                        title={t('management.preview') || 'Preview'}
                      >
                        <PreviewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveAttachment(idx)}
                        sx={{ color: 'error.main' }}
                        title={t('management.remove') || 'Remove'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('management.public') || 'Public'}
                    </Typography>
                    <Chip 
                      label={attachment.is_public ? t('management.yes') || 'Yes' : t('management.no') || 'No'} 
                      size="small" 
                      color={attachment.is_public ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </Box>
                  
                  <RTLTextField
                    fullWidth
                    size="small"
                    label={t('management.description') || 'Description'}
                    value={attachment.description || ''}
                    onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                    placeholder={t('management.enterDescription') || 'Enter description for this attachment...'}
                    multiline
                    rows={2}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <Typography variant="body2">
              {t('management.noAttachments') || 'No attachments uploaded.'}
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {t('management.previewAttachment') || 'Preview Attachment'}
          <IconButton onClick={handleClosePreview}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {renderPreview()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} variant="outlined">
            {t('management.close') || 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default AttachmentsSection; 
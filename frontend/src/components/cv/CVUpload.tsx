import React, { useState } from 'react';
import { 
  Paper, 
  Button, 
  Typography, 
  Container,
  LinearProgress 
} from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';

export const CVUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // سيتم إضافة منطق الرفع لاحقاً
      await new Promise(resolve => setTimeout(resolve, 2000)); // محاكاة الرفع
      console.log('تم رفع الملف:', file.name);
    } catch (error) {
      console.error('خطأ في رفع الملف:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h5" align="center" gutterBottom>
          رفع السيرة الذاتية
        </Typography>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <input
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="cv-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="cv-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<CloudUpload />}
            >
              اختر ملف
            </Button>
          </label>
          {file && (
            <Typography style={{ marginTop: '1rem' }}>
              تم اختيار: {file.name}
            </Typography>
          )}
          {uploading && <LinearProgress style={{ marginTop: '1rem' }} />}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{ marginTop: '1rem' }}
          >
            رفع السيرة الذاتية
          </Button>
        </div>
      </Paper>
    </Container>
  );
}; 
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Grid,
} from '@material-ui/core';
import { ExportService, ExportOptions } from '../../services/export.service';

interface Props {
  open: boolean;
  onClose: () => void;
  cvData: any;
}

export const ExportDialog: React.FC<Props> = ({ open, onClose, cvData }) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    template: 'modern',
    language: 'ar',
    includePhoto: true,
    encrypt: false,
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await ExportService.exportCV(cvData, options);
      onClose();
    } catch (error) {
      console.error('خطأ في التصدير:', error);
      // إظهار رسالة خطأ للمستخدم
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>تصدير السيرة الذاتية</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <InputLabel>تنسيق الملف</InputLabel>
              <RadioGroup
                value={options.format}
                onChange={(e) => setOptions({ ...options, format: e.target.value as any })}
              >
                <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
                <FormControlLabel value="docx" control={<Radio />} label="Word (DOCX)" />
                <FormControlLabel value="html" control={<Radio />} label="صفحة ويب (HTML)" />
                <FormControlLabel value="json" control={<Radio />} label="JSON" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>القالب</InputLabel>
              <Select
                value={options.template}
                onChange={(e) => setOptions({ ...options, template: e.target.value as string })}
              >
                <MenuItem value="modern">عصري</MenuItem>
                <MenuItem value="classic">كلاسيكي</MenuItem>
                <MenuItem value="professional">احترافي</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.includePhoto}
                  onChange={(e) => setOptions({ ...options, includePhoto: e.target.checked })}
                />
              }
              label="تضمين الصورة الشخصية"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.encrypt}
                  onChange={(e) => setOptions({ ...options, encrypt: e.target.checked })}
                />
              }
              label="تشفير الملف"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="default">
          إلغاء
        </Button>
        <Button
          onClick={handleExport}
          color="primary"
          variant="contained"
          disabled={isExporting}
        >
          {isExporting ? 'جاري التصدير...' : 'تصدير'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 
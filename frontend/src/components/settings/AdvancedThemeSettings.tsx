import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SketchPicker } from 'react-color';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
  },
  fontPreview: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

interface ThemeCustomization {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  borderRadius: number;
  spacing: number;
}

interface Props {
  customization: ThemeCustomization;
  onUpdate: (customization: ThemeCustomization) => void;
}

export const AdvancedThemeSettings: React.FC<Props> = ({
  customization,
  onUpdate,
}) => {
  const classes = useStyles();
  const [showColorPicker, setShowColorPicker] = React.useState<string | null>(null);

  const handleColorChange = (color: string, type: 'primaryColor' | 'secondaryColor') => {
    onUpdate({
      ...customization,
      [type]: color,
    });
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        تخصيص متقدم للمظهر
      </Typography>

      <div className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          الألوان الرئيسية
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>
              اللون الرئيسي
            </Typography>
            <Box
              className={classes.colorPreview}
              style={{ backgroundColor: customization.primaryColor }}
              onClick={() => setShowColorPicker('primary')}
            />
            {showColorPicker === 'primary' && (
              <Box mt={2}>
                <SketchPicker
                  color={customization.primaryColor}
                  onChange={(color) => handleColorChange(color.hex, 'primaryColor')}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>
              اللون الثانوي
            </Typography>
            <Box
              className={classes.colorPreview}
              style={{ backgroundColor: customization.secondaryColor }}
              onClick={() => setShowColorPicker('secondary')}
            />
            {showColorPicker === 'secondary' && (
              <Box mt={2}>
                <SketchPicker
                  color={customization.secondaryColor}
                  onChange={(color) => handleColorChange(color.hex, 'secondaryColor')}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </div>

      <div className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          الخطوط
        </Typography>
        <FormControl fullWidth>
          <InputLabel>نوع الخط</InputLabel>
          <Select
            value={customization.fontFamily}
            onChange={(e) => onUpdate({ ...customization, fontFamily: e.target.value as string })}
          >
            <MenuItem value="Cairo">Cairo</MenuItem>
            <MenuItem value="Tajawal">Tajawal</MenuItem>
            <MenuItem value="Almarai">Almarai</MenuItem>
            <MenuItem value="IBM Plex Sans Arabic">IBM Plex Sans Arabic</MenuItem>
          </Select>
        </FormControl>

        <Box mt={3}>
          <Typography gutterBottom>حجم الخط الأساسي</Typography>
          <Slider
            value={customization.fontSize}
            onChange={(_, value) => onUpdate({ ...customization, fontSize: value as number })}
            min={12}
            max={20}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        <div className={classes.fontPreview} style={{ fontFamily: customization.fontFamily, fontSize: customization.fontSize }}>
          نموذج للنص بالخط المختار
        </div>
      </div>

      <div className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          تخصيص الشكل
        </Typography>
        <Box mb={3}>
          <Typography gutterBottom>نصف قطر الحواف</Typography>
          <Slider
            value={customization.borderRadius}
            onChange={(_, value) => onUpdate({ ...customization, borderRadius: value as number })}
            min={0}
            max={24}
            step={2}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        <Typography gutterBottom>المسافات بين العناصر</Typography>
        <Slider
          value={customization.spacing}
          onChange={(_, value) => onUpdate({ ...customization, spacing: value as number })}
          min={4}
          max={16}
          step={2}
          marks
          valueLabelDisplay="auto"
        />
      </div>
    </Paper>
  );
}; 
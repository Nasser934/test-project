import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  Slider,
  Select,
  MenuItem,
  Grid,
  InputLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '../../contexts/ThemeContext';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: 200,
  },
}));

interface InterfacePreferences {
  fontSize: number;
  animationsEnabled: boolean;
  colorScheme: string;
  rtl: boolean;
}

interface Props {
  preferences: InterfacePreferences;
  onUpdate: (preferences: InterfacePreferences) => void;
}

export const InterfaceSettings: React.FC<Props> = ({ preferences, onUpdate }) => {
  const classes = useStyles();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleChange = (key: keyof InterfacePreferences, value: any) => {
    onUpdate({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        تخصيص الواجهة
      </Typography>

      <div className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          المظهر
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              color="primary"
            />
          }
          label="الوضع الليلي"
        />
      </div>

      <div className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          حجم الخط
        </Typography>
        <Slider
          value={preferences.fontSize}
          onChange={(_, value) => handleChange('fontSize', value)}
          min={12}
          max={24}
          step={1}
          marks
          valueLabelDisplay="auto"
        />
      </div>

      <div className={classes.section}>
        <FormControl className={classes.formControl}>
          <InputLabel>نظام الألوان</InputLabel>
          <Select
            value={preferences.colorScheme}
            onChange={(e) => handleChange('colorScheme', e.target.value)}
          >
            <MenuItem value="default">الافتراضي</MenuItem>
            <MenuItem value="blue">أزرق</MenuItem>
            <MenuItem value="green">أخضر</MenuItem>
            <MenuItem value="purple">بنفسجي</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className={classes.section}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.animationsEnabled}
              onChange={(e) => handleChange('animationsEnabled', e.target.checked)}
              color="primary"
            />
          }
          label="تفعيل الحركات"
        />
      </div>

      <div className={classes.section}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.rtl}
              onChange={(e) => handleChange('rtl', e.target.checked)}
              color="primary"
            />
          }
          label="اتجاه من اليمين إلى اليسار"
        />
      </div>
    </Paper>
  );
}; 
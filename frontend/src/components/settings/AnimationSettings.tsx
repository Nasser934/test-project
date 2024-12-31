import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  FormControl,
  FormControlLabel,
  Switch,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Motion, spring } from 'react-motion';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  previewBox: {
    width: 100,
    height: 100,
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(2, 0),
  },
  formControl: {
    minWidth: 200,
    marginBottom: theme.spacing(2),
  },
}));

interface AnimationConfig {
  enabled: boolean;
  duration: number;
  type: string;
  stiffness: number;
  damping: number;
}

interface IconConfig {
  size: number;
  style: string;
  animation: boolean;
}

interface Props {
  animationConfig: AnimationConfig;
  iconConfig: IconConfig;
  onUpdateAnimation: (config: AnimationConfig) => void;
  onUpdateIcons: (config: IconConfig) => void;
}

export const AnimationSettings: React.FC<Props> = ({
  animationConfig,
  iconConfig,
  onUpdateAnimation,
  onUpdateIcons,
}) => {
  const classes = useStyles();
  const [showPreview, setShowPreview] = React.useState(false);

  const handleAnimationChange = (key: keyof AnimationConfig, value: any) => {
    onUpdateAnimation({
      ...animationConfig,
      [key]: value,
    });
  };

  const handleIconChange = (key: keyof IconConfig, value: any) => {
    onUpdateIcons({
      ...iconConfig,
      [key]: value,
    });
  };

  const triggerPreview = () => {
    setShowPreview(false);
    setTimeout(() => setShowPreview(true), 100);
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        تخصيص الحركات والأيقونات
      </Typography>

      <div className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          إعدادات الحركة
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={animationConfig.enabled}
              onChange={(e) => handleAnimationChange('enabled', e.target.checked)}
              color="primary"
            />
          }
          label="تفعيل الحركات"
        />

        <FormControl fullWidth className={classes.formControl}>
          <InputLabel>نوع الحركة</InputLabel>
          <Select
            value={animationConfig.type}
            onChange={(e) => handleAnimationChange('type', e.target.value)}
          >
            <MenuItem value="ease">سلس</MenuItem>
            <MenuItem value="bounce">ارتداد</MenuItem>
            <MenuItem value="elastic">مرن</MenuItem>
            <MenuItem value="spring">نابض</MenuItem>
          </Select>
        </FormControl>

        <Typography gutterBottom>مدة الحركة (بالثواني)</Typography>
        <Slider
          value={animationConfig.duration}
          onChange={(_, value) => handleAnimationChange('duration', value)}
          min={0.1}
          max={2}
          step={0.1}
          marks
          valueLabelDisplay="auto"
        />

        {animationConfig.type === 'spring' && (
          <>
            <Typography gutterBottom>قوة النابض</Typography>
            <Slider
              value={animationConfig.stiffness}
              onChange={(_, value) => handleAnimationChange('stiffness', value)}
              min={50}
              max={300}
              step={10}
              marks
              valueLabelDisplay="auto"
            />

            <Typography gutterBottom>التخميد</Typography>
            <Slider
              value={animationConfig.damping}
              onChange={(_, value) => handleAnimationChange('damping', value)}
              min={5}
              max={40}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </>
        )}

        <Box mt={2}>
          <Button onClick={triggerPreview} variant="outlined" color="primary">
            معاينة الحركة
          </Button>
          {showPreview && (
            <Motion
              defaultStyle={{ x: 0, opacity: 0 }}
              style={{
                x: spring(100, { stiffness: animationConfig.stiffness, damping: animationConfig.damping }),
                opacity: spring(1),
              }}
            >
              {(interpolated) => (
                <div
                  className={classes.previewBox}
                  style={{
                    transform: `translateX(${interpolated.x}px)`,
                    opacity: interpolated.opacity,
                  }}
                />
              )}
            </Motion>
          )}
        </Box>
      </div>

      <div className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          تخصيص الأيقونات
        </Typography>

        <FormControl fullWidth className={classes.formControl}>
          <InputLabel>نمط الأيقونات</InputLabel>
          <Select
            value={iconConfig.style}
            onChange={(e) => handleIconChange('style', e.target.value)}
          >
            <MenuItem value="filled">معبأة</MenuItem>
            <MenuItem value="outlined">محددة</MenuItem>
            <MenuItem value="rounded">دائرية</MenuItem>
            <MenuItem value="sharp">حادة</MenuItem>
          </Select>
        </FormControl>

        <Typography gutterBottom>حجم الأيقونات</Typography>
        <Slider
          value={iconConfig.size}
          onChange={(_, value) => handleIconChange('size', value)}
          min={16}
          max={48}
          step={4}
          marks
          valueLabelDisplay="auto"
        />

        <FormControlLabel
          control={
            <Switch
              checked={iconConfig.animation}
              onChange={(e) => handleIconChange('animation', e.target.checked)}
              color="primary"
            />
          }
          label="تفعيل حركات الأيقونات"
        />
      </div>
    </Paper>
  );
}; 
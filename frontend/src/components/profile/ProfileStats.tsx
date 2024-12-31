import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Description,
  CloudUpload,
  Edit,
  Visibility,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  icon: {
    fontSize: 40,
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  value: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(0.5),
  },
  label: {
    color: theme.palette.text.secondary,
  },
  progress: {
    position: 'relative',
    display: 'inline-flex',
    marginBottom: theme.spacing(1),
  },
}));

interface ProfileStats {
  totalCVs: number;
  uploadedThisMonth: number;
  lastEditDate: string;
  totalViews: number;
  completionRate: number;
}

interface Props {
  stats: ProfileStats;
}

export const ProfileStats: React.FC<Props> = ({ stats }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        إحصائيات الملف الشخصي
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6} sm={3}>
          <div className={classes.statItem}>
            <Description className={classes.icon} />
            <Typography className={classes.value}>
              {stats.totalCVs}
            </Typography>
            <Typography className={classes.label}>
              إجمالي السير الذاتية
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6} sm={3}>
          <div className={classes.statItem}>
            <CloudUpload className={classes.icon} />
            <Typography className={classes.value}>
              {stats.uploadedThisMonth}
            </Typography>
            <Typography className={classes.label}>
              تم الرفع هذا الشهر
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6} sm={3}>
          <div className={classes.statItem}>
            <Visibility className={classes.icon} />
            <Typography className={classes.value}>
              {stats.totalViews}
            </Typography>
            <Typography className={classes.label}>
              مرات المشاهدة
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6} sm={3}>
          <div className={classes.statItem}>
            <div className={classes.progress}>
              <Tooltip title="نسبة اكتمال الملف الشخصي">
                <CircularProgress
                  variant="determinate"
                  value={stats.completionRate}
                  size={60}
                  thickness={4}
                  color="primary"
                />
              </Tooltip>
            </div>
            <Typography className={classes.value}>
              {stats.completionRate}%
            </Typography>
            <Typography className={classes.label}>
              اكتمال الملف
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}; 
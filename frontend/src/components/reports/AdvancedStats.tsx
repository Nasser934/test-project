import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  card: {
    height: '100%',
  },
  chartContainer: {
    height: 300,
    marginTop: theme.spacing(3),
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
}));

interface ActivityStats {
  dailyLogins: { date: string; count: number }[];
  cvStats: {
    total: number;
    completed: number;
    inProgress: number;
    shared: number;
  };
  skillsDistribution: { skill: string; count: number }[];
  completionRates: {
    personalInfo: number;
    experience: number;
    education: number;
    skills: number;
  };
}

interface Props {
  stats: ActivityStats;
}

export const AdvancedStats: React.FC<Props> = ({ stats }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        تقارير متقدمة
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                نشاط تسجيل الدخول
              </Typography>
              <div className={classes.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.dailyLogins}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Bar dataKey="count" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                معدلات اكتمال السيرة الذاتية
              </Typography>
              {Object.entries(stats.completionRates).map(([key, value]) => (
                <div key={key}>
                  <div className={classes.progressLabel}>
                    <Typography variant="body2">
                      {key === 'personalInfo' && 'المعلومات الشخصية'}
                      {key === 'experience' && 'الخبرات'}
                      {key === 'education' && 'التعليم'}
                      {key === 'skills' && 'المهارات'}
                    </Typography>
                    <Typography variant="body2">{`${value}%`}</Typography>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={value}
                    color="primary"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
}; 
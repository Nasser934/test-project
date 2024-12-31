import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  makeStyles,
  Card,
  CardContent,
  Button,
} from '@material-ui/core';
import {
  Description,
  Timeline,
  TrendingUp,
  Assignment,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    height: '100%',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 40,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  statsContainer: {
    marginBottom: theme.spacing(4),
  },
}));

export const Dashboard: React.FC = () => {
  const classes = useStyles();

  const stats = [
    {
      title: 'التقديمات النشطة',
      value: '12',
      icon: <Assignment className={classes.icon} />,
    },
    {
      title: 'السير الذاتية',
      value: '3',
      icon: <Description className={classes.icon} />,
    },
    {
      title: 'معدل النجاح',
      value: '68%',
      icon: <TrendingUp className={classes.icon} />,
    },
    {
      title: 'الوقت المتوفر',
      value: '45 ساعة',
      icon: <Timeline className={classes.icon} />,
    },
  ];

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        لوحة التحكم
      </Typography>

      <Grid container spacing={3} className={classes.statsContainer}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper className={classes.paper}>
              {stat.icon}
              <Typography variant="h6" gutterBottom>
                {stat.title}
              </Typography>
              <Typography variant="h4">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                آخر التقديمات
              </Typography>
              {/* سيتم إضافة جدول التقديمات لاحقاً */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الإجراءات السريعة
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<Description />}
                  >
                    رفع سيرة ذاتية جديدة
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<Assignment />}
                  >
                    بدء تقديم جديد
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}; 
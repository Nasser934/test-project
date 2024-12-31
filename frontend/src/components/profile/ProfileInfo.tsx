import React from 'react';
import { Paper, Typography, Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const useStyles = makeStyles((theme) => ({
  infoSection: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  label: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
  },
  value: {
    fontWeight: 500,
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

interface ProfileInfoProps {
  user: {
    createdAt: string;
    lastLogin: string;
    email: string;
    fullName: string;
  };
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const classes = useStyles();

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPP', { locale: ar });
  };

  return (
    <Paper className={classes.infoSection}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            معلومات الحساب
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.label}>تاريخ إنشاء الحساب</Typography>
          <Typography className={classes.value}>{formatDate(user.createdAt)}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.label}>آخر تسجيل دخول</Typography>
          <Typography className={classes.value}>{formatDate(user.lastLogin)}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.label}>البريد الإلكتروني</Typography>
          <Typography className={classes.value}>{user.email}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.label}>الاسم الكامل</Typography>
          <Typography className={classes.value}>{user.fullName}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}; 
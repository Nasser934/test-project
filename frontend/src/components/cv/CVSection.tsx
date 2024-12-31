import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  section: {
    marginBottom: theme.spacing(3),
  },
  title: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    fontWeight: 500,
  },
}));

interface CVSectionProps {
  title: string;
  children: React.ReactNode;
}

export const CVSection: React.FC<CVSectionProps> = ({ title, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.section}>
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
      {children}
    </div>
  );
}; 
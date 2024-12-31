import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  required: {
    '&::after': {
      content: '" *"',
      color: theme.palette.error.main,
    },
  },
}));

interface RequiredLabelProps {
  label: string;
  required?: boolean;
}

export const RequiredLabel: React.FC<RequiredLabelProps> = ({
  label,
  required = true,
}) => {
  const classes = useStyles();

  return (
    <Typography
      component="span"
      className={required ? classes.required : undefined}
    >
      {label}
    </Typography>
  );
}; 
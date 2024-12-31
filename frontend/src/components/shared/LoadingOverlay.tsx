import React from 'react';
import { Backdrop, CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ open, message }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
      {message && (
        <Typography variant="h6" component="div">
          {message}
        </Typography>
      )}
    </Backdrop>
  );
}; 
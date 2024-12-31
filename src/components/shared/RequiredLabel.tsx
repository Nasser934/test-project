import React from 'react';
import { Box, Typography } from '@mui/material';

interface RequiredLabelProps {
  label: string;
  required?: boolean;
}

export const RequiredLabel: React.FC<RequiredLabelProps> = ({ label, required = false }) => {
  return (
    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
      {label}
      {required && (
        <Typography component="span" color="error" sx={{ ml: 0.5 }}>
          *
        </Typography>
      )}
    </Box>
  );
}; 
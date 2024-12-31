import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'خطأ',
  message,
}) => {
  return (
    <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
}; 
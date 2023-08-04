import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

type CustomAlertProps = {
  message: string;
};

const CustomAlert: React.FC<CustomAlertProps> = ({ message }) => {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );
};

export default CustomAlert;
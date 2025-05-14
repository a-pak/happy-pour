// components/GlobalNotifier.tsx
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useErrorStore } from '../store/errorStore';
import useMediaQuery from '@mui/material/useMediaQuery';
import theme from '../Theme';

const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const GlobalErrorNotifier: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { notification, clearNotification } = useErrorStore();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    clearNotification();
  };

  if (!notification) return null;

  return (
    
    <Snackbar
      open={true}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        mt: 6,
        width: '300px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.type}
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>


  );
};


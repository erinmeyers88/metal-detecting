'use client';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useUserLocation } from './UserLocationProvider';

export default function LocationRequiredDialog() {
  const { status, requestLocation } = useUserLocation();
  const isOpen = status !== 'granted';
  const isLoading = status === 'loading';
  const isDenied = status === 'denied';
  const hasError = isDenied || status === 'error';

  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
      }}
      aria-labelledby="location-required-title"
      aria-describedby="location-required-description"
    >
      <DialogTitle id="location-required-title">Location required</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5}>
          <Typography id="location-required-description" variant="body1">
            Turn on location to use this app.
          </Typography>
          {isLoading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Waiting for permission...
              </Typography>
            </Stack>
          )}
          {hasError && (
            <>
              <Typography variant="body2" color="text.secondary">
                1. Tap the location icon in your browser address bar.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2. Set location to allow for this site.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3. Return here and tap Retry.
              </Typography>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={requestLocation}
          disabled={isLoading}
          fullWidth
          startIcon={<LocationOnIcon />}
        >
          {isLoading
            ? 'Checking...'
            : isDenied
              ? 'Retry'
              : 'Allow location'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

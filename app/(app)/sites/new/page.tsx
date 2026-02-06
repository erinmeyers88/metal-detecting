'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function NewSitePage() {
  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Add Site
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Placeholder for the add site form.
      </Typography>
    </Box>
  );
}

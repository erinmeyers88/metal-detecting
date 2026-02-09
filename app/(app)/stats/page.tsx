'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function StatsPage() {
  return (
    <Box
      sx={{
        height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 56px)' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'lowercase',
      }}
    >
      <Typography variant="h6" color="text.secondary">
        placeholder
      </Typography>
    </Box>
  );
}

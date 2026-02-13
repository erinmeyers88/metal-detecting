'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ThemeModeSwitch from '@/app/components/ThemeModeSwitch';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function ProfilePage() {
  const [tab, setTab] = useState<'you' | 'settings'>('you');

  return (
    <Box
      sx={{
        height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 56px)' },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          bgcolor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          variant="fullWidth"
          aria-label="Profile tabs"
          sx={{ minHeight: 56 }}
        >
          <Tab label="You" value="you" sx={{ minHeight: 56, py: 0.75 }} />
          <Tab label="Settings" value="settings" sx={{ minHeight: 56, py: 0.75 }} />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {tab === 'you' ? (
          <Typography variant="h6" color="text.secondary">
            placeholder
          </Typography>
        ) : (
          <Stack spacing={2}>
            <Paper variant="outlined">
              <List subheader={<ListSubheader>Appearance</ListSubheader>} disablePadding>
                <ThemeModeSwitch />
              </List>
            </Paper>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

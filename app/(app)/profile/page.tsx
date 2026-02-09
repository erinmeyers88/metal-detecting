'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import PaidIcon from '@mui/icons-material/Paid';
import PlaceIcon from '@mui/icons-material/Place';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FindsIcon from '@/app/components/icons/FindsIcon';
import Link from 'next/link';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ThemeModeSwitch from '@/app/components/ThemeModeSwitch';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function ProfilePage() {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState<'you' | 'settings'>('you');

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

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
      <Fab
        color="primary"
        size="medium"
        aria-label="Add"
        onClick={handleOpenMenu}
        sx={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: { xs: 88, sm: 96 },
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
      >
        <AddIcon />
      </Fab>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MenuItem component={Link} href="/finds/new" onClick={handleCloseMenu}>
          <ListItemIcon>
            <FindsIcon />
          </ListItemIcon>
          <ListItemText>Log find</ListItemText>
        </MenuItem>
        <MenuItem component={Link} href="/sites/new" onClick={handleCloseMenu}>
          <ListItemIcon>
            <PlaceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add site</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}

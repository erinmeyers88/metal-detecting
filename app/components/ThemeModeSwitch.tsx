'use client';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from './ThemeProviderClient';

export default function ThemeModeSwitch() {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';
  const modeLabel = isDark ? 'Dark mode' : 'Light mode';

  return (
    <ListItem sx={{ display: 'block', py: 1.5 }}>
      <ListItemText primary={modeLabel} />
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        {isDark ? <Brightness4Icon /> : <Brightness7Icon />}
        <Switch checked={isDark} onChange={toggleMode} />
      </Box>
    </ListItem>
  );
}

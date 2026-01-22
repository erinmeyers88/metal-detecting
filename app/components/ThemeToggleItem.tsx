'use client';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from './ThemeProviderClient';

export default function ThemeToggleItem() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={toggleMode}>
        <ListItemIcon>
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </ListItemIcon>
        <ListItemText primary={mode === 'dark' ? 'Light mode' : 'Dark mode'} />
      </ListItemButton>
    </ListItem>
  );
}

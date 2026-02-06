'use client';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from './ThemeProviderClient';

export default function ThemeModeSwitch() {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <ListItem
      secondaryAction={
        <Switch edge="end" checked={isDark} onChange={toggleMode} />
      }
    >
      <ListItemIcon>
        {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
      </ListItemIcon>
      <ListItemText
        primary="Dark mode"
        secondary={isDark ? 'On' : 'Off'}
      />
    </ListItem>
  );
}

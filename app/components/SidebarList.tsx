'use client';

import Box from '@mui/material/Box';
import Drawer, { type DrawerProps } from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PlaceIcon from '@mui/icons-material/Place';
import NavItem from './NavItem';
import ThemeToggleItem from './ThemeToggleItem';

export const drawerWidth = 240;

type SidebarListProps = {
  variant?: DrawerProps['variant'];
  open?: boolean;
  onClose?: DrawerProps['onClose'];
  onNavigate?: () => void;
  keepMounted?: boolean;
};

export default function SidebarList({
  variant = 'permanent',
  open,
  onClose,
  onNavigate,
  keepMounted = false,
}: SidebarListProps) {
  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={keepMounted ? { keepMounted: true } : undefined}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <NavItem
            href="/"
            label="Dashboard"
            icon={<DashboardIcon />}
            onNavigate={onNavigate}
          />
          <NavItem
            href="/list?tab=finds"
            label="List"
            icon={<ListAltIcon />}
            onNavigate={onNavigate}
          />
          <NavItem
            href="/map"
            label="Map"
            icon={<PlaceIcon />}
            onNavigate={onNavigate}
          />
        </List>
        <Divider />
        <List>
          <NavItem
            href="/settings"
            label="Settings"
            icon={<SettingsIcon />}
            onNavigate={onNavigate}
          />
          <ThemeToggleItem onNavigate={onNavigate} />
        </List>
      </Box>
    </Drawer>
  );
}

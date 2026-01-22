import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import MapIcon from '@mui/icons-material/Map';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NavItem from './NavItem';
import ThemeToggleItem from './ThemeToggleItem';

const drawerWidth = 240;

export default function SidebarList() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <NavItem href="/dashboard" label="Dashboard" icon={<DashboardIcon />} />
          <NavItem href="/map" label="Map" icon={<MapIcon />} />
          <NavItem href="/list" label="List" icon={<ListAltIcon />} />
        </List>
        <Divider />
        <List>
          <NavItem href="/settings" label="Settings" icon={<SettingsIcon />} />
          <ThemeToggleItem />
        </List>
      </Box>
    </Drawer>
  );
}

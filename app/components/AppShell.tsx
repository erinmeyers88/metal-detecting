import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MainContent from './MainContent';
import SidebarList from './SidebarList';
import AuthButton from './AuthButton';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap component="div">
              Metal Detecting
            </Typography>
            {/* <AuthButton /> */}
          </Toolbar>
        </AppBar>
      <SidebarList />
      <MainContent>{children}</MainContent>
    </Box>
  );
}

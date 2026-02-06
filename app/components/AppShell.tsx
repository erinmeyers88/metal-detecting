'use client';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { usePathname } from 'next/navigation';
import MainContent from './MainContent';
import BottomNav from './BottomNav';
import { mockFinds } from '@/app/lib/mock/find';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const titleMap: Record<string, string> = {
    '/': 'Home',
    '/finds': 'My Finds',
    '/map': 'My Finds',
    '/sites': 'My Sites',
    '/settings': 'Settings',
  };
  const baseTitle = titleMap[pathname] ?? 'Metal Detecting';
  const totalFinds = mockFinds.length;
  const title =
    pathname === '/finds' || pathname === '/map'
      ? `${baseTitle} (${totalFinds})`
      : baseTitle;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <MainContent>{children}</MainContent>
      <BottomNav />
    </Box>
  );
}

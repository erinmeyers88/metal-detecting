'use client';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { usePathname } from 'next/navigation';
import MainContent from './MainContent';
import BottomNav from './BottomNav';
import LocationRequiredDialog from './LocationRequiredDialog';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isMapView = pathname === '/map';

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
      <MainContent disablePadding={isMapView} showToolbar={false}>
        {children}
      </MainContent>
      <BottomNav />
      <LocationRequiredDialog />
    </Box>
  );
}

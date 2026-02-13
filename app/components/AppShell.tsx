'use client';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { usePathname, useSearchParams } from 'next/navigation';
import MainContent from './MainContent';
import BottomNav from './BottomNav';
import LocationRequiredDialog from './LocationRequiredDialog';
import AppStateBootstrap from './AppStateBootstrap';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMapView = pathname === '/map' || (pathname === '/' && searchParams.get('view') === 'map');

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
      <AppStateBootstrap />
      <MainContent disablePadding={isMapView} showToolbar={false}>
        {children}
      </MainContent>
      <BottomNav />
      <LocationRequiredDialog />
    </Box>
  );
}

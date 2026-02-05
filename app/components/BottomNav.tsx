'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PlaceIcon from '@mui/icons-material/Place';
import SettingsIcon from '@mui/icons-material/Settings';

const navItems = [
  { label: 'Home', href: '/', icon: <HomeIcon /> },
  { label: 'Finds', href: '/finds', icon: <ListAltIcon /> },
  { label: 'Sites', href: '/sites', icon: <PlaceIcon /> },
  { label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
];

export default function BottomNav() {
  const pathname = usePathname();
  const current = useMemo(() => {
    const match = navItems.find((item) => item.href === pathname);
    return match?.href ?? '/';
  }, [pathname]);

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <BottomNavigation showLabels value={current}>
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.href}
            component={Link}
            href={item.href}
            label={item.label}
            value={item.href}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

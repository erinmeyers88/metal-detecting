'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const navItems = [
  { label: 'Go', href: '/', icon: <LocationOnIcon /> },
  { label: 'Stats', href: '/stats', icon: <AnalyticsIcon /> },
  { label: 'Profile', href: '/profile', icon: <PersonIcon /> },
];

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [findsHref, setFindsHref] = useState('/list?tab=finds');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (pathname === '/list') {
      if (tabParam === 'sites') {
        localStorage.setItem('listTab', 'sites');
        setFindsHref('/list?tab=sites');
        return;
      }
      localStorage.setItem('listTab', 'finds');
      setFindsHref('/list?tab=finds');
      return;
    }
    const savedTab = localStorage.getItem('listTab');
    setFindsHref(savedTab === 'sites' ? '/list?tab=sites' : '/list?tab=finds');
  }, [pathname, searchParams]);
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
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
      }}
    >
      <BottomNavigation
        showLabels
        value={current}
        sx={{
          bgcolor: 'transparent',
          color: 'inherit',
          '& .MuiBottomNavigationAction-root': {
            minHeight: 56,
            color: 'inherit',
          },
          '& .MuiBottomNavigationAction-root .MuiSvgIcon-root': {
            fontSize: 26,
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            lineHeight: 1.2,
            '&.Mui-selected': {
              fontSize: '0.75rem',
            },
          },
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            color: 'primary.contrastText',
          },
        }}
      >
        {navItems.map((item) => {
          const href = item.href === '/list' ? findsHref : item.href;
          return (
          <BottomNavigationAction
            key={item.href}
            component={Link}
            href={href}
            label={item.label}
            value={item.href}
            icon={item.icon}
          />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '@/app/lib/supabaseClient';

type AuthGateProps = {
  children: React.ReactNode;
};

const PUBLIC_ROUTES = new Set(['/login', '/auth/callback']);

export default function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const hasSession = Boolean(data.session);
      const isPublic = PUBLIC_ROUTES.has(pathname);

      if (!hasSession && !isPublic) {
        router.replace('/login');
      } else if (hasSession && pathname === '/login') {
        router.replace('/dashboard');
      } else {
        setChecking(false);
      }
    };

    void checkSession();
  }, [pathname, router]);

  if (checking && !PUBLIC_ROUTES.has(pathname)) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return children;
}

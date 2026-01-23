'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { supabase } from '@/app/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finalizeAuth = async () => {
      await supabase.auth.getSession();
      router.replace('/dashboard');
    };

    void finalizeAuth();
  }, [router]);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <CircularProgress size={20} />
      <Typography>Signing you in…</Typography>
    </Box>
  );
}

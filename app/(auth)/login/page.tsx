'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { supabase } from '@/app/lib/supabaseClient';

export default function LoginPage() {
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h5">Sign in</Typography>
      <Typography variant="body2" color="text.secondary">
        Sign in to access your areas, finds, and detectors.
      </Typography>
      <Button variant="contained" onClick={handleSignIn}>
        Sign in with Google
      </Button>
    </Stack>
  );
}

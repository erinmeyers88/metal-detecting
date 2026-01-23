'use client';

import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { supabase } from '@/app/lib/supabaseClient';

type AuthState = {
  loading: boolean;
  email: string | null;
};

export default function AuthButton() {
  const [authState, setAuthState] = useState<AuthState>({
    loading: true,
    email: null,
  });

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthState({
        loading: false,
        email: data.session?.user.email ?? null,
      });
    };

    loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setAuthState({
          loading: false,
          email: session?.user.email ?? null,
        });
      }
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (authState.loading) {
    return <CircularProgress size={20} />;
  }

  if (authState.email) {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2">{authState.email}</Typography>
        <Button variant="outlined" size="small" onClick={handleSignOut}>
          Sign out
        </Button>
      </Stack>
    );
  }

  return (
    <Button variant="contained" size="small" onClick={handleSignIn}>
      Sign in with Google
    </Button>
  );
}

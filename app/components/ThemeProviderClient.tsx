'use client';

import { useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  selectThemeMode,
  setThemeMode,
  toggleThemeMode,
  type ThemeMode,
} from '@/app/store/slices/themeSlice';
import { getThemeOptions } from '@/app/themeOptions';

type ThemeProviderClientProps = {
  children: React.ReactNode;
};

export function useThemeMode() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectThemeMode);

  return {
    mode,
    toggleMode: () => dispatch(toggleThemeMode()),
  };
}

export default function ThemeProviderClient({ children }: ThemeProviderClientProps) {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectThemeMode);
  const theme = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

  useEffect(() => {
    const storedMode = window.localStorage.getItem('themeMode');
    if (storedMode === 'light' || storedMode === 'dark') {
      dispatch(setThemeMode(storedMode as ThemeMode));
    }
  }, [dispatch]);

  useEffect(() => {
    window.localStorage.setItem('themeMode', mode);
  }, [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

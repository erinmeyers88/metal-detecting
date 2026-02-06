'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

type ThemeModeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProviderClient');
  }
  return context;
}

type ThemeProviderClientProps = {
  children: React.ReactNode;
};

export default function ThemeProviderClient({ children }: ThemeProviderClientProps) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  useEffect(() => {
    const storedMode = window.localStorage.getItem('themeMode');
    if (storedMode === 'light' || storedMode === 'dark') {
      setMode(storedMode);
    }
  }, []);

  const toggleMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'light' ? 'dark' : 'light';
      window.localStorage.setItem('themeMode', nextMode);
      return nextMode;
    });
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

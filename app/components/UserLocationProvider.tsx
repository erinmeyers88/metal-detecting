'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
};

type UserLocationContextValue = {
  location: UserLocation | null;
  status: 'idle' | 'loading' | 'granted' | 'denied' | 'error';
  error: string | null;
};

const UserLocationContext = createContext<UserLocationContextValue | null>(null);

export const useUserLocation = () => {
  const context = useContext(UserLocationContext);
  if (!context) {
    throw new Error('useUserLocation must be used within UserLocationProvider');
  }
  return context;
};

type UserLocationProviderProps = {
  children: React.ReactNode;
};

export default function UserLocationProvider({ children }: UserLocationProviderProps) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<UserLocationContextValue['status']>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Geolocation is not supported in this browser.');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setStatus('granted');
        setError(null);
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error');
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  }, []);

  const value = useMemo(
    () => ({
      location,
      status,
      error,
    }),
    [location, status, error]
  );

  return (
    <UserLocationContext.Provider value={value}>
      {children}
    </UserLocationContext.Provider>
  );
}

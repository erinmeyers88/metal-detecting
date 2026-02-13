'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
  requestLocation: () => void;
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

  const requestLocation = useCallback(() => {
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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      requestLocation();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [requestLocation]);

  useEffect(() => {
    if (!navigator.permissions?.query) {
      return;
    }
    let isCancelled = false;
    let permissionStatus: PermissionStatus | null = null;
    const updateFromPermission = (state: PermissionState) => {
      if (isCancelled || state !== 'granted') {
        return;
      }
      requestLocation();
    };
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((result) => {
        if (isCancelled) {
          return;
        }
        permissionStatus = result;
        updateFromPermission(result.state);
        result.onchange = () => updateFromPermission(result.state);
      })
      .catch(() => {
        // Swallow permission API failures; location retries remain manual via requestLocation.
      });

    return () => {
      isCancelled = true;
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, [requestLocation]);

  const value = useMemo(
    () => ({
      location,
      status,
      error,
      requestLocation,
    }),
    [location, status, error, requestLocation]
  );

  return (
    <UserLocationContext.Provider value={value}>
      {children}
    </UserLocationContext.Provider>
  );
}

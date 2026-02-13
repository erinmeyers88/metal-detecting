'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  locationRequestFailed,
  locationRequestStarted,
  locationRequestSucceeded,
  selectUserLocation,
  selectUserLocationError,
  selectUserLocationStatus,
  type UserLocation,
  type UserLocationStatus,
} from '@/app/store/slices/locationSlice';

type UserLocationContextValue = {
  location: UserLocation | null;
  status: UserLocationStatus;
  error: string | null;
  requestLocation: () => void;
};

type UserLocationProviderProps = {
  children: React.ReactNode;
};

export const useUserLocation = (): UserLocationContextValue => {
  const dispatch = useAppDispatch();
  const location = useAppSelector(selectUserLocation);
  const status = useAppSelector(selectUserLocationStatus);
  const error = useAppSelector(selectUserLocationError);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      dispatch(
        locationRequestFailed({
          status: 'error',
          error: 'Geolocation is not supported in this browser.',
        })
      );
      return;
    }

    dispatch(locationRequestStarted());

    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(
          locationRequestSucceeded({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          })
        );
      },
      (err) => {
        dispatch(
          locationRequestFailed({
            status: err.code === err.PERMISSION_DENIED ? 'denied' : 'error',
            error: err.message,
          })
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  }, [dispatch]);

  return { location, status, error, requestLocation };
};

export default function UserLocationProvider({ children }: UserLocationProviderProps) {
  return <>{children}</>;
}

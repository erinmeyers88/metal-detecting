'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  isBasemapStyle,
  selectBasemapStyle,
  setBasemapStyle,
} from '@/app/store/slices/basemapSlice';
import { regenerateMockDataFromCenter } from '@/app/store/slices/mockDataSlice';
import { useUserLocation } from './UserLocationProvider';

export default function AppStateBootstrap() {
  const dispatch = useAppDispatch();
  const { location, requestLocation } = useUserLocation();
  const basemapStyle = useAppSelector(selectBasemapStyle);

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
        // Swallow permission API failures; location retries remain manual.
      });

    return () => {
      isCancelled = true;
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, [requestLocation]);

  useEffect(() => {
    const storedBasemap = window.localStorage.getItem('basemapStyle');
    if (storedBasemap && isBasemapStyle(storedBasemap)) {
      dispatch(setBasemapStyle(storedBasemap));
    }
  }, [dispatch]);

  useEffect(() => {
    window.localStorage.setItem('basemapStyle', basemapStyle);
  }, [basemapStyle]);

  useEffect(() => {
    if (!location) {
      return;
    }
    dispatch(
      regenerateMockDataFromCenter({
        lat: location.latitude,
        lng: location.longitude,
      })
    );
  }, [dispatch, location]);

  return null;
}

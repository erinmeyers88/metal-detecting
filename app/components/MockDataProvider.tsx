'use client';

import { useCallback } from 'react';
import type { MockSite } from '@/app/lib/mock/site';
import type { MockFind } from '@/app/lib/mock/find';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  selectMockFinds,
  selectMockSites,
  setMockFinds,
  setMockSites,
} from '@/app/store/slices/mockDataSlice';

type MockDataProviderProps = {
  children: React.ReactNode;
};

export const useMockData = () => {
  const dispatch = useAppDispatch();
  const sites = useAppSelector(selectMockSites);
  const finds = useAppSelector(selectMockFinds);

  const setSites = useCallback(
    (nextSites: React.SetStateAction<MockSite[]>) => {
      const resolved =
        typeof nextSites === 'function'
          ? (nextSites as (prev: MockSite[]) => MockSite[])(sites)
          : nextSites;
      dispatch(setMockSites(resolved));
    },
    [dispatch, sites]
  );

  const setFinds = useCallback(
    (nextFinds: React.SetStateAction<MockFind[]>) => {
      const resolved =
        typeof nextFinds === 'function'
          ? (nextFinds as (prev: MockFind[]) => MockFind[])(finds)
          : nextFinds;
      dispatch(setMockFinds(resolved));
    },
    [dispatch, finds]
  );

  return { sites, finds, setSites, setFinds };
};

export default function MockDataProvider({ children }: MockDataProviderProps) {
  return <>{children}</>;
}

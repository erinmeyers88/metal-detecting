'use client';

import { useCallback } from 'react';
import type { FindsFilterState } from './findsFilters';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  selectFindsFilters,
  setFindsFilters,
} from '@/app/store/slices/findsFiltersSlice';

type FindsFilterProviderProps = {
  children: React.ReactNode;
};

export function useFindsFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFindsFilters);

  const setFilters = useCallback(
    (nextFilters: React.SetStateAction<FindsFilterState>) => {
      const resolved =
        typeof nextFilters === 'function'
          ? (nextFilters as (prev: FindsFilterState) => FindsFilterState)(filters)
          : nextFilters;
      dispatch(setFindsFilters(resolved));
    },
    [dispatch, filters]
  );

  return { filters, setFilters };
}

export default function FindsFilterProvider({ children }: FindsFilterProviderProps) {
  return <>{children}</>;
}

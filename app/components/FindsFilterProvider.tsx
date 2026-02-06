'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { FindsFilterState } from './findsFilters';
import { defaultFindsFilters } from './findsFilters';

type FindsFilterContextValue = {
  filters: FindsFilterState;
  setFilters: React.Dispatch<React.SetStateAction<FindsFilterState>>;
};

const FindsFilterContext = createContext<FindsFilterContextValue | null>(null);

export function useFindsFilters() {
  const context = useContext(FindsFilterContext);
  if (!context) {
    throw new Error('useFindsFilters must be used within FindsFilterProvider');
  }
  return context;
}

type FindsFilterProviderProps = {
  children: React.ReactNode;
};

export default function FindsFilterProvider({ children }: FindsFilterProviderProps) {
  const [filters, setFilters] = useState<FindsFilterState>(defaultFindsFilters);
  const value = useMemo(() => ({ filters, setFilters }), [filters]);

  return (
    <FindsFilterContext.Provider value={value}>
      {children}
    </FindsFilterContext.Provider>
  );
}

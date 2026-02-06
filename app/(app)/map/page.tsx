'use client';

import { useMemo } from 'react';
import Map from '../../components/Map';
import { mockFinds } from '@/app/lib/mock/find';
import FindsViewToggleFab from '@/app/components/FindsViewToggleFab';
import FindsFilterFab from '@/app/components/FindsFilterFab';
import { applyFindsFilters } from '@/app/components/findsFilters';
import { useFindsFilters } from '@/app/components/FindsFilterProvider';

export default function MapPage() {
  const { filters } = useFindsFilters();
  const filteredFinds = useMemo(
    () => applyFindsFilters(mockFinds, filters),
    [filters]
  );
  return (
    <>
      <FindsFilterFab finds={mockFinds} showOrdering={false} />
      <Map finds={filteredFinds} />
      <FindsViewToggleFab mode="list" />
    </>
  );
}

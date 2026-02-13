'use client';

import { useMemo } from 'react';
import Map from '@/app/components/Map';
import { useMockData } from '@/app/components/MockDataProvider';
import FindsFilterFab from '@/app/components/FindsFilterFab';
import { applyFindsFilters } from '@/app/components/findsFilters';
import { useFindsFilters } from '@/app/components/FindsFilterProvider';
import Fab from '@mui/material/Fab';
import FindsIcon from '@/app/components/icons/FindsIcon';
import Link from 'next/link';

export default function FindsMapView() {
  const { filters } = useFindsFilters();
  const { finds, sites } = useMockData();
  const filteredFinds = useMemo(
    () => applyFindsFilters(finds, filters),
    [filters, finds]
  );

  return (
    <>
      <FindsFilterFab finds={finds} showOrdering={false} />
      <Map finds={filteredFinds} sites={sites} />
      <Fab
        color="primary"
        size="large"
        aria-label="Log find"
        component={Link}
        href="/finds/new"
        sx={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: { xs: 88, sm: 96 },
          zIndex: (theme) => theme.zIndex.appBar + 1,
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.55), 0 3px 10px rgba(0, 0, 0, 0.35)',
          '&:hover': {
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.6), 0 5px 14px rgba(0, 0, 0, 0.4)',
          },
          '&:active': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.35)',
          },
        }}
      >
        <FindsIcon />
      </Fab>
    </>
  );
}

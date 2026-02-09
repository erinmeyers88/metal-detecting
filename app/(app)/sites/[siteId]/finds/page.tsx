'use client';

import { useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useMockData } from '@/app/components/MockDataProvider';
import FindsList from '@/app/components/FindsList';
import Map from '@/app/components/Map';
import FindsFilterFab from '@/app/components/FindsFilterFab';
import { applyFindsFilters } from '@/app/components/findsFilters';
import { useFindsFilters } from '@/app/components/FindsFilterProvider';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function SiteFindsPage() {
  const params = useParams<{ siteId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('view');
  const isMapView = view === 'map';
  const siteId = params.siteId;
  const { finds, sites } = useMockData();
  const siteFinds = useMemo(
    () => finds.filter((find) => find.site.id === siteId),
    [finds, siteId]
  );
  const site = useMemo(
    () => sites.find((item) => item.id === siteId),
    [sites, siteId]
  );
  const { filters } = useFindsFilters();
  const filteredFinds = useMemo(
    () => applyFindsFilters(siteFinds, filters),
    [siteFinds, filters]
  );

  return (
    <>
      <Box>
        <Tabs
          value={isMapView ? 'map' : 'list'}
          onChange={(_event, value) =>
            router.replace(`/sites/${siteId}/finds${value === 'map' ? '?view=map' : ''}`)
          }
          sx={{ mb: 2 }}
          aria-label="Finds list and map tabs"
        >
          <Tab label="List" value="list" />
          <Tab label="Map" value="map" />
        </Tabs>
      </Box>
      {isMapView ? (
        <>
          <FindsFilterFab finds={siteFinds} showOrdering={false} />
          <Map finds={filteredFinds} sites={site ? [site] : []} />
        </>
      ) : (
        <FindsList finds={siteFinds} />
      )}
    </>
  );
}

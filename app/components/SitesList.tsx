'use client';

import { useMemo } from 'react';
import Masonry from '@mui/lab/Masonry';
import { Box } from '@mui/material';
import type { MockSite } from '../lib/mock/site';
import SiteCard from './SiteCard';
import { useMockData } from './MockDataProvider';

type SitesListProps = {
  sites: MockSite[];
};

const SitesList = ({ sites }: SitesListProps) => {
  const { finds } = useMockData();
  const siteFindCounts = useMemo(() => {
    const counts = new Map<string, number>();
    finds.forEach((find) => {
      counts.set(find.site.id, (counts.get(find.site.id) ?? 0) + 1);
    });
    return counts;
  }, [finds]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', mx: 0, px: 0 }}>
      <Masonry
        columns={{ xs: 1, md: 2, lg: 3 }}
        spacing={2}
        sx={{ width: '100%', mx: 'auto' }}
      >
        {sites.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            totalFinds={siteFindCounts.get(site.id) ?? 0}
            href={`/sites/${site.id}`}
          />
        ))}
      </Masonry>
    </Box>
  );
};

export default SitesList;

'use client';

import { useMemo } from 'react';
import Masonry from '@mui/lab/Masonry';
import type { MockFind } from '../lib/mock/find';
import { Box } from '@mui/material';
import FindsFilterFab from './FindsFilterFab';
import { applyFindsFilters } from './findsFilters';
import { useFindsFilters } from './FindsFilterProvider';
import FindCard from './FindCard';

const FindsList = ({finds}: { finds: MockFind[] }) => {
  const { filters } = useFindsFilters();
  const filteredFinds = useMemo(() => applyFindsFilters(finds, filters), [finds, filters]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', mx: 0, px: 0 }}>
      <FindsFilterFab finds={finds} />
      <Masonry
        columns={{ xs: 1, md: 2, lg: 4 }}
        spacing={2}
        sx={{ width: '100%', mx: 'auto' }}
      >
        {filteredFinds.map((find) => (
          <FindCard key={find.id} find={find} />
        ))}
      </Masonry>
    </Box>
  );
}
export default FindsList;

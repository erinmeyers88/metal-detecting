'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PlaceIcon from '@mui/icons-material/Place';
import FindsIcon from '@/app/components/icons/FindsIcon';
import FindsList from '@/app/components/FindsList';
import SitesList from '@/app/components/SitesList';
import { mockFinds } from '@/app/lib/mock/find';
import { mockSites } from '@/app/lib/mock/site';
import { applyFindsFilters } from '@/app/components/findsFilters';
import { useFindsFilters } from '@/app/components/FindsFilterProvider';
import Link from 'next/link';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function ListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const activeTab = tab === 'sites' ? 'sites' : 'finds';
  const { filters } = useFindsFilters();
  const filteredFinds = useMemo(
    () => applyFindsFilters(mockFinds, filters),
    [filters]
  );
  const totalFinds = mockFinds.length;
  const totalSites = mockSites.length;

  const handleTabChange = (_event: React.SyntheticEvent, value: string) => {
    router.replace(`/list?tab=${value}`);
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        aria-label="Finds and sites tabs"
        sx={{
          mb: 2,
          minHeight: 44,
          '& .MuiTab-root': {
            minHeight: 44,
            py: 0.5,
          },
          '& .MuiTab-iconWrapper': {
            marginRight: 0.5,
          },
          '& .MuiTab-root.Mui-selected': {
            bgcolor: 'action.selected',
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        <Tab
          icon={<FindsIcon />}
          iconPosition="start"
          label={`Finds (${totalFinds})`}
          value="finds"
        />
        <Tab
          icon={<PlaceIcon />}
          iconPosition="start"
          label={`Sites (${totalSites})`}
          value="sites"
        />
      </Tabs>
      {activeTab === 'finds' ? (
        <FindsList finds={filteredFinds} />
      ) : (
        <SitesList sites={mockSites} />
      )}
      <Fab
        color="primary"
        size="medium"
        aria-label={activeTab === 'sites' ? 'Add site' : 'Add find'}
        component={Link}
        href={activeTab === 'sites' ? '/sites/new' : '/finds/new'}
        sx={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: { xs: 88, sm: 96 },
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

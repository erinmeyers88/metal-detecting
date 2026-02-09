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
import { applyFindsFilters } from '@/app/components/findsFilters';
import { useFindsFilters } from '@/app/components/FindsFilterProvider';
import Link from 'next/link';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useMockData } from '@/app/components/MockDataProvider';

export default function FindsListView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const activeTab = tab === 'sites' ? 'sites' : 'finds';
  const { filters } = useFindsFilters();
  const { finds, sites } = useMockData();
  const filteredFinds = useMemo(
    () => applyFindsFilters(finds, filters),
    [filters, finds]
  );
  const totalFinds = finds.length;
  const totalSites = sites.length;

  const handleTabChange = (_event: React.SyntheticEvent, value: string) => {
    router.replace(`/?view=list&tab=${value}`);
  };

  return (
    <Box
      sx={{
        height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 56px)' },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          bgcolor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="Finds and sites tabs"
          sx={{ minHeight: 56 }}
        >
          <Tab
            icon={<FindsIcon />}
            iconPosition="start"
            label={`Finds (${filteredFinds.length === totalFinds ? totalFinds : `${filteredFinds.length}/${totalFinds}`})`}
            value="finds"
            sx={{ minHeight: 56, py: 0.75 }}
          />
          <Tab
            icon={<PlaceIcon />}
            iconPosition="start"
            label={`Sites (${totalSites})`}
            value="sites"
            sx={{ minHeight: 56, py: 0.75 }}
          />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto', pt: 2 }}>
        {activeTab === 'finds' ? (
          <FindsList finds={filteredFinds} />
        ) : (
          <SitesList sites={sites} />
        )}
      </Box>
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

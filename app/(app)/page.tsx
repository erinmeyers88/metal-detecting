'use client';

import { useSearchParams } from 'next/navigation';
import Fab from '@mui/material/Fab';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MapIcon from '@mui/icons-material/Map';
import Box from '@mui/material/Box';
import Link from 'next/link';
import FindsMapView from '@/app/components/FindsMapView';
import FindsListView from '@/app/components/FindsListView';
import BasemapFab from '@/app/components/BasemapFab';

export default function RootPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const isListView = view === 'list';

  return (
    <Box>
      {isListView ? <FindsListView /> : <FindsMapView />}
      {!isListView && <BasemapFab />}
      <Fab
        color="primary"
        size="medium"
        aria-label={isListView ? 'Map view' : 'List view'}
        component={Link}
        href={isListView ? '/?view=map' : '/?view=list'}
        sx={{
          position: 'fixed',
          right: 16,
          bottom: { xs: 160, sm: 160 },
          zIndex: (theme) => theme.zIndex.appBar + 2,
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.55), 0 3px 10px rgba(0, 0, 0, 0.35)',
          '&:hover': {
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.6), 0 5px 14px rgba(0, 0, 0, 0.4)',
          },
          '&:active': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.35)',
          },
        }}
      >
        {isListView ? <MapIcon /> : <ListAltIcon />}
      </Fab>
    </Box>
  );
}

'use client';

import { useSearchParams } from 'next/navigation';
import Fab from '@mui/material/Fab';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MapIcon from '@mui/icons-material/Map';
import Box from '@mui/material/Box';
import Link from 'next/link';
import FindsMapView from '@/app/components/FindsMapView';
import FindsListView from '@/app/components/FindsListView';

export default function RootPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const isListView = view === 'list';

  return (
    <Box>
      {isListView ? <FindsListView /> : <FindsMapView />}
      <Fab
        color="primary"
        size="small"
        aria-label={isListView ? 'Map view' : 'List view'}
        component={Link}
        href={isListView ? '/?view=map' : '/?view=list'}
        sx={{
          position: 'fixed',
          right: 16,
          bottom: { xs: 144, sm: 144 },
          zIndex: (theme) => theme.zIndex.appBar + 2,
        }}
      >
        {isListView ? <MapIcon /> : <ListAltIcon />}
      </Fab>
    </Box>
  );
}

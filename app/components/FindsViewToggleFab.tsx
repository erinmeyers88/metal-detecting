'use client';

import Link from 'next/link';
import Fab from '@mui/material/Fab';
import MapIcon from '@mui/icons-material/Map';
import ListAltIcon from '@mui/icons-material/ListAlt';

type FindsViewToggleFabProps = {
  mode: 'map' | 'list';
};

export default function FindsViewToggleFab({ mode }: FindsViewToggleFabProps) {
  const isMap = mode === 'map';

  return (
    <Fab
      color="primary"
      variant="extended"
      component={Link}
      href={isMap ? '/map' : '/finds'}
      sx={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: { xs: 88, sm: 96 },
      }}
      size="small"
      aria-label={isMap ? 'Open map view' : 'Open list view'}
    >
      {isMap ? <MapIcon sx={{ mr: 1 }} /> : <ListAltIcon sx={{ mr: 1 }} />}
      {isMap ? 'Map' : 'List'}
    </Fab>
  );
}

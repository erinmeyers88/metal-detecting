'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PlaceIcon from '@mui/icons-material/Place';
import { useMockData } from '@/app/components/MockDataProvider';

export default function SiteDetailPage() {
  const params = useParams<{ siteId: string }>();
  const siteId = params.siteId;
  const { sites, finds } = useMockData();
  const site = sites.find((item) => item.id === siteId);
  const totalFinds = useMemo(
    () => finds.filter((find) => find.site.id === siteId).length,
    [finds, siteId]
  );

  if (!site) {
    return (
      <Typography variant="body1" color="text.secondary">
        Site not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PlaceIcon color="action" />
        <Typography variant="h6">{site.name}</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {site.notes}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 2 }}>
        <Typography variant="h5">{totalFinds}</Typography>
        <Typography variant="body2" color="text.secondary">
          total finds
        </Typography>
      </Box>
      <Button component={Link} href={`/sites/${siteId}/finds`} variant="contained" sx={{ mt: 2 }}>
        View finds
      </Button>
    </Box>
  );
}

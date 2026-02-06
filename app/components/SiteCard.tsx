'use client';

import type { MockSite } from '../lib/mock/site';
import Link from 'next/link';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
  Box,
  Button,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';

type SiteCardProps = {
  site: MockSite;
  href?: string;
  totalFinds?: number;
  showCta?: boolean;
};

const SiteCard = ({ site, href, totalFinds, showCta = false }: SiteCardProps) => {
  const content = (
    <CardContent>
      <Stack direction="row" spacing={1} alignItems="center">
        <PlaceIcon color="action" fontSize="small" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
          {site.name}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {site.notes}
      </Typography>
      {typeof totalFinds === 'number' && (
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 2 }}>
          <Typography variant="h5">{totalFinds}</Typography>
          <Typography variant="body2" color="text.secondary">
            total finds
          </Typography>
        </Box>
      )}
      {showCta && href && (
        <Button component="div" variant="contained" sx={{ mt: 2 }}>
          View finds
        </Button>
      )}
    </CardContent>
  );

  return (
    <Card variant="outlined" sx={{ overflow: 'hidden' }}>
      {href ? (
        <CardActionArea component={Link} href={href} sx={{ display: 'block' }}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
};

export default SiteCard;

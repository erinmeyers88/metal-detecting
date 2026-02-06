'use client';

import { useMemo, useState } from 'react';
import Masonry from '@mui/lab/Masonry';
import type { MockFind } from '../lib/mock/find';
import {
  CardHeader,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  Stack,
  CardMedia,
  Avatar,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import PaidIcon from '@mui/icons-material/Paid';
import CastleIcon from '@mui/icons-material/Castle';
import DeleteIcon from '@mui/icons-material/Delete';
import ConstructionIcon from '@mui/icons-material/Construction';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FindsFilterFab from './FindsFilterFab';
import { applyFindsFilters } from './findsFilters';
import { useFindsFilters } from './FindsFilterProvider';

const getChipTextColor = (hex) => {
  const hexValue = hex.replace('#', '');
  const r = parseInt(hexValue.slice(0, 2), 16);
  const g = parseInt(hexValue.slice(2, 4), 16);
  const b = parseInt(hexValue.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1f1f1f' : '#ffffff';
};

const typeIconMap = {
  Coin: PaidIcon,
  Relic: CastleIcon,
  Trash: DeleteIcon,
  Junk: ConstructionIcon,
};

const FindsList = ({finds}: { finds: MockFind[] }) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const { filters } = useFindsFilters();
  const filteredFinds = useMemo(() => applyFindsFilters(finds, filters), [finds, filters]);

  const handleToggleDescription = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', mx: 0, px: 0 }}>
      <FindsFilterFab finds={finds} />
      <Masonry
        columns={{ xs: 1, md: 2, lg: 4 }}
        spacing={2}
        sx={{ width: '100%', mx: 'auto' }}
      >
        {filteredFinds.map((find) => {
          const dateTimeString = `${find.foundTimestamp}`;
          const locationDepthString = `${find.site.name} • ${find.depth}in`;
          const TypeIcon = typeIconMap[find.type] ?? AutoAwesomeIcon;
          const hasImage = Boolean(find.photoUrl);

          return (
            <Card key={find.id} variant="outlined" sx={{ overflow: 'hidden' }}>
              {hasImage && (
                <CardMedia
                  component="img"
                  image={find.photoUrl}
                  sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ pb: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <TypeIcon fontSize="small" />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, lineHeight: 1.25 }}
                      noWrap
                    >
                      {find.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dateTimeString}
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {locationDepthString}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mt: 1.25 }}
                >
                  {find.materials.map((m, idx) => (
                    <Chip
                      key={idx}
                      size="small"
                      label={m.name}
                      sx={{
                        backgroundColor: m.color,
                        color: getChipTextColor(m.color),
                        border: 'none',
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
              <Accordion
                disableGutters
                elevation={0}
                square
                expanded={Boolean(expandedIds[find.id])}
                onChange={() => handleToggleDescription(find.id)}
                sx={{
                  bgcolor: 'transparent',
                  borderTop: 1,
                  borderColor: 'divider',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`find-desc-${find.id}-content`}
                  id={`find-desc-${find.id}-header`}
                  sx={{
                    px: 2,
                    minHeight: 36,
                    '&.Mui-expanded': { minHeight: 36 },
                    '& .MuiAccordionSummary-content': { my: 0 },
                    '& .MuiAccordionSummary-content.Mui-expanded': { my: 0 },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {expandedIds[find.id] ? 'Less' : 'More details'}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
                  <Box
                    component="dl"
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      columnGap: 1.5,
                      rowGap: 0.5,
                      mb: 1,
                      typography: 'body2',
                      color: 'text.secondary',
                      '& dt': { fontWeight: 600 },
                      '& dd': { m: 0 },
                    }}
                  >
                    <dt>Size</dt>
                    <dd>{find.size}</dd>
                    <dt>Weight</dt>
                    <dd>{find.weight ?? '—'}</dd>
                    <dt>Year</dt>
                    <dd>{find.yearMade ?? '—'}</dd>
                    <dt>Condition</dt>
                    <dd>{find.condition}</dd>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {find.description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Card>
          );
        })}
      </Masonry>
    </Box>
  );
}
export default FindsList;

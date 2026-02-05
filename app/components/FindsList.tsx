'use client';

import { useState } from 'react';
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

  const handleToggleDescription = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', mx: 0, px: 0 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Toolbar Placeholder
      </Typography>
      <Masonry
        columns={{ xs: 1, md: 2, lg: 4 }}
        spacing={2}
        sx={{ width: '100%', mx: 'auto' }}
      >
        {finds.map((find) => {

const latitude = find.location.geometry.coordinates[1];
const longitude = find.location.geometry.coordinates[0]

  const dateTimeString = `${find.foundTimestamp}`
const locationDepthString = `${find.site.name} at ${find.depth} in`

          const TypeIcon = typeIconMap[find.type] ?? AutoAwesomeIcon;
          const hasImage = Boolean(find.photoUrl);

          return (
            <Card key={find.id} variant="outlined">
              <Box sx={{ display: { xs: 'flex', md: 'block' } }}>
                {hasImage && (
                  <Box
                    sx={{
                      display: { xs: 'block', md: 'none' },
                      width: 96,
                      height: 96,
                      flexShrink: 0,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={find.photoUrl}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                )}
                <Box sx={{ flex: 1 }}>
                  <CardHeader
                    avatar={
                      !hasImage ? (
                        <Avatar sx={{ width: 36, height: 36 }}>
                          <TypeIcon fontSize="small" />
                        </Avatar>
                      ) : undefined
                    }
                    title={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                        {find.title}
                      </Typography>
                    }
                    subheader={
                      <Box sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
                        <Box>{dateTimeString}</Box>
                        <Box>{locationDepthString}</Box>
                      </Box>
                    }
                  />
                  <CardContent sx={{ pb: 1 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{
                        mt: { xs: 0.5, md: 0 },
                        ml: { xs: -12, md: 0 },
                      }}
                    >
                      {find.materials.map((m, idx) => (
                        <Chip
                          key={idx}
                          size="small"
                          label={m.name}
                          sx={{
                            backgroundImage: `linear-gradient(135deg, ${m.color} 0%, ${m.colorAlt} 100%)`,
                            color: getChipTextColor(m.colorAlt),
                            border: '1px solid rgba(0,0,0,0.2)',
                            '& .MuiChip-icon': {
                              color: 'inherit',
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Box>
              </Box>
              {hasImage && (
                <CardMedia
                  component="img"
                  image={find.photoUrl}
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    height: 'fit-content',
                    width: '100%',
                  }}
                />
              )}
              <CardContent sx={{ pt: 0.5, pb: 1 }}>
                <Accordion
                  disableGutters
                  elevation={0}
                  square
                  expanded={Boolean(expandedIds[find.id])}
                  onChange={() => handleToggleDescription(find.id)}
                  sx={{
                    bgcolor: 'transparent',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`find-desc-${find.id}-content`}
                    id={`find-desc-${find.id}-header`}
                    sx={{
                      px: 0,
                      minHeight: 24,
                      '&.Mui-expanded': { minHeight: 24 },
                      '& .MuiAccordionSummary-content': { my: 0 },
                      '& .MuiAccordionSummary-content.Mui-expanded': { my: 0 },
                      '& .MuiAccordionSummary-expandIconWrapper': {
                        transition: 'none',
                      },
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {expandedIds[find.id] ? 'Less' : 'More'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 0, pt: 0, pb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {find.description}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </Masonry>
    </Box>
  );
}
export default FindsList;

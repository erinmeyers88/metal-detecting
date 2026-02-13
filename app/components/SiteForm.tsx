'use client';

import { useMemo, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import type { MockSite } from '@/app/lib/mock/site';
import { useUserLocation } from './UserLocationProvider';
import SitePolygonMap, { type Coordinate } from './SitePolygonMap';

type SiteFormProps = {
  onSubmit: (payload: MockSite) => void;
  onCancel?: () => void;
  submitLabel?: string;
  formId?: string;
  showActions?: boolean;
  center?: { lat: number; lng: number };
};

type SiteFormErrors = {
  name: boolean;
  center: boolean;
  ring: boolean;
};

export default function SiteForm({
  onSubmit,
  onCancel,
  submitLabel,
  formId,
  showActions = true,
  center,
}: SiteFormProps) {
  const { location } = useUserLocation();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [ring, setRing] = useState<Coordinate[]>([]);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  const siteCenter = useMemo(
    () =>
      center
        ? center
        : location
          ? { lat: location.latitude, lng: location.longitude }
          : null,
    [center, location]
  );

  const actionLabel = submitLabel ?? 'Save site';
  const validationErrors = useMemo<SiteFormErrors>(
    () => ({
      name: !name.trim(),
      center: !siteCenter,
      ring: ring.length < 4,
    }),
    [name, ring.length, siteCenter]
  );
  const hasValidationErrors = Object.values(validationErrors).some(Boolean);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setHasTriedSubmit(true);
    if (hasValidationErrors || !siteCenter) {
      return;
    }
    const payload: MockSite = {
      id: crypto.randomUUID(),
      name: name.trim(),
      notes: notes.trim(),
      location: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [ring],
        },
      },
      finds: [],
    };
    onSubmit(payload);
  };

  return (
    <Box
      component="form"
      id={formId}
      noValidate
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: 720,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        maxHeight: '100%',
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Add Site
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Site name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            error={hasTriedSubmit && validationErrors.name}
            fullWidth
          />
          <TextField
            label="Notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <Typography variant="body2" color="text.secondary">
            Click to draw. Double-click to finish. Use trash to clear.
          </Typography>
          <SitePolygonMap
            center={siteCenter}
            error={hasTriedSubmit && (validationErrors.ring || validationErrors.center)}
            onRingChange={setRing}
          />
        </Stack>
      </Box>
      {showActions && (
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            bgcolor: 'background.paper',
          }}
        >
          {onCancel && (
            <Button variant="text" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button variant="contained" type="submit">
            {actionLabel}
          </Button>
        </Box>
      )}
    </Box>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Map as MapView, Marker, Source, Layer } from 'react-map-gl/mapbox';
import type { MockSite } from '@/app/lib/mock/site';
import { buildSitePolygon, DEFAULT_CENTER } from '@/app/lib/mock/site';
import { useUserLocation } from './UserLocationProvider';

type SiteFormProps = {
  onSubmit: (payload: MockSite) => void;
  onCancel?: () => void;
  submitLabel?: string;
  formId?: string;
  showActions?: boolean;
  center?: { lat: number; lng: number };
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
  const [siteCenter, setSiteCenter] = useState(center);
  const [ring, setRing] = useState<[number, number][]>([]);
  const [draftPoints, setDraftPoints] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [viewState, setViewState] = useState(() => ({
    longitude: center?.lng ?? DEFAULT_CENTER.lng,
    latitude: center?.lat ?? DEFAULT_CENTER.lat,
    zoom: 16,
  }));

  useEffect(() => {
    if (center) {
      setSiteCenter(center);
      return;
    }
    if (!location) {
      return;
    }
    setSiteCenter({ lat: location.latitude, lng: location.longitude });
  }, [center, location]);

  useEffect(() => {
    if (!siteCenter) {
      return;
    }
    setRing(buildSitePolygon(siteCenter, 50));
    setDraftPoints([]);
    setIsDrawing(false);
    setViewState((prev) => ({
      ...prev,
      longitude: siteCenter.lng,
      latitude: siteCenter.lat,
      zoom: 16.5,
    }));
  }, [siteCenter]);

  const mapViewState = useMemo(() => viewState, [viewState]);

  const polygonFeature = useMemo(() => {
    if (!ring.length) return null;
    return {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [ring] },
    };
  }, [ring]);

  const draftLineFeature = useMemo(() => {
    if (draftPoints.length < 2) return null;
    return {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: draftPoints },
    };
  }, [draftPoints]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!siteCenter) {
      return;
    }
    const payload: MockSite = {
      id: crypto.randomUUID(),
      name: name.trim() || 'New site',
      notes: notes.trim(),
      location: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [ring.length ? ring : buildSitePolygon(siteCenter, 50)],
        },
      },
      finds: [],
    };
    onSubmit(payload);
  };

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Add Site
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Site name"
          value={name}
          onChange={(event) => setName(event.target.value)}
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
        <Box sx={{ height: 260, borderRadius: 2, overflow: 'hidden' }}>
          <MapView
            mapboxAccessToken={mapboxToken}
            viewState={mapViewState}
            onMove={(event) => setViewState(event.viewState)}
            onClick={(event) => {
              if (!isDrawing) return;
              setDraftPoints((prev) => [...prev, [event.lngLat.lng, event.lngLat.lat]]);
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            style={{ width: '100%', height: '100%' }}
          >
            {polygonFeature && (
              <Source id="site-polygon" type="geojson" data={polygonFeature}>
                <Layer
                  id="site-fill"
                  type="fill"
                  paint={{ 'fill-color': '#1976d2', 'fill-opacity': 0.2 }}
                />
                <Layer
                  id="site-outline"
                  type="line"
                  paint={{ 'line-color': '#1976d2', 'line-width': 2 }}
                />
              </Source>
            )}
            {draftLineFeature && (
              <Source id="site-draft" type="geojson" data={draftLineFeature}>
                <Layer
                  id="site-draft-line"
                  type="line"
                  paint={{
                    'line-color': '#1976d2',
                    'line-width': 2,
                    'line-dasharray': [2, 2],
                  }}
                />
              </Source>
            )}
            {siteCenter && (
              <Marker longitude={siteCenter.lng} latitude={siteCenter.lat} anchor="bottom">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: '#1976d2',
                    border: '2px solid #ffffff',
                  }}
                />
              </Marker>
            )}
          </MapView>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant={isDrawing ? 'contained' : 'outlined'}
            onClick={() => {
              setDraftPoints([]);
              setIsDrawing(true);
            }}
          >
            Draw polygon
          </Button>
          <Button
            variant="outlined"
            disabled={draftPoints.length < 3}
            onClick={() => {
              if (draftPoints.length < 3) return;
              setRing([...draftPoints, draftPoints[0]]);
              setDraftPoints([]);
              setIsDrawing(false);
            }}
          >
            Finish polygon
          </Button>
          <Button
            variant="text"
            onClick={() => {
              if (!siteCenter) return;
              setRing(buildSitePolygon(siteCenter, 50));
              setDraftPoints([]);
              setIsDrawing(false);
            }}
          >
            Reset to square
          </Button>
        </Box>
        {showActions && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {onCancel && (
              <Button variant="text" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button variant="contained" type="submit">
              {submitLabel ?? 'Save site'}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaidIcon from '@mui/icons-material/Paid';
import CastleIcon from '@mui/icons-material/Castle';
import DeleteIcon from '@mui/icons-material/Delete';
import ConstructionIcon from '@mui/icons-material/Construction';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Map as MapView, Marker } from 'react-map-gl/mapbox';
import type { MapLayerMouseEvent, MarkerDragEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { MockFind } from '@/app/lib/mock/find';
import { useMockData } from './MockDataProvider';
import SiteForm from './SiteForm';
import { useUserLocation } from './UserLocationProvider';
import { useAppSelector } from '@/app/store/hooks';
import { selectBasemapStyle } from '@/app/store/slices/basemapSlice';

type FindFormProps = {
  initialFind?: MockFind;
  onSubmit: (payload: Partial<MockFind>) => void;
  submitLabel?: string;
  onCancel?: () => void;
  formId?: string;
  showActions?: boolean;
};

type FindFormErrors = {
  type: boolean;
  foundDateTime: boolean;
  title: boolean;
  condition: boolean;
  depth: boolean;
  siteId: boolean;
  longitude: boolean;
  latitude: boolean;
};

const materialOptions = [
  { name: 'Iron', color: '#2f3339', colorAlt: '#5f6b75' },
  { name: 'Copper', color: '#c96a2b', colorAlt: '#8f3f1c' },
  { name: 'Copper Alloy', color: '#5f7a5b', colorAlt: '#2f4b3f' },
  { name: 'Pure Silver', color: '#e7eaee', colorAlt: '#a2b2bf' },
  { name: 'Sterling Silver', color: '#9fb8d8', colorAlt: '#6b88a8' },
  { name: 'Coin Silver', color: '#7c8aa0', colorAlt: '#4f5b6e' },
  { name: 'Gold', color: '#d8a53a', colorAlt: '#8b6a1a' },
  { name: 'Aluminum', color: '#a0a7ad', colorAlt: '#70767c' },
  { name: 'Brass', color: '#b5912f', colorAlt: '#7a5c1a' },
  { name: 'Plastic', color: '#2f6bff', colorAlt: '#1b3b9b' },
  { name: 'Ceramic', color: '#d2b48c', colorAlt: '#a37e4f' },
];

const typeOptions = ['Coin', 'Relic', 'Trash', 'Junk'];
const conditionOptions = ['New', 'Little Wear', 'Worn', 'Very Worn', 'Bad'];

const typeIconMap = {
  Coin: PaidIcon,
  Relic: CastleIcon,
  Trash: DeleteIcon,
  Junk: ConstructionIcon,
};

const toNumber = (value: string) => (value.trim() === '' ? undefined : Number(value));
const toLocalDateTimeInput = (timestamp: number) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const getChipTextColor = (hex: string) => {
  const hexValue = hex.replace('#', '');
  const r = parseInt(hexValue.slice(0, 2), 16);
  const g = parseInt(hexValue.slice(2, 4), 16);
  const b = parseInt(hexValue.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1f1f1f' : '#ffffff';
};
const pointInPolygon = (point: [number, number], ring: [number, number][]) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects =
      yi > point[1] !== yj > point[1] &&
      point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
};

export default function FindForm({
  initialFind,
  onSubmit,
  submitLabel,
  onCancel,
  formId,
  showActions = true,
}: FindFormProps) {
  const { location } = useUserLocation();
  const basemapStyle = useAppSelector(selectBasemapStyle);
  const [title, setTitle] = useState(initialFind?.title ?? '');
  const [description, setDescription] = useState(initialFind?.description ?? '');
  const [type, setType] = useState(initialFind?.type ?? '');
  const [materialNames, setMaterialNames] = useState<string[]>(
    initialFind?.materials?.map((material) => material.name) ?? []
  );
  const [depth, setDepth] = useState(
    initialFind?.depth !== undefined ? String(initialFind.depth) : ''
  );
  const [foundDateTime, setFoundDateTime] = useState(() => {
    if (initialFind?.foundTimestamp) {
      return toLocalDateTimeInput(initialFind.foundTimestamp);
    }
    return toLocalDateTimeInput(Date.now());
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [size, setSize] = useState(
    initialFind?.size !== undefined ? String(initialFind.size) : ''
  );
  const [weight, setWeight] = useState(
    initialFind?.weight !== undefined ? String(initialFind.weight) : ''
  );
  const [yearMade, setYearMade] = useState(
    initialFind?.yearMade !== undefined ? String(initialFind.yearMade) : ''
  );
  const [condition, setCondition] = useState(initialFind?.condition ?? '');
  const [siteId, setSiteId] = useState(initialFind?.site?.id ?? '');
  const [siteDialogOpen, setSiteDialogOpen] = useState(false);
  const { sites, setSites } = useMockData();
  const [longitude, setLongitude] = useState(
    initialFind?.location?.geometry?.coordinates?.[0] !== undefined
      ? String(initialFind.location.geometry.coordinates[0])
      : ''
  );
  const [latitude, setLatitude] = useState(
    initialFind?.location?.geometry?.coordinates?.[1] !== undefined
      ? String(initialFind.location.geometry.coordinates[1])
      : ''
  );
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  const sitesById = useMemo(() => new Map(sites.map((site) => [site.id, site])), [sites]);
  const longitudeValue =
    longitude ||
    (initialFind || !location ? '' : location.longitude.toFixed(6));
  const latitudeValue =
    latitude ||
    (initialFind || !location ? '' : location.latitude.toFixed(6));
  const autoMatchedSiteId = useMemo(() => {
    const lng = toNumber(longitudeValue);
    const lat = toNumber(latitudeValue);
    if (lng === undefined || lat === undefined) {
      return '';
    }
    const match = sites.find((site) =>
      site.location.geometry.coordinates.some((ring) => pointInPolygon([lng, lat], ring))
    );
    return match?.id ?? '__new__';
  }, [latitudeValue, longitudeValue, sites]);
  const selectedSiteId = siteId || autoMatchedSiteId;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setHasTriedSubmit(true);
    if (hasValidationErrors) {
      return;
    }
    const parsedDepth = toNumber(depth) as number;
    const parsedLongitude = toNumber(longitudeValue) as number;
    const parsedLatitude = toNumber(latitudeValue) as number;
    const parsedFoundTimestamp = new Date(foundDateTime).getTime();
    const site = sitesById.get(selectedSiteId) ?? initialFind?.site;
    if (!site) {
      return;
    }
    const payload: Partial<MockFind> = {
      id: initialFind?.id,
      title: title.trim(),
      description: description.trim(),
      type,
      materials: materialOptions.filter((material) => materialNames.includes(material.name)),
      depth: parsedDepth,
      foundTimestamp: parsedFoundTimestamp,
      site,
      photoUrl: initialFind?.photoUrl,
      photoFile,
      size: toNumber(size) ?? 0,
      weight: toNumber(weight),
      yearMade: toNumber(yearMade),
      condition,
      location: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [parsedLongitude, parsedLatitude],
        },
      },
    };
    onSubmit(payload);
  };

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapLng = toNumber(longitudeValue) ?? -111.758;
  const mapLat = toNumber(latitudeValue) ?? 40.299;
  const actionLabel = submitLabel ?? (initialFind ? 'Save changes' : 'Log find');
  const validationErrors = useMemo<FindFormErrors>(() => {
    const errors: FindFormErrors = {
      type: false,
      foundDateTime: false,
      title: false,
      condition: false,
      depth: false,
      siteId: false,
      longitude: false,
      latitude: false,
    };
    const parsedDepth = toNumber(depth);
    const parsedLongitude = toNumber(longitudeValue);
    const parsedLatitude = toNumber(latitudeValue);
    const parsedDateTime = foundDateTime ? new Date(foundDateTime).getTime() : Number.NaN;

    if (!type.trim()) {
      errors.type = true;
    }
    if (!foundDateTime.trim() || Number.isNaN(parsedDateTime)) {
      errors.foundDateTime = true;
    }
    if (!title.trim()) {
      errors.title = true;
    }
    if (!condition.trim()) {
      errors.condition = true;
    }
    if (
      parsedDepth === undefined ||
      Number.isNaN(parsedDepth) ||
      !Number.isFinite(parsedDepth) ||
      parsedDepth < 0
    ) {
      errors.depth = true;
    }
    if (!selectedSiteId || selectedSiteId === '__new__') {
      errors.siteId = true;
    }
    if (
      parsedLongitude === undefined ||
      Number.isNaN(parsedLongitude) ||
      !Number.isFinite(parsedLongitude) ||
      parsedLongitude < -180 ||
      parsedLongitude > 180
    ) {
      errors.longitude = true;
    }
    if (
      parsedLatitude === undefined ||
      Number.isNaN(parsedLatitude) ||
      !Number.isFinite(parsedLatitude) ||
      parsedLatitude < -90 ||
      parsedLatitude > 90
    ) {
      errors.latitude = true;
    }

    return errors;
  }, [
    condition,
    depth,
    foundDateTime,
    latitudeValue,
    longitudeValue,
    selectedSiteId,
    title,
    type,
  ]);
  const hasValidationErrors = Object.values(validationErrors).some(Boolean);
  const initialMapViewState = useMemo(
    () => ({
      longitude: location?.longitude ?? mapLng,
      latitude: location?.latitude ?? mapLat,
      zoom: location ? 16.5 : 13,
    }),
    [location, mapLat, mapLng]
  );

  return (
    <Box
      component="form"
      id={formId}
      noValidate
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 720,
        mx: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        maxHeight: '100%',
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {initialFind ? 'Edit Find' : 'Log Find'}
        </Typography>
        <Stack spacing={2}>
        <FormControl fullWidth required error={hasTriedSubmit && validationErrors.type}>
          <InputLabel id="find-type-label">Type</InputLabel>
          <Select
            labelId="find-type-label"
            label="Type"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <MenuItem value="">
              <em>Select type</em>
            </MenuItem>
            {typeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Stack direction="row" spacing={1} alignItems="center">
                  {(() => {
                    const TypeIcon = typeIconMap[option as keyof typeof typeIconMap] ?? AutoAwesomeIcon;
                    return <TypeIcon fontSize="small" sx={{ color: 'primary.main' }} />;
                  })()}
                  <span>{option}</span>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Date found"
          type="datetime-local"
          value={foundDateTime}
          onChange={(event) => setFoundDateTime(event.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          error={hasTriedSubmit && validationErrors.foundDateTime}
          fullWidth
        />
        <Button variant="outlined" component="label" type="button">
          {photoFile ? 'Photo selected' : 'Add photo'}
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(event) => {
              setPhotoFile(event.target.files?.[0] ?? null);
            }}
          />
        </Button>
        <TextField
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          error={hasTriedSubmit && validationErrors.title}
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          fullWidth
          multiline
          minRows={3}
        />
        <FormControl
          fullWidth
          required
          error={hasTriedSubmit && validationErrors.condition}
        >
          <InputLabel id="find-condition-label">Condition</InputLabel>
          <Select
            labelId="find-condition-label"
            label="Condition"
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
          >
            <MenuItem value="">
              <em>Select condition</em>
            </MenuItem>
            {conditionOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="find-materials-label">Materials</InputLabel>
          <Select
            labelId="find-materials-label"
            label="Materials"
            multiple
            value={materialNames}
            onChange={(event) =>
              setMaterialNames(
                typeof event.target.value === 'string'
                  ? event.target.value.split(',')
                  : event.target.value
              )
            }
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {selected.map((name) => {
                  const material = materialOptions.find((m) => m.name === name);
                  const color = material?.color ?? '#cccccc';
                  return (
                    <Chip
                      key={name}
                      size="small"
                      label={name}
                      sx={{
                        backgroundColor: color,
                        color: getChipTextColor(color),
                        border: 'none',
                      }}
                    />
                  );
                })}
              </Box>
            )}
          >
            {materialOptions.map((material) => (
              <MenuItem key={material.name} value={material.name}>
                <Chip
                  size="small"
                  label={material.name}
                  sx={{
                    backgroundColor: material.color,
                    color: getChipTextColor(material.color),
                    border: 'none',
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Depth (in)"
            type="number"
            value={depth}
            onChange={(event) => setDepth(event.target.value)}
            inputProps={{ min: 0, step: 0.1 }}
            required
            error={hasTriedSubmit && validationErrors.depth}
            fullWidth
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Size"
            type="number"
            value={size}
            onChange={(event) => setSize(event.target.value)}
            inputProps={{ min: 0, step: 0.1 }}
            fullWidth
          />
          <TextField
            label="Weight"
            type="number"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            inputProps={{ min: 0, step: 0.1 }}
            fullWidth
          />
          <TextField
            label="Year made"
            type="number"
            value={yearMade}
            onChange={(event) => setYearMade(event.target.value)}
            inputProps={{ min: 0, step: 1 }}
            fullWidth
          />
        </Stack>
        <FormControl fullWidth required error={hasTriedSubmit && validationErrors.siteId}>
          <InputLabel id="find-site-label">Site</InputLabel>
          <Select
            labelId="find-site-label"
            label="Site"
            value={selectedSiteId}
            onChange={(event) => setSiteId(event.target.value)}
          >
            <MenuItem value="">
              <em>Select site</em>
            </MenuItem>
            {sites.map((site) => (
              <MenuItem key={site.id} value={site.id}>
                {site.name}
              </MenuItem>
            ))}
            <MenuItem
              value="__new__"
              sx={{ color: 'primary.main', fontWeight: 600 }}
              onClick={() => setSiteDialogOpen(true)}
            >
              <AddIcon fontSize="small" sx={{ mr: 1 }} />
              Add new site...
            </MenuItem>
          </Select>
        </FormControl>
        <Dialog
          open={siteDialogOpen}
          onClose={() => setSiteDialogOpen(false)}
          fullWidth
          maxWidth="sm"
          scroll="paper"
        >
          <DialogTitle>Add new site</DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <SiteForm
              center={
                toNumber(latitudeValue) !== undefined && toNumber(longitudeValue) !== undefined
                  ? {
                      lat: toNumber(latitudeValue) as number,
                      lng: toNumber(longitudeValue) as number,
                    }
                  : undefined
              }
              onSubmit={(newSite) => {
                console.log('Create site payload', newSite);
                setSites((prev) => [...prev, newSite]);
                setSiteId(newSite.id);
                setSiteDialogOpen(false);
              }}
              onCancel={() => setSiteDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Longitude"
            type="number"
            value={longitudeValue}
            onChange={(event) => setLongitude(event.target.value)}
            required
            error={hasTriedSubmit && validationErrors.longitude}
            fullWidth
          />
          <TextField
            label="Latitude"
            type="number"
            value={latitudeValue}
            onChange={(event) => setLatitude(event.target.value)}
            required
            error={hasTriedSubmit && validationErrors.latitude}
            fullWidth
          />
        </Stack>
        <Box sx={{ height: 280, borderRadius: 2, overflow: 'hidden' }}>
          <MapView
            mapboxAccessToken={mapboxToken}
            key={`${initialMapViewState.longitude}:${initialMapViewState.latitude}`}
            initialViewState={initialMapViewState}
            onClick={(event: MapLayerMouseEvent) => {
              setLongitude(event.lngLat.lng.toFixed(6));
              setLatitude(event.lngLat.lat.toFixed(6));
            }}
            mapStyle={basemapStyle}
            style={{ width: '100%', height: '100%' }}
          >
            {location && (
              <Marker longitude={location.longitude} latitude={location.latitude} anchor="bottom">
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: '#1976d2',
                    border: '2px solid #ffffff',
                    boxShadow: '0 0 0 6px rgba(25, 118, 210, 0.2)',
                  }}
                />
              </Marker>
            )}
            <Marker
              longitude={mapLng}
              latitude={mapLat}
              draggable
              onDragEnd={(event: MarkerDragEvent) => {
                setLongitude(event.lngLat.lng.toFixed(6));
                setLatitude(event.lngLat.lat.toFixed(6));
              }}
            >
              <LocationOnIcon
                sx={{
                  fontSize: 32,
                  color: '#111111',
                  filter: 'drop-shadow(0 0 6px rgba(17, 17, 17, 0.25))',
                }}
              />
            </Marker>
          </MapView>
        </Box>
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

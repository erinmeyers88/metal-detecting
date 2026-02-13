'use client';

import { useMemo, useState } from 'react';
import { Map as MapView, Marker, Source, Layer } from 'react-map-gl/mapbox';
import type { MapLayerMouseEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Box from '@mui/material/Box';
import type { MockFind } from '@/app/lib/mock/find';
import type { MockSite } from '@/app/lib/mock/site';
import type { Map as MapboxMap } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import coinSvg from './icons/paid_24dp_1F1F1F.svg?raw';
import relicSvg from './icons/castle_24dp_1F1F1F.svg?raw';
import trashSvg from './icons/delete_24dp_1F1F1F.svg?raw';
import FindCard from './FindCard';
import SiteCard from './SiteCard';
import { useUserLocation } from './UserLocationProvider';
import { useAppSelector } from '@/app/store/hooks';
import { selectBasemapStyle } from '@/app/store/slices/basemapSlice';

type MapProps = {
  finds: MockFind[];
  sites?: MockSite[];
};

const DARK_BROWN = '#5b3a1e';
const LIGHT_BROWN = '#d2a06f';
const SITE_FILL = '#1976d2';
const SITE_STROKE = '#1976d2';

const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const iconSvgs = {
  Coin: coinSvg,
  Relic: relicSvg,
  Trash: trashSvg,
};

const addSvgIcon = (map: MapboxMap, id: string, svg: string) => {
  if (map.hasImage(id)) {
    return;
  }
  const image = new Image(24, 24);
  image.onload = () => {
    if (!map.hasImage(id)) {
      map.addImage(id, image, { sdf: true });
    }
  };
  image.src = svgToDataUri(svg);
};

const registerMapDecorations = (map: MapboxMap) => {
  addSvgIcon(map, 'finds-coin', iconSvgs.Coin);
  addSvgIcon(map, 'finds-relic', iconSvgs.Relic);
  addSvgIcon(map, 'finds-trash', iconSvgs.Trash);
};

export default function MainMap({ finds, sites = [] }: MapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [selectedFind, setSelectedFind] = useState<MockFind | null>(null);
  const [selectedSite, setSelectedSite] = useState<MockSite | null>(null);
  const { location } = useUserLocation();
  const basemapStyle = useAppSelector(selectBasemapStyle);

  const { minDepth, maxDepth } = useMemo(() => {
    if (!finds.length) {
      return { minDepth: 0, maxDepth: 1 };
    }
    let min = finds[0].depth;
    let max = finds[0].depth;
    finds.forEach((find) => {
      if (find.depth < min) min = find.depth;
      if (find.depth > max) max = find.depth;
    });
    return { minDepth: min, maxDepth: max };
  }, [finds]);

  const findsById = useMemo(
    () => new Map(finds.map((find) => [String(find.id), find])),
    [finds]
  );

  const sitesById = useMemo(
    () => new Map((sites ?? []).map((site) => [String(site.id), site])),
    [sites]
  );

  const featureCollection = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: finds.map((find) => ({
        type: 'Feature',
        geometry: find.location.geometry,
        properties: {
          id: find.id,
          type: find.type,
          depth: find.depth,
        },
      })),
    }),
    [finds]
  );

  const sitesFeatureCollection = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: (sites ?? []).map((site) => ({
        type: 'Feature',
        geometry: site.location.geometry,
        properties: {
          id: site.id,
          name: site.name,
        },
      })),
    }),
    [sites]
  );

  const mapLayer = useMemo(
    () => ({
      id: 'finds-icons',
      type: 'symbol',
      source: 'finds',
      layout: {
        'icon-image': [
          'match',
          ['get', 'type'],
          'Coin',
          'finds-coin',
          'Relic',
          'finds-relic',
          'Trash',
          'finds-trash',
          'Junk',
          'finds-trash',
          'finds-coin',
        ],
        'icon-size': 1,
        'icon-allow-overlap': true,
      },
      paint: {
        'icon-color': [
          'interpolate',
          ['linear'],
          ['get', 'depth'],
          minDepth,
          LIGHT_BROWN,
          maxDepth,
          DARK_BROWN,
        ],
      },
    }),
    [maxDepth, minDepth]
  );

  const sitesFillLayer = useMemo(
    () => ({
      id: 'sites-fill',
      type: 'fill',
      source: 'sites',
      paint: {
        'fill-color': SITE_FILL,
        'fill-opacity': 0,
      },
    }),
    []
  );

  const sitesOutlineLayer = useMemo(
    () => ({
      id: 'sites-outline',
      type: 'line',
      source: 'sites',
      paint: {
        'line-color': SITE_STROKE,
        'line-width': 3,
      },
    }),
    []
  );

  const sitesSelectedLayer = useMemo(
    () => ({
      id: 'sites-selected',
      type: 'fill',
      source: 'sites',
      filter: [
        '==',
        ['get', 'id'],
        selectedSite ? String(selectedSite.id) : '__none__',
      ],
      paint: {
        'fill-color': SITE_FILL,
        'fill-opacity': 0.18,
      },
    }),
    [selectedSite]
  );

  const sitesSelectedOutlineLayer = useMemo(
    () => ({
      id: 'sites-selected-outline',
      type: 'line',
      source: 'sites',
      filter: [
        '==',
        ['get', 'id'],
        selectedSite ? String(selectedSite.id) : '__none__',
      ],
      paint: {
        'line-color': '#e65100',
        'line-width': 3,
      },
    }),
    [selectedSite]
  );

  const selectedLayer = useMemo(
    () => ({
      id: 'finds-selected',
      type: 'circle',
      source: 'finds',
      filter: [
        '==',
        ['get', 'id'],
        selectedFind ? String(selectedFind.id) : '__none__',
      ],
      paint: {
        'circle-radius': 18,
        'circle-color': SITE_FILL,
        'circle-opacity': 0.35,
        'circle-stroke-color': '#e65100',
        'circle-stroke-width': 2,
      },
    }),
    [selectedFind]
  );

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) {
      setSelectedFind(null);
      setSelectedSite(null);
      return;
    }
    const featureId = feature.properties?.id;
    if (!featureId) {
      setSelectedFind(null);
      setSelectedSite(null);
      return;
    }
    if (feature.layer?.id?.startsWith('sites')) {
      const site = sitesById.get(String(featureId)) ?? null;
      setSelectedSite(site);
      setSelectedFind(null);
      return;
    }
    const find = findsById.get(String(featureId)) ?? null;
    setSelectedFind(find);
    setSelectedSite(null);
  };

  const [fallbackLng, fallbackLat] =
    finds[0]?.location.geometry.coordinates ?? [-111.758, 40.299];
  const initialViewState = useMemo(
    () => ({
      longitude: location?.longitude ?? fallbackLng,
      latitude: location?.latitude ?? fallbackLat,
      zoom: 18,
    }),
    [fallbackLat, fallbackLng, location]
  );

  const siteFindCounts = useMemo(() => {
    const counts = new Map<string, number>();
    finds.forEach((find) => {
      counts.set(find.site.id, (counts.get(find.site.id) ?? 0) + 1);
    });
    return counts;
  }, [finds]);

  return (
    <Box
      sx={{
        width: '100%',
        height: {
          xs: 'calc(100vh - 56px)',
          sm: 'calc(100vh - 56px)',
        },
        p: 0,
        m: 0,
      }}
    >
      <MapView
        reuseMaps
        onLoad={(event) => {
          registerMapDecorations(event.target);
          if (!(event.target as MapboxMap & { __hasAttribution?: boolean }).__hasAttribution) {
            event.target.addControl(
              new mapboxgl.AttributionControl({ compact: true }),
              'top-right'
            );
            (event.target as MapboxMap & { __hasAttribution?: boolean }).__hasAttribution = true;
          }
        }}
        onStyleData={(event) => {
          registerMapDecorations(event.target);
        }}
        onClick={handleMapClick}
        interactiveLayerIds={['finds-icons', 'sites-fill', 'sites-selected']}
        mapboxAccessToken={mapboxToken}
        attributionControl={false}
        logoPosition="top-left"
        key={`${initialViewState.longitude}:${initialViewState.latitude}`}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={basemapStyle}
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
        <Source id="sites" type="geojson" data={sitesFeatureCollection}>
          <Layer {...sitesFillLayer} />
          <Layer {...sitesSelectedLayer} />
          <Layer {...sitesOutlineLayer} />
          <Layer {...sitesSelectedOutlineLayer} />
        </Source>
        <Source id="finds" type="geojson" data={featureCollection}>
          <Layer {...selectedLayer} />
          <Layer {...mapLayer} />
        </Source>
        <Box
          sx={{
            position: 'fixed',
            left: 16,
            bottom: { xs: 96, sm: 96 },
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              px: 1.5,
              py: 1,
              boxShadow: 2,
              width: 'fit-content',
            }}
          >
            <Box
              sx={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'text.secondary',
              }}
            >
              Depth
            </Box>
            <Box sx={{ mt: 0.75, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 72,
                  borderRadius: 999,
                  background: `linear-gradient(180deg, ${LIGHT_BROWN}, ${DARK_BROWN})`,
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  fontSize: 12,
                  color: 'text.secondary',
                  lineHeight: 1.2,
                }}
              >
                <span>{minDepth} in</span>
                <span style={{ marginTop: 48 }}>{maxDepth} in</span>
              </Box>
            </Box>
          </Box>
        </Box>
        {selectedFind && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              right: 16,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 360 }}>
              <FindCard key={selectedFind.id} find={selectedFind} />
            </Box>
          </Box>
        )}
        {selectedSite && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              right: 16,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 360 }}>
              <SiteCard
                key={selectedSite.id}
                site={selectedSite}
                totalFinds={siteFindCounts.get(selectedSite.id) ?? 0}
                href={`/sites/${selectedSite.id}`}
              />
            </Box>
          </Box>
        )}
      </MapView>
    </Box>
  );
}

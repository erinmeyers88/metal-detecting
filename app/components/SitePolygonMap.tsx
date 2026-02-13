'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Map as MapView, Marker } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import type { Map as MapboxMap } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { DEFAULT_CENTER } from '@/app/lib/mock/site';

export type Coordinate = [number, number];

type SitePolygonMapProps = {
  center: { lat: number; lng: number } | null;
  error?: boolean;
  onRingChange: (ring: Coordinate[]) => void;
};

const ORANGE = '#f57c00';

const DRAW_STYLES = [
  {
    id: 'gl-draw-polygon-fill-inactive',
    type: 'fill',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'fill-color': '#1976d2',
      'fill-outline-color': '#1976d2',
      'fill-opacity': 0.12,
    },
  },
  {
    id: 'gl-draw-polygon-fill-active',
    type: 'fill',
    filter: [
      'all',
      ['==', 'active', 'true'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'fill-color': ORANGE,
      'fill-outline-color': ORANGE,
      'fill-opacity': 0.16,
    },
  },
  {
    id: 'gl-draw-polygon-stroke-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#1976d2',
      'line-width': 3,
    },
  },
  {
    id: 'gl-draw-polygon-and-line-active',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'true'],
      ['!=', 'mode', 'static'],
      ['in', '$type', 'Polygon', 'LineString'],
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ORANGE,
      'line-width': 3,
    },
  },
  {
    id: 'gl-draw-line-static',
    type: 'line',
    filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#1976d2',
      'line-width': 2,
    },
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-halo-active',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', 'active', 'true'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'circle-radius': 8,
      'circle-color': '#ffffff',
    },
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', 'active', 'true'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'circle-radius': 5,
      'circle-color': '#d84315',
    },
  },
  {
    id: 'gl-draw-midpoint-active',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'midpoint'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'circle-radius': 4,
      'circle-color': '#ffb300',
    },
  },
];

const getFirstPolygonRing = (draw: MapboxDraw): Coordinate[] => {
  const collection = draw.getAll();
  const polygonFeature = collection.features.find(
    (feature) => feature.geometry.type === 'Polygon'
  );
  if (!polygonFeature || polygonFeature.geometry.type !== 'Polygon') {
    return [];
  }
  return (polygonFeature.geometry.coordinates[0] as Coordinate[]) ?? [];
};

export default function SitePolygonMap({ center, error = false, onRingChange }: SitePolygonMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const drawMapRef = useRef<MapboxMap | null>(null);
  const removeDrawListenersRef = useRef<(() => void) | null>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const mapKey = center
    ? `site-map-${center.lat.toFixed(6)}-${center.lng.toFixed(6)}`
    : 'site-map-default';

  const attachDrawControls = (mapFromEvent?: MapboxMap) => {
    const map = mapFromEvent ?? mapRef.current?.getMap();
    if (!map) {
      return;
    }
    if (drawRef.current && drawMapRef.current === map) {
      return;
    }

    if (drawRef.current && drawMapRef.current) {
      removeDrawListenersRef.current?.();
      drawMapRef.current.removeControl(drawRef.current);
      drawRef.current = null;
      drawMapRef.current = null;
      removeDrawListenersRef.current = null;
    }
    onRingChange([]);

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: false,
        trash: true,
      },
      defaultMode: 'draw_polygon',
      styles: DRAW_STYLES,
    });
    const drawApi = draw as MapboxDraw & { trash: () => void };
    drawApi.trash = () => {
      draw.deleteAll();
      onRingChange([]);
      draw.changeMode('draw_polygon');
    };

    drawRef.current = draw;
    drawMapRef.current = map;
    map.addControl(draw, 'top-left');

    const syncRing = () => {
      onRingChange(getFirstPolygonRing(draw));
    };

    map.on('draw.create', syncRing);
    map.on('draw.update', syncRing);
    map.on('draw.delete', syncRing);
    const mapContainer = map.getContainer();
    const handleControlClickCapture = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest('.mapbox-gl-draw_trash')) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      draw.deleteAll();
      onRingChange([]);
      draw.changeMode('draw_polygon');
    };
    mapContainer.addEventListener('click', handleControlClickCapture, true);

    removeDrawListenersRef.current = () => {
      map.off('draw.create', syncRing);
      map.off('draw.update', syncRing);
      map.off('draw.delete', syncRing);
      mapContainer.removeEventListener('click', handleControlClickCapture, true);
    };
  };

  useEffect(() => {
    return () => {
      removeDrawListenersRef.current?.();
      removeDrawListenersRef.current = null;
      if (drawRef.current && drawMapRef.current) {
        drawMapRef.current.removeControl(drawRef.current);
      }
      drawRef.current = null;
      drawMapRef.current = null;
    };
  }, [mapKey]);

  useEffect(() => {
    return () => {
      removeDrawListenersRef.current?.();
      removeDrawListenersRef.current = null;
      if (drawRef.current && drawMapRef.current) {
        drawMapRef.current.removeControl(drawRef.current);
      }
      drawRef.current = null;
      drawMapRef.current = null;
    };
  }, []);

  return (
    <Box
      sx={{
        height: 320,
        borderRadius: 2,
        overflow: 'hidden',
        border: error ? 1 : 0,
        borderColor: 'error.main',
        '& .mapboxgl-ctrl-group button': {
          width: 34,
          height: 34,
        },
      }}
    >
      <MapView
        key={mapKey}
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: center?.lng ?? DEFAULT_CENTER.lng,
          latitude: center?.lat ?? DEFAULT_CENTER.lat,
          zoom: 16.5,
        }}
        onLoad={(event) => {
          attachDrawControls(event.target as MapboxMap);
        }}
        onStyleData={(event) => {
          attachDrawControls(event.target as MapboxMap);
        }}
        doubleClickZoom={false}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        style={{ width: '100%', height: '100%' }}
      >
        {center && (
          <Marker longitude={center.lng} latitude={center.lat} anchor="bottom">
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
  );
}

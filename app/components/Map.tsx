'use client';

import { Map, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';


export default function MainMap({finds}) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const featureCollection = {
    type: 'FeatureCollection',
    features: finds.map((find) => find.geometry),
  } as const;

  const findsLayer = {
    id: 'finds-layer',
    type: 'circle',
    source: 'finds',
    paint: {
      'circle-color': '#ef6c00',
      'circle-radius': 6,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
    },
  };

  return (
    <Map
      reuseMaps
      mapboxAccessToken={mapboxToken}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: '100%', height: 500 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Source id="finds" type="geojson" data={featureCollection}/>
        {/* <Layer {...findsLayer} /> */}

    </Map>
  );
  return "Map";
}

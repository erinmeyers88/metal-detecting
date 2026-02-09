import { faker } from "@faker-js/faker";
import type { Feature, Polygon } from "geojson";
import type { MockFind } from "./find";

export type MockSite = {
  id: string;
  name: string;
  notes: string;
  location: Feature<Polygon>;
  finds: MockFind[];
};

export const DEFAULT_CENTER = { lat: 40.297146, lng: -111.755283 };

export const buildSitePolygon = (
  center: { lat: number; lng: number },
  sizeFeet = 50
) => {
  const halfFeet = sizeFeet / 2;
  const halfMiles = halfFeet / 5280;
  const deltaLat = halfMiles / 69;
  const deltaLng = halfMiles / (69 * Math.cos((center.lat * Math.PI) / 180));
  const { lat, lng } = center;
  return [
    [lng - deltaLng, lat - deltaLat],
    [lng + deltaLng, lat - deltaLat],
    [lng + deltaLng, lat + deltaLat],
    [lng - deltaLng, lat + deltaLat],
    [lng - deltaLng, lat - deltaLat],
  ] as [number, number][];
};

const siteNames = [
  "Old Fairgrounds",
  "Riverbend Park",
  "East Beach",
  "Pioneer Trail",
];
const siteNotes = [
  "Public access",
  "Low tide best",
  "High traffic",
  "Historic site",
];

const seedFromCenter = (center: { lat: number; lng: number }) => {
  const latSeed = Math.round(center.lat * 1000);
  const lngSeed = Math.round(center.lng * 1000);
  return Math.abs(latSeed * 100000 + lngSeed);
};

const boundsFromCenter = (center: { lat: number; lng: number }, radiusMiles: number) => {
  const latDelta = radiusMiles / 69;
  const lngDelta = radiusMiles / (69 * Math.cos((center.lat * Math.PI) / 180));
  return {
    minLat: center.lat - latDelta,
    maxLat: center.lat + latDelta,
    minLng: center.lng - lngDelta,
    maxLng: center.lng + lngDelta,
  };
};

export const createMockSites = (
  center: { lat: number; lng: number } = DEFAULT_CENTER,
  count = 4
): MockSite[] => {
  faker.seed(seedFromCenter(center));
  const bounds = boundsFromCenter(center, 2);
  const nearbySite: MockSite = {
    id: faker.string.uuid(),
    name: 'Nearby Spot',
    notes: 'Auto-generated near your location',
    location: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [buildSitePolygon(center, 50)],
      },
    },
    finds: [],
  };

  const rest = Array.from({ length: count }, () => {
    const lat = faker.number.float({
      min: bounds.minLat,
      max: bounds.maxLat,
      precision: 6,
    });
    const lng = faker.number.float({
      min: bounds.minLng,
      max: bounds.maxLng,
      precision: 6,
    });
    const sizeFeet = faker.number.float({ min: 20, max: 50 });
    const ring = buildSitePolygon({ lat, lng }, sizeFeet);

    return {
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement(siteNames),
      notes: faker.helpers.arrayElement(siteNotes),
      location: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [ring],
        },
      },
      finds: [],
    };
  });
  return [nearbySite, ...rest];
};

export const mockSites: MockSite[] = createMockSites(DEFAULT_CENTER);

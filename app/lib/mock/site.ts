import { faker } from "@faker-js/faker";
import type { Feature, Polygon } from "geojson";

export type MockSite = {
  id: string;
  name: string;
  notes: string;
  location: Feature<Polygon>;
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

export const mockSites: MockSite[] = Array.from({ length: 4 }, () => {
  const latitude = faker.location.latitude({
    min: 42.0,
    max: 46.3,
    precision: 6,
  });
  const longitude = faker.location.longitude({
    min: -124.6,
    max: -116.5,
    precision: 6,
  });
  const deltaLat = faker.number.float({ min: 0.005, max: 0.03 });
  const deltaLng = faker.number.float({ min: 0.005, max: 0.03 });

  const lat = Number(latitude);
  const lng = Number(longitude);
  const ring: [number, number][] = [
    [lng - deltaLng, lat - deltaLat],
    [lng + deltaLng, lat - deltaLat],
    [lng + deltaLng, lat + deltaLat],
    [lng - deltaLng, lat + deltaLat],
    [lng - deltaLng, lat - deltaLat],
  ];

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
  };
});

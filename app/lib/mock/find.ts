import { faker } from "@faker-js/faker";
import { MockSite, mockSites } from "./site";
import type { Feature, Point } from "geojson";

export type MockFind = {
  id: string;
  type: string;
  title: string;
  description: string;
  materials: { name: string; color: string; colorAlt: string }[];
  depth: number;
  foundTimestamp: string;
  location: Feature<Point>;
  site: MockSite;
  photoUrl?: string;
  size: number;
  weight?: number;
  yearMade?: number;
  condition: string;
};

faker.seed(42); //Ensures that all mock data remains the same with each generation

const materials = [
  { name: "Iron", color: "#2f3339", colorAlt: "#5f6b75" },
  { name: "Copper", color: "#c96a2b", colorAlt: "#8f3f1c" },
  { name: "Copper Alloy", color: "#5f7a5b", colorAlt: "#2f4b3f" },
  { name: "Pure Silver", color: "#e7eaee", colorAlt: "#a2b2bf" },
  { name: "Sterling Silver", color: "#9fb8d8", colorAlt: "#6b88a8" },
  { name: "Coin Silver", color: "#7c8aa0", colorAlt: "#4f5b6e" },
  { name: "Gold", color: "#d8a53a", colorAlt: "#8b6a1a" },
  { name: "Aluminum", color: "#a0a7ad", colorAlt: "#70767c" },
  { name: "Brass", color: "#b5912f", colorAlt: "#7a5c1a" },
  { name: "Plastic", color: "#2f6bff", colorAlt: "#1b3b9b" },
  { name: "Ceramic", color: "#d2b48c", colorAlt: "#a37e4f" },
];

const types = ["Coin", "Relic", "Trash"];

const conditions = ["New", "Little Wear", "Worn", "Very Worn", "Bad"];

const getSiteBounds = (site: MockSite) => {
  const ring = site.location.geometry.coordinates[0];
  const lngs = ring.map((coord) => coord[0]);
  const lats = ring.map((coord) => coord[1]);
  return {
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
  };
};

const randomPointInSite = (site: MockSite) => {
  const { minLng, maxLng, minLat, maxLat } = getSiteBounds(site);
  return [
    faker.number.float({ min: minLng, max: maxLng, precision: 6 }),
    faker.number.float({ min: minLat, max: maxLat, precision: 6 }),
  ] as [number, number];
};

const buildFind = (site: MockSite): MockFind => {
  const foundTimestamp = faker.date.recent({ days: 60 }).toDateString();
  const [lng, lat] = randomPointInSite(site);
  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    type: faker.helpers.arrayElement(types),
    materials: faker.helpers.arrayElements(materials, { min: 1, max: 3 }),
    depth: faker.number.int({ min: 0.5, max: 10 }),
    foundTimestamp,
    site,
    photoUrl: faker.image.urlPicsumPhotos({ blur: 0, width: 4000 }),
    location: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    },
    size: faker.number.int({ min: 1, max: 10 }),
    weight: faker.number.int({ min: 1, max: 10 }),
    yearMade: faker.number.int({ min: 1000, max: 2026 }),
    condition: faker.helpers.arrayElement(conditions),
  };
};

export const mockFinds: MockFind[] = mockSites.flatMap((site) =>
  Array.from({ length: 3 }, () => buildFind(site))
);

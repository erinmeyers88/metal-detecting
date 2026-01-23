import { faker } from '@faker-js/faker';
import type { Feature } from 'geojson';


export type MockArea = {
  id: string;
  name: string;
  notes: string;
  geometry: Feature
};

const areaNames = ['Old Fairgrounds', 'Riverbend Park', 'East Beach', 'Pioneer Trail'];
const areaNotes = ['Public access', 'Low tide best', 'High traffic', 'Historic site'];

export const mockAreas: MockArea[] = Array.from({ length: 4 }, () => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(areaNames),
  notes: faker.helpers.arrayElement(areaNotes),
}));
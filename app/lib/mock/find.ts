import { faker } from '@faker-js/faker';
import { MockArea, mockAreas } from './area';
import {Feature} from 'geojson'


export type MockFind = {
  id: string;
  title: string;
  description: string;
  material: string;
  depthCm: number;
  foundAt: string;
  geometry: Feature
  area: MockArea;
  photoUrl: string
};

faker.seed(42);

const materials = ['Iron', 'Copper', 'Silver', 'Gold', 'Aluminum', 'Brass', 'Plastic', 'Ceramic'];




export const mockFinds: MockFind[] = Array.from({ length: 12 }, () => {
  const foundAt = faker.date.recent({ days: 60 }).toISOString().slice(0, 10);
  const area = faker.helpers.arrayElement(mockAreas);
  const latitude = faker.location.latitude({ min: 42.0, max: 46.3, precision: 6 });
  const longitude = faker.location.longitude({ min: -124.6, max: -116.5, precision: 6 });
  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    material: faker.helpers.arrayElement(materials),
    depthCm: faker.number.int({ min: 2, max: 30 }),
    foundAt,
    area,
    photoUrl: faker.image.urlPicsumPhotos({blur: 0, width: 4000}),
    geometry: {
      type: 'Feature',
      properties: {

      },
      geometry: {
type: 'Point',
coordinates: [Number(longitude), Number(latitude)]
      }
    }
  };
});

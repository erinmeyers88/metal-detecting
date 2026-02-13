import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createMockSites, DEFAULT_CENTER, type MockSite } from '@/app/lib/mock/site';
import { createMockFinds, type MockFind } from '@/app/lib/mock/find';

export type MockDataState = {
  sites: MockSite[];
  finds: MockFind[];
  seedKey: string;
};

const seedKeyFromCenter = (center: { lat: number; lng: number }) =>
  `${Math.round(center.lat * 1000)}:${Math.round(center.lng * 1000)}`;

const buildMockData = (center: { lat: number; lng: number }) => {
  const sites = createMockSites(center).map((site) => ({ ...site, finds: [] }));
  const sitesById = new Map(sites.map((site) => [site.id, site]));
  const finds = createMockFinds(sites, center).map((find) => {
    const site = sitesById.get(find.site.id) ?? find.site;
    return { ...find, site };
  });

  return { sites, finds };
};

const initialData = buildMockData(DEFAULT_CENTER);

const initialState: MockDataState = {
  sites: initialData.sites,
  finds: initialData.finds,
  seedKey: seedKeyFromCenter(DEFAULT_CENTER),
};

const mockDataSlice = createSlice({
  name: 'mockData',
  initialState,
  reducers: {
    setMockSites(state, action: PayloadAction<MockSite[]>) {
      state.sites = action.payload;
    },
    setMockFinds(state, action: PayloadAction<MockFind[]>) {
      state.finds = action.payload;
    },
    regenerateMockDataFromCenter(state, action: PayloadAction<{ lat: number; lng: number }>) {
      const nextSeedKey = seedKeyFromCenter(action.payload);
      if (state.seedKey === nextSeedKey) {
        return;
      }
      const nextData = buildMockData(action.payload);
      state.sites = nextData.sites;
      state.finds = nextData.finds;
      state.seedKey = nextSeedKey;
    },
  },
});

export const { setMockSites, setMockFinds, regenerateMockDataFromCenter } =
  mockDataSlice.actions;

type MockDataSliceState = { mockData: MockDataState };

export const selectMockDataState = (state: MockDataSliceState) => state.mockData;
export const selectMockSites = (state: MockDataSliceState) => state.mockData.sites;
export const selectMockFinds = (state: MockDataSliceState) => state.mockData.finds;
export const selectMockSeedKey = (state: MockDataSliceState) => state.mockData.seedKey;

export default mockDataSlice.reducer;

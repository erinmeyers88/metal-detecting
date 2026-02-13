import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const BASEMAP_OPTIONS = [
  {
    label: 'Streets',
    value: 'mapbox://styles/mapbox/streets-v12',
  },
  {
    label: 'Outdoors',
    value: 'mapbox://styles/mapbox/outdoors-v12',
  },
  {
    label: 'Satellite',
    value: 'mapbox://styles/mapbox/satellite-streets-v12',
  },
] as const;

export type BasemapStyle = (typeof BASEMAP_OPTIONS)[number]['value'];

const DEFAULT_BASEMAP: BasemapStyle = 'mapbox://styles/mapbox/satellite-streets-v12';

type BasemapState = {
  style: BasemapStyle;
};

const initialState: BasemapState = {
  style: DEFAULT_BASEMAP,
};

const basemapValues = new Set<string>(BASEMAP_OPTIONS.map((option) => option.value));

export const isBasemapStyle = (value: string): value is BasemapStyle =>
  basemapValues.has(value);

const basemapSlice = createSlice({
  name: 'basemap',
  initialState,
  reducers: {
    setBasemapStyle(state, action: PayloadAction<BasemapStyle>) {
      state.style = action.payload;
    },
  },
});

export const { setBasemapStyle } = basemapSlice.actions;

type BasemapSliceState = { basemap: BasemapState };

export const selectBasemapState = (state: BasemapSliceState) => state.basemap;
export const selectBasemapStyle = (state: BasemapSliceState) => state.basemap.style;

export default basemapSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './slices/locationSlice';
import mockDataReducer from './slices/mockDataSlice';
import findsFiltersReducer from './slices/findsFiltersSlice';
import themeReducer from './slices/themeSlice';
import basemapReducer from './slices/basemapSlice';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    mockData: mockDataReducer,
    findsFilters: findsFiltersReducer,
    theme: themeReducer,
    basemap: basemapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

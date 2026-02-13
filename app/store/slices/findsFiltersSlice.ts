import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FindsFilterState } from '@/app/components/findsFilters';
import { defaultFindsFilters } from '@/app/components/findsFilters';

type FindsFiltersState = {
  filters: FindsFilterState;
};

const initialState: FindsFiltersState = {
  filters: defaultFindsFilters,
};

const findsFiltersSlice = createSlice({
  name: 'findsFilters',
  initialState,
  reducers: {
    setFindsFilters(state, action: PayloadAction<FindsFilterState>) {
      state.filters = action.payload;
    },
    resetFindsFilters(state) {
      state.filters = defaultFindsFilters;
    },
  },
});

export const { setFindsFilters, resetFindsFilters } = findsFiltersSlice.actions;

type FindsFiltersSliceState = { findsFilters: FindsFiltersState };

export const selectFindsFiltersState = (state: FindsFiltersSliceState) => state.findsFilters;
export const selectFindsFilters = (state: FindsFiltersSliceState) => state.findsFilters.filters;

export default findsFiltersSlice.reducer;

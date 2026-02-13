import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
};

export type UserLocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error';

export type LocationState = {
  location: UserLocation | null;
  status: UserLocationStatus;
  error: string | null;
};

const initialState: LocationState = {
  location: null,
  status: 'idle',
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    locationRequestStarted(state) {
      state.status = 'loading';
      state.error = null;
    },
    locationRequestSucceeded(state, action: PayloadAction<UserLocation>) {
      state.location = action.payload;
      state.status = 'granted';
      state.error = null;
    },
    locationRequestFailed(
      state,
      action: PayloadAction<{ status: 'denied' | 'error'; error: string }>
    ) {
      state.status = action.payload.status;
      state.error = action.payload.error;
    },
  },
});

export const {
  locationRequestStarted,
  locationRequestSucceeded,
  locationRequestFailed,
} = locationSlice.actions;

type LocationSliceState = { location: LocationState };

export const selectLocationState = (state: LocationSliceState) => state.location;
export const selectUserLocation = (state: LocationSliceState) => state.location.location;
export const selectUserLocationStatus = (state: LocationSliceState) => state.location.status;
export const selectUserLocationError = (state: LocationSliceState) => state.location.error;

export default locationSlice.reducer;

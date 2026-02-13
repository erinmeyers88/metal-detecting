import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

export type ThemeState = {
  mode: ThemeMode;
};

const initialState: ThemeState = {
  mode: 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    toggleThemeMode(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setThemeMode, toggleThemeMode } = themeSlice.actions;

type ThemeSliceState = { theme: ThemeState };

export const selectThemeState = (state: ThemeSliceState) => state.theme;
export const selectThemeMode = (state: ThemeSliceState) => state.theme.mode;

export default themeSlice.reducer;

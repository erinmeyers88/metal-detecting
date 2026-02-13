'use client';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  BASEMAP_OPTIONS,
  isBasemapStyle,
  selectBasemapStyle,
  setBasemapStyle,
} from '@/app/store/slices/basemapSlice';

export default function BasemapSelectItem() {
  const dispatch = useAppDispatch();
  const basemapStyle = useAppSelector(selectBasemapStyle);

  return (
    <ListItem sx={{ display: 'block', py: 1.5 }}>
      <ListItemText primary="Basemap" />
      <FormControl size="small" fullWidth sx={{ mt: 1 }}>
        <Select
          value={basemapStyle}
          onChange={(event) => {
            const value = event.target.value;
            if (!isBasemapStyle(value)) {
              return;
            }
            dispatch(setBasemapStyle(value));
          }}
        >
          {BASEMAP_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ListItem>
  );
}

'use client';

import { useState } from 'react';
import Fab from '@mui/material/Fab';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LayersIcon from '@mui/icons-material/Layers';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  BASEMAP_OPTIONS,
  isBasemapStyle,
  selectBasemapStyle,
  setBasemapStyle,
} from '@/app/store/slices/basemapSlice';

export default function BasemapFab() {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const basemapStyle = useAppSelector(selectBasemapStyle);

  return (
    <>
      <Fab
        size="medium"
        color="primary"
        aria-label="Choose basemap"
        onClick={(event) => setMenuAnchor(event.currentTarget)}
        sx={{
          position: 'fixed',
          right: 16,
          bottom: { xs: 224, sm: 224 },
          zIndex: (theme) => theme.zIndex.appBar + 1,
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.55), 0 3px 10px rgba(0, 0, 0, 0.35)',
          '&:hover': {
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.6), 0 5px 14px rgba(0, 0, 0, 0.4)',
          },
          '&:active': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.35)',
          },
        }}
      >
        <LayersIcon fontSize="small" />
      </Fab>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {BASEMAP_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === basemapStyle}
            onClick={() => {
              if (isBasemapStyle(option.value)) {
                dispatch(setBasemapStyle(option.value));
              }
              setMenuAnchor(null);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

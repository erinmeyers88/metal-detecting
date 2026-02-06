'use client';

import { useMemo } from 'react';
import Map from '@/app/components/Map';
import { mockFinds } from '@/app/lib/mock/find';
import { mockSites } from '@/app/lib/mock/site';
import FindsFilterFab from '@/app/components/FindsFilterFab';
import { applyFindsFilters } from '@/app/components/findsFilters';
import { useFindsFilters } from '@/app/components/FindsFilterProvider';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PlaceIcon from '@mui/icons-material/Place';
import FindsIcon from '@/app/components/icons/FindsIcon';
import Link from 'next/link';
import { useState } from 'react';

export default function MapPage() {
  const { filters } = useFindsFilters();
  const filteredFinds = useMemo(
    () => applyFindsFilters(mockFinds, filters),
    [filters]
  );
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <FindsFilterFab finds={mockFinds} showOrdering={false} />
      <Map finds={filteredFinds} sites={mockSites} />
      <Fab
        color="primary"
        size="medium"
        aria-label="Add"
        onClick={handleOpenMenu}
        sx={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: { xs: 88, sm: 96 },
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
      >
        <AddIcon />
      </Fab>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MenuItem component={Link} href="/finds/new" onClick={handleCloseMenu}>
          <ListItemIcon>
            <FindsIcon />
          </ListItemIcon>
          <ListItemText>Log find</ListItemText>
        </MenuItem>
        <MenuItem component={Link} href="/sites/new" onClick={handleCloseMenu}>
          <ListItemIcon>
            <PlaceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add site</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

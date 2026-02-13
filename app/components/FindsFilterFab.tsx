'use client';

import { useMemo, useState } from 'react';
import {
  Badge,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Button,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import type { MockFind } from '@/app/lib/mock/find';
import { useFindsFilters } from './FindsFilterProvider';
import { defaultFindsFilters } from './findsFilters';
import type { OrderBy, OrderDir } from './findsFilters';

type FindsFilterFabProps = {
  finds: MockFind[];
  showOrdering?: boolean;
};

export default function FindsFilterFab({
  finds,
  showOrdering = true,
}: FindsFilterFabProps) {
  const { filters, setFilters } = useFindsFilters();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(filters);

  const handleOpen = () => {
    setDraftFilters(filters);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const sites = useMemo(() => {
    const names = new Set<string>();
    finds.forEach((find) => {
      if (find.site?.name) {
        names.add(find.site.name);
      }
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [finds]);

  const types = useMemo(() => {
    const names = new Set<string>();
    finds.forEach((find) => {
      if (find.type) {
        names.add(find.type);
      }
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [finds]);

  const appliedCount = useMemo(() => {
    let count = 0;
    if (filters.typeFilter !== 'All') count += 1;
    if (filters.siteFilter !== 'All') count += 1;
    if (filters.dateFrom) count += 1;
    if (filters.dateTo) count += 1;
    if (filters.depthMin) count += 1;
    if (filters.depthMax) count += 1;
    if (filters.yearMin) count += 1;
    if (filters.yearMax) count += 1;
    if (showOrdering && filters.orderBy !== 'date') count += 1;
    if (showOrdering && filters.orderDir !== 'desc') count += 1;
    return count;
  }, [filters, showOrdering]);

  return (
    <>
      <Fab
        color="primary"
        size="medium"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          right: 16,
          left: 'auto',
          transform: 'none',
          bottom: { xs: 96, sm: 96 },
          zIndex: (theme) => theme.zIndex.appBar - 1,
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.55), 0 3px 10px rgba(0, 0, 0, 0.35)',
          '&:hover': {
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.6), 0 5px 14px rgba(0, 0, 0, 0.4)',
          },
          '&:active': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.35)',
          },
        }}
        aria-label="Open filters"
      >
        <Badge
          badgeContent={appliedCount > 0 ? appliedCount : undefined}
          color="secondary"
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiBadge-badge': {
              top: -4,
              right: -4,
            },
          }}
        >
          <FilterListIcon />
        </Badge>
      </Fab>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        scroll="paper"
      >
        <DialogTitle>Filters</DialogTitle>
        <DialogContent dividers sx={{ p: 2 }}>
          <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="finds-type-label">Type</InputLabel>
            <Select
              labelId="finds-type-label"
              label="Type"
              value={draftFilters.typeFilter}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, typeFilter: event.target.value }))
              }
            >
              <MenuItem value="All">All</MenuItem>
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="finds-site-label">Site</InputLabel>
            <Select
              labelId="finds-site-label"
              label="Site"
              value={draftFilters.siteFilter}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, siteFilter: event.target.value }))
              }
            >
              <MenuItem value="All">All</MenuItem>
              {sites.map((site) => (
                <MenuItem key={site} value={site}>
                  {site}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack direction="row" spacing={1}>
            <TextField
              label="From"
              type="date"
              value={draftFilters.dateFrom}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, dateFrom: event.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            <TextField
              label="To"
              type="date"
              value={draftFilters.dateTo}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, dateTo: event.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Depth min"
              type="number"
              value={draftFilters.depthMin}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, depthMin: event.target.value }))
              }
              size="small"
              fullWidth
              inputProps={{ min: 0, step: 0.1 }}
            />
            <TextField
              label="Depth max"
              type="number"
              value={draftFilters.depthMax}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, depthMax: event.target.value }))
              }
              size="small"
              fullWidth
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Year min"
              type="number"
              value={draftFilters.yearMin}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, yearMin: event.target.value }))
              }
              size="small"
              fullWidth
              inputProps={{ min: 0, step: 1 }}
            />
            <TextField
              label="Year max"
              type="number"
              value={draftFilters.yearMax}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, yearMax: event.target.value }))
              }
              size="small"
              fullWidth
              inputProps={{ min: 0, step: 1 }}
            />
          </Stack>
          <Divider />
          {showOrdering && (
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl fullWidth size="small">
                <InputLabel id="finds-order-label">Order by</InputLabel>
                <Select
                  labelId="finds-order-label"
                  label="Order by"
                  value={draftFilters.orderBy}
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      orderBy: event.target.value as OrderBy,
                    }))
                  }
                >
                  <MenuItem value="date">Date found</MenuItem>
                  <MenuItem value="depth">Depth</MenuItem>
                  <MenuItem value="yearMade">Year made</MenuItem>
                </Select>
              </FormControl>
              <ToggleButtonGroup
                size="small"
                value={draftFilters.orderDir}
                exclusive
                onChange={(_, value: OrderDir | null) =>
                  value && setDraftFilters((prev) => ({ ...prev, orderDir: value }))
                }
                aria-label="Sort direction"
              >
                <ToggleButton value="desc" aria-label="Descending">
                  <ArrowDownwardIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="asc" aria-label="Ascending">
                  <ArrowUpwardIcon fontSize="small" />
                </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            px: 2,
            py: 1.5,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Button
            size="small"
            onClick={() =>
              setDraftFilters((prev) => ({ ...prev, ...defaultFindsFilters }))
            }
          >
            Clear all
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setFilters(draftFilters);
              handleClose();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

import type { MockFind } from '@/app/lib/mock/find';

export type OrderBy = 'date' | 'depth' | 'yearMade';
export type OrderDir = 'asc' | 'desc';

export type FindsFilterState = {
  typeFilter: string;
  siteFilter: string;
  dateFrom: string;
  dateTo: string;
  depthMin: string;
  depthMax: string;
  yearMin: string;
  yearMax: string;
  orderBy: OrderBy;
  orderDir: OrderDir;
};

export const defaultFindsFilters: FindsFilterState = {
  typeFilter: 'All',
  siteFilter: 'All',
  dateFrom: '',
  dateTo: '',
  depthMin: '',
  depthMax: '',
  yearMin: '',
  yearMax: '',
  orderBy: 'date',
  orderDir: 'desc',
};

const parseFoundDate = (foundTimestamp: string) => {
  const parsed = new Date(foundTimestamp);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const applyFindsFilters = (
  finds: MockFind[],
  filters: FindsFilterState
) => {
  const { typeFilter, siteFilter, dateFrom, dateTo, orderBy, orderDir } = filters;
  const fromDate = dateFrom ? new Date(dateFrom) : null;
  const toDate = dateTo ? new Date(dateTo) : null;
  const depthMin = filters.depthMin ? Number(filters.depthMin) : null;
  const depthMax = filters.depthMax ? Number(filters.depthMax) : null;
  const yearMin = filters.yearMin ? Number(filters.yearMin) : null;
  const yearMax = filters.yearMax ? Number(filters.yearMax) : null;

  const base = finds.filter((find) => {
    if (typeFilter !== 'All' && find.type !== typeFilter) {
      return false;
    }
    if (siteFilter !== 'All' && find.site?.name !== siteFilter) {
      return false;
    }
    if (fromDate || toDate) {
      const foundDate = parseFoundDate(find.foundTimestamp);
      if (!foundDate) {
        return false;
      }
      if (fromDate && foundDate < fromDate) {
        return false;
      }
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (foundDate > endOfDay) {
          return false;
        }
      }
    }
    if (depthMin !== null && Number.isFinite(depthMin) && find.depth < depthMin) {
      return false;
    }
    if (depthMax !== null && Number.isFinite(depthMax) && find.depth > depthMax) {
      return false;
    }
    if (yearMin !== null && Number.isFinite(yearMin)) {
      const year = find.yearMade ?? null;
      if (year === null || year < yearMin) {
        return false;
      }
    }
    if (yearMax !== null && Number.isFinite(yearMax)) {
      const year = find.yearMade ?? null;
      if (year === null || year > yearMax) {
        return false;
      }
    }
    return true;
  });

  return [...base].sort((a, b) => {
    if (orderBy === 'depth') {
      return orderDir === 'asc' ? a.depth - b.depth : b.depth - a.depth;
    }
    if (orderBy === 'yearMade') {
      const aYear = a.yearMade ?? -Infinity;
      const bYear = b.yearMade ?? -Infinity;
      return orderDir === 'asc' ? aYear - bYear : bYear - aYear;
    }
    const aDate = parseFoundDate(a.foundTimestamp)?.getTime() ?? 0;
    const bDate = parseFoundDate(b.foundTimestamp)?.getTime() ?? 0;
    return orderDir === 'asc' ? aDate - bDate : bDate - aDate;
  });
};

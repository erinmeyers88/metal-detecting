'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createMockSites, DEFAULT_CENTER, type MockSite } from '@/app/lib/mock/site';
import { createMockFinds, type MockFind } from '@/app/lib/mock/find';
import { useUserLocation } from './UserLocationProvider';

type MockDataContextValue = {
  sites: MockSite[];
  finds: MockFind[];
  setSites: React.Dispatch<React.SetStateAction<MockSite[]>>;
  setFinds: React.Dispatch<React.SetStateAction<MockFind[]>>;
};

const MockDataContext = createContext<MockDataContextValue | null>(null);

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within MockDataProvider');
  }
  return context;
};

const seedKeyFromCenter = (center: { lat: number; lng: number }) =>
  `${Math.round(center.lat * 1000)}:${Math.round(center.lng * 1000)}`;

const buildMockData = (center: { lat: number; lng: number }) => {
  const sites = createMockSites(center).map((site) => ({ ...site, finds: [] }));
  const sitesById = new Map(sites.map((site) => [site.id, site]));
  const finds = createMockFinds(sites, center).map((find) => {
    const site = sitesById.get(find.site.id) ?? find.site;
    return { ...find, site };
  });
  finds.forEach((find) => {
    const site = sitesById.get(find.site.id);
    if (site) {
      site.finds.push(find);
    }
  });
  return { sites, finds };
};

type MockDataProviderProps = {
  children: React.ReactNode;
};

export default function MockDataProvider({ children }: MockDataProviderProps) {
  const { location } = useUserLocation();
  const initialData = useMemo(() => buildMockData(DEFAULT_CENTER), []);
  const [sites, setSites] = useState<MockSite[]>(initialData.sites);
  const [finds, setFinds] = useState<MockFind[]>(initialData.finds);
  const [seedKey, setSeedKey] = useState(() => seedKeyFromCenter(DEFAULT_CENTER));

  useEffect(() => {
    if (!location) {
      return;
    }
    const center = { lat: location.latitude, lng: location.longitude };
    const nextSeedKey = seedKeyFromCenter(center);
    if (nextSeedKey === seedKey) {
      return;
    }
    const nextData = buildMockData(center);
    setSites(nextData.sites);
    setFinds(nextData.finds);
    setSeedKey(nextSeedKey);
  }, [location, seedKey]);

  const value = useMemo(
    () => ({
      sites,
      finds,
      setSites,
      setFinds,
    }),
    [sites, finds]
  );

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>;
}

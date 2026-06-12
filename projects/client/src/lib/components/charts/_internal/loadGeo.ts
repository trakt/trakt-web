import type { ChoroplethChartOptions } from '@carbon/charts-svelte';
import geoAssetUrl from '../assets/world-countries-50m.topojson?url';

type GeoData = ChoroplethChartOptions['geoData'];

// Shared across CountryMap instances so the topology is fetched once, not per instance.
const geoCache: Record<string, Promise<GeoData>> = {};

export function loadGeo(): Promise<GeoData> {
  const cached = geoCache[geoAssetUrl];
  if (cached) return cached;

  const pending = fetch(geoAssetUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch map geometry: ${response.statusText}`,
        );
      }
      return response.json() as Promise<GeoData>;
    })
    .catch((error) => {
      console.error('Failed to load country map geometry:', error);
      // Drop the rejected promise so a remount can retry instead of
      // permanently serving the cached failure.
      delete geoCache[geoAssetUrl];
      throw error;
    });
  geoCache[geoAssetUrl] = pending;
  return pending;
}

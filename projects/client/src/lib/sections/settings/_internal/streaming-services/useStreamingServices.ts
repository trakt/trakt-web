import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { StreamingSource } from '$lib/requests/models/StreamingSource.ts';
import { saveStreamingPreferencesRequest } from '$lib/requests/queries/services/saveStreamingPreferencesRequest.ts';
import { streamingSourcesQuery } from '$lib/requests/queries/services/streamingSourcesQuery.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { combineLatest, map } from 'rxjs';
import { toFavoriteId } from './toFavoriteId.ts';

export function useStreamingServices() {
  const { country, favorites } = useStreamingPreferences();
  const { invalidate } = useInvalidator();

  const sources = useQuery(streamingSourcesQuery()).pipe(
    map((query) => query.data ?? new Map<string, StreamingSource[]>()),
  );

  const availableCountries = sources.pipe(
    map((sourceMap) => [...sourceMap.keys()]),
  );

  const countrySources = combineLatest([country, sources]).pipe(
    map(([countryCode, sourceMap]) => sourceMap.get(countryCode) ?? []),
  );

  const favoriteSources = combineLatest([country, favorites, sources]).pipe(
    map(([countryCode, favoriteIds, sourceMap]) => {
      const favoriteSet = new Set(favoriteIds);
      return (sourceMap.get(countryCode) ?? []).filter((source) =>
        favoriteSet.has(toFavoriteId(countryCode, source.source))
      );
    }),
  );

  const setCountry = async (nextCountry: string) => {
    await saveStreamingPreferencesRequest({ country: nextCountry });
    await invalidate(InvalidateAction.User.Settings);
  };

  const saveFavorites = async (forCountry: string, sourceSlugs: string[]) => {
    // Only ever persist favorites for the currently selected country - the
    // payload fully replaces the stored list, so other countries are not sent.
    const next = sourceSlugs.map((slug) => toFavoriteId(forCountry, slug));

    await saveStreamingPreferencesRequest({ favorites: next });
    await invalidate(InvalidateAction.User.Settings);
  };

  return {
    country,
    favorites,
    availableCountries,
    countrySources,
    favoriteSources,
    setCountry,
    saveFavorites,
  };
}

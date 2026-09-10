import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { saveStreamingPreferencesRequest } from '$lib/requests/queries/services/saveStreamingPreferencesRequest.ts';
import { streamingSourcesQuery } from '$lib/requests/queries/services/streamingSourcesQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { combineLatest, map } from 'rxjs';
import { toFavoriteId } from './toFavoriteId.ts';

export function useStreamingServices() {
  const { country, favorites } = useStreamingPreferences();

  const savePreferences = useMutation(defineMutation({
    key: 'streaming:save-preferences',
    request: (
      preferences: Parameters<typeof saveStreamingPreferencesRequest>[0],
    ) => saveStreamingPreferencesRequest(preferences),
    invalidations: [InvalidateAction.User.Settings],
  }));

  const sources = useQuery(streamingSourcesQuery()).pipe(
    map((query) => query.data),
  );

  const availableCountries = sources.pipe(
    map((sourceMap) => sourceMap ? [...sourceMap.keys()] : undefined),
  );

  const countrySources = combineLatest([country, sources]).pipe(
    map(([countryCode, sourceMap]) =>
      sourceMap ? (sourceMap.get(countryCode) ?? []) : undefined
    ),
  );

  const favoriteSources = combineLatest([country, favorites, sources]).pipe(
    map(([countryCode, favoriteIds, sourceMap]) => {
      if (!sourceMap) return undefined;
      const favoriteSet = new Set(favoriteIds);
      return (sourceMap.get(countryCode) ?? []).filter((source) =>
        favoriteSet.has(toFavoriteId(countryCode, source.source))
      );
    }),
  );

  const setCountry = async (nextCountry: string) => {
    await savePreferences.mutate({ country: nextCountry });
  };

  const saveFavorites = async (forCountry: string, sourceSlugs: string[]) => {
    // Only ever persist favorites for the currently selected country - the
    // payload fully replaces the stored list, so other countries are not sent.
    const next = sourceSlugs.map((slug) => toFavoriteId(forCountry, slug));

    await savePreferences.mutate({ favorites: next });
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

import { useQuery } from '$lib/features/query/useQuery.ts';
import { streamingSourcesQuery } from '$lib/requests/queries/services/streamingSourcesQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { combineLatest, map, of } from 'rxjs';

export function useStreamingServices(country?: string) {
  const { country: userCountry, showOnlyFavorites, favorites } =
    useStreamingPreferences();
  const query = useQuery(streamingSourcesQuery({}));

  const activeCountry = country ? of(country) : userCountry;
  const activeShowOnlyFavorites = country ? of(false) : showOnlyFavorites;

  return {
    sources: combineLatest([
      activeCountry,
      activeShowOnlyFavorites,
      favorites,
      query,
    ]).pipe(
      map(([countryCode, onlyFavorites, userFavorites, $query]) => {
        const services = $query.data?.get(countryCode) ?? [];

        if (!onlyFavorites) {
          return services;
        }

        return services.filter((service) =>
          userFavorites.includes(service.source)
        );
      }),
    ),
  };
}

import { useQuery } from '$lib/features/query/useQuery.ts';
import { streamingSourcesQuery } from '$lib/requests/queries/services/streamingSourcesQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { combineLatest, map, type Observable, startWith } from 'rxjs';
import { buildStreamingServiceOptions } from './buildStreamingServiceOptions.ts';

type StreamingServiceOption = {
  source: string;
  name: string;
  hasLogo: boolean;
};

type StreamingBrandOption = {
  key: string;
  name: string;
  source: string;
  color: string | undefined;
  slugs: string[];
  hasLogo: boolean;
};

type StreamingServiceOptions = {
  all: StreamingServiceOption[];
  top: StreamingBrandOption[];
  hasFavorites: boolean;
};

const emptyStreamingServiceOptions: StreamingServiceOptions = {
  all: [],
  top: [],
  hasFavorites: false,
};

export function useStreamingServiceOptions(): Observable<
  StreamingServiceOptions
> {
  const { country, favorites } = useStreamingPreferences();
  const query = useQuery(streamingSourcesQuery());

  return combineLatest([country, favorites, query]).pipe(
    map(([countryCode, $favorites, $query]) => {
      return buildStreamingServiceOptions({
        countryCode,
        favorites: $favorites,
        sourceMap: $query.data ?? new Map(),
      });
    }),
    startWith(emptyStreamingServiceOptions),
  );
}

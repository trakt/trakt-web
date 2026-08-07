import { useQuery } from '$lib/features/query/useQuery.ts';
import { streamingSourcesQuery } from '$lib/requests/queries/services/streamingSourcesQuery.ts';
import { map, type Observable } from 'rxjs';
import { cleanStreamingServiceName } from './_internal/cleanStreamingServiceName.ts';

/**
 * Emits a lookup of streaming `source` id to its cleaned, user-facing display
 * name (mirrors what {@link useStreamingServiceLogo} renders per service).
 * Callers use it to search/filter services by the name the user actually sees.
 */
export function useStreamingServiceNames(): Observable<
  ReadonlyMap<string, string>
> {
  const query = useQuery(streamingSourcesQuery({}));

  return query.pipe(
    map(($query) => {
      const sources = Array.from($query.data?.values() ?? []).flat();

      return new Map(
        sources.map(
          (source) =>
            [source.source, cleanStreamingServiceName(source.name)] as const,
        ),
      );
    }),
  );
}

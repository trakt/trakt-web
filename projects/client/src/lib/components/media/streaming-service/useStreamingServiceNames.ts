import { useQuery } from '$lib/features/query/useQuery.ts';
import { streamingSourcesQuery } from '$lib/requests/queries/services/streamingSourcesQuery.ts';
import { map, type Observable } from 'rxjs';
import { cleanStreamingServiceName } from './_internal/cleanStreamingServiceName.ts';

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

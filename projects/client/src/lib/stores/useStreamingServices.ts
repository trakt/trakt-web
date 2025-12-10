import { useQuery } from '$lib/features/query/useQuery.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';
import { streamingSourcesQuery } from '../requests/queries/services/streamingSourcesQuery.ts';

export function useStreamingServices(country: string) {
  const streamingSources = useQuery(streamingSourcesQuery({}));
  const streamingSources$ = toObservable(streamingSources);

  return {
    sources: streamingSources$.pipe(
      map(
        (s) => s.data?.get(country) ?? [],
      ),
    ),
  };
}

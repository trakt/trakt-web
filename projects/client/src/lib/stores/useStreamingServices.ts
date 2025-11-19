import { useQuery } from '$lib/features/query/useQuery.ts';
import { derived } from 'svelte/store';
import { streamingSourcesQuery } from '../requests/queries/services/streamingSourcesQuery.ts';

export function useStreamingServices(country: string) {
  const streamingSources = useQuery(streamingSourcesQuery({}));

  return {
    sources: derived(
      streamingSources,
      ($streamingSources) => $streamingSources.data?.get(country) ?? [],
    ),
  };
}

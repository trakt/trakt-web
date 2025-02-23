import { useQuery } from '$lib/features/query/useQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { derived } from 'svelte/store';
import { streamingSourcesQuery } from '../requests/queries/services/streamingSourcesQuery.ts';

export function useStreamingServices() {
  const { country } = useStreamingPreferences();
  const streamingSources = useQuery(streamingSourcesQuery({}));

  return {
    sources: derived(
      [streamingSources, country],
      ([$streamingSources, $country]) =>
        $streamingSources.data?.get($country) ?? [],
    ),
  };
}

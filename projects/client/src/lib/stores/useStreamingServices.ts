import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { getLanguageAndRegion } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { derived, get } from 'svelte/store';
import { streamingSourcesQuery } from '../requests/queries/services/streamingSourcesQuery.ts';

export function useStreamingServices() {
  const { user } = useUser();
  const { region } = getLanguageAndRegion();

  const services = get(user)?.services;
  const country = services?.country ?? region;

  const streamingSources = useQuery(streamingSourcesQuery({}));

  return {
    sources: derived(
      streamingSources,
      ($streamingSources) => $streamingSources.data?.get(country) ?? [],
    ),
  };
}

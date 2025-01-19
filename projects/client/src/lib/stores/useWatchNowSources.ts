import { useUser } from '$lib/features/auth/stores/useUser';
import { getLanguageAndRegion } from '$lib/features/i18n';
import { watchNowSourcesQuery } from '$lib/requests/queries/watchnow/watchNowSourcesQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export function useWatchNowSources() {
  const { current } = useUser();
  const { region } = getLanguageAndRegion();

  const { watchNow: watchNowSettings } = current();
  const country = watchNowSettings.country ?? region;

  const watchNowSources = createQuery({
    ...watchNowSourcesQuery({}),
    staleTime: Infinity,
  });

  return {
    sources: derived(
      watchNowSources,
      ($watchNowSources) => $watchNowSources.data?.get(country) ?? [],
    ),
  };
}

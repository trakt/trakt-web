import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { getLanguageAndRegion } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { watchNowSourcesQuery } from '$lib/requests/queries/watchnow/watchNowSourcesQuery.ts';
import { derived } from 'svelte/store';

export function useWatchNowSources() {
  const { current } = useUser();
  const { region } = getLanguageAndRegion();

  const { watchNow: watchNowSettings } = current();
  const country = watchNowSettings.country ?? region;

  const watchNowSources = useQuery(watchNowSourcesQuery({}));

  return {
    sources: derived(
      watchNowSources,
      ($watchNowSources) => $watchNowSources.data?.get(country) ?? [],
    ),
  };
}

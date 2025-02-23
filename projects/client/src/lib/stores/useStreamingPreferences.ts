import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { getLanguageAndRegion } from '$lib/features/i18n/index.ts';
import type { StreamingServiceOptions } from '$lib/requests/models/StreamingServiceOptions.ts';
import { findPreferredStreamingService } from '$lib/stores/_internal/findPreferredStreamingService.ts';
import { derived, get } from 'svelte/store';

export function useStreamingPreferences() {
  const { user } = useUser();
  const { region } = getLanguageAndRegion();

  const country = derived(user, ($user) => $user?.services?.country ?? region);
  const favorites = derived(user, ($user) => $user?.services?.favorites ?? []);

  return {
    country,
    getPreferred: (services: StreamingServiceOptions) =>
      findPreferredStreamingService({
        services,
        favorites: get(favorites),
        countryCode: get(country),
      }),
  };
}

import { goto } from '$app/navigation';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { FilterKey } from '$lib/features/filters/models/Filter.ts';
import type { FilterMode } from '$lib/features/filters/models/FilterMode.ts';

type GoToFilteredStateProps = {
  key: FilterKey;
  value: string | null;
  mode: FilterMode;
};

export function useFilterSetter() {
  const { track } = useTrack(AnalyticsEvent.Filter);

  return {
    gotoFilteredState: ({ key, value, mode }: GoToFilteredStateProps) => {
      const url = new URL(globalThis.window.location.href);

      if (!value) {
        track({ id: key, action: 'reset', mode });
        url.searchParams.delete(key);
        goto(url, { keepFocus: true, replaceState: true });
        return;
      }

      track({ id: key, action: 'set', mode });
      url.searchParams.set(key, value);
      goto(url, { keepFocus: true, replaceState: true });
    },
  };
}

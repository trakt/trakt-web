import { goto } from '$app/navigation';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { FilterKey } from '$lib/features/filters/models/Filter.ts';

type GoToFilteredStateProps = {
  key: FilterKey;
  value: string | null;
};

export function useFilterSetter() {
  const { track } = useTrack(AnalyticsEvent.Filter);

  return {
    gotoFilteredState: ({ key, value }: GoToFilteredStateProps) => {
      const url = new URL(globalThis.window.location.href);

      if (!value) {
        track({ id: key, action: 'reset' });
        url.searchParams.delete(key);
        goto(url, { keepFocus: true, replaceState: true });
        return;
      }

      track({ id: key, action: 'set' });
      url.searchParams.set(key, value);
      goto(url, { keepFocus: true, replaceState: true });
    },
  };
}

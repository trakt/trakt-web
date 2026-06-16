import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useCollapsedSection } from '$lib/stores/useCollapsedSection.ts';

const ITEM_PREFIX = 'list_collapsed';

export function useCollapsedList(listId: string) {
  const { track } = useTrack(AnalyticsEvent.Collapse);

  const { isCollapsed, toggle } = useCollapsedSection(
    `${ITEM_PREFIX}_${listId}`,
  );

  let collapsed = false;
  isCollapsed.subscribe((v) => (collapsed = v));

  return {
    isCollapsed,
    toggle: () => {
      console.log('TOGGLE', collapsed);
      track({
        action: collapsed ? 'expand' : 'collapse',
        source: listId,
      });
      toggle();
    },
  };
}

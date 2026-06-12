import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { activityEntryTargets } from '$lib/features/intl-overlay/activityEntryTargets.ts';
import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SocialActivity } from '$lib/requests/models/SocialActivity.ts';
import { socialActivityQuery } from '$lib/requests/queries/users/socialActivityQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { map } from 'rxjs';
import { mapToActivityCalendar } from '../../stores/_internal/mapToActivityCalendar.ts';

type DateRange = {
  startDate: Date;
  endDate: Date;
};

type ActivityListProps =
  & {
    type: DiscoverMode;
    range?: DateRange;
  }
  & PaginationParams
  & FilterParams;

export function useActivityList(props: ActivityListProps) {
  const { list, isLoading: baseLoading, ...rest } = usePaginatedListQuery(
    socialActivityQuery({
      ...props,
      startDate: props.range?.startDate,
      endDate: props.range?.endDate,
    }),
  );

  const overlay = createBulkIntlOverlay<SocialActivity>({
    getTargets: activityEntryTargets,
  });

  const filteredList = list.pipe(
    overlay.operator,
    map(($list) => {
      if (!props.type || props.type === 'media') {
        return $list;
      }

      return $list.filter((entry) =>
        entry.type === props.type ||
        props.type === 'show' && entry.type === 'episode'
      );
    }),
  );

  const activityCalendar = filteredList.pipe(
    map((items) => mapToActivityCalendar(items, props.range?.startDate)),
  );

  return {
    list: filteredList,
    activityCalendar,
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
    ...rest,
  };
}

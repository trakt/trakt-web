import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
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
  const { list, ...rest } = usePaginatedListQuery(
    socialActivityQuery({
      ...props,
      startDate: props.range?.startDate,
      endDate: props.range?.endDate,
    }),
  );

  const filteredList = list.pipe(map(($list) => {
    if (!props.type || props.type === 'media') {
      return $list;
    }

    return $list.filter((entry) =>
      entry.type === props.type ||
      props.type === 'show' && entry.type === 'episode'
    );
  }));

  const activityCalendar = filteredList.pipe(
    map((items) => mapToActivityCalendar(items, props.range?.startDate)),
  );

  return {
    list: filteredList,
    activityCalendar,
    ...rest,
  };
}

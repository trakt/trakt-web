import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SocialActivity } from '$lib/requests/models/SocialActivity.ts';
import { activityHistoryQuery } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import { socialActivityQuery } from '$lib/requests/queries/users/socialActivityQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import type { HistoryEntry } from '$lib/sections/lists/stores/useRecentlyWatchedList.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import type { ActivityType } from '../models/ActivityType.ts';

type ActivityListProps = {
  activityType: ActivityType;
} & PaginationParams;

type ActivityEntry =
  | SocialActivity
  | HistoryEntry;

function typeToQuery(
  props: ActivityListProps,
) {
  const params = {
    limit: props.limit,
    page: props.page,
  };

  switch (props.activityType) {
    case 'social':
      return socialActivityQuery(params) as CreateQueryOptions<
        Paginatable<ActivityEntry>
      >;
    case 'personal':
      return activityHistoryQuery({
        ...params,
        slug: 'me',
      }) as CreateQueryOptions<
        Paginatable<ActivityEntry>
      >;
  }
}

export function useActivityList(props: ActivityListProps) {
  return usePaginatedListQuery(typeToQuery(props));
}

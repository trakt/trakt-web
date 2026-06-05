import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import {
  releasesCalendarQuery,
} from '$lib/requests/queries/calendars/releasesCalendarQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { map } from 'rxjs';
import { filterReleasesItems } from './_internal/filterReleasesItems.ts';

type UseReleasesItemsProps = {
  type: DiscoverMode;
  limit: number;
} & FilterParams;

const daysToFetch = 30;
const releasesSourceLimit = 20;

export function useReleasesItems(props: UseReleasesItemsProps) {
  const [yyyyMmDd] = new Date().toISOString().split('T');
  const startDate = assertDefined(
    yyyyMmDd,
    'Could not extract current date.',
  );

  const query = useQuery(
    releasesCalendarQuery({
      startDate,
      days: daysToFetch,
      type: props.type,
      filter: props.filter,
      filterOverride: props.filterOverride,
      sourceLimit: releasesSourceLimit,
    }),
  );

  const isLoading = query.pipe(map(($query) => $query.isLoading));

  const list = query.pipe(
    map(($query) =>
      filterReleasesItems({
        entries: $query.data ?? [],
        limit: props.limit,
        now: new Date(),
      })
    ),
  );

  return { list, isLoading };
}

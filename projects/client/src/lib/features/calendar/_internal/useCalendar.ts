import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import {
  type UpcomingEpisodeEntry,
  upcomingEpisodesQuery,
} from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { upcomingMoviesQuery } from '$lib/requests/queries/calendars/upcomingMoviesQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { isSameDay } from 'date-fns/isSameDay';
import { derived, type Readable } from 'svelte/store';
import type { DiscoverMode } from '../../discover/models/DiscoverMode.ts';
import type { CalendarEntry } from '../models/CalendarEntry.ts';

type CalendarItems = Array<MediaEntry | UpcomingEpisodeEntry>;

type UseCalendarParams = {
  start: Date;
  days: number;
  type: DiscoverMode;
};

type CalendarResult = {
  isLoading: Readable<boolean>;
  calendar: Readable<CalendarEntry[]>;
};

function typeToQueries({ start, days, type }: UseCalendarParams) {
  const [YYYY_MM_DD] = start.toISOString().split('T');

  const params = {
    startDate: assertDefined(YYYY_MM_DD, 'Could not extract start date.'),
    days,
  };

  switch (type) {
    case 'movie':
      return [
        upcomingMoviesQuery(params) as CreateQueryOptions<CalendarItems>,
      ];
    case 'show':
      return [
        upcomingEpisodesQuery(params) as CreateQueryOptions<CalendarItems>,
      ];
    case 'media':
      return [
        upcomingMoviesQuery(params) as CreateQueryOptions<CalendarItems>,
        upcomingEpisodesQuery(params) as CreateQueryOptions<CalendarItems>,
      ];
  }
}

export function useCalendar(
  props: UseCalendarParams,
): CalendarResult {
  const queries = typeToQueries(props)
    .map((query) => useQuery(query));

  const isLoading = derived(
    queries,
    ($queries) => $queries.some(toLoadingState),
  );

  const allItems = derived(queries, ($queries) => {
    return $queries.flatMap((query) => query.data ?? []).sort((a, b) => {
      return new Date(a.airDate).getTime() - new Date(b.airDate).getTime();
    });
  });

  return {
    isLoading,
    calendar: derived(
      allItems,
      ($allItems) => {
        return Array.from({ length: props.days }, (_, i) => {
          const date = new Date(props.start);
          date.setDate(props.start.getDate() + i);

          const items = $allItems.filter(
            (item) => isSameDay(item.airDate, date),
          );

          return { date, items };
        });
      },
    ),
  };
}

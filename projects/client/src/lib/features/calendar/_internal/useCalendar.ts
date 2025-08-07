import { useQuery } from '$lib/features/query/useQuery.ts';
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
import type { MediaEntry } from '../../../requests/models/MediaEntry.ts';
import type { CalendarEntry } from '../models/CalendarEntry.ts';

type CalendarItems = Array<MediaEntry | UpcomingEpisodeEntry>;

type UseCalendarParams = {
  start: Date;
  days: number;
};

type CalendarResult = {
  isLoading: Readable<boolean>;
  calendar: Readable<CalendarEntry[]>;
};

export function useCalendar(
  { start, days }: UseCalendarParams,
): CalendarResult {
  const [YYYY_MM_DD] = start.toISOString().split('T');

  const params = {
    startDate: assertDefined(YYYY_MM_DD, 'Could not extract start date.'),
    days,
  };

  const episodes = useQuery(
    upcomingEpisodesQuery(params) as CreateQueryOptions<CalendarItems>,
  );
  const movies = useQuery(
    upcomingMoviesQuery(params) as CreateQueryOptions<CalendarItems>,
  );

  const queries = [episodes, movies];

  const isLoading = derived(
    queries,
    ($queries) => $queries.some(toLoadingState),
  );

  const allItems = derived([movies, episodes], ([$movies, $episodes]) => {
    return [...$movies.data ?? [], ...$episodes.data ?? []].sort((a, b) => {
      return new Date(a.airDate).getTime() - new Date(b.airDate).getTime();
    });
  });

  return {
    isLoading,
    calendar: derived(
      allItems,
      ($allItems) => {
        return Array.from({ length: days }, (_, i) => {
          const date = new Date(start);
          date.setDate(start.getDate() + i);

          const items = $allItems.filter(
            (item) => isSameDay(item.airDate, date),
          );

          return { date, items };
        });
      },
    ),
  };
}

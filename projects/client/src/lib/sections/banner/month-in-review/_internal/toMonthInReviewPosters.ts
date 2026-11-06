import type { ActivityHistory } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import type { MonthInReviewPoster } from './MonthInReviewPoster.ts';

const POSTER_COUNT = 3;

function toMedia(entry: ActivityHistory) {
  return entry.type === 'movie' ? entry.movie : entry.show;
}

export function toMonthInReviewPosters(
  entries: ReadonlyArray<ActivityHistory>,
): MonthInReviewPoster[] {
  const media = dedupe((item) => item.key, entries.map(toMedia));

  return media
    .slice(0, POSTER_COUNT)
    .map((item) => ({ key: item.key, src: item.poster.url.thumb }));
}

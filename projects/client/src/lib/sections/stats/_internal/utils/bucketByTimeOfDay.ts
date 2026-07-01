import * as m from '$lib/features/i18n/messages.ts';
import type { PeakHoursBucket } from '$lib/sections/stats/_internal/models/PeakHoursBucket.ts';

const morningStartHour = 5;
const afternoonStartHour = 12;
const eveningStartHour = 17;
const lateNightStartHour = 22;

type BucketByTimeOfDayParams = {
  readonly movieDates: ReadonlyArray<Date>;
  readonly showDates: ReadonlyArray<Date>;
};

function timeBucketIndex(hour: number): number {
  if (hour >= morningStartHour && hour < afternoonStartHour) return 0;
  if (hour >= afternoonStartHour && hour < eveningStartHour) return 1;
  if (hour >= eveningStartHour && hour < lateNightStartHour) return 2;
  return 3;
}

function countPerBucket(dates: ReadonlyArray<Date>): ReadonlyArray<number> {
  return Array.from(
    { length: 4 },
    (_, i) => dates.filter((d) => timeBucketIndex(d.getHours()) === i).length,
  );
}

export function bucketByTimeOfDay(
  { movieDates, showDates }: BucketByTimeOfDayParams,
): ReadonlyArray<PeakHoursBucket> {
  const movies = countPerBucket(movieDates);
  const episodes = countPerBucket(showDates);

  const buckets: ReadonlyArray<
    Omit<PeakHoursBucket, 'movies' | 'episodes' | 'count'>
  > = [
    { label: m.text_stats_time_morning(), key: 'morning' },
    { label: m.text_stats_time_afternoon(), key: 'afternoon' },
    { label: m.text_stats_time_evening(), key: 'evening' },
    { label: m.text_stats_time_late_night(), key: 'night' },
  ];

  return buckets.map((bucket, i) => {
    const movieCount = movies.at(i) ?? 0;
    const episodeCount = episodes.at(i) ?? 0;
    return {
      ...bucket,
      movies: movieCount,
      episodes: episodeCount,
      count: movieCount + episodeCount,
    };
  });
}

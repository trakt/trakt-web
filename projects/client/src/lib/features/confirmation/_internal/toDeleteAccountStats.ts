import type { UserStats } from '$lib/requests/models/UserStats.ts';
import { getYearsDifference } from '$lib/utils/date/getYearsDifference.ts';

type ToDeleteAccountStatsParams = {
  joinedAt: Date | Nil;
  stats: UserStats | Nil;
  now: Date;
};

const toKnownCount = (count: number) => (count > 0 ? count : null);

export function toDeleteAccountStats({
  joinedAt,
  stats,
  now,
}: ToDeleteAccountStatsParams) {
  return {
    years: toKnownCount(joinedAt ? getYearsDifference(now, joinedAt) : 0),
    hours: toKnownCount(Math.floor((stats?.totalMinutes ?? 0) / 60)),
    plays: toKnownCount(stats?.totalPlays ?? 0),
  };
}

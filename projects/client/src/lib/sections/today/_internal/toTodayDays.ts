import { formatLocalDate } from '$lib/utils/date/formatLocalDate.ts';
import { subtractDays } from '$lib/utils/date/subtractDays.ts';
import type { TodayDayKind } from '../models/TodayDayKind.ts';

export const WEEK_DAY_KEY = 'week';

type TodayDay = Readonly<{
  key: string;
  kind: TodayDayKind;
  date: Date;
  isToday: boolean;
}>;

export function toTodayDays(now: Date): TodayDay[] {
  const yesterday = subtractDays(now, 1);

  return [
    { key: formatLocalDate(now), kind: 'today', date: now, isToday: true },
    {
      key: formatLocalDate(yesterday),
      kind: 'yesterday',
      date: yesterday,
      isToday: false,
    },
    { key: WEEK_DAY_KEY, kind: 'week', date: now, isToday: false },
  ];
}

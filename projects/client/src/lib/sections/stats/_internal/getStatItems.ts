import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { WAKING_HOURS_PER_DAY } from '$lib/sections/stats/_internal/constants/index.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toPercentage } from '$lib/utils/formatting/number/toPercentage.ts';
import type { PulseStat } from './models/PulseStat.ts';
import type { PulseStatItem } from './models/PulseStatItem.ts';
import type { WeekData } from './models/WeekData.ts';
import { computeDelta } from './utils/computeDelta.ts';
import { countUniqueDays } from './utils/countUniqueDays.ts';

function allDates(week: WeekData): readonly Date[] {
  return [...week.movieDates, ...week.showDates];
}

interface GetStatItemsParams {
  readonly thisWeek: WeekData;
  readonly lastWeek: WeekData;
  readonly mode: DiscoverMode;
}

export function getStatItems(
  { thisWeek, lastWeek, mode }: GetStatItemsParams,
): PulseStatItem[] {
  const locale = getLocale();
  const twAll = allDates(thisWeek);
  const lwAll = allDates(lastWeek);

  const twActiveDays = countUniqueDays(twAll);
  const twActiveDayCount = Math.max(twActiveDays, 1);
  const avgMinutesPerDay = twActiveDays > 0
    ? Math.round(thisWeek.totalMinutes / twActiveDayCount)
    : 0;
  const lastWeekActiveDays = countUniqueDays(lwAll);
  const lastWeekAvgMinutes = lastWeekActiveDays > 0
    ? Math.round(lastWeek.totalMinutes / Math.max(lastWeekActiveDays, 1))
    : 0;

  const wakingMinutesPerWeek = WAKING_HOURS_PER_DAY * 7 * 60;
  const screenTimeShareValue = wakingMinutesPerWeek > 0
    ? thisWeek.totalMinutes / wakingMinutesPerWeek
    : 0;
  const lastWeekShareValue = wakingMinutesPerWeek > 0
    ? lastWeek.totalMinutes / wakingMinutesPerWeek
    : 0;

  const commonStats: PulseStat[] = [
    {
      key: 'screenTimeTotal',
      rawValue: thisWeek.totalMinutes,
      value: toHumanDuration({ minutes: thisWeek.totalMinutes }, languageTag()),
      label: m.label_stats_screen_time_total(),
      tooltip: m.tooltip_stats_screen_time_total(),
      delta: computeDelta(thisWeek.totalMinutes, lastWeek.totalMinutes),
      deltaKind: 'time',
    },
    {
      key: 'screenTimeShare',
      rawValue: Math.round(screenTimeShareValue * 100),
      value: toPercentage(screenTimeShareValue, locale),
      label: m.label_stats_screen_time_share(),
      tooltip: m.tooltip_stats_screen_time_share(),
      delta: computeDelta(
        Math.round(screenTimeShareValue * 100),
        Math.round(lastWeekShareValue * 100),
      ),
      deltaKind: 'percentage',
    },
    {
      key: 'avgPerDay',
      rawValue: avgMinutesPerDay,
      value: toHumanDuration({ minutes: avgMinutesPerDay }, languageTag()),
      label: m.label_stats_avg_per_day(),
      tooltip: m.tooltip_stats_avg_per_day(),
      delta: computeDelta(avgMinutesPerDay, lastWeekAvgMinutes),
      deltaKind: 'time',
    },
  ];

  const movieStats: PulseStat[] = [
    {
      key: 'movieTime',
      rawValue: thisWeek.movieMinutes,
      value: toHumanDuration({ minutes: thisWeek.movieMinutes }, languageTag()),
      label: m.label_stats_movies(),
      tooltip: m.tooltip_stats_movies(),
      delta: computeDelta(thisWeek.movieMinutes, lastWeek.movieMinutes),
      deltaKind: 'time',
    },
  ];

  const showStats: PulseStat[] = [
    {
      key: 'showTime',
      rawValue: thisWeek.showMinutes,
      value: toHumanDuration({ minutes: thisWeek.showMinutes }, languageTag()),
      label: m.label_stats_shows(),
      tooltip: m.tooltip_stats_shows(),
      delta: computeDelta(thisWeek.showMinutes, lastWeek.showMinutes),
      deltaKind: 'time',
    },
  ];

  const stats = [...commonStats];
  if (mode === 'media' || mode === 'movie') {
    stats.push(...movieStats);
  }
  if (mode === 'media' || mode === 'show') {
    stats.push(...showStats);
  }

  return stats.map((stat) => ({
    type: 'stat',
    ...stat,
  }));
}

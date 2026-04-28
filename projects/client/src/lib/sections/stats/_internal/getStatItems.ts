import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toPercentage } from '$lib/utils/formatting/number/toPercentage.ts';
import type { PulseStat } from './models/PulseStat.ts';
import type { PulseStatItem } from './models/PulseStatItem.ts';
import type { WeekData } from './models/WeekData.ts';
import { rankStats, scoreStatWithContext, statScoreMax } from './rankStats.ts';
import { WAKING_HOURS_PER_DAY } from './useWeeklyPulse.ts';
import { computeDelta } from './utils/computeDelta.ts';
import { countUniqueDays } from './utils/countUniqueDays.ts';
import { normalizeScore } from './utils/normalizeScore.ts';

function allDates(week: WeekData): readonly Date[] {
  return [...week.movieDates, ...week.showDates];
}

interface GetStatItemsParams {
  readonly thisWeek: WeekData;
  readonly lastWeek: WeekData;
  readonly now: Date;
}

export function getStatItems(
  { thisWeek, lastWeek }: GetStatItemsParams,
): PulseStatItem[] {
  const locale = getLocale();
  const twAll = allDates(thisWeek);
  const lwAll = allDates(lastWeek);

  const thisWeekPeak = thisWeek.dailyMinutes.reduce(
    (best, minutes, dayIndex) =>
      minutes > best.minutes ? { dayIndex, minutes } : best,
    { dayIndex: 0, minutes: 0 },
  );
  const lastWeekPeak = lastWeek.dailyMinutes.reduce(
    (best, minutes, dayIndex) =>
      minutes > best.minutes ? { dayIndex, minutes } : best,
    { dayIndex: 0, minutes: 0 },
  );

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

  const candidates: PulseStat[] = [
    {
      key: 'screenTimeTotal',
      rawValue: thisWeek.totalMinutes,
      value: toHumanDuration({ minutes: thisWeek.totalMinutes }, languageTag()),
      label: m.label_stats_screen_time_total(),
      tooltip: m.tooltip_stats_screen_time_total(),
      delta: computeDelta(thisWeek.totalMinutes, lastWeek.totalMinutes),
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
    },
    {
      key: 'avgPerDay',
      rawValue: avgMinutesPerDay,
      value: toHumanDuration({ minutes: avgMinutesPerDay }, languageTag()),
      label: m.label_stats_avg_per_day(),
      tooltip: m.tooltip_stats_avg_per_day(),
      delta: computeDelta(avgMinutesPerDay, lastWeekAvgMinutes),
    },
    {
      key: 'activeDays',
      rawValue: twActiveDays,
      value: String(twActiveDays),
      label: m.label_stats_active_days(),
      tooltip: m.tooltip_stats_active_days(),
      delta: computeDelta(twActiveDays, countUniqueDays(lwAll)),
    },
    {
      key: 'longestBinge',
      rawValue: thisWeekPeak.minutes,
      value: toHumanDuration({ minutes: thisWeekPeak.minutes }, languageTag()),
      label: m.label_stats_best_day(),
      tooltip: m.tooltip_stats_best_day(),
      delta: computeDelta(thisWeekPeak.minutes, lastWeekPeak.minutes),
    },
  ];

  const rawCounts = new Map<string, number>();

  const rankedStats = rankStats(candidates, rawCounts);
  return rankedStats.map((stat) => ({
    type: 'stat',
    ...stat,
    score: normalizeScore(
      scoreStatWithContext(stat, rawCounts),
      statScoreMax,
    ),
  }));
}

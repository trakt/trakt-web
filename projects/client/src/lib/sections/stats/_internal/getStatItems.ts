import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { toHumanDayOfWeek } from '$lib/utils/formatting/date/toHumanDayOfWeek.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
import type { PulseStat } from './models/PulseStat.ts';
import type { PulseStatItem } from './models/PulseStatItem.ts';
import type { WeekData } from './models/WeekData.ts';
import { rankStats, scoreStatWithContext, statScoreMax } from './rankStats.ts';
import { computeDelta } from './utils/computeDelta.ts';
import { countUniqueDays } from './utils/countUniqueDays.ts';
import { dayOfWeekDate } from './utils/dayOfWeekDate.ts';
import { getBusiestDay } from './utils/getBusiestDay.ts';
import { maxPlaysInSingleDay } from './utils/maxPlaysInSingleDay.ts';
import { normalizeScore } from './utils/normalizeScore.ts';

function allDates(week: WeekData): readonly Date[] {
  return [...week.movieDates, ...week.showDates];
}

interface GetStatItemsParams {
  readonly thisWeek: WeekData;
  readonly lastWeek: WeekData;
  readonly now: Date;
}

function fmt(n: number): string {
  return toHumanNumber(n, languageTag());
}

export function getStatItems(
  { thisWeek, lastWeek, now }: GetStatItemsParams,
): PulseStatItem[] {
  const locale = getLocale();
  const twAll = allDates(thisWeek);
  const lwAll = allDates(lastWeek);

  const twBusiest = getBusiestDay(twAll);
  const lwBusiest = getBusiestDay(lwAll);

  const twBingeMax = maxPlaysInSingleDay(twAll);
  const lwBingeMax = maxPlaysInSingleDay(lwAll);

  const busiestValue = twBusiest
    ? toHumanDayOfWeek(dayOfWeekDate(twBusiest.dayIndex, now), locale)
    : '—';

  const busiestNote = lwBusiest
    ? m.text_stats_was_last_week({
      day: toHumanDayOfWeek(
        dayOfWeekDate(lwBusiest.dayIndex, now),
        locale,
      ),
    })
    : undefined;

  const twActiveDays = countUniqueDays(twAll);

  const candidates: PulseStat[] = [
    {
      key: 'totalPlays',
      rawValue: twAll.length,
      value: fmt(twAll.length),
      label: m.label_stats_plays(),
      tooltip: m.tooltip_stats_plays(),
      delta: computeDelta(twAll.length, lwAll.length),
    },
    {
      key: 'episodes',
      rawValue: thisWeek.showDates.length,
      value: fmt(thisWeek.showDates.length),
      label: m.label_stats_episodes(),
      tooltip: m.tooltip_stats_episodes(),
      delta: computeDelta(thisWeek.showDates.length, lastWeek.showDates.length),
    },
    {
      key: 'movies',
      rawValue: thisWeek.movieDates.length,
      value: fmt(thisWeek.movieDates.length),
      label: m.label_stats_movies(),
      tooltip: m.tooltip_stats_movies(),
      delta: computeDelta(
        thisWeek.movieDates.length,
        lastWeek.movieDates.length,
      ),
    },
    {
      key: 'shows',
      rawValue: thisWeek.uniqueShows,
      value: fmt(thisWeek.uniqueShows),
      label: m.label_stats_shows(),
      tooltip: m.tooltip_stats_shows(),
      delta: computeDelta(thisWeek.uniqueShows, lastWeek.uniqueShows),
    },
    {
      key: 'activeDays',
      rawValue: twActiveDays,
      value: fmt(twActiveDays),
      label: m.label_stats_active_days(),
      tooltip: m.tooltip_stats_active_days(),
      delta: computeDelta(
        twActiveDays,
        countUniqueDays(lwAll),
      ),
    },
    {
      key: 'busiestDay',
      rawValue: twBusiest?.count ?? 0,
      value: busiestValue,
      label: m.label_stats_busiest_day(),
      tooltip: m.tooltip_stats_busiest_day(),
      delta: null,
      note: busiestNote,
    },
    {
      key: 'longestBinge',
      rawValue: twBingeMax,
      value: fmt(twBingeMax),
      label: m.label_stats_best_day(),
      tooltip: m.tooltip_stats_best_day(),
      delta: computeDelta(twBingeMax, lwBingeMax),
    },
  ];

  if (thisWeek.ratings.length > 0 || lastWeek.ratings.length > 0) {
    candidates.push({
      key: 'ratings',
      rawValue: thisWeek.ratings.length,
      value: fmt(thisWeek.ratings.length),
      label: m.label_stats_ratings(),
      tooltip: m.tooltip_stats_ratings(),
      delta: computeDelta(thisWeek.ratings.length, lastWeek.ratings.length),
    });
  }

  const rawCounts = new Map<string, number>([
    ['totalPlays', twAll.length],
    ['episodes', thisWeek.showDates.length],
    ['movies', thisWeek.movieDates.length],
  ]);

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

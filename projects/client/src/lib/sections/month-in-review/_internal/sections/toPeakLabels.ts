import type { AvailableLanguage } from '$lib/features/i18n/index.ts';
import { toHumanHour } from '$lib/utils/formatting/date/toHumanHour.ts';

type ToPeakLabelsParams = {
  dailyPlays?: ReadonlyArray<number>;
  hourlyPlays?: ReadonlyArray<number>;
  year: number;
  month: number;
  locale: AvailableLanguage;
};

const indexOfMax = (values: ReadonlyArray<number>) =>
  values.some((value) => value > 0)
    ? values.indexOf(Math.max(...values))
    : undefined;

export function toPeakLabels({
  dailyPlays,
  hourlyPlays,
  year,
  month,
  locale,
}: ToPeakLabelsParams) {
  const dayIndex = dailyPlays ? indexOfMax(dailyPlays) : undefined;
  const hourIndex = hourlyPlays ? indexOfMax(hourlyPlays) : undefined;

  return {
    dayIndex,
    hourIndex,
    day:
      dayIndex === undefined
        ? undefined
        : new Intl.DateTimeFormat(locale, {
            weekday: 'short',
            day: 'numeric',
          }).format(new Date(year, month - 1, dayIndex + 1)),
    hour:
      hourIndex === undefined
        ? undefined
        : toHumanHour(new Date(year, month - 1, 1, hourIndex), locale),
  };
}

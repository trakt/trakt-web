import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { DAYS_IN_WEEK } from '$lib/utils/constants.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { addWeeks } from 'date-fns/addWeeks';
import { subWeeks } from 'date-fns/subWeeks';
import type { CalendarChunk } from '../models/CalendarChunk.ts';
import type { CalendarOrder } from '../models/CalendarOrder.ts';
import type { CalendarWindow } from '../models/CalendarWindow.ts';
import { dateKey } from './dateKey.ts';

type ToCalendarChunksParams = {
  range: CalendarWindow;
  weeksPerStep: number;
  order: CalendarOrder;
  locale: AvailableLocale;
  upperBound?: Date;
  lowerBound?: Date;
  minLater?: number;
};

export function toCalendarChunks({
  range,
  weeksPerStep,
  order,
  locale,
  upperBound,
  lowerBound,
  minLater = 0,
}: ToCalendarChunksParams): ReadonlyArray<CalendarChunk> {
  const anchor =
    upperBound && range.anchor > upperBound ? upperBound : range.anchor;
  const anchorWeek = getStartOfWeek(anchor, locale);
  const anchorChunk =
    order === 'reverse-chronological'
      ? subWeeks(anchorWeek, weeksPerStep - 1)
      : anchorWeek;
  const later = Math.max(range.later, minLater);

  return Array.from(
    { length: range.earlier + later + 1 },
    (_, index) => index - range.earlier,
  )
    .map((offset) => ({
      offset,
      start: addWeeks(anchorChunk, offset * weeksPerStep),
    }))
    .filter(
      ({ offset, start }) => offset === 0 || !upperBound || start <= upperBound,
    )
    .filter(
      ({ offset, start }) =>
        offset >= 0 ||
        !lowerBound ||
        addWeeks(start, weeksPerStep) > lowerBound,
    )
    .map(({ offset, start }) => ({
      key: dateKey(start),
      start,
      days: weeksPerStep * DAYS_IN_WEEK,
      isAnchor: offset === 0,
    }));
}

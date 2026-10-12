import * as m from '$lib/features/i18n/messages.ts';

export function toCalendarItemCountLabel(count: number) {
  return count === 1
    ? m.calendar_day_item_count_one({ count })
    : m.calendar_day_item_count_other({ count });
}

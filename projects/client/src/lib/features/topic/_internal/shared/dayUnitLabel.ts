import { m } from '$lib/features/i18n/messages.ts';

export function dayUnitLabel(days: number) {
  return days === 1
    ? m.text_topic_unit_day_one()
    : m.text_topic_unit_day_other();
}

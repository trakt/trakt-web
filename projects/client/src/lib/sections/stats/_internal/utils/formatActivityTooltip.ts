import * as m from '$lib/features/i18n/messages.ts';

type FormatActivityTooltipParams = {
  now: Date;
  date: Date;
  count: number;
  locale: string;
};

export function formatActivityTooltip(
  { now, date, count, locale }: FormatActivityTooltipParams,
): string {
  const label = date.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  if (date > now) {
    return m.tooltip_text_future_activity({ day: label });
  }

  if (count === 0) return label;
  return `${label} • ${count} ${m.tag_text_watched()}`;
}

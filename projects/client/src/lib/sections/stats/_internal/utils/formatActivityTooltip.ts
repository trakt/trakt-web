type FormatActivityTooltipParams = {
  date: Date;
  count: number;
  locale: string;
};

export function formatActivityTooltip(
  { date, count, locale }: FormatActivityTooltipParams,
): string {
  const label = date.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  if (count === 0) return label;
  return `${label} · ${count} ${count === 1 ? 'watch' : 'watches'}`;
}

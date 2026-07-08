const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string): Intl.NumberFormat {
  const cached = formatterCache.get(locale);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  formatterCache.set(locale, formatter);

  return formatter;
}

export function toIMDBRating(rating: number, locale: string): string {
  return getFormatter(locale).format(rating);
}

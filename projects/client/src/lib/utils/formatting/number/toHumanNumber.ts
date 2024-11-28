export function toHumanNumber(value: number, locale = 'en') {
  const formatter = Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  });

  return formatter.format(value);
}

export function toPercentage(value: number, locale = 'en') {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value);
}

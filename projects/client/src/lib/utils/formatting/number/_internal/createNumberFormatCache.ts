export function createNumberFormatCache(options: Intl.NumberFormatOptions) {
  const formatters = new Map<string, Intl.NumberFormat>();

  return (intlLocale: string): Intl.NumberFormat => {
    const cached = formatters.get(intlLocale);
    if (cached) return cached;

    const formatter = new Intl.NumberFormat(intlLocale, options);
    formatters.set(intlLocale, formatter);

    return formatter;
  };
}

type ToChangeParams = {
  current: number;
  previous: number;
  locale: string;
};

export function toChange({ current, previous, locale }: ToChangeParams) {
  if (previous === 0) return null;

  const ratio = (current - previous) / previous;

  return {
    label: new Intl.NumberFormat(locale, {
      style: 'percent',
      maximumFractionDigits: 0,
      signDisplay: 'exceptZero',
    }).format(ratio),
    trend: ratio >= 0 ? ('up' as const) : ('down' as const),
  };
}

let formatter: Intl.NumberFormat | null = null;

export function formatNumber(value: number): string {
  formatter ??= new Intl.NumberFormat();
  return formatter.format(Math.round(value));
}

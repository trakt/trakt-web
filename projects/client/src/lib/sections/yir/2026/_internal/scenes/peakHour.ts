export function peakHour(hourly: ReadonlyArray<number>): number | null {
  if (hourly.length === 0) return null;

  return hourly.indexOf(Math.max(...hourly));
}

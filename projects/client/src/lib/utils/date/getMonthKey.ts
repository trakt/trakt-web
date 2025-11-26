export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

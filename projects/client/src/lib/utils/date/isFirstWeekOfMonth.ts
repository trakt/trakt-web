const WEEK_DAYS = 7;

export function isFirstWeekOfMonth(date: Date): boolean {
  const dayOfMonth = date.getDate();
  return dayOfMonth <= WEEK_DAYS;
}

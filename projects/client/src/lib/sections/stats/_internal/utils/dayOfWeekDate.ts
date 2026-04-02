export function dayOfWeekDate(dayIndex: number, now: Date): Date {
  const date = new Date(now);
  date.setDate(date.getDate() - ((date.getDay() - dayIndex + 7) % 7));
  return date;
}

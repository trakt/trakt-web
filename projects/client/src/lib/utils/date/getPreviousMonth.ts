export function getPreviousMonth(now: Date) {
  const date = new Date(now);
  date.setMonth(date.getMonth() - 1);

  return date;
}

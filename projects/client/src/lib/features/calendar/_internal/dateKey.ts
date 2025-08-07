export const DATE_KEY_PREFIX = 'calendar-day-';

export function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${DATE_KEY_PREFIX}${year}-${month}-${day}`;
}

const DAY_PREFIX = 'day-';

function parseDay(key: string | undefined) {
  const [year, month, date] = (key?.replace(DAY_PREFIX, '') ?? '')
    .split('-')
    .map(Number);
  if (!year || !month || !date) return null;
  return new Date(year, month - 1, date);
}

function fromDayAnchor(header: HTMLElement) {
  const anchor = header.closest<HTMLElement>(`[id^='${DAY_PREFIX}']`);
  return anchor ? parseDay(anchor.id) : null;
}

function fromWeekHead(header: HTMLElement) {
  const week = header.closest<HTMLElement>('[data-week-start]');
  const day = header.parentElement;
  const row = day?.parentElement;
  if (!week || !day || !row) return null;

  const start = parseDay(week.dataset.weekStart);
  const offset = [...row.children].indexOf(day);
  if (!start || offset < 0) return null;

  return new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate() + offset,
  );
}

export function calendarDate(header: HTMLElement) {
  return fromDayAnchor(header) ?? fromWeekHead(header);
}

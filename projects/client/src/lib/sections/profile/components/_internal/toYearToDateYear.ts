const JANUARY = 0;

export function toYearToDateYear(now: Date) {
  const year = now.getFullYear();

  return now.getMonth() === JANUARY ? year - 1 : year;
}

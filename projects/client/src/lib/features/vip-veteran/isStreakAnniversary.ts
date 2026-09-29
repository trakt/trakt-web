function isLeapYear(year: number) {
  return new Date(Date.UTC(year, 1, 29)).getUTCMonth() === 1;
}

function toAnniversaryDay(since: Date, year: number) {
  const isLeapDay = since.getUTCMonth() === 1 && since.getUTCDate() === 29;
  return isLeapDay && !isLeapYear(year) ? 28 : since.getUTCDate();
}

export function isStreakAnniversary(since: Date, today: Date): boolean {
  if (today.getUTCFullYear() <= since.getUTCFullYear()) return false;

  return today.getUTCMonth() === since.getUTCMonth() &&
    today.getUTCDate() === toAnniversaryDay(since, today.getUTCFullYear());
}

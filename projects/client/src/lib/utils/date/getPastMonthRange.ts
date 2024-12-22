export function getPastMonthRange(now: Date) {
  const startDate = new Date(now);
  startDate.setMonth(now.getMonth() - 1);

  return {
    startDate,
    endDate: now,
  };
}

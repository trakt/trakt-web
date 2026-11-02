export function toMonthRange(month: Date) {
  const year = month.getFullYear();
  const index = month.getMonth();

  return {
    startDate: new Date(year, index, 1),
    endDate: new Date(year, index + 1, 0, 23, 59, 59, 999),
  };
}

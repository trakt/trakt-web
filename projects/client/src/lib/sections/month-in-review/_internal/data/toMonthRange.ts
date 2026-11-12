type ToMonthRangeParams = {
  year: number;
  month: number;
};

export function toMonthRange({ year, month }: ToMonthRangeParams) {
  return {
    startDate: new Date(year, month - 1, 1),
    endDate: new Date(year, month, 1),
  };
}

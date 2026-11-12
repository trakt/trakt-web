type ToAdjacentMonthParams = {
  year: number;
  month: number;
  offset: 1 | -1;
};

export function toAdjacentMonth({
  year,
  month,
  offset,
}: ToAdjacentMonthParams) {
  const date = new Date(year, month - 1 + offset, 1);

  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

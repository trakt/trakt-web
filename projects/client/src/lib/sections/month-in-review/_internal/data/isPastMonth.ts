type IsPastMonthParams = {
  year: number;
  month: number;
  now?: Date;
};

export function isPastMonth({
  year,
  month,
  now = new Date(),
}: IsPastMonthParams) {
  return (
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth() + 1)
  );
}

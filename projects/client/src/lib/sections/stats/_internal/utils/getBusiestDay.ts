export function getBusiestDay(
  dates: ReadonlyArray<Date>,
): { readonly dayIndex: number; readonly count: number } | null {
  if (dates.length === 0) return null;

  const counts = dates.reduce((acc, d) => {
    const dow = d.getDay();
    acc.set(dow, (acc.get(dow) ?? 0) + 1);
    return acc;
  }, new Map<number, number>());

  return [...counts.entries()].reduce(
    (best, [day, count]) =>
      count > best.count ? { dayIndex: day, count } : best,
    { dayIndex: 0, count: 0 },
  );
}

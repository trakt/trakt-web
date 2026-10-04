import { time } from '$lib/utils/timing/time.ts';

type PickDailyEntryProps<T> = {
  entries: ReadonlyArray<T>;
  date: Date;
};

export function pickDailyEntry<T>(
  { entries, date }: PickDailyEntryProps<T>,
): T | undefined {
  if (entries.length === 0) return;

  const dayIndex = Math.floor(date.getTime() / time.days(1));

  return entries.at(dayIndex % entries.length);
}

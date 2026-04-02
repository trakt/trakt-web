import * as m from '$lib/features/i18n/messages.ts';

const morningStartHour = 5;
const afternoonStartHour = 12;
const eveningStartHour = 17;
const lateNightStartHour = 22;

function timeBucketIndex(hour: number): number {
  if (hour >= morningStartHour && hour < afternoonStartHour) return 0;
  if (hour >= afternoonStartHour && hour < eveningStartHour) return 1;
  if (hour >= eveningStartHour && hour < lateNightStartHour) return 2;
  return 3;
}

export function bucketByTimeOfDay(
  dates: ReadonlyArray<Date>,
): ReadonlyArray<{ readonly label: string; readonly count: number }> {
  const counts = Array.from(
    { length: 4 },
    (_, i) => dates.filter((d) => timeBucketIndex(d.getHours()) === i).length,
  );

  return [
    { label: m.text_stats_time_morning(), count: counts[0] ?? 0 },
    { label: m.text_stats_time_afternoon(), count: counts[1] ?? 0 },
    { label: m.text_stats_time_evening(), count: counts[2] ?? 0 },
    { label: m.text_stats_time_late_night(), count: counts[3] ?? 0 },
  ];
}

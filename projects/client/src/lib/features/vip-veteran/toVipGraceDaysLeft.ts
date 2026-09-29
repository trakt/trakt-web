import { time } from '$lib/utils/timing/time.ts';

const WARNING_DAYS = 14;

export function toVipGraceDaysLeft(
  graceEndsAt: Date | Nil,
  now: Date,
): number | null {
  if (!graceEndsAt) return null;

  const daysLeft = Math.ceil(
    (graceEndsAt.getTime() - now.getTime()) / time.days(1),
  );
  if (daysLeft < 1 || daysLeft > WARNING_DAYS) return null;

  return daysLeft;
}

/**
 * Whole years elapsed between `date` and `now`, counted on the calendar rather
 * than by averaging milliseconds - so an exact 10th anniversary reads as `10`,
 * not `9` (which `ms / 365.25days` produces once leap days drift in). Returns
 * `0` for a missing, invalid, or future date so it degrades gracefully as a
 * metric. UTC components keep it deterministic regardless of runtime timezone.
 */
export function toWholeYearsSince(
  date: Date | null | undefined,
  now: number,
): number {
  if (!date) {
    return 0;
  }

  const start = date.getTime();
  if (Number.isNaN(start) || start > now) {
    return 0;
  }

  const from = new Date(start);
  const to = new Date(now);

  const years = to.getUTCFullYear() - from.getUTCFullYear();

  const beforeAnniversary = to.getUTCMonth() < from.getUTCMonth() ||
    (to.getUTCMonth() === from.getUTCMonth() &&
      to.getUTCDate() < from.getUTCDate());

  return Math.max(0, beforeAnniversary ? years - 1 : years);
}

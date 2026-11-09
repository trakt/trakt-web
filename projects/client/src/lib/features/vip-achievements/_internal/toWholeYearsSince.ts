/**
 * Whole years from `since` to `now` (epoch milliseconds): the count only goes
 * up on the anniversary. `0` when the start date is unknown.
 */
export function toWholeYearsSince(since: Date | Nil, now: number): number {
  if (!since) {
    return 0;
  }

  const current = new Date(now);
  const years = current.getUTCFullYear() - since.getUTCFullYear();
  const hasReachedAnniversary =
    current.getUTCMonth() > since.getUTCMonth() ||
    (current.getUTCMonth() === since.getUTCMonth() &&
      current.getUTCDate() >= since.getUTCDate());

  return Math.max(0, hasReachedAnniversary ? years : years - 1);
}

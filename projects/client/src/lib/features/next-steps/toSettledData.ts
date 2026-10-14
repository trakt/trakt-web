type SettleableQuery<T> = {
  isPending: boolean;
  data?: T | undefined;
};

/**
 * `null` while the query is pending, then its data. A query that failed
 * settles on `fallback` so one broken source never leaves the card loading.
 */
export function toSettledData<T>(
  query: SettleableQuery<T>,
  fallback: T,
): T | null {
  if (query.isPending) return null;
  return query.data ?? fallback;
}

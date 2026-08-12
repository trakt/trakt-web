type SettleableQuery = {
  isPending: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
};

export function isQuerySettled(query: SettleableQuery): boolean {
  return !query.isPending && !query.isFetchingNextPage && !query.hasNextPage;
}

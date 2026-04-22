export type SyncState<T> = {
  status: T;
  processedCount: number;
  totalCount: number;
};

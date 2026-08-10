export type CustomFetchError = {
  status: number;
  message?: string;
  /** Query key of the request that failed (e.g. "query:plexServerAccounts"). */
  source?: string;
};

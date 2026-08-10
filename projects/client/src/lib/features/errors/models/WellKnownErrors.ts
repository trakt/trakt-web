export enum WellKnownErrorType {
  ServerError = 'ServerError',
  LockedAccountError = 'LockedAccountError',
  NotFoundError = 'NotFoundError',
  RateLimitError = 'RateLimitError',
}

export type WellKnownError = {
  type: WellKnownErrorType;
  message?: string;
  /** Query key of the request that failed (e.g. "query:plexServerAccounts"). */
  source?: string;
};

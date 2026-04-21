export enum WellKnownErrorType {
  ServerError = 'ServerError',
  LockedAccountError = 'LockedAccountError',
  NotFoundError = 'NotFoundError',
  RateLimitError = 'RateLimitError',
}

export type WellKnownError = {
  type: WellKnownErrorType;
  message?: string;
};

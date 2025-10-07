export enum WellKnownErrorType {
  ServerError = 'ServerError',
  LockedAccountError = 'LockedAccountError',
  NotFoundError = 'NotFoundError',
}

export type WellKnownError = {
  type: WellKnownErrorType;
  message?: string;
};

import { WellKnownError } from '../models/WellKnownErrors.ts';

export function mapToWellKnownError(
  statusCode: number,
): WellKnownError | undefined {
  switch (statusCode) {
    case 502:
    case 503:
      return WellKnownError.ServerError;
    case 423:
      return WellKnownError.LockedAccountError;
    default:
      return;
  }
}

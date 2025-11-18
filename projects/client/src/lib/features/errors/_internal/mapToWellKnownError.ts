import type { CustomFetchError } from '../models/CustomFetchError.ts';
import {
  type WellKnownError,
  WellKnownErrorType,
} from '../models/WellKnownErrors.ts';

function mapToWellKnownErrorType(statusCode: number) {
  switch (statusCode) {
    case 500:
    case 502:
    case 503:
      return WellKnownErrorType.ServerError;
    case 423:
      return WellKnownErrorType.LockedAccountError;
    case 404:
      return WellKnownErrorType.NotFoundError;
    default:
      return;
  }
}

export function mapToWellKnownError(
  error: CustomFetchError,
): WellKnownError | undefined {
  const errorType = mapToWellKnownErrorType(error.status);
  if (!errorType) {
    return;
  }

  return {
    type: errorType,
    message: error.message,
  };
}

import { isRateLimitError } from './isRateLimitError.ts';
import { LoginErrorType } from './models/LoginErrorType.ts';

export function mapToLoginError(error: unknown): LoginErrorType {
  return isRateLimitError(error)
    ? LoginErrorType.RateLimited
    : LoginErrorType.Unreachable;
}

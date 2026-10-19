import { isNetworkError } from '$lib/utils/requests/isNetworkError.ts';

function toStatus(error: unknown): number | null {
  if (typeof error !== 'object' || error === null) return null;
  if (!('response' in error)) return null;

  const response = Array.isArray(error.response)
    ? error.response.at(0)
    : error.response;
  if (typeof response !== 'object' || response === null) return null;
  if (!('status' in response)) return null;

  return typeof response.status === 'number' ? response.status : null;
}

export function toVipFailureCode(error: unknown): string {
  if (isNetworkError(error)) return 'network';

  const status = toStatus(error);
  return status === null ? 'unknown' : `http_${status}`;
}

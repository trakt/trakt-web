import { HttpStatusError } from './HttpStatusError.ts';

type StatusResponse = {
  status: number;
  headers?: Headers;
};

function hasStatus(value: unknown): value is StatusResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    typeof value.status === 'number'
  );
}

export function assertSuccessfulResponse<T>(response: T): T {
  if (!hasStatus(response)) return response;
  if (response.status >= 200 && response.status < 300) return response;

  throw new HttpStatusError({
    status: response.status,
    headers: response.headers,
  });
}

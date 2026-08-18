import { rawApiFetch } from '$lib/requests/api.ts';
import { error } from '$lib/utils/console/print.ts';
import { time } from '$lib/utils/timing/time.ts';
import { isAbortError, retryAsync } from 'ts-retry';
import { PAGE_LIMIT } from './constants.ts';

type FetchWithRetryParams = {
  url: string;
  page?: number;
  timeout?: number;
  retryDelay?: number;
  maxTry?: number;
};

const REQUEST_TIMEOUT_STATUS = 408;

class PermanentHttpError extends Error {
  constructor(status: number) {
    super(`HTTP ${status}`);
    this.name = 'PermanentHttpError';
  }
}

function toHttpError(status: number) {
  const isTransient = status >= 500 || status === REQUEST_TIMEOUT_STATUS;

  return isTransient
    ? new Error(`HTTP ${status}`)
    : new PermanentHttpError(status);
}

export function fetchWithRetry({
  url,
  page = 1,
  timeout = time.minutes(1),
  retryDelay = time.seconds(10),
  maxTry = 10,
}: FetchWithRetryParams): Promise<{
  json: unknown;
  paginationPageCount: number;
}> {
  return retryAsync(
    async () => {
      const pageUrl = url.includes('?')
        ? `${url}&page=${page}&limit=${PAGE_LIMIT}`
        : `${url}?page=${page}&limit=${PAGE_LIMIT}`;

      const response = await rawApiFetch({
        path: `/${pageUrl}`,
        init: { signal: AbortSignal.timeout(timeout) },
      });

      if (response.status === 429) {
        throw new Error('RateLimited');
      }

      if (!response.ok) {
        throw toHttpError(response.status);
      }

      const json = await response.json();

      const pageCount = Number.parseInt(
        response.headers.get('X-Pagination-Page-Count') ?? '',
      );

      return { json, paginationPageCount: pageCount || 1 };
    },
    {
      delay: retryDelay,
      maxTry,
      onError: (err) => {
        if (err instanceof PermanentHttpError) {
          error('Fetch failed, giving up', err);
          return false;
        }

        error('Fetch failed, retrying...', err);
        return undefined;
      },
    },
  ).catch((err: unknown) => {
    throw isAbortError(err) ? err.getError() : err;
  });
}

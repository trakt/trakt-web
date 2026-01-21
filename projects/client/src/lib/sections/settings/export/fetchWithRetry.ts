import { rawApiFetch } from '$lib/requests/api.ts';
import { retryAsync } from 'ts-retry';

export function fetchWithRetry(
  url: string,
  page = 1,
): Promise<{
  json: unknown;
  paginationPage: number;
  paginationPageCount: number;
}> {
  return retryAsync(
    async () => {
      const pageUrl = url.includes('?')
        ? `${url}&page=${page}&limit=1000`
        : `${url}?page=${page}&limit=1000`;

      const response = await rawApiFetch({ path: `/${pageUrl}` });

      if (response.status === 429) {
        throw new Error('RateLimited');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      const headers = response.headers;

      const paginationPage = parseInt(
        headers.get('X-Pagination-Page') || '1',
      );
      const paginationPageCount = parseInt(
        headers.get('X-Pagination-Page-Count') || '1',
      );

      return { json, paginationPage, paginationPageCount };
    },
    {
      delay: 10000,
      maxTry: 10,
      onError: (err) => {
        if (err.message === 'RateLimited') {
          // already updated status
        } else {
          console.error('Fetch failed, retrying...', err);
        }
        return undefined;
      },
    },
  );
}

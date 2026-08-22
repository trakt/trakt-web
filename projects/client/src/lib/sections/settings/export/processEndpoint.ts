import { PAGE_LIMIT } from './constants.ts';
import { fetchWithRetry } from './fetchWithRetry.ts';
import type { Pagination } from './models/Pagination.ts';

const MAX_PAGES = 10_000;
const MAX_UNREPORTED_PAGES = 100;

type ProcessEndpointOptions = {
  path: string;
  onPage: (data: unknown, pagination: Pagination) => Promise<void> | void;
  signal?: AbortSignal;
};

export async function processEndpoint({
  path,
  onPage,
  signal,
}: ProcessEndpointOptions): Promise<void> {
  for (let page = 1; page <= MAX_PAGES; page++) {
    const result = await fetchWithRetry({ url: path, page, signal });

    const entries = Array.isArray(result.json) ? result.json : null;
    const hasMorePages = page < result.paginationPageCount;
    const isPageFull = entries?.length === PAGE_LIMIT;
    const unreportedPages = Math.max(0, page - result.paginationPageCount);

    if (unreportedPages > 0 && entries?.length === 0) {
      return;
    }

    if (unreportedPages >= MAX_UNREPORTED_PAGES) {
      throw new Error(
        `Pagination for ${path} ran ${MAX_UNREPORTED_PAGES} pages past its reported page count`,
      );
    }

    const hasMore = hasMorePages || isPageFull;

    await onPage(result.json, {
      page,
      pageCount: Math.max(page, result.paginationPageCount),
      hasMore,
    });

    if (!hasMore) {
      return;
    }
  }

  throw new Error(
    `Pagination did not terminate for ${path} after ${MAX_PAGES} pages`,
  );
}

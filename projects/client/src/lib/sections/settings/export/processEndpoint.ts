import { fetchWithRetry } from './fetchWithRetry.ts';

const MAX_PAGES = 10_000;

export type Pagination = {
  page: number;
  pageCount: number;
};

export async function processEndpoint(
  path: string,
  onPage: (data: unknown, pagination: Pagination) => Promise<void> | void,
): Promise<void> {
  for (let page = 1; page <= MAX_PAGES; page++) {
    const result = await fetchWithRetry({ url: path, page });

    await onPage(result.json, {
      page,
      pageCount: result.paginationPageCount,
    });

    if (page >= result.paginationPageCount) {
      return;
    }
  }

  throw new Error(
    `Pagination did not terminate for ${path} after ${MAX_PAGES} pages`,
  );
}

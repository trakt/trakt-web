import { fetchWithRetry } from './fetchWithRetry.ts';

export type Pagination = {
  page: number;
  pageCount: number;
};

export async function processEndpoint(
  path: string,
  onPage: (data: unknown, pagination: Pagination) => Promise<void> | void,
  page = 1,
) {
  const result = await fetchWithRetry(path, page);

  await onPage(result.json, {
    page: result.paginationPage,
    pageCount: result.paginationPageCount,
  });

  if (result.paginationPage < result.paginationPageCount) {
    await processEndpoint(path, onPage, page + 1);
  }
}

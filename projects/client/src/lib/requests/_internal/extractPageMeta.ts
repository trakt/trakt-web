import type { PageMeta } from '../models/Paginatable.ts';

const DEFAULT_PAGE = '1';

export function extractPageMeta(headers: Headers): PageMeta {
  return {
    current: parseInt(headers.get('x-pagination-page') ?? DEFAULT_PAGE),
    total: parseInt(headers.get('x-pagination-page-count') ?? DEFAULT_PAGE),
  };
}

import type { PageMeta } from '../models/Paginatable.ts';

const DEFAULT_PAGE = '1';

function parseValue(headerValue: string | null): number {
  const parsed = parseInt(headerValue ?? DEFAULT_PAGE);
  const value = isNaN(parsed) ? parseInt(DEFAULT_PAGE) : parsed;
  return Math.max(1, value);
}

export function extractPageMeta(headers: Headers): PageMeta {
  const current = parseValue(headers.get('x-pagination-page'));
  const total = parseValue(headers.get('x-pagination-page-count'));

  return {
    current: Math.min(current, total),
    total,
  };
}

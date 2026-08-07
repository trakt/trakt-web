import type { PageMeta } from '../models/Paginatable.ts';

const DEFAULT_PAGE = '1';

function parseValue(headerValue: string | null): number {
  const parsed = parseInt(headerValue ?? DEFAULT_PAGE);
  const value = isNaN(parsed) ? parseInt(DEFAULT_PAGE) : parsed;
  return Math.max(1, value);
}

function parseItemCount(headerValue: string | null): number | undefined {
  if (headerValue === null) {
    return undefined;
  }

  const parsed = parseInt(headerValue);
  return isNaN(parsed) ? undefined : Math.max(0, parsed);
}

export function extractPageMeta(headers: Headers, fallbackPage = 1): PageMeta {
  const pageCountHeader = headers.get('x-pagination-page-count');

  if (pageCountHeader === null) {
    return {
      type: 'infinite',
      current: fallbackPage,
    };
  }

  const current = parseValue(headers.get('x-pagination-page'));
  const total = parseValue(pageCountHeader);
  const itemCount = parseItemCount(headers.get('x-pagination-item-count'));

  return {
    type: 'paginated',
    current: Math.min(current, total),
    total,
    itemCount,
  };
}

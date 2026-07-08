const DEFAULT_COUNT = 0;

/**
 * Reads the total item count from a paginated Trakt response via the
 * `x-pagination-item-count` header. Unlike {@link extractPageMeta}, which
 * exposes the number of pages, this returns the total number of items across
 * all pages - letting a `limit: 1` request act as a cheap count probe.
 */
export function extractItemCount(headers: Headers): number {
  const parsed = parseInt(headers.get('x-pagination-item-count') ?? '');
  return isNaN(parsed) ? DEFAULT_COUNT : Math.max(0, parsed);
}

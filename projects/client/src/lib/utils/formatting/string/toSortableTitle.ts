const leadingArticle = /^(?:the|an|a)\s+/i;

/**
 * Mirrors the sort key the API orders list items by.
 *
 * FIXME: clients should not have to re-derive this. The API should return a
 * `sort_title` on the entry so grouping reads the server's own key instead of
 * guessing at it, which also drops the English-only article list.
 */
export function toSortableTitle(title: string): string {
  return title.replace(leadingArticle, '');
}

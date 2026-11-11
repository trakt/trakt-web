import type { SearchResponse } from '$lib/features/search/models/SearchResponse.ts';

const MAX_REPORTED_RESULTS = 10;

const withYear = (title: string, year: number | null | undefined): string =>
  year != null ? `${title} (${year})` : title;

function toResultLines(response: SearchResponse): ReadonlyArray<string> {
  switch (response.type) {
    case 'media':
      return response.items.map(
        (item) =>
          `${item.type}: ${withYear(item.title, item.year)} [${item.slug}]`,
      );
    case 'people':
      return response.items.map(
        (item) => `person: ${item.name} [${item.slug}]`,
      );
    case 'lists':
      return response.items.map((item) => `list: ${item.name} [${item.slug}]`);
  }
}

export function toReportedSearchResults(
  response: SearchResponse | Nil,
): ReadonlyArray<string> {
  if (!response) return [];

  return toResultLines(response).slice(0, MAX_REPORTED_RESULTS);
}

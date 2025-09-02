import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';

type SearchTarget = {
  mode?: SearchMode;
};

function mapToSearchMode(value: string | null): SearchMode | undefined {
  switch (value) {
    case 'people':
      return 'people';
    case 'media':
      return 'media';
    case 'movie':
      return 'movie';
    case 'show':
      return 'show';
    default:
      return undefined;
  }
}

export function toSearchTarget(
  mode: string | null,
): SearchTarget {
  return {
    mode: mapToSearchMode(mode),
  };
}

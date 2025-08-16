import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';

type SearchTarget = {
  mode?: SearchMode;
  mediaType?: MediaType;
};

function mapToSearchMode(value: string | null): SearchMode | undefined {
  switch (value) {
    case 'people':
      return 'people';
    case 'media':
      return 'media';
    default:
      return undefined;
  }
}

function mapToMediaType(value: string | null): MediaType | undefined {
  switch (value) {
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
  type: string | null,
): SearchTarget {
  return {
    mode: mapToSearchMode(mode),
    mediaType: mapToMediaType(type),
  };
}

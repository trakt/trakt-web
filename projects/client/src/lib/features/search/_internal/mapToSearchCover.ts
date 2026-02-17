import type { SearchResponse } from '../models/SearchResponse.ts';

export function mapToSearchCover(response: SearchResponse | Nil) {
  if (!response) {
    return;
  }

  switch (response.type) {
    case 'media':
      return response.items.at(0)?.cover?.url.medium;
    case 'people':
      return response.items.at(0)?.headshot.url.medium;
    case 'lists':
      return response.items.at(0)?.posters.at(0)?.url.medium;
  }
}

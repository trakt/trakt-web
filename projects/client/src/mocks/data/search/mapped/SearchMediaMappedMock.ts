import type { MediaSearchResult } from '$lib/requests/queries/search/searchMediaQuery.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';

export const SearchMediaMappedMock: MediaSearchResult = {
  type: 'media',
  items: [
    { ...MovieHereticMappedMock, score: 110.041016 },
  ],
};

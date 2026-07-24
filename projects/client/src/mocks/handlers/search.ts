import { http, HttpResponse } from 'msw';

import { TrendingSearchedMoviesResponseMock } from '../data/search/response/TrendingSearchedMoviesResponseMock.ts';
import { TrendingSearchedShowsResponseMock } from '../data/search/response/TrendingSearchedShowsResponseMock.ts';
import { SearchHereticResponseMock } from '../data/search/response/SearchHereticResponseMock.ts';
import { MovieHereticResponseMock } from '../data/summary/movies/heretic/response/MovieHereticResponseMock.ts';

export const search = [
  http.get(
    'http://localhost/search/recent_by_id/global/movies',
    () => HttpResponse.json(TrendingSearchedMoviesResponseMock),
  ),
  http.get(
    'http://localhost/search/recent_by_id/global/shows',
    () => HttpResponse.json(TrendingSearchedShowsResponseMock),
  ),
  http.get(
    'http://localhost/search/*',
    ({ request }) => {
      const url = new URL(request.url);
      const searchQuery = url.searchParams.get('query');

      if (
        searchQuery?.toLowerCase() ===
          MovieHereticResponseMock.title.toLowerCase()
      ) {
        return HttpResponse.json(SearchHereticResponseMock);
      }

      return new HttpResponse(null, {
        status: 200,
      });
    },
  ),
];

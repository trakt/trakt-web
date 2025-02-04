import { http, HttpResponse } from 'msw';

import { SearchHereticResponseMock } from '../data/search/response/SearchHereticResponseMock.ts';
import { MovieHereticResponseMock } from '../data/summary/movies/heretic/response/MovieHereticResponseMock.ts';

export const search = [
  http.get(
    'http://localhost/search/*',
    ({ request }) => {
      const url = new URL(request.url);
      const searchQuery = url.searchParams.get('query');

      if (searchQuery === MovieHereticResponseMock.title) {
        return HttpResponse.json(SearchHereticResponseMock);
      }

      return new HttpResponse(null, {
        status: 200,
      });
    },
  ),
];

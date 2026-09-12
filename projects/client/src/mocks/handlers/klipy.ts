import { GifCategoriesResponseMock } from '$mocks/data/gifs/response/GifCategoriesResponseMock.ts';
import { GifTrendingResponseMock } from '$mocks/data/gifs/response/GifTrendingResponseMock.ts';
import { http, HttpResponse } from 'msw';

// The picker never talks to Klipy directly; it goes through our own proxy,
// which is what these handlers stand in for. Paths are relative because the
// proxy is same-origin - unlike the Trakt API, which has its own host.
export const klipy = [
  http.get(
    '/api/klipy/gifs/trending',
    () => HttpResponse.json(GifTrendingResponseMock),
  ),
  http.get(
    '/api/klipy/gifs/search',
    ({ request }) => {
      const query = new URL(request.url).searchParams.get('q');

      if (query !== 'thursday') {
        return HttpResponse.json({
          result: true,
          data: { data: [], current_page: 1, per_page: 24, has_next: false },
        });
      }

      return HttpResponse.json(GifTrendingResponseMock);
    },
  ),
  http.get(
    '/api/klipy/gifs/categories',
    () => HttpResponse.json(GifCategoriesResponseMock),
  ),
  http.post(
    '/api/klipy/gifs/share/*',
    () => new HttpResponse(null, { status: 204 }),
  ),
];

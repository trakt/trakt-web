import { GifCategoriesResponseMock } from '$mocks/data/gifs/response/GifCategoriesResponseMock.ts';
import { GifTrendingResponseMock } from '$mocks/data/gifs/response/GifTrendingResponseMock.ts';
import { http, HttpResponse } from 'msw';

const KLIPY_API = 'https://api.klipy.com/api/v1/:key';

export const klipy = [
  http.get(
    `${KLIPY_API}/gifs/trending`,
    () => HttpResponse.json(GifTrendingResponseMock),
  ),
  http.get(
    `${KLIPY_API}/gifs/search`,
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
    `${KLIPY_API}/gifs/categories`,
    () => HttpResponse.json(GifCategoriesResponseMock),
  ),
  http.post(
    `${KLIPY_API}/gifs/share/*`,
    () => new HttpResponse(null, { status: 204 }),
  ),
];

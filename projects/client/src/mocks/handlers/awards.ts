import { http, HttpResponse } from 'msw';
import { AwardCatalogResponseMock } from '../data/awards/response/AwardCatalogResponseMock.ts';
import { MovieOppenheimerAwardsResponseMock } from '$mocks/data/awards/response/MovieOppenheimerAwardsResponseMock.ts';
import { MoviePerfectDaysAwardsResponseMock } from '$mocks/data/awards/response/MoviePerfectDaysAwardsResponseMock.ts';
import { PersonGiamattiAwardsResponseMock } from '$mocks/data/awards/response/PersonGiamattiAwardsResponseMock.ts';
import { PersonStreepAwardsResponseMock } from '$mocks/data/awards/response/PersonStreepAwardsResponseMock.ts';
import { ShowShogunAwardsResponseMock } from '$mocks/data/awards/response/ShowShogunAwardsResponseMock.ts';

export const awards = [
  http.get('http://localhost/awards', () => {
    return HttpResponse.json(AwardCatalogResponseMock);
  }),
  http.get('http://localhost/movies/oppenheimer-2023/awards', () =>
    HttpResponse.json(MovieOppenheimerAwardsResponseMock),
  ),
  http.get('http://localhost/movies/perfect-days-2023/awards', () =>
    HttpResponse.json(MoviePerfectDaysAwardsResponseMock),
  ),
  http.get('http://localhost/movies/talk-to-me-2023/awards', () =>
    HttpResponse.json([]),
  ),
  http.get(
    'http://localhost/movies/unknown-title/awards',
    () => new HttpResponse(null, { status: 404 }),
  ),
  http.get('http://localhost/shows/shogun-2024/awards', () =>
    HttpResponse.json(ShowShogunAwardsResponseMock),
  ),
  http.get('http://localhost/people/meryl-streep/awards', () =>
    HttpResponse.json(PersonStreepAwardsResponseMock),
  ),
  http.get('http://localhost/people/paul-giamatti/awards', () =>
    HttpResponse.json(PersonGiamattiAwardsResponseMock),
  ),
];

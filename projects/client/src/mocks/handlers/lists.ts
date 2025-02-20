import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { ListedMoviesResponseMock } from '$mocks/data/lists/response/ListedMoviesResponseMock.ts';
import { ListedShowsResponseMock } from '$mocks/data/lists/response/ListedShowsResponseMock.ts';
import { HereticListsResponseMock } from '$mocks/data/summary/movies/heretic/response/HereticListsResponseMock.ts';
import { SiloListsResponseMock } from '$mocks/data/summary/shows/silo/response/SiloListsResponseMock.ts';
import { http, HttpResponse } from 'msw';

export const lists = [
  http.get(
    `http://localhost/lists/${
      assertDefined(SiloListsResponseMock.at(0)).ids.trakt
    }`,
    () => {
      return HttpResponse.json(SiloListsResponseMock[0]);
    },
  ),
  http.get(
    `http://localhost/lists/${
      assertDefined(SiloListsResponseMock.at(0)).ids.trakt
    }/items/movie,show*`,
    () => {
      return HttpResponse.json([
        ...ListedShowsResponseMock,
        ...ListedMoviesResponseMock,
      ]);
    },
  ),
  http.get(
    `http://localhost/lists/${
      assertDefined(SiloListsResponseMock.at(0)).ids.trakt
    }/items/show*`,
    () => {
      return HttpResponse.json(ListedShowsResponseMock);
    },
  ),
  http.get(
    `http://localhost/lists/${
      assertDefined(HereticListsResponseMock.at(0)).ids.trakt
    }/items/movie*`,
    () => {
      return HttpResponse.json(ListedMoviesResponseMock);
    },
  ),
];

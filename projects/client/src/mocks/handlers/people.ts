import { http, HttpResponse } from 'msw';

import { PersonFergusonResponseMock } from '../data/people/response/PersonFergusonResponseMock.ts';
import { PersonFergusonShowCreditsResponseMock } from '../data/people/response/PersonFergusonShowCreditsResponseMock.ts';
import { PersonGrantMovieCreditsResponseMock } from '../data/people/response/PersonGrantMovieCreditsResponseMock.ts';
import { PersonGrantResponseMock } from '../data/people/response/PersonGrantResponseMock.ts';

export const people = [
  http.get(
    `http://localhost/people/${PersonFergusonResponseMock.ids.slug}`,
    () => {
      return HttpResponse.json(PersonFergusonResponseMock);
    },
  ),
  http.get(
    `http://localhost/people/${PersonFergusonResponseMock.ids.slug}/shows`,
    () => {
      return HttpResponse.json(PersonFergusonShowCreditsResponseMock);
    },
  ),
  http.get(
    `http://localhost/people/${PersonGrantResponseMock.ids.slug}/movies`,
    () => {
      return HttpResponse.json(PersonGrantMovieCreditsResponseMock);
    },
  ),
];

import { http, HttpResponse } from 'msw';
import { RecommendedByResponseMock } from '../data/shares/response/RecommendedByResponseMock.ts';

export const shares = [
  http.get(
    'http://localhost/v3/shares/recommended',
    () => HttpResponse.json(RecommendedByResponseMock),
  ),
];

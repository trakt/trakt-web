import { MediaReactionsSummaryResponseMock } from '$mocks/data/reactions/response/MediaReactionsSummaryResponseMock.ts';
import { UserMediaReactionsResponseMock } from '$mocks/data/reactions/response/UserMediaReactionsResponseMock.ts';
import { http, HttpResponse } from 'msw';

export const reactions = [
  http.get(
    'http://localhost/v3/:type/:reference/reactions/summary',
    () => HttpResponse.json(MediaReactionsSummaryResponseMock),
  ),
  http.get(
    'http://localhost/v3/users/me/:type/:id',
    () => HttpResponse.json(UserMediaReactionsResponseMock),
  ),
  http.put(
    'http://localhost/v3/:type/:reference/reactions/:types',
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.delete(
    'http://localhost/v3/:type/:reference/reactions/:ids',
    () => new HttpResponse(null, { status: 204 }),
  ),
];

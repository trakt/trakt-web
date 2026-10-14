import { StreamingConnectionsResponseMock } from '$mocks/data/streaming-sync/response/StreamingConnectionsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';

/**
 * A free member who signed up and never used Trakt: nothing watched, listed
 * or commented, no service linked, and the VIP-only stats call refused.
 */
export function serveUnusedAccount() {
  server.use(
    http.get(
      'http://localhost/users/me/stats',
      () => new HttpResponse(null, { status: 403 }),
    ),
    http.get('http://localhost/users/me/history/', () => HttpResponse.json([])),
    http.get('http://localhost/users/me/lists', () => HttpResponse.json([])),
    http.get(
      'http://localhost/users/me/comments/all/all',
      () => HttpResponse.json([]),
    ),
    http.get(
      'http://localhost/younify/connections',
      () =>
        HttpResponse.json(
          StreamingConnectionsResponseMock.map((connection) => ({
            ...connection,
            connected: false,
          })),
        ),
    ),
  );
}

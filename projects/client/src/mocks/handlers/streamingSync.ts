import { http, HttpResponse } from 'msw';
import { DataSyncsResponseMock } from '../data/streaming-sync/response/DataSyncsResponseMock.ts';
import { StreamingConnectionsResponseMock } from '../data/streaming-sync/response/StreamingConnectionsResponseMock.ts';
import { SyncPausedItemsResponseMock } from '../data/streaming-sync/response/SyncPausedItemsResponseMock.ts';
import { SyncSkippedItemsResponseMock } from '../data/streaming-sync/response/SyncSkippedItemsResponseMock.ts';

function paginated<T>(request: Request, items: T[]) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? 1);

  if (page > 1) {
    return HttpResponse.json([], {
      headers: {
        'x-pagination-page': `${page}`,
        'x-pagination-page-count': '1',
        'x-pagination-item-count': `${items.length}`,
      },
    });
  }

  return HttpResponse.json(items, {
    headers: {
      'x-pagination-page': '1',
      'x-pagination-page-count': '1',
      'x-pagination-item-count': `${items.length}`,
    },
  });
}

export const streamingSync = [
  http.get(
    'http://localhost/younify/connections',
    () => HttpResponse.json(StreamingConnectionsResponseMock),
  ),
  http.get(
    'http://localhost/users/syncs/younify',
    ({ request }) => paginated(request, DataSyncsResponseMock),
  ),
  http.get(
    'http://localhost/users/syncs/:id/paused',
    ({ request }) => paginated(request, SyncPausedItemsResponseMock),
  ),
  http.get(
    'http://localhost/users/syncs/:id/skipped',
    ({ request }) => paginated(request, SyncSkippedItemsResponseMock),
  ),
  http.get(
    'http://localhost/users/syncs/:id',
    ({ params }) => {
      const id = Number(params.id);
      const sync = DataSyncsResponseMock.find((entry) => entry.id === id) ??
        DataSyncsResponseMock[0];
      return HttpResponse.json(sync);
    },
  ),
  http.post(
    'http://localhost/younify/connect',
    () =>
      HttpResponse.json({
        url: 'https://younify.tv/auth/amazon?token=mock',
      }),
  ),
  http.post(
    'http://localhost/younify/users/refresh/:serviceId/:allData',
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.post(
    'http://localhost/younify/users/refresh/:serviceId',
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.delete(
    'http://localhost/younify/users/services/:serviceId',
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.delete(
    'http://localhost/users/syncs/:id',
    () => new HttpResponse(null, { status: 204 }),
  ),
];

import { BulkIntlResponseMock } from '$mocks/data/intl/response/BulkIntlResponseMock.ts';
import { http, HttpResponse } from 'msw';

export const intl = [
  http.get(
    'http://localhost/v3/intl/bulk',
    () => HttpResponse.json(BulkIntlResponseMock),
  ),
];

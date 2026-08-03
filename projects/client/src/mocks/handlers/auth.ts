import { http, HttpResponse } from 'msw';

export const auth = [
  http.post(
    '*/api/store-token',
    () => HttpResponse.json({ ok: true }),
  ),
];

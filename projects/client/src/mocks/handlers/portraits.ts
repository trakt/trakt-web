import { http, HttpResponse } from 'msw';

export const portraits = [
  http.get('http://localhost/portraits/token', () =>
    HttpResponse.json({
      token: '1794787200-mac',
      expires_at: '2026-11-30T00:00:00.000Z',
    }),
  ),
];

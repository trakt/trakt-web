import { http, HttpResponse } from 'msw';

export function respondWithMalformedJson(url: string) {
  return http.post(
    url,
    () =>
      new HttpResponse('{', {
        status: 201,
        headers: { 'content-type': 'application/json' },
      }),
  );
}

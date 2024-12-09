import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('...', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({});
  }),
];

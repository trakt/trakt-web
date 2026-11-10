import { http, HttpResponse } from 'msw';

import { AwardCatalogResponseMock } from '../data/awards/response/AwardCatalogResponseMock.ts';

export const awards = [
  http.get('http://localhost/awards', () => {
    return HttpResponse.json(AwardCatalogResponseMock);
  }),
];

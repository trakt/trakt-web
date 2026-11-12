import { http, HttpResponse } from 'msw';
import { PromotionsResponseMock } from '../data/promotions/response/PromotionsResponseMock.ts';

export const promotions = [
  http.get('http://localhost/vip/promotions', () =>
    HttpResponse.json(PromotionsResponseMock),
  ),
];

import type { PromotionResponse } from '$lib/requests/models/PromotionResponse.ts';

export const PromotionsResponseMock: PromotionResponse[] = [
  {
    id: 'spring-offer',
    name: 'Spring Offer',
    label: 'SO · 01',
    theme: 'tickets',
    starts_at: '2030-03-01T08:00:00.000Z',
    ends_at: '2030-03-06T08:00:00.000Z',
    audience: 'not_renewing',
    plan: {
      duration: 'two_years',
      currency: 'usd',
      amount: 96,
      amount_off: 26,
      discounted_amount: 70,
      months_in_term: 24,
      first_term_only: true,
    },
    app_countries: ['us'],
  },
];

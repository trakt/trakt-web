import type { PromotionOffer } from '$lib/requests/models/PromotionOffer.ts';

export const PromotionsMappedMock: PromotionOffer[] = [
  {
    id: 'spring-offer',
    name: 'Spring Offer',
    label: 'SO · 01',
    theme: 'tickets',
    startsAt: new Date('2030-03-01T08:00:00.000Z'),
    endsAt: new Date('2030-03-06T08:00:00.000Z'),
    plan: {
      duration: 'two_years',
      currency: 'usd',
      fullPrice: 96,
      discountedPrice: 70,
      amountOff: 26,
      monthsInTerm: 24,
      firstTermOnly: true,
    },
  },
];

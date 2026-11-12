import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PromotionOfferSchema } from '$lib/requests/models/PromotionOffer.ts';
import {
  type PromotionResponse,
  PromotionsResponseSchema,
} from '$lib/requests/models/PromotionResponse.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToPromotionOffer } from './_internal/mapToPromotionOffer.ts';

const promotionsRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({ fetch, path: '/vip/promotions' });

  return response.ok
    ? {
        body: PromotionsResponseSchema.parse(await response.json()),
        status: 200,
      }
    : { body: [] as PromotionResponse[], status: 200 };
};

export const promotionsQuery = defineQuery({
  key: 'promotions',
  invalidations: [InvalidateAction.Vip.Promotion],
  dependencies: [],
  request: promotionsRequest,
  mapper: (response) => response.body.map(mapToPromotionOffer),
  schema: z.array(PromotionOfferSchema),
  ttl: time.minutes(5),
});

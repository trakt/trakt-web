import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { VipSubscriptionResponseSchema } from '$lib/requests/models/VipSubscriptionResponse.ts';
import { defineQuery } from '../../features/query/defineQuery.ts';
import { time } from '../../utils/timing/time.ts';
import { InvalidateAction } from '../models/InvalidateAction.ts';
import { VipSubscriptionSchema } from '../models/VipSubscription.ts';
import { mapToVipSubscription } from './_internal/mapToVipSubscription.ts';

type VipSubscriptionParams = ApiParams;

const vipSubscriptionRequest = async (
  { fetch }: VipSubscriptionParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: '/vip/details',
  });

  return response.ok
    ? {
      body: VipSubscriptionResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const vipSubscriptionQuery = defineQuery({
  key: 'vipSubscription',
  invalidations: [
    InvalidateAction.Vip.Canceled,
    InvalidateAction.Vip.Updated,
  ],
  dependencies: [],
  request: vipSubscriptionRequest,
  mapper: (response) => mapToVipSubscription(response.body),
  schema: VipSubscriptionSchema.nullish(),
  ttl: time.hours(3),
});

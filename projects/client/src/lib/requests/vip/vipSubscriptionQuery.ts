import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import {
  type VipSubscriptionResponse,
  VipSubscriptionResponseSchema,
} from '$lib/requests/models/VipSubscriptionResponse.ts';
import { defineQuery } from '../../features/query/defineQuery.ts';
import { time } from '../../utils/timing/time.ts';
import { InvalidateAction } from '../models/InvalidateAction.ts';
import {
  type VipSubscription,
  VipSubscriptionSchema,
} from '../models/VipSubscription.ts';

type VipSubscriptionParams = ApiParams;

function toSubscription(
  response?: VipSubscriptionResponse,
): VipSubscription | Nil {
  if (!response || !response.type) {
    return null;
  }

  const mapToDate = (value: string | Nil) => {
    return value ? new Date(value) : null;
  };

  return {
    memberSince: mapToDate(response.vip_signed_up_at),
    renewsAt: mapToDate(response.renewal?.date),
    expiresAt: mapToDate(response.expires_at),
    type: response.type,
    gateway: response.gateway === '' ? null : response.gateway,
    isCancelled: response.cancelled,
  };
}

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
  ],
  dependencies: [],
  request: vipSubscriptionRequest,
  mapper: (response) => toSubscription(response.body),
  schema: VipSubscriptionSchema.nullish(),
  ttl: time.hours(3),
});

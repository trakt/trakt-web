import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { cancelSubscriptionQuery } from './cancelSubscriptionQuery.ts';

describe('cancelSubscriptionQuery', () => {
  it('should report a cancelled subscription', async () => {
    server.use(
      http.post(
        'http://localhost/vip/stripe/cancel',
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    const result = await cancelSubscriptionQuery();

    expect(result).to.equal(true);
  });

  it('should return false when there is no active subscription', async () => {
    server.use(
      http.post(
        'http://localhost/vip/stripe/cancel',
        () =>
          HttpResponse.json({
            message: 'No active Stripe subscriptions found',
          }, { status: 404 }),
      ),
    );

    const result = await cancelSubscriptionQuery();

    expect(result).to.equal(false);
  });
});

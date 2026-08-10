import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { manageSubscriptionQuery } from './manageSubscriptionQuery.ts';

const CHECKOUT_URL = 'https://billing.stripe.com/p/session/test';
const RETURN_URL = 'https://app.trakt.tv/vip';

describe('manageSubscriptionQuery', () => {
  it('should return the checkout url', async () => {
    server.use(
      http.post(
        'http://localhost/vip/stripe/update',
        () => HttpResponse.json({ checkout_url: CHECKOUT_URL }),
      ),
    );

    const result = await manageSubscriptionQuery({ returnUrl: RETURN_URL });

    expect(result).to.deep.equal({ kind: 'redirect', url: CHECKOUT_URL });
  });

  it('should report a missing subscription', async () => {
    server.use(
      http.post(
        'http://localhost/vip/stripe/update',
        () =>
          HttpResponse.json({
            message: 'No active Stripe subscriptions found',
          }, { status: 404 }),
      ),
    );

    const result = await manageSubscriptionQuery({ returnUrl: RETURN_URL });

    expect(result).to.deep.equal({ kind: 'missing-subscription' });
  });
});

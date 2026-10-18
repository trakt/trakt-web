import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { FETCH_ERROR_EVENT } from '$lib/features/errors/constants.ts';
import { describe, expect, it, vi } from 'vitest';
import { manageSubscriptionQuery } from './manageSubscriptionQuery.ts';

const CHECKOUT_URL = 'https://billing.stripe.com/p/session/test';
const RETURN_URL = 'https://app.trakt.tv/vip';

describe('manageSubscriptionQuery', () => {
  it('should return the checkout url', async () => {
    server.use(
      http.post('http://localhost/vip/stripe/update', () =>
        HttpResponse.json({ checkout_url: CHECKOUT_URL }),
      ),
    );

    const result = await manageSubscriptionQuery({ returnUrl: RETURN_URL });

    expect(result).to.deep.equal({ kind: 'redirect', url: CHECKOUT_URL });
  });

  it('should report a missing subscription', async () => {
    server.use(
      http.post('http://localhost/vip/stripe/update', () =>
        HttpResponse.json(
          {
            message: 'No active Stripe subscriptions found',
          },
          { status: 404 },
        ),
      ),
    );

    const result = await manageSubscriptionQuery({ returnUrl: RETURN_URL });

    expect(result).to.deep.equal({ kind: 'missing-subscription' });
  });

  it('should throw when the subscription cannot be updated', async () => {
    server.use(
      http.post('http://localhost/vip/stripe/update', () =>
        HttpResponse.json(
          {
            message: 'User is not a Stripe VIP',
          },
          { status: 400 },
        ),
      ),
    );

    const request = manageSubscriptionQuery({ returnUrl: RETURN_URL });

    await expect(request).rejects.toThrow('Failed to fetch data');
  });

  it('should not replace the page on a server error', async () => {
    server.use(
      http.post(
        'http://localhost/vip/stripe/update',
        () => new HttpResponse(null, { status: 500 }),
      ),
    );
    const onFetchError = vi.fn();
    globalThis.window.addEventListener(FETCH_ERROR_EVENT, onFetchError);

    await expect(
      manageSubscriptionQuery({ returnUrl: RETURN_URL }),
    ).rejects.toThrow('(500)');

    globalThis.window.removeEventListener(FETCH_ERROR_EVENT, onFetchError);
    expect(onFetchError).not.toHaveBeenCalled();
  });
});

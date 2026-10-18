import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { FETCH_ERROR_EVENT } from '$lib/features/errors/constants.ts';
import { describe, expect, it, vi } from 'vitest';
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
      http.post('http://localhost/vip/stripe/cancel', () =>
        HttpResponse.json(
          {
            message: 'No active Stripe subscriptions found',
          },
          { status: 404 },
        ),
      ),
    );

    const result = await cancelSubscriptionQuery();

    expect(result).to.equal(false);
  });

  it('should throw when the subscription cannot be updated', async () => {
    server.use(
      http.post('http://localhost/vip/stripe/cancel', () =>
        HttpResponse.json(
          {
            message: 'User is not a Stripe VIP',
          },
          { status: 400 },
        ),
      ),
    );

    await expect(cancelSubscriptionQuery()).rejects.toThrow(
      'Failed to fetch data',
    );
  });

  it('should not replace the page on a server error', async () => {
    server.use(
      http.post(
        'http://localhost/vip/stripe/cancel',
        () => new HttpResponse(null, { status: 500 }),
      ),
    );
    const onFetchError = vi.fn();
    globalThis.window.addEventListener(FETCH_ERROR_EVENT, onFetchError);

    await expect(cancelSubscriptionQuery()).rejects.toThrow('(500)');

    globalThis.window.removeEventListener(FETCH_ERROR_EVENT, onFetchError);
    expect(onFetchError).not.toHaveBeenCalled();
  });
});

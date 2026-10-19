import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { startCheckoutQuery } from './startCheckoutQuery.ts';

const CHECKOUT_URL = 'https://checkout.stripe.com/c/pay/test';
const SUCCESS_URL = 'https://app.trakt.tv/vip?source=navbar&plan=yearly';
const CANCEL_URL = `${SUCCESS_URL}&checkout=canceled`;

describe('startCheckoutQuery', () => {
  it('should send separate success and cancel return urls', async () => {
    const received: Record<string, string | null> = {};
    server.use(
      http.post('http://localhost/vip/stripe/create', ({ request }) => {
        const { searchParams } = new URL(request.url);
        received.duration = searchParams.get('duration');
        received.success = searchParams.get('success_url');
        received.cancel = searchParams.get('cancel_url');

        return HttpResponse.json({ checkout_url: CHECKOUT_URL });
      }),
    );

    const result = await startCheckoutQuery({
      duration: 'yearly',
      successUrl: SUCCESS_URL,
      cancelUrl: CANCEL_URL,
    });

    expect(result).to.equal(CHECKOUT_URL);
    expect(received).to.deep.equal({
      duration: 'yearly',
      success: SUCCESS_URL,
      cancel: CANCEL_URL,
    });
  });
});

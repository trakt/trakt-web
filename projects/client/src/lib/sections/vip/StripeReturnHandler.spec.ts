import { goto } from '$app/navigation';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { delay } from '$lib/utils/timing/delay.ts';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import StripeReturnHandler from './StripeReturnHandler.svelte';

const CONFIRM_URL = 'http://localhost/vip/stripe/confirm';

describe('StripeReturnHandler', () => {
  const unhandled = vi.fn();

  beforeEach(() => {
    setAuthorization(true);
    window.history.replaceState(null, '', '/vip?session_id=cs_test');
    process.on('unhandledRejection', unhandled);
  });

  afterEach(() => {
    process.off('unhandledRejection', unhandled);
    unhandled.mockReset();
    vi.mocked(goto).mockClear();
    window.history.replaceState(null, '', '/');
  });

  it('should keep the session in the url when the confirmation fails', async () => {
    const confirm = vi.fn(() => HttpResponse.error());
    server.use(http.post(CONFIRM_URL, confirm));

    renderComponent(StripeReturnHandler, { props: {} });
    await vi.waitFor(() => expect(confirm).toHaveBeenCalled());
    await delay(0);

    expect(unhandled).not.toHaveBeenCalled();
    expect(goto).not.toHaveBeenCalled();
  });

  it('should drop the session from the url once confirmed', async () => {
    server.use(
      http.post(CONFIRM_URL, () => HttpResponse.json({}, { status: 200 })),
    );

    renderComponent(StripeReturnHandler, { props: {} });

    await vi.waitFor(() => expect(goto).toHaveBeenCalled());
    const [url] = vi.mocked(goto).mock.lastCall ?? [];
    expect(String(url)).not.toContain('session_id');
  });
});

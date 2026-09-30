import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { server } from '$mocks/server.ts';
import { captureInvalidations } from '$test/beds/query/captureInvalidations.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useEmailSettings } from './useEmailSettings.ts';

const EMAIL_SETTINGS_URL = 'http://localhost/users/settings/emails';

describe('useEmailSettings', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should only send the toggled category', async () => {
    const bodies: unknown[] = [];
    server.use(
      http.put(EMAIL_SETTINGS_URL, async ({ request }) => {
        bodies.push(await request.json());
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const { set } = await renderStore(() => useEmailSettings());
    await set('recaps', false);

    expect(bodies).toEqual([{ recaps: false }]);
  });

  it('should invalidate the email settings after saving', async () => {
    const { set } = await renderStore(() => useEmailSettings());

    const invalidations = await captureInvalidations(() =>
      set('marketing', true)
    );

    expect(invalidations).toContain(InvalidateAction.User.EmailSettings);
  });

  it('should invalidate the email settings when saving fails', async () => {
    server.use(
      http.put(
        EMAIL_SETTINGS_URL,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    const { set } = await renderStore(() => useEmailSettings());

    const invalidations = await captureInvalidations(() =>
      set('notifications', false)
    );

    expect(invalidations).toContain(InvalidateAction.User.EmailSettings);
  });
});

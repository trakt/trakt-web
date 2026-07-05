import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyLocalePreference } from './applyLocalePreference.ts';
import { LocaleEndpoint } from './LocaleEndpoint.ts';

const workerRequest = vi.hoisted(() => vi.fn());
vi.mock('$worker/workerRequest', () => ({ workerRequest }));

describe('util: applyLocalePreference', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    workerRequest.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should apply the locale to the running app', async () => {
    const setLocale = vi.fn();

    await applyLocalePreference({ value: 'fr-FR', setLocale });

    expect(setLocale).toHaveBeenCalledWith('fr-FR');
  });

  it('should persist the locale to the cookie endpoint', async () => {
    await applyLocalePreference({ value: 'fr-FR', setLocale: vi.fn() });

    expect(fetchMock).toHaveBeenCalledWith(
      LocaleEndpoint.Set,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ locale: 'fr-FR' }),
      }),
    );
  });

  it('should bust the worker cache so the next SSR picks up the cookie', async () => {
    await applyLocalePreference({ value: 'fr-FR', setLocale: vi.fn() });

    expect(workerRequest).toHaveBeenCalledWith(WorkerMessage.CacheBust);
  });
});

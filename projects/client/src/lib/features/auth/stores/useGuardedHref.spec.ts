import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { useGuardedHref } from './useGuardedHref.ts';

describe('store: useGuardedHref', () => {
  beforeEach(() => {
    setAuthorization(false);
  });

  it.each([
    UrlBuilder.developer.home(),
    UrlBuilder.developer.apps(),
  ])('should allow signed-out visitors to open %s', async (href) => {
    const result = await runQuery({
      factory: () => useGuardedHref(href).guardedHref,
    });

    expect(result).toBe(href);
  });

  it('should still guard settings for signed-out visitors', async () => {
    const result = await runQuery({
      factory: () =>
        useGuardedHref(UrlBuilder.settings.appsConnected()).guardedHref,
    });

    expect(result).toBe(UrlBuilder.landing());
  });

  it('should allow signed-in visitors to open settings', async () => {
    setAuthorization(true);
    const href = UrlBuilder.settings.appsConnected();
    const result = await runQuery({
      factory: () => useGuardedHref(href).guardedHref,
    });

    expect(result).toBe(href);
  });
});

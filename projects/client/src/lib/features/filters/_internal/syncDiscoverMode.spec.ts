import {
  resetGlobalStore,
  useToggler,
} from '$lib/components/toggles/useToggler.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { syncDiscoverMode } from './syncDiscoverMode.ts';

describe('util: syncDiscoverMode', () => {
  const currentMode = () =>
    firstValueFrom(useToggler('discover').current).then(({ value }) => value);

  beforeEach(() => {
    localStorage.clear();
    resetGlobalStore();
  });

  it('should adopt a valid mode from the URL', async () => {
    await syncDiscoverMode(new URLSearchParams('mode=movie'));

    expect(await currentMode()).toBe('movie');
  });

  it('should persist the adopted mode', async () => {
    await syncDiscoverMode(new URLSearchParams('mode=movie'));

    expect(localStorage.getItem('trakt_toggler_discover')).toBe('"movie"');
  });

  it('should ignore an unknown mode', async () => {
    useToggler('discover').set('movie');

    await syncDiscoverMode(new URLSearchParams('mode=banana'));

    expect(await currentMode()).toBe('movie');
  });

  it('should keep the stored mode when the URL has none', async () => {
    useToggler('discover').set('movie');

    await syncDiscoverMode(new URLSearchParams());

    expect(await currentMode()).toBe('movie');
  });
});
